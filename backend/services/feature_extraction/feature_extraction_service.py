import pandas as pd
import numpy as np
import os
from sqlalchemy.orm import Session
from models.dataset import Dataset, DatasetStatus
from datetime import datetime
from services.audit_log_service import log_action


def extract_commit_features(df: pd.DataFrame) -> pd.DataFrame:
    """Aggregate commit-level metrics per developer."""
    commit_counts = df.groupby('developer_id')['commit_id'].nunique().rename('num_commits')
    files_changed = df.groupby('developer_id')['files_changed'].sum().rename('files_changed')
    lines_added   = df.groupby('developer_id')['lines_added'].sum().rename('lines_added')
    lines_removed = df.groupby('developer_id')['lines_removed'].sum().rename('lines_removed')
    commit_size   = (lines_added + lines_removed).rename('commit_size')
    activity_freq = df.groupby('developer_id')['commit_timestamp'].count().rename('activity_freq')
    return pd.concat(
        [commit_counts, files_changed, lines_added, lines_removed, commit_size, activity_freq],
        axis=1
    ).reset_index()


def extract_pipeline_features(df: pd.DataFrame) -> pd.DataFrame:
    """Extract per-row pipeline features — safe implementation."""
    df = df.copy()
    df = df.sort_values(['developer_id', 'commit_timestamp'])

    # ── prev_pipeline_status: shift within each developer group
    df['prev_pipeline_status'] = (
        df.groupby('developer_id')['pipeline_status']
        .shift(1)
        .fillna(1)          # assume previous build was success for very first row
        .astype(int)
    )

    # ── failure_history: cumulative failures BEFORE current row per developer
    # Use transform with cumsum minus current row
    def rolling_failure_count(s):
        # cumulative number of failures up to (but not including) current row
        cum = s.eq(0).cumsum().shift(1).fillna(0).astype(int)
        return cum

    df['failure_history'] = (
        df.groupby('developer_id')['pipeline_status']
        .transform(rolling_failure_count)
    )

    # ── build_frequency: seconds since last build by same developer
    df['commit_timestamp'] = pd.to_datetime(df['commit_timestamp'], errors='coerce')
    df['build_frequency'] = (
        df.groupby('developer_id')['commit_timestamp']
        .diff()
        .dt.total_seconds()
        .fillna(0)
    )

    keep_cols = [
        'commit_id', 'developer_id',
        'prev_pipeline_status', 'execution_time',
        'failure_history', 'build_frequency',
        'pipeline_status',
    ]
    return df[[c for c in keep_cols if c in df.columns]]


def correlate_features(commit_df: pd.DataFrame, pipeline_df: pd.DataFrame) -> pd.DataFrame:
    """Merge per-developer commit aggregates onto per-row pipeline features."""
    merged = pd.merge(pipeline_df, commit_df, on='developer_id', how='left')
    merged = merged.rename(columns={'pipeline_status': 'label'})
    return merged


def save_features(df: pd.DataFrame, dataset: Dataset) -> str:
    features_path = dataset.file_path + ".features.csv"
    df.to_csv(features_path, index=False)
    return features_path


def extract_and_save_features(db: Session, dataset: Dataset, user_id: int, ip: str = None) -> str:
    if dataset.filename.lower().endswith('.csv'):
        df = pd.read_csv(dataset.file_path)
    else:
        df = pd.read_json(dataset.file_path)

    commit_df   = extract_commit_features(df)
    pipeline_df = extract_pipeline_features(df)
    features_df = correlate_features(commit_df, pipeline_df)
    features_path = save_features(features_df, dataset)

    log_action(db, user_id, f"feature_extraction:{dataset.id}", ip)
    return features_path

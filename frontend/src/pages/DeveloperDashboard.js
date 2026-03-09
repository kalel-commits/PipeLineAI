import React, { useState } from 'react';
import DatasetUpload from '../components/DatasetUpload';
import FeatureExtraction from '../components/FeatureExtraction';
import ModelTraining from '../components/ModelTraining';
import ModelEvaluation from '../components/ModelEvaluation';
import ModelPrediction from '../components/ModelPrediction';
import ModelComparison from '../components/ModelComparison';
import { Box, Typography, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TuneIcon from '@mui/icons-material/Tune';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const featureNames = [
  'prev_pipeline_status', 'execution_time', 'failure_history', 'build_frequency',
  'num_commits', 'files_changed', 'lines_added', 'lines_removed', 'commit_size', 'activity_freq',
];

const STEPS = [
  { id: 'upload', label: 'Upload', desc: 'Import dataset', icon: CloudUploadIcon },
  { id: 'process', label: 'Preprocess', desc: 'Clean & extract', icon: TuneIcon },
  { id: 'train', label: 'Train', desc: 'Select & train model', icon: PsychologyIcon },
  { id: 'evaluate', label: 'Evaluate', desc: 'Review & predict', icon: AssessmentIcon },
];

/* ── Workflow Card ─────────────────────────────────────────── */
const WorkflowCard = ({ title, subtitle, step, children }) => (
  <Box sx={{
    background: '#151C2E',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    mb: 2,
    overflow: 'hidden',
  }}>
    {/* Card header */}
    <Box sx={{
      px: 3, pt: 2.5, pb: 2,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(17,24,39,0.4)',
      display: 'flex', alignItems: 'flex-start', gap: 1.5,
    }}>
      <Box sx={{
        mt: 0.25, minWidth: 24, height: 24, borderRadius: '50%', fontSize: '11px', fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
        color: '#fff', flexShrink: 0,
      }}>
        {step}
      </Box>
      <Box>
        <Typography fontWeight={600} fontSize={16} color="#F9FAFB" sx={{ letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: '13px' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>

    {/* Card body */}
    <Box sx={{ p: 3 }}>
      {children}
    </Box>
  </Box>
);

const DeveloperDashboard = () => {
  const [dataset, setDataset] = useState(null);
  const [features, setFeatures] = useState(null);
  const [model, setModel] = useState(null);

  /* Which step is currently active */
  const activeStep = !dataset ? 0 : !features ? 1 : !model ? 2 : 3;

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 3 }, py: '48px' }}>

      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.025em', color: '#F9FAFB', fontSize: '2rem' }}>
          Developer Workspace
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: '14px' }}>
          Upload pipeline data, train ML models, and run real-time failure predictions.
        </Typography>
      </Box>

      {/* ── Stepper ──────────────────────────── */}
      <Box sx={{
        display: 'flex', alignItems: 'stretch',
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        p: '6px',
        mb: 4,
        gap: '4px',
      }}>
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          const Icon = step.icon;
          return (
            <Box key={step.id} sx={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 0.5,
              px: 1, py: 1.5,
              borderRadius: '10px',
              background: active ? 'rgba(99,102,241,0.12)' : done ? 'rgba(16,185,129,0.06)' : 'transparent',
              border: active ? '1px solid rgba(99,102,241,0.28)' : done ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
              transition: 'all 280ms cubic-bezier(0.4,0,0.2,1)',
            }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '8px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', mb: 0.25,
                background: done
                  ? 'rgba(16,185,129,0.15)'
                  : active
                    ? 'linear-gradient(135deg,#6366F1,#8B5CF6)'
                    : 'rgba(255,255,255,0.05)',
                boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                transition: 'all 280ms',
              }}>
                {done
                  ? <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />
                  : <Icon sx={{ fontSize: 17, color: active ? '#fff' : '#4B5563' }} />
                }
              </Box>
              <Typography sx={{
                fontSize: '12px', fontWeight: 600, lineHeight: 1.1,
                color: done ? '#10B981' : active ? '#818CF8' : '#4B5563',
                transition: 'color 280ms',
                display: { xs: 'none', sm: 'block' },
              }}>
                {step.label}
              </Typography>
              <Typography sx={{
                fontSize: '11px', color: done ? 'rgba(16,185,129,0.7)' : active ? 'rgba(129,140,248,0.7)' : '#374151',
                lineHeight: 1, display: { xs: 'none', md: 'block' }
              }}>
                {step.desc}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ── Step 1: Upload ───────────────────── */}
      <Fade in timeout={350}>
        <Box>
          <WorkflowCard step={1} title="Upload Dataset" subtitle="Import your CI/CD pipeline build history as CSV or JSON.">
            <DatasetUpload onUpload={d => setDataset(d)} />
          </WorkflowCard>
        </Box>
      </Fade>

      {/* ── Step 2: Preprocess ─────────────── */}
      {dataset && (
        <Fade in timeout={350}>
          <Box>
            <WorkflowCard step={2} title="Preprocess & Extract Features" subtitle="Validate schema, handle missing values, and generate ML-ready features.">
              <FeatureExtraction datasetId={dataset.dataset_id} onExtracted={d => setFeatures(d)} />
            </WorkflowCard>
          </Box>
        </Fade>
      )}

      {/* ── Step 3: Train + Compare ─────────── */}
      {features && (
        <Fade in timeout={350}>
          <Box>
            <WorkflowCard step={3} title="Train Model" subtitle="Choose an algorithm and fit a classifier on extracted features.">
              <ModelTraining datasetId={dataset.dataset_id} onTrained={d => {
                const active = d.models?.find(m => m.is_active) || d.models?.[0];
                setModel(active);
              }} />
            </WorkflowCard>

            <WorkflowCard step="~" title="Model Comparison" subtitle="Side-by-side metric comparison across all trained models for this dataset.">
              <ModelComparison datasetId={dataset.dataset_id} onModelActivated={(m) => setModel(m)} currentModel={model} />
            </WorkflowCard>
          </Box>
        </Fade>
      )}

      {/* ── Step 4: Evaluate + Predict ─────── */}
      {model && (
        <Fade in timeout={350}>
          <Box>
            <WorkflowCard step={4} title="Evaluate" subtitle={`Performance metrics for Model #${model.model_id} · ${model.algorithm}`}>
              <ModelEvaluation modelId={model.model_id} />
            </WorkflowCard>

            <WorkflowCard step="→" title="Run Prediction" subtitle="Enter pipeline metrics for real-time failure probability scoring.">
              <ModelPrediction modelId={model.model_id} featureNames={featureNames} />
            </WorkflowCard>
          </Box>
        </Fade>
      )}

    </Box>
  );
};

export default DeveloperDashboard;

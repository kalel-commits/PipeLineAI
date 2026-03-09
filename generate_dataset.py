import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_realistic_dataset(num_rows=1000, out_path="sample_dataset_1000.csv"):
    np.random.seed(42)
    random.seed(42)
    
    # Developers
    devs = [f"dev_{str(i).zfill(2)}" for i in range(1, 16)]
    
    data = []
    base_time = datetime(2024, 1, 1)
    
    for i in range(num_rows):
        dev = random.choice(devs)
        
        # Decide if this build will fail or succeed based on some probabilities
        # Large commits by infrequent devs are more likely to fail
        # But introduce randomness
        
        is_fail = np.random.rand() < 0.35 # ~35% failure rate baseline
        
        if is_fail:
            status = "Failure"
            files_changed = int(np.random.exponential(scale=15) + 3)
            lines_added = int(np.random.exponential(scale=500) + 100)
            lines_removed = int(np.random.exponential(scale=200) + 50)
            exec_time = float(np.random.normal(loc=180, scale=40))
        else:
            status = "Success"
            files_changed = int(np.random.exponential(scale=4) + 1)
            lines_added = int(np.random.exponential(scale=100) + 10)
            lines_removed = int(np.random.exponential(scale=40) + 5)
            exec_time = float(np.random.normal(loc=45, scale=15))
            
        exec_time = max(10.0, exec_time) # Ensure positive
        
        # Add some noise to make it not 100% perfectly separable
        if np.random.rand() < 0.1: 
            status = "Success" if status == "Failure" else "Failure"
            
        timestamp = base_time + timedelta(hours=i*1.5 + random.uniform(-0.5, 0.5))
        commit_id = f"{random.getrandbits(32):08x}"
        
        data.append({
            "pipeline_status": status,
            "execution_time": round(exec_time, 1),
            "commit_id": commit_id,
            "files_changed": files_changed,
            "lines_added": lines_added,
            "lines_removed": lines_removed,
            "commit_timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "developer_id": dev
        })
        
    df = pd.DataFrame(data)
    df.to_csv(out_path, index=False)
    print(f"Generated {num_rows} rows at {out_path} with {len(df[df['pipeline_status'] == 'Failure'])} failures.")

if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "sample_dataset_1000.csv"
    generate_realistic_dataset(1000, out)

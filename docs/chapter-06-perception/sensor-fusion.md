---
sidebar_position: 3
---

# Sensor Fusion

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

No single sensor is perfect. Fusion combines multiple sensors for robust perception.

## Kalman Filter

The classic fusion algorithm:

```python
class KalmanFilter:
    def __init__(self, state_dim, obs_dim):
        self.x = np.zeros(state_dim)  # State estimate
        self.P = np.eye(state_dim)     # Covariance
        self.Q = np.eye(state_dim) * 0.01  # Process noise
        self.R = np.eye(obs_dim) * 0.1     # Measurement noise
    
    def predict(self, F, u=None):
        self.x = F @ self.x
        self.P = F @ self.P @ F.T + self.Q
    
    def update(self, z, H):
        y = z - H @ self.x
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.x = self.x + K @ y
        self.P = (np.eye(len(self.x)) - K @ H) @ self.P
```

---

**Next:** [SLAM →](./slam)

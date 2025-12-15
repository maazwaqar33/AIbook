---
sidebar_position: 3
---

# Inverse Kinematics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Inverse kinematics (IK) is the reverse: given a desired end effector pose, find the joint angles.

## Analytical vs Numerical IK

### Analytical IK
Closed-form solution—fast but only works for simple geometries:

```python
import numpy as np

def ik_2link(target_x, target_y, l1, l2):
    """Analytical IK for 2-link planar arm"""
    # Distance to target
    d = np.sqrt(target_x**2 + target_y**2)
    
    # Check reachability
    if d > l1 + l2 or d < abs(l1 - l2):
        return None, None
    
    # Law of cosines for elbow angle
    cos_theta2 = (d**2 - l1**2 - l2**2) / (2 * l1 * l2)
    theta2 = np.arccos(np.clip(cos_theta2, -1, 1))
    
    # Shoulder angle
    alpha = np.arctan2(target_y, target_x)
    beta = np.arctan2(l2 * np.sin(theta2), l1 + l2 * np.cos(theta2))
    theta1 = alpha - beta
    
    return theta1, theta2
```

### Numerical IK
Use optimization—works for any robot:

```python
from scipy.optimize import minimize

def numerical_ik(target, initial_guess, forward_kinematics):
    def objective(joints):
        current = forward_kinematics(joints)
        return np.sum((current - target)**2)
    
    result = minimize(objective, initial_guess, method='SLSQP')
    return result.x if result.success else None
```

---

**Next:** [Dynamics →](./dynamics)

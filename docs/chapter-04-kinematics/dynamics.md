---
sidebar_position: 4
---

# Dynamics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Dynamics adds forces and torques to the picture. Essential for controlling robot motion precisely.

## Newton-Euler Equations

The equation of motion for a robotic arm:

```
M(q)q̈ + C(q,q̇)q̇ + g(q) = τ
```

Where:
- `M(q)` - Mass/inertia matrix
- `C(q,q̇)` - Coriolis and centrifugal terms
- `g(q)` - Gravity compensation
- `τ` - Applied torques

## Computed Torque Control

Use the dynamics model for precise control:

```python
def computed_torque_control(q, q_dot, q_desired, q_dot_desired, q_ddot_desired, Kp, Kd):
    # Position and velocity errors
    e = q_desired - q
    e_dot = q_dot_desired - q_dot
    
    # Desired acceleration with PD correction
    q_ddot_cmd = q_ddot_desired + Kp * e + Kd * e_dot
    
    # Compute required torque using dynamics
    M = compute_mass_matrix(q)
    C = compute_coriolis(q, q_dot)
    g = compute_gravity(q)
    
    tau = M @ q_ddot_cmd + C @ q_dot + g
    return tau
```

---

**Next:** [Simulation Tools →](./simulation-tools)

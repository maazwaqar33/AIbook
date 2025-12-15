---
sidebar_position: 3
---

# Balance Control

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Staying upright requires constant active control—unlike wheeled robots.

## Control Strategies

### Model Predictive Control (MPC)
Plan footsteps and balance ahead of time:

```python
def mpc_balance_control(current_state, reference_trajectory, horizon=10):
    """MPC for humanoid balance"""
    # Define optimization problem
    # Minimize: tracking error + control effort
    # Subject to: dynamics, ZMP constraints, joint limits
    
    from scipy.optimize import minimize
    
    def cost(u):
        states = simulate_forward(current_state, u, horizon)
        tracking_error = np.sum((states - reference_trajectory)**2)
        control_effort = np.sum(u**2)
        return tracking_error + 0.01 * control_effort
    
    result = minimize(cost, x0=np.zeros(horizon * num_controls))
    return result.x[:num_controls]  # Return first action
```

### Reactive Balance
Quick reflexes for unexpected pushes:
- Ankle strategy (small perturbations)
- Hip strategy (medium perturbations)
- Step strategy (large perturbations)

---

**Next:** [Physical AI →](./physical-ai)

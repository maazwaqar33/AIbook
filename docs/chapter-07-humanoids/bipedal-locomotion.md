---
sidebar_position: 2
---

# Bipedal Locomotion

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Walking on two legs is fundamentally unstable—that's what makes it challenging and interesting.

## Gait Cycle

Human walking consists of phases:

```mermaid
graph LR
    A[Heel Strike] --> B[Loading]
    B --> C[Mid Stance]
    C --> D[Terminal Stance]
    D --> E[Pre-Swing]
    E --> F[Swing]
    F --> A
```

## Zero Moment Point (ZMP)

The key concept for stable walking:

```python
def compute_zmp(com_position, com_acceleration, height):
    """Compute Zero Moment Point from center of mass dynamics"""
    g = 9.81
    zmp_x = com_position[0] - (height / g) * com_acceleration[0]
    zmp_y = com_position[1] - (height / g) * com_acceleration[1]
    return np.array([zmp_x, zmp_y])

# ZMP must stay within support polygon for stability
def is_stable(zmp, support_polygon):
    return point_in_polygon(zmp, support_polygon)
```

---

**Next:** [Balance Control →](./balance-control)

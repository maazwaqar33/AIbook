---
sidebar_position: 2
---

# Forward Kinematics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Forward kinematics computes the pose of the robot's end effector given all joint values.

## The Chain of Transformations

Each joint adds a transformation:

```python
import numpy as np

def forward_kinematics(joint_angles, link_lengths):
    """Compute end effector position for a planar arm"""
    x, y = 0, 0
    angle = 0
    
    for theta, length in zip(joint_angles, link_lengths):
        angle += theta
        x += length * np.cos(angle)
        y += length * np.sin(angle)
    
    return x, y, angle

# 3-link planar arm
joints = [np.pi/4, -np.pi/6, np.pi/8]
links = [0.4, 0.35, 0.2]
end_x, end_y, end_angle = forward_kinematics(joints, links)
print(f"End effector at: ({end_x:.3f}, {end_y:.3f})")
```

## DH Parameters

For 3D robots, we use Denavit-Hartenberg convention—a systematic way to describe each link.

---

**Next:** [Inverse Kinematics →](./inverse-kinematics)

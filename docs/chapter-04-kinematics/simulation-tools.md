---
sidebar_position: 5
---

# Simulation Tools

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Simulation lets us test without breaking expensive hardware.

## Popular Simulators

| Simulator | Best For | Language |
|-----------|----------|----------|
| Gazebo | ROS integration | C++/Python |
| PyBullet | Quick prototyping | Python |
| MuJoCo | Contact-rich tasks | C++/Python |
| Isaac Sim | GPU physics, AI | Python |

## PyBullet Quick Start

```python
import pybullet as p
import time

# Setup
p.connect(p.GUI)
p.setGravity(0, 0, -10)
p.loadURDF("plane.urdf")
robot = p.loadURDF("robot.urdf", [0, 0, 1])

# Control loop
for _ in range(1000):
    p.setJointMotorControl2(robot, 0, p.POSITION_CONTROL, targetPosition=1.57)
    p.stepSimulation()
    time.sleep(1/240)
```

---

**Next Chapter:** [AI for Robotics →](../chapter-05-ai/)

---
sidebar_position: 2
---

# Sensors

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Sensors are a robot's connection to reality. Without them, it's blind, deaf, and unaware.

## Vision Sensors

### RGB Cameras
Standard cameras capture color images:
- Cheap and widely available
- Rich information (texture, color)
- Struggle with depth perception

### Depth Cameras
Intel RealSense, Azure Kinect, Orbbec:
- RGB + Depth in one device
- Great for manipulation
- Limited outdoor use

### LIDAR
Light Detection and Ranging:
- Precise distance measurements
- Works in all lighting
- 2D (scanning) or 3D (spinning/solid-state)
- Essential for autonomous vehicles

```python
# Processing LIDAR data
import numpy as np

def find_obstacles(ranges, angle_min, angle_increment, threshold=0.5):
    """Find obstacles in LIDAR scan"""
    obstacles = []
    for i, distance in enumerate(ranges):
        if distance < threshold:
            angle = angle_min + i * angle_increment
            x = distance * np.cos(angle)
            y = distance * np.sin(angle)
            obstacles.append((x, y))
    return obstacles
```

## Proprioceptive Sensors

These tell the robot about its own state:

### Encoders
Measure rotation:
- Incremental - Count pulses
- Absolute - Know exact position

### IMU (Inertial Measurement Unit)
6-DOF motion sensing:
- Accelerometer (linear motion)
- Gyroscope (rotation)
- Often includes magnetometer

```python
# Simple IMU fusion for orientation
class IMUFusion:
    def __init__(self, alpha=0.98):
        self.alpha = alpha
        self.angle = 0.0
    
    def update(self, gyro, accel, dt):
        # Gyro integration (fast, drifts)
        gyro_angle = self.angle + gyro * dt
        
        # Accelerometer angle (slow, noisy but absolute)
        accel_angle = np.arctan2(accel[1], accel[2])
        
        # Complementary filter
        self.angle = self.alpha * gyro_angle + (1 - self.alpha) * accel_angle
        return self.angle
```

### Force/Torque Sensors
Measure interaction forces:
- Essential for safe human contact
- Enable force control for manipulation

---

**Next:** [Actuators & Motors →](./actuators-motors)

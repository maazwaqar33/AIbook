---
sidebar_position: 3
---

# Python for Robotics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Python is the Swiss Army knife of robotics development. Fast prototyping, great libraries, and AI integration make it indispensable.

## Essential Libraries

```python
# The robotics Python stack
import numpy as np          # Numerical computing
import cv2                   # Computer vision
import torch                 # Deep learning
import pybullet as p        # Physics simulation
import matplotlib.pyplot as plt  # Visualization
```

## NumPy: Your New Best Friend

NumPy is the foundation of scientific Python:

```python
import numpy as np

# Creating arrays
positions = np.array([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
velocities = np.zeros((10, 3))  # 10 points, 3D
random_data = np.random.randn(100, 3)

# Vectorized operations - super fast!
# Instead of loops:
distances = np.linalg.norm(positions, axis=1)

# Broadcasting - operations across dimensions
normalized = positions / distances[:, np.newaxis]

# Useful for robotics
def wrap_angle(angle):
    """Keep angle in [-pi, pi]"""
    return (angle + np.pi) % (2 * np.pi) - np.pi
```

## Computer Vision with OpenCV

Every robot needs eyes:

```python
import cv2
import numpy as np

# Reading from camera
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Edge detection
    edges = cv2.Canny(gray, 50, 150)
    
    # Find contours (object shapes)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, 
                                    cv2.CHAIN_APPROX_SIMPLE)
    
    # Draw detected contours
    cv2.drawContours(frame, contours, -1, (0, 255, 0), 2)
    
    cv2.imshow('Robot Vision', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
```

### Object Detection

```python
def detect_colored_object(frame, lower_hsv, upper_hsv):
    """Detect objects of a specific color"""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, lower_hsv, upper_hsv)
    
    # Find the biggest contour
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                    cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        largest = max(contours, key=cv2.contourArea)
        M = cv2.moments(largest)
        if M['m00'] > 0:
            cx = int(M['m10'] / M['m00'])
            cy = int(M['m01'] / M['m00'])
            return (cx, cy)
    return None

# Detecting a red object
lower_red = np.array([0, 100, 100])
upper_red = np.array([10, 255, 255])
position = detect_colored_object(frame, lower_red, upper_red)
```

## Physics Simulation with PyBullet

Test robot code without real hardware:

```python
import pybullet as p
import pybullet_data
import time

# Start simulation
physics_client = p.connect(p.GUI)
p.setAdditionalSearchPath(pybullet_data.getDataPath())

# Set up environment
p.setGravity(0, 0, -10)
plane_id = p.loadURDF("plane.urdf")
robot_id = p.loadURDF("kuka_iiwa/model.urdf", [0, 0, 0])

# Get joint info
num_joints = p.getNumJoints(robot_id)
for i in range(num_joints):
    info = p.getJointInfo(robot_id, i)
    print(f"Joint {i}: {info[1].decode()}")

# Control the robot
target_positions = [0.5, -0.3, 0.4, 0.2, -0.1, 0.3, 0]
for i, pos in enumerate(target_positions):
    p.setJointMotorControl2(robot_id, i, p.POSITION_CONTROL, 
                            targetPosition=pos)

# Run simulation
for _ in range(1000):
    p.stepSimulation()
    time.sleep(1/240)

p.disconnect()
```

## Deep Learning with PyTorch

For AI-powered robots:

```python
import torch
import torch.nn as nn

class RobotPerceptionNet(nn.Module):
    """Simple CNN for robot visual perception"""
    def __init__(self, num_classes=10):
        super().__init__()
        # I use a simple architecture that runs fast on embedded devices
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 64, 3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1)
        )
        self.classifier = nn.Linear(64, num_classes)
    
    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        return self.classifier(x)

# Using the model
model = RobotPerceptionNet(num_classes=5)
image = torch.randn(1, 3, 224, 224)  # Batch of 1 image
prediction = model(image)
print(f"Predicted class: {prediction.argmax(dim=1).item()}")
```

## Useful Patterns

### Robot Controller Class

```python
import numpy as np
from dataclasses import dataclass
from typing import Optional

@dataclass
class RobotState:
    position: np.ndarray
    orientation: np.ndarray
    velocity: np.ndarray
    joint_positions: np.ndarray

class RobotController:
    """Base controller class I use for all my robots"""
    
    def __init__(self, config: dict):
        self.config = config
        self.state: Optional[RobotState] = None
        self._is_running = False
    
    def update_state(self, sensor_data: dict) -> RobotState:
        """Update internal state from sensors"""
        self.state = RobotState(
            position=np.array(sensor_data['position']),
            orientation=np.array(sensor_data['orientation']),
            velocity=np.array(sensor_data['velocity']),
            joint_positions=np.array(sensor_data['joints'])
        )
        return self.state
    
    def compute_control(self, target: np.ndarray) -> np.ndarray:
        """Compute control command - override in subclass"""
        raise NotImplementedError
    
    def run_loop(self, get_sensors, send_command, rate_hz=100):
        """Main control loop"""
        import time
        dt = 1.0 / rate_hz
        self._is_running = True
        
        while self._is_running:
            start_time = time.time()
            
            sensor_data = get_sensors()
            self.update_state(sensor_data)
            
            command = self.compute_control(self.target)
            send_command(command)
            
            # Maintain loop rate
            elapsed = time.time() - start_time
            if elapsed < dt:
                time.sleep(dt - elapsed)
```

---

:::tip Performance Tips
1. Use NumPy operations instead of Python loops
2. Profile your code with `cProfile`
3. Consider `numba` for JIT compilation of hot loops
4. Use async/await for I/O-bound operations
:::

## Practice Exercises

1. Write a function that computes the inverse kinematics for a 2-link planar arm
2. Create a simple object tracker using OpenCV that follows a colored ball
3. Build a PyBullet simulation of a mobile robot navigating around obstacles
4. Train a small neural network to classify robot gripper states (open/closed)

---

**Next:** [C++ Basics →](./cpp-basics)

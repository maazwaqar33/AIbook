---
sidebar_position: 2
---

# Linear Algebra for Robotics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Linear algebra is the language of robotics. Every position, every rotation, every transformation is expressed through vectors and matrices.

## Vectors: Position and Direction

A vector represents both magnitude and direction:

```python
import numpy as np

# 3D position vector (x, y, z)
position = np.array([1.0, 2.0, 0.5])

# Robot's forward direction
forward = np.array([1.0, 0.0, 0.0])

# Vector operations
print(f"Position: {position}")
print(f"Magnitude: {np.linalg.norm(position):.2f}")
print(f"Normalized: {position / np.linalg.norm(position)}")
```

### Common Vector Operations

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Addition: moving from one point to another
result = a + b  # [5, 7, 9]

# Dot product: projection, finding angles
dot = np.dot(a, b)  # 32

# Cross product: perpendicular vector (3D only)
cross = np.cross(a, b)  # [-3, 6, -3]

# Angle between vectors
angle = np.arccos(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
```

## Matrices: Transformations

Matrices transform vectors—essential for moving robots:

### Rotation Matrices

Rotation around the Z-axis (yaw):

```python
def rotation_z(theta):
    """Rotation matrix around Z axis by theta radians"""
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [c, -s, 0],
        [s,  c, 0],
        [0,  0, 1]
    ])

# Rotate a point 45 degrees around Z
theta = np.pi / 4  # 45 degrees
R = rotation_z(theta)
point = np.array([1, 0, 0])
rotated = R @ point  # [0.707, 0.707, 0]
```

### Complete Rotation Set

```python
def rotation_x(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [1, 0,  0],
        [0, c, -s],
        [0, s,  c]
    ])

def rotation_y(theta):
    c, s = np.cos(theta), np.sin(theta)
    return np.array([
        [ c, 0, s],
        [ 0, 1, 0],
        [-s, 0, c]
    ])
```

## Homogeneous Coordinates

For combined rotation AND translation, we use 4x4 matrices:

```python
def transformation_matrix(R, t):
    """Create 4x4 transformation matrix from rotation R and translation t"""
    T = np.eye(4)
    T[:3, :3] = R
    T[:3, 3] = t
    return T

# Example: Rotate 90° and move forward
R = rotation_z(np.pi / 2)  # 90 degrees
t = np.array([1.0, 0.0, 0.0])  # Move 1 unit in x
T = transformation_matrix(R, t)

# Transform a point
point = np.array([0, 0, 0, 1])  # Homogeneous coordinates
transformed = T @ point  # [1, 0, 0, 1]
```

### Chaining Transformations

The power of matrices: compose multiple transformations!

```python
# Robot arm: base -> shoulder -> elbow -> wrist
T_base = transformation_matrix(rotation_z(0.5), [0, 0, 0.3])
T_shoulder = transformation_matrix(rotation_y(0.3), [0, 0, 0.4])
T_elbow = transformation_matrix(rotation_y(-0.6), [0, 0, 0.35])
T_wrist = transformation_matrix(rotation_x(0.2), [0, 0, 0.2])

# End effector position in world frame
T_end_effector = T_base @ T_shoulder @ T_elbow @ T_wrist

# Get position
end_position = T_end_effector[:3, 3]
print(f"End effector position: {end_position}")
```

## Inverse Kinematics Preview

Given desired position, find joint angles—we solve this by inverting transformations:

```python
# Inverse of a transformation matrix
def inverse_transform(T):
    R = T[:3, :3]
    t = T[:3, 3]
    T_inv = np.eye(4)
    T_inv[:3, :3] = R.T  # Transpose of rotation
    T_inv[:3, 3] = -R.T @ t
    return T_inv
```

## Practical Exercise

```python
# Challenge: Calculate where a robot's gripper ends up

# Robot configuration:
# - Base at origin, rotated 45° around Z
# - Arm 1: 0.5m long, raised 30° from horizontal
# - Arm 2: 0.3m long, lowered 60° from arm 1
# - Gripper: 0.1m long, aligned with arm 2

# Your code here:
# 1. Build transformation matrices for each link
# 2. Multiply them together
# 3. Extract final gripper position

# Solution sketch:
import numpy as np

# I'll walk through the solution
base_rotation = np.pi / 4  # 45 degrees
arm1_angle = np.pi / 6     # 30 degrees
arm2_angle = -np.pi / 3    # -60 degrees relative to arm1

# Build the chain...
T_base = transformation_matrix(rotation_z(base_rotation), [0, 0, 0])
T_arm1 = transformation_matrix(rotation_y(arm1_angle), [0.5, 0, 0])
T_arm2 = transformation_matrix(rotation_y(arm2_angle), [0.3, 0, 0])
T_gripper = transformation_matrix(np.eye(3), [0.1, 0, 0])

T_final = T_base @ T_arm1 @ T_arm2 @ T_gripper
gripper_pos = T_final[:3, 3]
print(f"Gripper position: {gripper_pos}")
```

---

:::info Key Formulas
- **Rotation matrix properties**: R^T = R^(-1), det(R) = 1
- **Transformation composition**: T_total = T_1 @ T_2 @ ... @ T_n
- **Point transformation**: p' = T @ [p; 1] (homogeneous coords)
:::

## Practice Questions

1. What's the difference between a rotation and a transformation matrix?
2. Why do we use homogeneous coordinates (4D) instead of just 3D?
3. If you rotate 30° then 45°, is it the same as rotating 45° then 30°?
4. How would you find the position of the robot's elbow given joint angles?

---

**Next:** [Python for Robotics →](./python-for-robotics)

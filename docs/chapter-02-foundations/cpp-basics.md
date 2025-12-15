---
sidebar_position: 4
---

# C++ Basics for Robotics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

C++ is the language of choice for production robotics code. Its performance, determinism, and hardware access make it essential for real-time systems.

## Why C++ for Robots?

| Requirement | Why C++ Wins |
|-------------|--------------|
| Real-time control | Deterministic execution |
| Embedded systems | Direct hardware access |
| Performance | No garbage collection pauses |
| ROS2 | Native support, fastest option |

## Memory and Performance Basics

```cpp
#include <vector>
#include <memory>
#include <iostream>

// I prefer smart pointers for safety
class RobotJoint {
public:
    RobotJoint(int id, double max_torque) 
        : id_(id), max_torque_(max_torque), current_position_(0.0) {}
    
    void setPosition(double pos) { current_position_ = pos; }
    double getPosition() const { return current_position_; }
    
private:
    int id_;
    double max_torque_;
    double current_position_;
};

// Smart pointer usage - no manual delete needed
auto joint = std::make_unique<RobotJoint>(1, 100.0);
joint->setPosition(1.57);

// For shared ownership
auto shared_joint = std::make_shared<RobotJoint>(2, 50.0);
```

## Essential Patterns for Robotics

### Fixed-Rate Control Loop

```cpp
#include <chrono>
#include <thread>

class ControlLoop {
public:
    explicit ControlLoop(double frequency_hz) 
        : period_(std::chrono::duration<double>(1.0 / frequency_hz)) {}
    
    void run() {
        running_ = true;
        while (running_) {
            auto start = std::chrono::steady_clock::now();
            
            // My control logic here
            readSensors();
            computeControl();
            sendCommands();
            
            // Sleep for remaining time
            auto end = std::chrono::steady_clock::now();
            auto elapsed = end - start;
            if (elapsed < period_) {
                std::this_thread::sleep_for(period_ - elapsed);
            }
        }
    }
    
    void stop() { running_ = false; }
    
private:
    void readSensors() { /* ... */ }
    void computeControl() { /* ... */ }
    void sendCommands() { /* ... */ }
    
    std::chrono::duration<double> period_;
    bool running_ = false;
};
```

### Eigen for Linear Algebra

```cpp
#include <Eigen/Dense>

// Eigen is the NumPy of C++
Eigen::Vector3d position(1.0, 2.0, 3.0);
Eigen::Matrix3d rotation = Eigen::Matrix3d::Identity();

// Rotation around Z
double angle = M_PI / 4;  // 45 degrees
Eigen::Matrix3d Rz;
Rz << cos(angle), -sin(angle), 0,
      sin(angle),  cos(angle), 0,
      0,           0,          1;

Eigen::Vector3d rotated = Rz * position;

// Transformation matrices
Eigen::Affine3d transform = Eigen::Affine3d::Identity();
transform.rotate(Eigen::AngleAxisd(angle, Eigen::Vector3d::UnitZ()));
transform.translate(Eigen::Vector3d(1, 0, 0));
```

---

:::tip Getting Started
Start with Python for prototyping, then port performance-critical code to C++. This is the workflow used by most robotics teams.
:::

**Next:** [ROS2 Introduction →](./ros2-intro)

---
sidebar_position: 3
---

# Actuators & Motors

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Actuators convert electrical energy into physical motion. Choosing the right actuator is crucial.

## Electric Motors

### Brushed DC Motors
Simple and cheap:
- Voltage → Speed
- Easy to control
- Wear out (brushes)

### Brushless DC (BLDC)
The modern standard:
- More efficient
- Longer life
- Need electronic commutation

### Servo Motors
Motor + Gearbox + Controller:
- Position control built-in
- Common in hobby robotics
- Limited rotation range

### Stepper Motors
Precise positioning:
- Move in discrete steps
- No feedback needed
- Can lose steps under load

## Actuator Selection

| Application | Best Choice | Why |
|-------------|-------------|-----|
| Robot arm joints | BLDC + harmonic drive | Precision, backdrivability |
| Mobile base | BLDC + planetary gearbox | Power, efficiency |
| Grippers | Small servos or linear actuators | Simple control |
| Humanoid legs | High-torque BLDC | Dynamic movement |

## Control Modes

```python
class MotorController:
    def position_control(self, target_angle, kp=10.0):
        """PID position control"""
        error = target_angle - self.current_angle
        return kp * error
    
    def velocity_control(self, target_velocity, kp=1.0):
        """Velocity control"""
        error = target_velocity - self.current_velocity
        return kp * error
    
    def torque_control(self, target_torque):
        """Direct torque command - most responsive"""
        return target_torque * self.torque_constant
```

---

**Next:** [Microcontrollers →](./microcontrollers)

---
sidebar_position: 4
---

# Microcontrollers

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Microcontrollers are the interface between software and hardware.

## Platform Comparison

| Platform | CPU | Use Case | Price |
|----------|-----|----------|-------|
| Arduino Uno | 16MHz AVR | Simple sensors, servos | $25 |
| Raspberry Pi 5 | 4x 2.4GHz ARM | Vision, ROS2, AI | $60 |
| NVIDIA Jetson Nano | 4x ARM + GPU | Deep learning | $150 |
| NVIDIA Jetson Orin | 12x ARM + GPU | Full autonomy | $500+ |

## When to Use What

- **Arduino**: Real-time motor control, sensor reading
- **Raspberry Pi**: Running ROS2, basic vision
- **Jetson**: Neural network inference, advanced perception

```python
# Arduino-style pseudocode (actual Arduino uses C++)
def loop():
    # Read sensors
    encoder_value = read_encoder()
    
    # Simple PID control
    error = target - encoder_value
    command = kp * error
    
    # Send to motor
    set_motor_pwm(command)
```

---

**Next:** [Power Systems →](./power-systems)

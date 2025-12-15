---
description: Generate runnable code examples for robotics concepts
---

# Code Example Generator Skill

## Purpose
Creates practical, runnable code examples for robotics and AI concepts.

## Instructions

### Guidelines

1. **Language Selection**
   - Python for AI, simulation, prototyping
   - C++ for real-time, embedded, performance
   - Both for comparison when relevant

2. **Code Quality**
   - Include comprehensive comments
   - Use type hints (Python) or strong typing (C++)
   - Follow PEP 8 / Google Style Guide
   - Make code self-contained when possible

3. **Structure**
   - Start with imports/includes
   - Define helper functions/classes
   - Provide a main example usage
   - Include expected output as comment

### Template

```python
"""
[Brief description of what this example demonstrates]

This example shows how to [specific concept].
"""

import numpy as np
# Other imports...

def example_function(param: type) -> return_type:
    """
    [Description]
    
    Args:
        param: [Description]
        
    Returns:
        [Description]
    """
    # Implementation with comments explaining each step
    pass

# Example usage
if __name__ == "__main__":
    result = example_function(value)
    print(f"Result: {result}")
    # Expected output: [expected]
```

## Common Topics

- Forward/Inverse Kinematics
- PID Control
- Sensor Fusion (Kalman Filter)
- Computer Vision (OpenCV)
- Deep Learning (PyTorch)
- Reinforcement Learning
- ROS2 Nodes

## Output
Return complete, runnable code with documentation.

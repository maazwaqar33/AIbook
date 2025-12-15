---
sidebar_position: 5
---

# Human-Robot Interaction

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

HRI defines how robots and humans work together safely and effectively.

## Key Principles

1. **Safety First** - Robot must never harm humans
2. **Natural Interaction** - Intuitive communication
3. **Transparency** - Robot intentions should be clear
4. **Adaptability** - Adjust to human preferences

## Modalities

- **Speech** - Voice commands and responses
- **Gesture** - Hand and body movements  
- **Touch** - Physical guidance
- **Gaze** - Eye contact and attention

```python
# Simple gesture detection
def detect_pointing(pose_landmarks):
    # Check if arm is extended
    wrist = pose_landmarks['right_wrist']
    elbow = pose_landmarks['right_elbow']
    shoulder = pose_landmarks['right_shoulder']
    
    arm_vector = np.array([wrist.x - shoulder.x, wrist.y - shoulder.y])
    arm_length = np.linalg.norm(arm_vector)
    
    if arm_length > 0.5:  # Arm extended
        direction = arm_vector / arm_length
        return direction
    return None
```

---

**Next Chapter:** [Humanoid Robotics →](../chapter-07-humanoids/)

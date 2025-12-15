---
sidebar_position: 2
---

# Computer Vision

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Computer vision enables robots to understand visual information.

## Object Detection

Locate and classify objects in images:

```python
import cv2
from ultralytics import YOLO

# Load pre-trained model
model = YOLO('yolov8n.pt')

# Detect objects in frame
def detect_objects(frame):
    results = model(frame)
    
    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                'class': model.names[int(box.cls)],
                'confidence': float(box.conf),
                'bbox': box.xyxy[0].tolist()
            })
    return detections
```

## Depth Estimation

Get 3D information from cameras:
- Stereo vision (two cameras)
- Structured light (Intel RealSense)
- Time of flight (Azure Kinect)

---

**Next:** [Sensor Fusion →](./sensor-fusion)

---
sidebar_position: 3
---

# Deep Learning

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Deep learning enables robots to process complex sensory data like images and point clouds.

## CNNs for Robot Vision

```python
import torch
import torch.nn as nn

class RobotVision(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.backbone = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d(1)
        )
        self.head = nn.Linear(128, num_classes)
    
    def forward(self, x):
        features = self.backbone(x)
        return self.head(features.flatten(1))
```

## Pre-trained Models

Don't train from scratch—use transfer learning:
- **ResNet** - General features
- **CLIP** - Vision + language
- **SAM** - Segmentation

---

**Next:** [Reinforcement Learning →](./reinforcement-learning)

---
sidebar_position: 2
---

# Machine Learning Basics

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

ML gives robots the ability to learn from data instead of explicit programming.

## Types of Learning

### Supervised Learning
Learn from labeled examples:
```python
from sklearn.ensemble import RandomForestClassifier

# Train a classifier for obstacle detection
X = sensor_readings  # Features
y = obstacle_labels  # 1 = obstacle, 0 = clear

clf = RandomForestClassifier()
clf.fit(X, y)

# Predict on new data
prediction = clf.predict(new_reading)
```

### Unsupervised Learning
Find patterns without labels—useful for anomaly detection and clustering sensor data.

### Reinforcement Learning
Learn by trial and error—covered in its own section.

---

**Next:** [Deep Learning →](./deep-learning)

---
sidebar_position: 4
---

# Physical AI

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Physical AI is artificial intelligence that exists in and interacts with the physical world.

## Beyond Digital AI

Traditional AI operates on data. Physical AI must:
- Deal with physics, friction, gravity
- Handle uncertainty in the real world
- Learn from physical interaction
- Operate in real-time

## The Embodiment Hypothesis

Intelligence emerges from physical interaction. A robot learns differently than a pure software agent because:
- Actions have consequences that can't be undone
- The world provides constant feedback
- Physical constraints shape possible solutions

## Learning in the Physical World

```python
# Sim-to-Real transfer pipeline
class PhysicalAITraining:
    def __init__(self):
        self.sim_env = SimulatedEnvironment()
        self.real_env = RealRobot()
        
    def train(self, num_episodes=1000):
        # Phase 1: Train in simulation
        policy = self.train_in_sim(num_episodes)
        
        # Phase 2: Domain randomization
        policy = self.randomize_and_retrain(policy)
        
        # Phase 3: Fine-tune on real robot
        policy = self.finetune_real(policy)
        
        return policy
```

---

**Next:** [Real-World Applications →](./real-world-applications)

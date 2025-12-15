---
sidebar_position: 5
---

# Power Systems

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Power is often the limiting factor in mobile robotics.

## Battery Technologies

| Type | Energy Density | Pros | Cons |
|------|---------------|------|------|
| LiPo | High | Lightweight | Fire risk |
| Li-Ion | Medium-High | Safer | Heavier |
| LiFePO4 | Medium | Very safe, long life | Heavy |

## Power Budget

Always plan your power:

```python
# Power budget calculation
class PowerBudget:
    def __init__(self, battery_wh):
        self.battery_wh = battery_wh
        self.consumers = {}
    
    def add_consumer(self, name, watts):
        self.consumers[name] = watts
    
    def runtime_hours(self):
        total_watts = sum(self.consumers.values())
        return self.battery_wh / total_watts

# Example humanoid robot
budget = PowerBudget(battery_wh=500)
budget.add_consumer("Compute", 50)
budget.add_consumer("Motors (avg)", 200)
budget.add_consumer("Sensors", 30)

print(f"Expected runtime: {budget.runtime_hours():.1f} hours")
# Output: Expected runtime: 1.8 hours
```

---

**Next Chapter:** [Kinematics & Dynamics →](../chapter-04-kinematics/)

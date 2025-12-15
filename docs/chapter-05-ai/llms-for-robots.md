---
sidebar_position: 5
---

# LLMs for Robots

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

Large Language Models are revolutionizing how robots understand and plan.

## Use Cases

1. **Task Planning** - Convert natural language to action sequences
2. **Reasoning** - Common sense about the physical world  
3. **Interaction** - Natural conversation with users

## Example: LLM-based Planning

```python
from openai import OpenAI

client = OpenAI()

def plan_task(task_description, available_actions):
    prompt = f"""
    You are a robot assistant. Given the task and available actions, 
    output a step-by-step plan.
    
    Task: {task_description}
    Available actions: {available_actions}
    
    Plan:
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content

# Usage
plan = plan_task(
    "Make me a cup of coffee",
    ["navigate(location)", "pick(object)", "place(object, location)", 
     "pour(container)", "press_button(device)"]
)
```

---

**Next Chapter:** [Perception & Interaction →](../chapter-06-perception/)

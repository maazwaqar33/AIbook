---
description: Generate comprehensive textbook chapter content for Physical AI & Humanoid Robotics
---

# Chapter Writer Skill

## Purpose
This skill generates textbook chapter content for the Physical AI & Humanoid Robotics book.

## Instructions

When generating chapter content, follow these guidelines:

### Structure
1. Start with a frontmatter (sidebar_position, title)
2. Import ChapterActions component
3. Begin with an engaging introduction
4. Use clear headings (H2, H3) for sections
5. Include code examples with comments
6. Add mermaid diagrams where helpful
7. End with practice questions

### Writing Style
- Write in first person where appropriate ("I find that...", "My approach is...")
- Be conversational but professional
- Explain complex concepts with analogies
- Include practical examples

### Code Examples
- Always include comments explaining the code
- Make examples runnable when possible
- Use Python for most examples, C++ for performance-critical code
- Include type hints in Python

### Template

```markdown
---
sidebar_position: X
---

# [Chapter Title]

import ChapterActions from '@site/src/components/ChapterActions';

<ChapterActions />

[Engaging introduction paragraph]

## Section 1

[Content...]

```python
# Example code with comments
```

## Practice Questions

1. [Question 1]
2. [Question 2]

---

**Next:** [Next Section →](./next-section)
```

## Output Format
Return Markdown content following the template above.

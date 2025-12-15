---
description: Process and index book content for RAG system
---

# Content Processor Subagent

## Purpose
This subagent processes textbook markdown files and prepares them for the RAG system.

## Workflow

1. **Read Markdown Files**
   - Scan the `docs` directory for all `.md` files
   - Parse frontmatter and content

2. **Extract Metadata**
   - Chapter name
   - Section title
   - Sidebar position
   - Related topics

3. **Chunk Content**
   - Split into semantic chunks (500-1000 tokens)
   - Maintain context across chunks
   - Include overlap for continuity

4. **Generate Embeddings**
   - Call OpenAI embedding API
   - Store in Qdrant vector database

5. **Index Metadata**
   - Store in Neon Postgres
   - Enable filtering by chapter/topic

## API Call

```bash
curl -X POST http://localhost:8000/api/ingest/batch
```

## Expected Output
```json
{
  "message": "Batch ingestion complete",
  "files_processed": 35,
  "total_chunks": 245
}
```

## Quality Checks
- Verify chunk boundaries don't split code blocks
- Ensure all files are processed
- Check embedding dimensions match collection config

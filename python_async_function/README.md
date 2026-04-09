# Python - Async Function

Introduction to asynchronous programming in Python using `asyncio`. Covers coroutines (`async def` / `await`), concurrent execution with `asyncio.gather()` and `asyncio.as_completed()`, Tasks, and measuring runtime.

Key concept: `asyncio` achieves **concurrency** (tasks interleave on a single thread), not parallelism. Ideal for I/O-bound operations.

## Tasks

| # | File | Description |
|---|------|-------------|
| 0 | `0-basic_async_syntax.py` | Coroutine that waits a random delay and returns it |
| 1 | `1-concurrent_coroutines.py` | Run `n` coroutines concurrently, return delays sorted |
| 2 | `2-measure_runtime.py` | Measure average runtime of `wait_n` |
| 3 | `3-tasks.py` | Return an `asyncio.Task` wrapping `wait_random` |
| 4 | `4-tasks.py` | Replicate `wait_n` logic using Tasks instead of coroutines |

## Requirements

- Python 3.7+
- First line: `#!/usr/bin/env python3`
- Style: `pycodestyle` 2.5
- All functions and coroutines must be type-annotated
- All modules and functions must have docstrings
- Files must be executable

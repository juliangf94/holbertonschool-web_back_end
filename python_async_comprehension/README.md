# Python - Async Comprehension

Async generators and async comprehensions in Python. An async generator is an `async def` function that uses `yield`, allowing `await` between each produced value. Async comprehensions use `async for` to collect values from async generators.

## Tasks

| # | File | Description |
|---|------|-------------|
| 0 | `0-async_generator.py` | Async generator that yields 10 random floats (1s delay each) |
| 1 | `1-async_comprehension.py` | Collect 10 values from the generator using async comprehension |
| 2 | `2-measure_runtime.py` | Run 4 async comprehensions in parallel and measure total runtime |

## Key concept

The 4 comprehensions in task 2 run concurrently via `asyncio.gather()`. Each takes ~10 seconds, but since they overlap the total is ~10s, not 40s.

## Requirements

- Python 3.7+
- First line: `#!/usr/bin/env python3`
- Style: `pycodestyle` 2.5
- All functions and coroutines must be type-annotated
- All modules and functions must have docstrings
- Files must be executable

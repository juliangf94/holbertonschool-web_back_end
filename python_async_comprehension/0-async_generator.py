#!/usr/bin/env python3
"""Module that provides an async generator yielding random numbers."""
import asyncio
import random
from typing import Generator


async def async_generator() -> Generator[float, None, None]:
    """Loop 10 times, wait 1 second async, then yield a random float 0-10."""
    for _ in range(10):
        await asyncio.sleep(1)
        yield random.uniform(0, 10)

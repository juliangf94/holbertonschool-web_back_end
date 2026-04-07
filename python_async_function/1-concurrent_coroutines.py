#!/usr/bin/env python3
"""Module that provides a coroutine to run multiple wait_random concurrently."""
import asyncio
from typing import List

wait_random = __import__('0-basic_async_syntax').wait_random


async def wait_n(n: int, max_delay: int) -> List[float]:
    """Spawn wait_random n times and return delays in ascending order."""
    delays = []
    for coro in asyncio.as_completed([wait_random(max_delay) for _ in range(n)]):
        delays.append(await coro)
    return delays

#!/usr/bin/env python3
"""Module that provides task_wait_n using asyncio Tasks."""
import asyncio
from typing import List

task_wait_random = __import__('3-tasks').task_wait_random


async def task_wait_n(n: int, max_delay: int) -> List[float]:
    """Spawn task_wait_random n times and return delays in ascending order."""
    delays = []
    for coro in asyncio.as_completed([task_wait_random(max_delay) for _ in range(n)]):
        delays.append(await coro)
    return delays

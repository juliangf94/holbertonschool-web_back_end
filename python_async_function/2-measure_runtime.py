#!/usr/bin/env python3
"""Module that measures the runtime of wait_n."""
import asyncio
import time

wait_n = __import__('1-concurrent_coroutines').wait_n


def measure_time(n: int, max_delay: int) -> float:
    """Measure total execution time of wait_n and return total_time / n."""
    start = time.perf_counter()
    asyncio.run(wait_n(n, max_delay))
    return (time.perf_counter() - start) / n

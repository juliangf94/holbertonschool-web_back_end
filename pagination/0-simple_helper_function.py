#!/usr/bin/env python3
"""
Module that provides a helper function for pagination index calculation.
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Return a tuple with the start and end index for a given page and size.
    """
    start = (page - 1) * page_size
    end = page * page_size
    return (start, end)

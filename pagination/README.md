# Pagination

## Description

This project explores different pagination strategies for a REST API using a dataset of popular baby names. The goal is to understand how to paginate data safely and efficiently, from basic offset-based pagination to deletion-resilient hypermedia pagination.

## Learning Objectives

- How to paginate a dataset with simple `page` and `page_size` parameters
- How to paginate a dataset with hypermedia metadata (HATEOAS)
- How to paginate in a deletion-resilient manner

## Requirements

- Python 3.9
- Ubuntu 20.04 LTS
- pycodestyle 2.5.*
- All functions and coroutines must be type-annotated
- All modules and functions must have documentation

## Files

| File | Description |
|---|---|
| `0-simple_helper_function.py` | Helper function `index_range` that calculates start and end indexes for pagination |
| `1-simple_pagination.py` | `Server` class with `get_page` method for basic pagination |
| `2-hypermedia_pagination.py` | Extends `Server` with `get_hyper` method that returns HATEOAS metadata |
| `3-hypermedia_del_pagination.py` | Extends `Server` with `get_hyper_index` for deletion-resilient pagination |

## Dataset

**Popular_Baby_Names.csv** — contains 19,418 rows of baby name data with columns: Year of Birth, Gender, Ethnicity, Child's First Name, Count, Rank.

## Tasks

### Task 0 - Simple helper function
Implements `index_range(page, page_size)` that returns a tuple `(start, end)` for a given page. Pages are 1-indexed.

```python
index_range(1, 7)        # → (0, 7)
index_range(3, 15)       # → (30, 45)
```

### Task 1 - Simple pagination
Implements a `Server` class with `get_page(page, page_size)` that returns the corresponding slice of the dataset. Uses `assert` to validate inputs.

```python
server.get_page(1, 3)      # → first 3 rows
server.get_page(3000, 100) # → []
```

### Task 2 - Hypermedia pagination
Adds `get_hyper(page, page_size)` that returns a dictionary with the data and navigation metadata following the HATEOAS principle.

```python
server.get_hyper(1, 2)
# → {'page_size': 2, 'page': 1, 'data': [...],
#    'next_page': 2, 'prev_page': None, 'total_pages': 9709}
```

### Task 3 - Deletion-resilient hypermedia pagination
Adds `get_hyper_index(index, page_size)` that uses original row indexes instead of page numbers. If rows are deleted between requests, the client never misses items.

```python
server.get_hyper_index(3, 2)
# → {'index': 3, 'data': [...], 'page_size': 2, 'next_index': 5}
```

## Author

Julian Gonzalez Florez

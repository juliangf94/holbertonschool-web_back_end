# Python - Async Function

## ¿Qué es la programación asíncrona?

La programación **asíncrona** permite que un programa haga otras cosas mientras espera que una operación lenta (I/O, red, disco) termine, en vez de bloquearse y no hacer nada.

> Python usa el módulo `asyncio` para manejar código asíncrono.

---

## Conceptos clave

### `async def` — definir una coroutine

Una **coroutine** es una función que puede pausarse y reanudarse.

```python
async def mi_funcion():
    ...
```

### `await` — pausar y esperar

Dentro de una coroutine, `await` pausa la ejecución hasta que la operación termine, liberando el hilo para otras tareas.

```python
async def esperar():
    await asyncio.sleep(2)  # pausa 2 segundos sin bloquear
```

### `asyncio.run()` — ejecutar una coroutine

Para ejecutar una coroutine desde código normal (no async):

```python
import asyncio
asyncio.run(mi_funcion())
```

### `asyncio.gather()` — ejecutar varias coroutines en paralelo

```python
await asyncio.gather(coroutine1(), coroutine2(), coroutine3())
```

### `asyncio.create_task()` — crear una tarea

Convierte una coroutine en una Task que se ejecuta concurrentemente.

```python
task = asyncio.create_task(mi_coroutine())
resultado = await task
```

---

## `random.uniform(a, b)`

Retorna un float aleatorio entre `a` y `b` (ambos incluidos).

```python
import random
random.uniform(0, 10)  # e.g. 7.342...
```

---

## Diferencia entre concurrencia y paralelismo

| Concepto      | Descripción                                              |
|---------------|----------------------------------------------------------|
| Concurrencia  | Varias tareas progresan alternándose (un solo hilo)     |
| Paralelismo   | Varias tareas corren al mismo tiempo (varios hilos/CPU) |

`asyncio` usa **concurrencia** — no paralelismo real. Es ideal para tareas I/O bound (esperar red, disco), no para CPU bound (cálculos pesados).

---

## Tasks del proyecto

| # | Archivo                     | Descripción                                      |
|---|-----------------------------|--------------------------------------------------|
| 0 | `0-basic_async_syntax.py`   | Coroutine que espera un delay aleatorio          |
| 1 | `1-concurrent_coroutines.py`| Ejecutar múltiples coroutines concurrentemente   |
| 2 | `2-measure_runtime.py`      | Medir el tiempo de ejecución                     |
| 3 | `3-tasks.py`                | Crear asyncio Tasks                              |
| 4 | `4-tasks.py`                | Modificar wait_n usando tasks                    |

---

## Reglas del proyecto

- Primera línea: `#!/usr/bin/env python3`
- Estilo: `pycodestyle` versión 2.5
- Todas las funciones y coroutines deben estar type-annotated
- Cada módulo y función debe tener su **docstring**
- Archivos deben ser ejecutables (`chmod +x archivo.py`)

---
---

# 0. The basics of async
Write an asynchronous coroutine wait_random that takes an integer max_delay (default 10) and waits a random float delay between 0 and max_delay seconds, then returns it.
`0-main.py`
```python
#!/usr/bin/env python3

import asyncio

wait_random = __import__('0-basic_async_syntax').wait_random

print(asyncio.run(wait_random()))
print(asyncio.run(wait_random(5)))
print(asyncio.run(wait_random(15)))

```

`0-basic_async_syntax.py`
```python
#!/usr/bin/env python3
"""Module that provides a basic async coroutine that waits a random delay."""
import asyncio
import random


async def wait_random(max_delay: int = 10) -> float:
    """Wait a random delay between 0 and max_delay seconds and return it."""
    delay = random.uniform(0, max_delay)
    await asyncio.sleep(delay)
    return delay

```

## Logica

## Output
```bash
9.034261504534394
1.6216525464615306
10.634589756751769
```

---

# 1. Let's execute multiple coroutines at the same time with async
Import wait_random and write async routine wait_n that spawns wait_random n times with max_delay. Returns list of delays in ascending order without using sort().
`1-main.py`
```python
#!/usr/bin/env python3
'''
Test file for printing the correct output of the wait_n coroutine
'''
import asyncio

wait_n = __import__('1-concurrent_coroutines').wait_n

print(asyncio.run(wait_n(5, 5)))
print(asyncio.run(wait_n(10, 7)))
print(asyncio.run(wait_n(10, 0)))

```

`1-concurrent_coroutines.py`
```python
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

```

## Logica

## Output
```bash
[0.9693881173832269, 1.0264573845731002, 1.7992690129519855, 3.641373003434587, 4.500011569340617]
[0.07256214141415429, 1.518551245602588, 3.355762808432721, 3.7032593997182923, 3.7796178143655546, 4.744537840582318, 5.50781365463315, 5.758942587637626, 6.109707751654879, 6.831351588271327]
[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
```

---

# 2. Measure the runtime
Create a regular function measure_time(n, max_delay) that measures the total execution time of wait_n(n, max_delay) and returns total_time / n as a float.
`2-main.py`
```python
#!/usr/bin/env python3

measure_time = __import__('2-measure_runtime').measure_time

n = 5
max_delay = 9

print(measure_time(n, max_delay))

```

`2-measure_runtime.py`
```python
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

```

## Logica

## Output
```bash
1.759705400466919
```

---

# 3. Tasks
Write a regular function task_wait_random(max_delay) that returns an asyncio.Task wrapping wait_random.
`3-main.py`
```python
#!/usr/bin/env python3

import asyncio

task_wait_random = __import__('3-tasks').task_wait_random


async def test(max_delay: int) -> float:
    task = task_wait_random(max_delay)
    await task
    print(task.__class__)

asyncio.run(test(5))

```

`3-tasks.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to create an asyncio Task."""
import asyncio

wait_random = __import__('0-basic_async_syntax').wait_random


def task_wait_random(max_delay: int) -> asyncio.Task:
    """Return an asyncio Task for wait_random(max_delay)."""
    return asyncio.create_task(wait_random(max_delay))

```

## Logica

## Output
```bash
<class '_asyncio.Task'>
```

---

# 4. Tasks
Alter wait_n into task_wait_n: same logic but using task_wait_random instead of wait_random.
`4-main.py`
```python
#!/usr/bin/env python3

import asyncio

task_wait_n = __import__('4-tasks').task_wait_n

n = 5
max_delay = 6
print(asyncio.run(task_wait_n(n, max_delay)))

```

`4-tasks.py`
```python
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

```

## Logica

## Output
```bash
[0.2261658205652346, 1.1942770588220557, 1.8410422186086628, 2.1457353803430523, 4.002505454641153]
```

---


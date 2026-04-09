# Python - Async Comprehension

## ¿Qué es un Async Generator?

Un **async generator** es una función `async def` que usa `yield`. Puede pausarse con `await` entre cada valor que produce.

```python
async def mi_generador():
    for i in range(5):
        await asyncio.sleep(1)  # pausa async
        yield i                 # produce un valor
```

Para **consumirlo** se usa `async for`:

```python
async for valor in mi_generador():
    print(valor)
```

---

## ¿Qué es una Async Comprehension?

Es una list comprehension que usa `async for` adentro — solo puede usarse dentro de una función `async def`.

```python
# List comprehension normal
resultado = [x for x in mi_lista]

# Async comprehension
resultado = [x async for x in mi_generador()]
```

También funciona con set, dict y generator expressions:

```python
resultado = {x async for x in mi_generador()}   # set
resultado = {k: v async for k, v in gen()}       # dict
resultado = (x async for x in mi_generador())    # generator
```

---

## Type-annotate de generadores

Para anotar un **generador normal**:

```python
from typing import Generator

def gen() -> Generator[float, None, None]:
    yield 1.0
# Generator[YieldType, SendType, ReturnType]
```

Para anotar un **async generator**:

```python
from typing import AsyncGenerator

async def gen() -> AsyncGenerator[float, None]:
    yield 1.0
# AsyncGenerator[YieldType, SendType]
```

---

## Comparación rápida

| Concepto             | Sintaxis                          |
|----------------------|-----------------------------------|
| Generator normal     | `def` + `yield`                   |
| Async generator      | `async def` + `yield` + `await`   |
| Iterar generator     | `for x in gen()`                  |
| Iterar async gen     | `async for x in gen()`            |
| List comprehension   | `[x for x in gen()]`              |
| Async comprehension  | `[x async for x in gen()]`        |

---

## Tasks del proyecto

| # | Archivo                        | Descripción                                        |
|---|--------------------------------|----------------------------------------------------|
| 0 | `0-async_generator.py`         | Async generator que yields 10 floats aleatorios    |
| 1 | `1-async_comprehension.py`     | Recolectar 10 valores con async comprehension      |
| 2 | `2-measure_runtime.py`         | Medir runtime de 4 comprehensions en paralelo      |

---

## Reglas del proyecto

- Primera línea: `#!/usr/bin/env python3`
- Estilo: `pycodestyle` versión 2.5
- Todas las funciones y coroutines deben estar type-annotated
- Cada módulo y función debe tener su **docstring**
- Archivos deben ser ejecutables (`chmod +x archivo.py`)

---
---

# 0. Async Generator
Write a coroutine async_generator that loops 10 times, waits 1 second async each iteration, then yields a random float between 0 and 10.
`0-main.py`
```python
#!/usr/bin/env python3

import asyncio

async_generator = __import__('0-async_generator').async_generator


async def print_yielded_values():
    result = []
    async for i in async_generator():
        result.append(i)
    print(result)

asyncio.run(print_yielded_values())

```

`0-async_generator.py`
```python
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

```

## Logica

## Output
```bash
[4.403136952967102, 6.9092712604587465, 6.293445466782645, 4.549663490048418, 4.1326571686139015, 9.99058525304903, 6.726734105473811, 9.84331704602206, 1.0067279479988345, 1.3783306401737838]
```

---

# 1. Async Comprehensions
Import async_generator and write coroutine async_comprehension that collects 10 random numbers using an async comprehension over async_generator, then returns them.
`1-main.py`
```python
#!/usr/bin/env python3

import asyncio

async_comprehension = __import__('1-async_comprehension').async_comprehension


async def main():
    print(await async_comprehension())

asyncio.run(main())

```

`1-async_comprehension.py`
```python
#!/usr/bin/env python3
"""Module that provides a coroutine to collect random numbers via async comprehension."""
from typing import List

async_generator = __import__('0-async_generator').async_generator


async def async_comprehension() -> List[float]:
    """Collect 10 random floats from async_generator using async comprehension."""
    return [i async for i in async_generator()]

```

## Logica

## Output
```bash
[9.861842105071727, 8.572355293354995, 1.7467182056248265, 4.0724372912858575, 0.5524750922145316, 8.084266576021555, 8.387128918690468, 1.5486451376520916, 7.713335177885325, 7.673533267041574]
```

---

# 2. Run time for four parallel comprehensions
Import async_comprehension and write coroutine measure_runtime that runs async_comprehension 4 times in parallel with asyncio.gather and returns the total runtime.
`2-main.py`
```python
#!/usr/bin/env python3

import asyncio


measure_runtime = __import__('2-measure_runtime').measure_runtime


async def main():
    return await(measure_runtime())

print(
    asyncio.run(main())
)

```

`2-measure_runtime.py`
```python
#!/usr/bin/env python3
"""Module that measures the runtime of four parallel async comprehensions."""
import asyncio
import time

async_comprehension = __import__('1-async_comprehension').async_comprehension


async def measure_runtime() -> float:
    """Execute async_comprehension 4 times in parallel and return total runtime."""
    start = time.perf_counter()
    await asyncio.gather(*[async_comprehension() for _ in range(4)])
    return time.perf_counter() - start

```

## Logica
Las 4 comprehensions corren en paralelo con asyncio.gather. Cada una tarda ~10 segundos (10 yields x 1 segundo cada uno). Como corren concurrentemente en el mismo event loop, todas esperan al mismo tiempo — no se suman. Por eso el total es ~10 segundos en vez de 40.

## Output
```bash
10.021936893463135
```

---


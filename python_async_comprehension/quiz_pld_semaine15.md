# Evaluation Quiz — Python Variable Annotation + Asynchronous Programming

**Date:** 2026-04-09
**Score:** 45.5% → 7/10 correctas
**Duración:** 3 minutos

---

## 0. What is the purpose of variable annotations in Python?

- To improve code performance.
- To automatically convert data types.
- ✅ **To provide a way to attach metadata to variables for type hints. It merely provides a more readable syntax to replace type comments.**
- To enforce strict type checking at runtime.

> **Por qué:** Las anotaciones de tipo en Python (PEP 526) son puramente informativas. No cambian el comportamiento en tiempo de ejecución ni convierten tipos. Solo sirven como documentación legible para herramientas como `mypy` o editores.

---

## 1. Which module is commonly used for asynchronous programming in Python?

- concurrent
- threads
- ✅ **asyncio**

> **Por qué:** `asyncio` es la librería estándar de Python para programación asíncrona. Provee el event loop, `async/await`, corutinas, y tareas. `threads` y `concurrent.futures` son para concurrencia basada en hilos, no para async/await.

---

## 2. How is a coroutine different from a routine?

- A coroutine can exit permanently, but a routine cannot.
- There is no difference.
- A routine can handle exceptions, but a coroutine cannot.
- ✅ **A coroutine can pause and resume, while a routine runs to completion.**

> **Por qué:** Una función normal (routine) ejecuta de inicio a fin sin interrupciones. Una corutina puede pausarse con `await`, ceder el control al event loop, y luego retomar desde donde se pausó. Esto es lo que permite la concurrencia cooperativa en `asyncio`.

---

## 3. What is a coroutine in Python?

- A special kind of loops in Python.
- A tool for multi-threading.
- ✅ **A special function that can pause and resume its execution.**

> **Por qué:** Una corutina se define con `async def` y puede usar `await` para pausarse. No es un loop ni tiene relación directa con multi-threading; usa un solo hilo con un event loop para manejar múltiples tareas concurrentemente.

---

## 4. Which of these is a feature of the 'asyncio' module?

- Synchronous I/O operations.
- ✅ **Asynchronous I/O operations.**
- Garbage collection.

> **Por qué:** `asyncio` fue diseñado específicamente para I/O asíncrono (red, archivos, etc.) sin bloquear el hilo principal. El garbage collection es responsabilidad del intérprete de Python, no de `asyncio`.

---

## 5. How does 'async for' differ from a regular 'for' in Python?

- There's no difference.
- async for iterates faster than for.
- ✅ **async for is used to iterate over an asynchronous iterator.**
- async for doesn't exist in Python.

> **Por qué:** `async for` llama a `__aiter__` y `__anext__` (versiones async de los métodos de iteración). Permite pausar la iteración en cada elemento si la fuente es un async generator o cualquier objeto que implemente el protocolo de iteración asíncrona.

---

## 6. Are variable annotations in Python enforced at runtime?

- No, they are optional and not enforced.
- Yes, they always enforce type.
- ✅ **Only with external libraries and frameworks.**

> **Por qué:** Python por sí solo no valida las anotaciones en tiempo de ejecución — son ignoradas. Sin embargo, librerías como `Pydantic`, `dataclasses` con validación, o frameworks como `FastAPI` sí leen las anotaciones y las usan para validar o convertir tipos. Por eso la respuesta más completa es "solo con librerías externas".

---

## 7. Concurrency is executing multiple operations in overlapping time periods.

- ✅ **True**
- False

> **Por qué:** Concurrencia significa que múltiples tareas progresan en períodos de tiempo que se solapan — no necesariamente al mismo instante (eso sería paralelismo). `asyncio` logra concurrencia en un solo hilo pausando y retomando tareas.

---

## 8. Which syntax correctly annotates a variable 'a' with type 'int'?

- ✅ **a: int = 5**
- int a = 5
- a = int(5)
- a = 5 // int

> **Por qué:** La sintaxis PEP 526 para anotar variables es `nombre: tipo = valor`. `int a = 5` es sintaxis de C/Java. `a = int(5)` convierte el valor a int pero no es una anotación. `a = 5 // int` es una división de piso inválida.

---

## 9. How do you annotate a function to indicate it returns a string in Python3?

- ✅ **def my_function() -> str:**
- def my_function() returns str:
- def my_function(): str:
- my_function() -> str:

> **Por qué:** PEP 3107 define la sintaxis `-> tipo` después de los parámetros y antes de los dos puntos para anotar el tipo de retorno. Las otras opciones son sintaxis inválidas en Python.

---

## Resumen de errores

| # | Pregunta | Error cometido |
|---|----------|---------------|
| 2 | Diferencia corutina vs rutina | Confusión sobre el comportamiento de pausa/resume |
| 4 | Feature de asyncio | No identificar I/O asíncrono como la característica principal |
| 6 | Annotations enforced at runtime? | No considerar el rol de librerías externas como Pydantic |

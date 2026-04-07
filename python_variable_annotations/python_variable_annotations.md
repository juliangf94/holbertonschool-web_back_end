# Python - Variable Annotations

## ¿Qué son las anotaciones de tipo?

Las **type annotations** (anotaciones de tipo) son una forma de indicarle a Python (y a las herramientas de análisis) qué tipo de dato espera recibir o devolver una función, o qué tipo tiene una variable.

> Python sigue siendo un lenguaje de **tipado dinámico**: las anotaciones NO cambian el comportamiento del programa en tiempo de ejecución. Son solo "pistas" para el programador y para herramientas como **mypy**.

---

## Sintaxis básica

### Variables

```python
# Sin anotación
nombre = "Julian"

# Con anotación
nombre: str = "Julian"
edad: int = 21
altura: float = 1.75
activo: bool = True
```

### Funciones

```python
def suma(a: float, b: float) -> float:
    return a + b
```

- `a: float` → el parámetro `a` debe ser un float
- `b: float` → el parámetro `b` debe ser un float
- `-> float` → la función retorna un float

---

## Tipos básicos

| Tipo Python | Ejemplo               |
|-------------|----------------------|
| `int`       | `42`                 |
| `float`     | `3.14`               |
| `str`       | `"hola"`             |
| `bool`      | `True` / `False`     |
| `None`      | `None`               |

---

## Tipos complejos (del módulo `typing`)

Para tipos más complejos se importa desde el módulo `typing`:

```python
from typing import List, Tuple, Dict, Union, Optional, Callable, Iterable, Sequence
```

### List

```python
def suma_lista(numeros: List[float]) -> float:
    return sum(numeros)
```

### Tuple

```python
def par(s: str, n: int) -> Tuple[str, float]:
    return (s, float(n))
```

### Union (puede ser uno u otro tipo)

```python
def mezcla(x: Union[int, float]) -> str:
    return str(x)
```

### Optional (puede ser el tipo o None)

```python
def buscar(nombre: Optional[str] = None) -> str:
    return nombre or "desconocido"
```

### Callable (funciones como argumentos)

```python
def aplicar(fn: Callable[[float], float], x: float) -> float:
    return fn(x)
```

---

## ¿Qué es Duck Typing?

> "Si camina como un pato y grazna como un pato, entonces es un pato."

En Python, no importa el **tipo exacto** de un objeto, sino que tenga los **métodos o atributos** que necesitas. Por eso Python usa `Iterable`, `Sequence`, etc., en lugar de exigir listas o tuplas específicas.

```python
# Esto funciona con listas, tuplas, strings... cualquier iterable
def primero(seq: Sequence[int]) -> int:
    return seq[0]
```

---

## Validar con mypy

**mypy** es una herramienta que analiza tu código y verifica que los tipos sean consistentes.

```bash
# Instalar
pip install mypy

# Validar un archivo
mypy 0-add.py
```

Si hay errores de tipo, mypy los reporta antes de que corras el código.

---

## Ver las anotaciones en tiempo de ejecución

Python guarda las anotaciones en el atributo `__annotations__`:

```python
def add(a: float, b: float) -> float:
    return a + b

print(add.__annotations__)
# {'a': <class 'float'>, 'b': <class 'float'>, 'return': <class 'float'>}
```

---

## Tasks del proyecto

| # | Archivo          | Descripción                              |
|---|-----------------|------------------------------------------|
| 0 | `0-add.py`      | Suma dos floats                          |
| 1 | `1-concat.py`   | Concatena dos strings                    |
| 2 | `2-floor.py`    | Floor de un float → int                  |
| 3 | `3-to_str.py`   | Convierte float a string                 |
| 4 | `4-define_variables.py` | Define variables con tipos        |
| 5 | `5-sum_list.py` | Suma una lista de floats                 |
| 6 | `6-sum_mixed_list.py` | Suma lista de int y float          |
| 7 | `7-to_kv.py`    | Retorna tupla (str, float)               |
| 8 | `8-make_multiplier.py` | Retorna función multiplicadora    |
| 9 | `9-element_length.py` | Longitud de elementos iterables    |

---

## Reglas del proyecto

- Primera línea: `#!/usr/bin/env python3`
- Estilo: `pycodestyle` versión 2.5
- Cada módulo, clase y función debe tener su **docstring**
- Archivos deben ser ejecutables (`chmod +x archivo.py`)


---
---

# 0. Basic annotations - add
Write a type-annotated function add that takes a float a and a float b as arguments and returns their sum as a float.
`0-main.py`
```python
#!/usr/bin/env python3
add = __import__('0-add').add

print(add(1.11, 2.22) == 1.11 + 2.22)
print(add.__annotations__)

```

`0-add.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to add two floats."""


def add(a: float, b: float) -> float:
    """Return the sum of two floats a and b."""
    return a + b

```

## Logica

## Output
```bash
True
{'a':  <class 'float'>, 'b': <class 'float'>, 'return': <class 'float'>}
```

---

# 1. Basic annotations - concat
Write a type-annotated function `concat` that takes a string `str1` and a string `str2` as arguments and returns a concatenated string.
`1-main.py`
```python
#!/usr/bin/env python3
concat = __import__('1-concat').concat

str1 = "egg"
str2 = "shell"

print(concat(str1, str2) == "{}{}".format(str1, str2))
print(concat.__annotations__)

```

`1-concat.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to concatenate two strings."""


def concat(str1: str, str2: str) -> str:
    """Return the concatenation of str1 and str2."""
    return str1 + str2

```

## Logica

## Output
```bash
True
{'str1': <class 'str'>, 'str2': <class 'str'>, 'return': <class 'str'>}
```

---

# 2. Basic annotations - floor
Write a type-annotated function floor which takes a float n as argument and returns the floor of the float.
`2-main.py`
```python
#!/usr/bin/env python3

import math

floor = __import__('2-floor').floor

ans = floor(3.14)

print(ans == math.floor(3.14))
print(floor.__annotations__)
print("floor(3.14) returns {}, which is a {}".format(ans, type(ans)))

```

`2-floor.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to return the floor of a float."""
import math


def floor(n: float) -> int:
    """Return the floor of float n as an integer."""
    return math.floor(n)

```

## Logica

## Output
```bash
True
{'n': <class 'float'>, 'return': <class 'int'>}
floor(3.14) returns 3, which is a <class 'int'>
```

---

# 3. Basic annotations - to string
Write a type-annotated function to_str that takes a float n as argument and returns the string representation of the float.
`3-main.py`
```python
#!/usr/bin/env python3
to_str = __import__('3-to_str').to_str

pi_str = to_str(3.14)
print(pi_str == str(3.14))
print(to_str.__annotations__)
print("to_str(3.14) returns {} which is a {}".format(pi_str, type(pi_str)))

```

`3-to_str.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to convert a float to a string."""


def to_str(n: float) -> str:
    """Return the string representation of float n."""
    return str(n)

```

## Logica

## Output
```bash
True
{'n': <class 'float'>, 'return': <class 'str'>}
to_str(3.14) returns 3.14 which is a <class 'str'>
```

---

# 4. Define variables
Define and annotate the following variables with the specified values: a (int = 1), pi (float = 3.14), i_understand_annotations (bool = True), school (str = "Holberton").
`4-main.py`
```python
#!/usr/bin/env python3

a = __import__('4-define_variables').a
pi = __import__('4-define_variables').pi
i_understand_annotations = __import__('4-define_variables').i_understand_annotations
school = __import__('4-define_variables').school

print("a is a {} with a value of {}".format(type(a), a))
print("pi is a {} with a value of {}".format(type(pi), pi))
print("i_understand_annotations is a {} with a value of {}".format(type(i_understand_annotations), i_understand_annotations))
print("school is a {} with a value of {}".format(type(school), school))

```

`4-define_variables.py`
```python
#!/usr/bin/env python3
"""Module that defines and annotates several variables."""

a: int = 1
pi: float = 3.14
i_understand_annotations: bool = True
school: str = "Holberton"

```

## Logica

## Output
```bash
a is a <class 'int'> with a value of 1
pi is a <class 'float'> with a value of 3.14
i_understand_annotations is a <class 'bool'> with a value of True
school is a <class 'str'> with a value of Holberton
```

---

# 5. Complex types - list of floats
Write a type-annotated function sum_list which takes a list input_list of floats as argument and returns their sum as a float.
`5-main.py`
```python
#!/usr/bin/env python3

sum_list = __import__('5-sum_list').sum_list

floats = [3.14, 1.11, 2.22]
floats_sum = sum_list(floats)
print(floats_sum == sum(floats))
print(sum_list.__annotations__)
print("sum_list(floats) returns {} which is a {}".format(floats_sum, type(floats_sum)))

```

`5-sum_list.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to sum a list of floats."""
from typing import List


def sum_list(input_list: List[float]) -> float:
    """Return the sum of a list of floats."""
    return sum(input_list)

```

## Logica

## Output
```bash
True
{'input_list': typing.List[float], 'return': <class 'float'>}
sum_list(floats) returns 6.470000000000001 which is a <class 'float'>
```

---

# 6. Complex types - mixed list
Write a type-annotated function sum_mixed_list which takes a list mxd_lst of integers and floats and returns their sum as a float.
`6-main.py`
```python
#!/usr/bin/env python3

sum_mixed_list = __import__('6-sum_mixed_list').sum_mixed_list

print(sum_mixed_list.__annotations__)
mixed = [5, 4, 3.14, 666, 0.99]
ans = sum_mixed_list(mixed)
print(ans == sum(mixed))
print("sum_mixed_list(mixed) returns {} which is a {}".format(ans, type(ans)))

```

`6-sum_mixed_list.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to sum a mixed list of ints and floats."""
from typing import List, Union


def sum_mixed_list(mxd_lst: List[Union[int, float]]) -> float:
    """Return the sum of a mixed list of integers and floats."""
    return float(sum(mxd_lst))

```

## Logica

## Output
```bash
{'mxd_lst': typing.List[typing.Union[int, float]], 'return': <class 'float'>}
True
sum_mixed_list(mixed) returns 679.13 which is a <class 'float'>
```

---

# 7. Complex types - string and int/float to tuple
Write a type-annotated function to_kv that takes a string k and an int OR float v and returns a tuple. The first element is k, the second is v squared (annotated as float).
`7-main.py`
```python
#!/usr/bin/env python3

to_kv = __import__('7-to_kv').to_kv

print(to_kv.__annotations__)
print(to_kv("eggs", 3))
print(to_kv("school", 0.02))

```

`7-to_kv.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to build a tuple from a string and a number."""
from typing import Union, Tuple


def to_kv(k: str, v: Union[int, float]) -> Tuple[str, float]:
    """Return a tuple with k and the square of v."""
    return (k, v ** 2)

```

## Logica

## Output
```bash
{'k': <class 'str'>, 'v': typing.Union[int, float], 'return': typing.Tuple[str, float]}
('eggs', 9)
('school', 0.0004)
```

---

# 8. Complex types - functions
Write a type-annotated function make_multiplier that takes a float multiplier and returns a function that multiplies a float by multiplier.
`8-main.py`
```python
#!/usr/bin/env python3

make_multiplier = __import__('8-make_multiplier').make_multiplier
print(make_multiplier.__annotations__)
fun = make_multiplier(2.22)
print("{}".format(fun(2.22)))

```

`8-make_multiplier.py`
```python
#!/usr/bin/env python3
"""Module that provides a function that returns a multiplier function."""
from typing import Callable


def make_multiplier(multiplier: float) -> Callable[[float], float]:
    """Return a function that multiplies a float by multiplier."""
    return lambda x: x * multiplier

```

## Logica

## Output
```bash
{'multiplier': <class 'float'>, 'return': typing.Callable[[float], float]}
4.928400000000001
```

---

# 9. Let's duck type an iterable object
Annotate the function element_length: takes an Iterable of Sequences, returns a List of Tuples with each element and its length.
`9-main.py`
```python
#!/usr/bin/env python3

element_length = __import__('9-element_length').element_length

print(element_length.__annotations__)

```

`9-element_length.py`
```python
#!/usr/bin/env python3
"""Module that provides a function to return lengths of iterable elements."""
from typing import Iterable, Sequence, List, Tuple


def element_length(lst: Iterable[Sequence]) -> List[Tuple[Sequence, int]]:
    """Return a list of tuples with each element and its length."""
    return [(i, len(i)) for i in lst]

```

## Logica

## Output
```bash
{'lst': typing.Iterable[typing.Sequence], 'return': typing.List[typing.Tuple[typing.Sequence, int]]}
```

---


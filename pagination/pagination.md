# Proyecto: Pagination

## ¿Qué es la paginación?

**Paginación** es dividir un conjunto grande de datos en partes más pequeñas llamadas **páginas**, en lugar de devolver todo de una vez.

Es como un libro: en vez de darte todas las páginas juntas, te las das de 10 en 10.

**Ejemplo práctico:**
Tienes 10,000 nombres en una base de datos. En vez de devolver los 10,000 de golpe (lento, pesado), devuelves:
- Página 1 → nombres del 1 al 20
- Página 2 → nombres del 21 al 40
- ...y así sucesivamente

Esto mejora el rendimiento de la API y la experiencia del usuario.

---

## Tipos de paginación

### 1. Paginación por Offset
Usa dos parámetros: `limit` (cuántos elementos devolver) y `offset` (desde qué posición empezar).

```
GET /items?limit=20&offset=0   → elementos del 1 al 20
GET /items?limit=20&offset=20  → elementos del 21 al 40
GET /items?limit=20&offset=100 → elementos del 101 al 120
```

**Ventajas:** fácil de implementar, no guarda estado en el servidor.  
**Desventajas:** lenta con offsets grandes; si se insertan datos nuevos entre solicitudes, los resultados pueden repetirse o saltarse.

---

### 2. Paginación por Keyset
En lugar de un número de posición, usa el **último valor devuelto** como punto de partida para la siguiente página.

```
GET /items?limit=20&created:lte:2021-01-20T00:00:00
```

La API devuelve los 20 elementos cuya fecha de creación sea menor o igual a la indicada.

**Ventajas:** rendimiento consistente sin importar cuántos datos haya.  
**Desventajas:** está acoplada al campo de ordenamiento, no se puede saltar a una página arbitraria.

---

### 3. Paginación Seek
Extensión de keyset que usa un `after_id` para indicar desde qué elemento continuar.

```
GET /items?limit=20&after_id=57
```

La API devuelve los 20 elementos siguientes al que tiene `id=57`.

**Ventajas:** desacoplada de filtros, rendimiento consistente, más flexible.  
**Desventajas:** más compleja de implementar en el backend.

---

## ¿Qué es HATEOAS?

**HATEOAS** (Hypermedia as the Engine of Application State) es un principio de REST donde la API no solo devuelve datos, sino también **los enlaces a las acciones disponibles** según el estado actual del recurso.

La idea es que el cliente **no necesite saber de antemano cómo usar la API**: la va descubriendo a través de los links que la misma respuesta le provee.

**Ejemplo — cuenta bancaria:**

Si la cuenta tiene saldo positivo, la respuesta incluye:
```json
{
  "balance": 1500,
  "links": [
    { "rel": "deposit",  "href": "/account/123/deposit" },
    { "rel": "withdraw", "href": "/account/123/withdraw" },
    { "rel": "transfer", "href": "/account/123/transfer" }
  ]
}
```

Si la cuenta está en negativo, la respuesta solo incluye:
```json
{
  "balance": -200,
  "links": [
    { "rel": "deposit", "href": "/account/123/deposit" }
  ]
}
```

El servidor controla qué acciones están disponibles según el estado, y el cliente simplemente las sigue. Esto hace que la API sea **autodescriptiva** y que los clientes no rompan si el backend cambia.

**Aplicado a paginación:**
```json
{
  "data": [...],
  "page": 2,
  "links": {
    "prev": "/items?page=1&page_size=20",
    "next": "/items?page=3&page_size=20"
  }
}
```

---

## Descripción general

Este proyecto explora diferentes estrategias de paginación para una API REST usando un dataset de nombres populares de bebés (`Popular_Baby_Names.csv`). El objetivo es aprender a paginar datos de forma segura y eficiente.

---

# Task 0 - Función helper simple
## Qué hace
Implementa una función `index_range(page, page_size)` que calcula los índices de inicio y fin para una página determinada dentro de una lista paginada.

## Cómo funciona
- Las páginas son **1-indexadas** (la primera página es la página 1).
- Dado un número de `page` y un `page_size`, la función retorna una tupla `(start_index, end_index)`.
- La fórmula es:
  - `start = (page - 1) * page_size`
  - `end = page * page_size`

## Codigo
Write a function named `index_range` that takes two integer arguments `page` and `page_size`.
The function should return a tuple of size two containing a start index and an end index corresponding to the range of indexes to return in a list for those particular pagination parameters.

Page numbers are 1-indexed, i.e. the first page is page 1.  

`0-main.py`
```python
#!/usr/bin/env python3
"""
`0-simple_helper_function.py`
"""

index_range = __import__('0-simple_helper_function').index_range

res = index_range(1, 7)
print(type(res))
print(res)

res = index_range(page=3, page_size=15)
print(type(res))
print(res)

```

`0-simple_helper_function.py`
```python
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

```

## Output
```bash
<class 'tuple'>
(0, 7)
<class 'tuple'>
(30, 45)

```


---

# Task 1 - Paginación simple

## Qué hace
Implementa una clase `Server` que carga el dataset `Popular_Baby_Names.csv` y provee un método `get_page(page, page_size)` para retornar una página específica de datos.

## Cómo funciona
- El CSV se carga una sola vez y se guarda en caché como lista de filas.
- `get_page` usa `index_range` de la Task 0 para encontrar el slice correcto del dataset.
- Si los índices calculados están fuera del rango del dataset, retorna una lista vacía.
- Tanto `page` como `page_size` deben ser enteros positivos (validados con `assert`).

## Codigo
Copia `index_range` del task anterior e implementa el método `get_page` dentro de la clase `Server`.
Usa `assert` para validar que ambos argumentos sean enteros mayores que 0.
Usa `index_range` para encontrar los índices correctos y retornar la página correspondiente del dataset.
Si los argumentos están fuera del rango del dataset, retorna una lista vacía.

`1-main.py`
```python
#!/usr/bin/env python3
"""
Main file
"""

Server = __import__('1-simple_pagination').Server

server = Server()

try:
    should_err = server.get_page(-10, 2)
except AssertionError:
    print("AssertionError raised with negative values")

try:
    should_err = server.get_page(0, 0)
except AssertionError:
    print("AssertionError raised with 0")

try:
    should_err = server.get_page(2, 'Bob')
except AssertionError:
    print("AssertionError raised when page and/or page_size are not ints")


print(server.get_page(1, 3))
print(server.get_page(3, 2))
print(server.get_page(3000, 100))

```

`1-simple_pagination.py`
```python
#!/usr/bin/env python3
"""Module that provides a paginated Server class for baby names dataset."""
import csv
import math
from typing import List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Return a tuple with the start and end index for a given page and size."""
    start = (page - 1) * page_size
    end = page * page_size
    return (start, end)


class Server:
    """Server class to paginate a database of popular baby names."""

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Return a page of the dataset given page number and page size."""
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0
        start, end = index_range(page, page_size)
        dataset = self.dataset()
        if start >= len(dataset):
            return []
        return dataset[start:end]

```

## Logica

**`dataset()`**
Método que carga el CSV una sola vez y lo guarda en `self.__dataset`.  

La primera vez que se llama, abre el archivo, lee todas las filas con `csv.reader` y descarta la primera (el encabezado) con `dataset[1:]`.  

En llamadas siguientes simplemente retorna el valor ya guardado en caché, sin volver a leer el archivo.  

**`get_page(page, page_size)`**
Método principal de paginación. Recibe el número de página y el tamaño de página, y retorna la lista de filas correspondiente del dataset.  
```python
index_range(page=1, page_size=3)
```
Devuelve `(0, 3)` que seran los primeros 3 renglones del archivo  

**`assert`**
Valida que los argumentos sean correctos antes de ejecutar la lógica.  
Si la condición es `False`, lanza un `AssertionError` y detiene la ejecución.  
```python
assert isinstance(page, int) and page > 0       # page debe ser entero positivo
assert isinstance(page_size, int) and page_size > 0  # page_size también
```
Sin este control, valores como `-1`, `0` o `'Bob'` podrían causar resultados inesperados.

**`isinstance(valor, tipo)`**
Función de Python que verifica si un valor es de un tipo específico.  
Retorna `True` o `False`.
```python
isinstance(5, int)     # → True
isinstance('Bob', int) # → False
isinstance(2.5, int)   # → False  (float no es int)
```
Se usa aquí para asegurarse de que `page` y `page_size` sean enteros reales, no strings ni floats.

**`start >= len(dataset)`**
Verifica si el índice de inicio está fuera del rango del dataset.  
Si es así, retorna `[]` en lugar de intentar hacer un slice vacío o lanzar un error.
```python
# dataset tiene 19418 filas
# get_page(3000, 100) → start = 299900 → mayor que 19418 → retorna []
```

## Output
```bash
AssertionError raised with negative values
AssertionError raised with 0
AssertionError raised when page and/or page_size are not ints
[['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Olivia', '172', '1'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Chloe', '112', '2'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Sophia', '104', '3']]
[['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Emily', '99', '4'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Mia', '79', '5']]
[]

```

---

# Task 2 - Paginación con hipermedia

## Qué hace
Extiende la clase `Server` con un método `get_hyper(page, page_size)` que retorna metadatos de paginación junto con los datos, siguiendo el principio **HATEOAS**.

## Cómo funciona
El método retorna un diccionario con las siguientes claves:
- `page_size`: cantidad de elementos en la página actual
- `page`: número de página actual
- `data`: lista de filas de esa página
- `next_page`: número de la siguiente página, o `None` si es la última
- `prev_page`: número de la página anterior, o `None` si es la primera
- `total_pages`: total de páginas en el dataset (calculado con `math.ceil`)

## Codigo
Copia el código del task anterior y agrega el método `get_hyper` a la clase `Server`.
Reutiliza `get_page` para obtener los datos y calcula los metadatos de navegación.

`2-main.py`
```python
#!/usr/bin/env python3
"""
`2-hypermedia_pagination.py`
"""

Server = __import__('2-hypermedia_pagination').Server

server = Server()

print(server.get_hyper(1, 2))
print("---")
print(server.get_hyper(2, 2))
print("---")
print(server.get_hyper(100, 3))
print("---")
print(server.get_hyper(3000, 100))

```

`2-hypermedia_pagination.py`
```python
#!/usr/bin/env python3
"""Module that provides hypermedia pagination for the baby names dataset."""
import csv
import math
from typing import Dict, List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Return a tuple with the start and end index for a given page and size."""
    start = (page - 1) * page_size
    end = page * page_size
    return (start, end)


class Server:
    """Server class to paginate a database of popular baby names."""

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Return a page of the dataset given page number and page size."""
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0
        start, end = index_range(page, page_size)
        dataset = self.dataset()
        if start >= len(dataset):
            return []
        return dataset[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """Return a dictionary with pagination metadata and the data page."""
        data = self.get_page(page, page_size)
        total_pages = math.ceil(len(self.dataset()) / page_size)
        return {
            'page_size': len(data),
            'page': page,
            'data': data,
            'next_page': page + 1 if page < total_pages else None,
            'prev_page': page - 1 if page > 1 else None,
            'total_pages': total_pages
        }

```

## Logica

**`get_hyper(page, page_size)`**
Método que extiende la paginación simple con metadatos de navegación. Llama a `get_page` para obtener los datos y luego calcula la información de contexto para que el cliente sepa dónde está y a dónde puede ir.

**`math.ceil(total / page_size)`**
Calcula el total de páginas redondeando hacia arriba. Se usa `ceil` porque aunque la última página tenga menos elementos que `page_size`, sigue siendo una página válida.
```python
math.ceil(19418 / 2)   # → 9709 páginas
math.ceil(19418 / 3)   # → 6473 páginas
math.ceil(19418 / 100) # → 195 páginas
```

**`next_page`**
Retorna el número de la siguiente página solo si no estamos en la última. De lo contrario retorna `None`.
```python
page + 1 if page < total_pages else None
# página 1 de 9709 → next_page = 2
# página 9709 de 9709 → next_page = None
```

**`prev_page`**
Retorna el número de la página anterior solo si no estamos en la primera. De lo contrario retorna `None`.
```python
page - 1 if page > 1 else None
# página 2 → prev_page = 1
# página 1 → prev_page = None
```

**`len(data)`**
Se usa en lugar de `page_size` directo porque la última página puede tener menos elementos que `page_size`. Así `page_size` en la respuesta refleja cuántos elementos hay realmente.
```python
# Última página con page_size=100 y 18 elementos restantes:
# len(data) → 18  (no 100)
```

## Output
```bash
{'page_size': 2, 'page': 1, 'data': [['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Olivia', '172', '1'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Chloe', '112', '2']], 'next_page': 2, 'prev_page': None, 'total_pages': 9709}
---
{'page_size': 2, 'page': 2, 'data': [['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Sophia', '104', '3'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Emma', '99', '4']], 'next_page': 3, 'prev_page': 1, 'total_pages': 9709}
---
{'page_size': 3, 'page': 100, 'data': [['2016', 'FEMALE', 'BLACK NON HISPANIC', 'Londyn', '14', '39'], ['2016', 'FEMALE', 'BLACK NON HISPANIC', 'Amirah', '14', '39'], ['2016', 'FEMALE', 'BLACK NON HISPANIC', 'McKenzie', '14', '39']], 'next_page': 101, 'prev_page': 99, 'total_pages': 6473}
---
{'page_size': 0, 'page': 3000, 'data': [], 'next_page': None, 'prev_page': 2999, 'total_pages': 195}

```

---

# Task 3 - Paginación resiliente a eliminaciones (`3-hypermedia_del_pagination.py`)

## Qué hace
Implementa un método `get_hyper_index(index, page_size)` que maneja la paginación incluso si se eliminan filas del dataset entre una solicitud y otra.

## Cómo funciona
- La clase `Server` guarda en caché un **dataset indexado** (`indexed_dataset`): un diccionario donde cada clave es el índice original de la fila en el CSV.
- `get_hyper_index` recibe un `index` de inicio y un `page_size`.
- Recorre el dataset indexado a partir de `index` y recolecta `page_size` filas, **saltando los huecos** causados por filas eliminadas.
- Retorna un diccionario con `index`, `next_index`, `page_size` y `data`.

## Codigo
Usa el código base provisto e implementa `get_hyper_index` dentro de la clase `Server`.
Usa `assert` para verificar que el índice esté dentro del rango válido del dataset indexado.
Recorre el dataset saltando los índices eliminados hasta recolectar `page_size` elementos.

`3-main.py`
```python
#!/usr/bin/env python3
"""
Main file
"""

Server = __import__('3-hypermedia_del_pagination').Server

server = Server()

server.indexed_dataset()

try:
    server.get_hyper_index(300000, 100)
except AssertionError:
    print("AssertionError raised when out of range")

index = 3
page_size = 2

print("Nb items: {}".format(len(server._Server__indexed_dataset)))

# 1- request first index
res = server.get_hyper_index(index, page_size)
print(res)

# 2- request next index
print(server.get_hyper_index(res.get('next_index'), page_size))

# 3- remove the first index
del server._Server__indexed_dataset[res.get('index')]
print("Nb items: {}".format(len(server._Server__indexed_dataset)))

# 4- request again the initial index -> first data is not the same as request 1
print(server.get_hyper_index(index, page_size))

# 5- request again initial next index -> same data page as request 2
print(server.get_hyper_index(res.get('next_index'), page_size))

```

`3-hypermedia_del_pagination.py`
```python
#!/usr/bin/env python3
"""Deletion-resilient hypermedia pagination."""

import csv
import math
from typing import Dict, List


class Server:
    """Server class to paginate a database of popular baby names."""

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]
        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0."""
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Return a page using original indexes, resilient to deletions."""
        dataset = self.indexed_dataset()
        assert index is not None and 0 <= index < len(dataset)
        data = []
        current = index
        while len(data) < page_size:
            if current in dataset:
                data.append(dataset[current])
            current += 1
        return {
            'index': index,
            'data': data,
            'page_size': page_size,
            'next_index': current
        }

```

## Logica

**`indexed_dataset()`**
Convierte la lista del dataset en un diccionario donde la clave es el índice original de cada fila. Esto permite detectar huecos (índices eliminados) al iterar.
```python
# Lista original:
[fila0, fila1, fila2, fila3, ...]

# Diccionario indexado:
{0: fila0, 1: fila1, 2: fila2, 3: fila3, ...}

# Si se elimina el índice 1:
{0: fila0, 2: fila2, 3: fila3, ...}  # clave 1 ya no existe
```

**`{i: dataset[i] for i in range(len(dataset))}`**
Es una **comprensión de diccionario**. Crea el diccionario indexado en una sola línea, donde cada clave es el índice `i` y el valor es la fila `dataset[i]`.

Es equivalente a escribir esto a mano:
```python
result = {}
for i in range(len(dataset)):
    result[i] = dataset[i]
```

Ejemplo con datos reales:
```python
dataset = [['Emma', '99'], ['Mia', '79'], ['Olivia', '172']]

# resultado:
{
    0: ['Emma', '99'],
    1: ['Mia', '79'],
    2: ['Olivia', '172']
}
```

La clave importa porque si luego eliminas el índice `1`, el diccionario queda así:
```python
{
    0: ['Emma', '99'],
    # 1 ya no existe → hueco detectado
    2: ['Olivia', '172']
}
```
Y el `while` del `get_hyper_index` puede saltar ese hueco con `if current in dataset`.

**`assert 0 <= index < len(dataset)`**
Verifica que el índice de inicio sea válido antes de iterar. Si el cliente pide un índice mayor al tamaño del dataset, lanza `AssertionError`.
```python
server.get_hyper_index(300000, 100)  # → AssertionError (fuera de rango)
```

**`while len(data) < page_size`**
En lugar de un slice fijo, itera avanzando de uno en uno y solo agrega la fila si el índice actual existe en el diccionario. Así salta automáticamente los índices eliminados.
```python
# page_size = 2, index = 3, índice 4 fue eliminado
current = 3 → dataset[3] existe → agrega → data tiene 1 elemento
current = 4 → dataset[4] NO existe → salta
current = 5 → dataset[5] existe → agrega → data tiene 2 elementos
# next_index = 6
```

**`next_index`**
Es el valor de `current` al terminar el `while`, es decir, el primer índice después de la última fila recolectada. El cliente usa este valor para pedir la siguiente página.

**Por qué es resiliente a eliminaciones:**
Si entre dos solicitudes se elimina una fila, el `while` simplemente la salta y sigue buscando. El cliente siempre recibe exactamente `page_size` elementos sin repeticiones ni saltos en los datos visibles.

## Output
```bash
AssertionError raised when out of range
Nb items: 19418
{'index': 3, 'data': [['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Emma', '99', '4'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Emily', '99', '4']], 'page_size': 2, 'next_index': 5}
{'index': 5, 'data': [['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Mia', '79', '5'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Charlotte', '59', '6']], 'page_size': 2, 'next_index': 7}
Nb items: 19417
{'index': 3, 'data': [['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Emily', '99', '4'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Mia', '79', '5']], 'page_size': 2, 'next_index': 6}
{'index': 5, 'data': [['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Mia', '79', '5'], ['2016', 'FEMALE', 'ASIAN AND PACIFIC ISLANDER', 'Charlotte', '59', '6']], 'page_size': 2, 'next_index': 7}

```

---

## Conceptos clave aprendidos

| Concepto | Descripción |
|---|---|
| Paginación simple | Usar `page` + `page_size` para hacer un slice de la lista |
| Paginación con hipermedia | Retornar metadatos (`next_page`, `prev_page`, `total_pages`) junto con los datos |
| Paginación resiliente a eliminaciones | Rastrear índices originales en lugar de números de página para manejar filas faltantes |

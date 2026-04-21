# Proyecto: NoSQL

## ¿Qué es NoSQL?

**NoSQL** (Not Only SQL) es un tipo de base de datos que **no usa tablas con filas y columnas** como las bases de datos relacionales tradicionales. En su lugar, almacena los datos en formatos más flexibles como documentos, pares clave-valor, grafos o columnas anchas.

Nació para resolver los problemas de escalabilidad y flexibilidad que tienen las bases de datos relacionales cuando manejan grandes volúmenes de datos no estructurados.

---

## SQL vs NoSQL

| Característica | SQL | NoSQL |
|---|---|---|
| Estructura | Tablas con esquema fijo | Documentos, clave-valor, etc. |
| Esquema | Rígido (definido antes) | Flexible (puede cambiar) |
| Escalabilidad | Vertical (más hardware) | Horizontal (más servidores) |
| Relaciones | JOINs entre tablas | Datos embebidos o referenciados |
| Ejemplos | MySQL, PostgreSQL | MongoDB, Redis, Cassandra |

**Ejemplo SQL:**
```sql
SELECT * FROM users WHERE age > 18;
```

**Ejemplo NoSQL (MongoDB):**
```js
db.users.find({ age: { $gt: 18 } })
```

---

## ¿Qué es ACID?

**ACID** es un conjunto de propiedades que garantizan que las transacciones en una base de datos sean confiables:

- **A — Atomicity (Atomicidad):** una transacción se ejecuta completa o no se ejecuta. No hay estados intermedios.
- **C — Consistency (Consistencia):** los datos siempre pasan de un estado válido a otro estado válido.
- **I — Isolation (Aislamiento):** las transacciones concurrentes no se afectan entre sí.
- **D — Durability (Durabilidad):** una vez confirmada una transacción, los datos persisten aunque el sistema falle.

Las bases de datos SQL cumplen ACID estrictamente. Las NoSQL a veces sacrifican alguna de estas propiedades para ganar velocidad y escalabilidad.

---

## ¿Qué es un Document Storage?

Un **document storage** (almacenamiento de documentos) es un tipo de base de datos NoSQL donde los datos se guardan como **documentos**, generalmente en formato JSON o BSON.

Cada documento es una unidad independiente que puede tener una estructura diferente a los demás. No hay esquema fijo.

**Ejemplo de documento en MongoDB:**
```json
{
  "_id": "001",
  "name": "Julian",
  "age": 32,
  "skills": ["Python", "MongoDB", "REST APIs"]
}
```

Otro documento de la misma colección puede tener campos completamente distintos sin causar errores.

---

## Tipos de bases de datos NoSQL

| Tipo | Descripción | Ejemplo |
|---|---|---|
| **Document** | Datos en formato JSON/BSON | MongoDB, CouchDB |
| **Key-Value** | Par clave → valor, como un diccionario | Redis, DynamoDB |
| **Column-Family** | Datos organizados en columnas agrupadas | Cassandra, HBase |
| **Graph** | Datos como nodos y relaciones | Neo4j, ArangoDB |

---

## Beneficios de NoSQL

- **Escalabilidad horizontal:** se puede distribuir en múltiples servidores fácilmente.
- **Esquema flexible:** los documentos no necesitan tener la misma estructura.
- **Alta disponibilidad:** diseñadas para funcionar aunque fallen algunos nodos.
- **Velocidad:** optimizadas para lectura/escritura masiva.
- **Ideal para big data:** maneja grandes volúmenes de datos no estructurados.

---

## ¿Qué es MongoDB?

**MongoDB** es la base de datos NoSQL de tipo documento más popular. Almacena datos en formato **BSON** (Binary JSON) y se organiza así:

```
MongoDB
└── Database (base de datos)
    └── Collection (colección → equivale a una tabla)
        └── Document (documento → equivale a una fila)
```

**Comandos básicos del shell de MongoDB:**

```js
show dbs                           // listar bases de datos
use mydb                           // seleccionar/crear una base de datos
show collections                   // listar colecciones
db.collection.find()               // listar todos los documentos
db.collection.find({ key: val })   // listar documentos con filtro
db.collection.countDocuments()     // contar documentos
db.collection.insert({})           // insertar un documento
db.collection.updateOne({}, {})    // actualizar el primer documento que coincida
db.collection.updateMany({}, {})   // actualizar todos los documentos que coincidan
db.collection.deleteOne({ key: val })   // eliminar el primer documento que coincida
db.collection.deleteMany({ key: val })  // eliminar todos los documentos que coincidan
```

---

## Descripción general

Este proyecto explora el uso de MongoDB como base de datos NoSQL. Se trabaja tanto con el shell de MongoDB (archivos `.js`) como con Python usando la librería **PyMongo** para realizar operaciones CRUD y consultas avanzadas.

---

## Comandos para manejar el servidor MongoDB

**Iniciar MongoDB:**
```bash
sudo -u mongodb /usr/bin/mongod --config /etc/mongod.conf &
```
- `sudo -u mongodb` — ejecuta el comando como el usuario del sistema `mongodb`
- `/usr/bin/mongod` — es el proceso servidor de MongoDB (`mongod` = mongo daemon)
- `--config /etc/mongod.conf` — archivo de configuración con puertos, rutas de datos y logs
- `&` — lo corre en segundo plano para no bloquear la terminal

**Verificar que está corriendo:**
```bash
mongo --eval "db.runCommand({ connectionStatus: 1 })"
```
- `mongo` — cliente del shell de MongoDB (distinto a `mongod` que es el servidor)
- `--eval` — ejecuta un comando sin abrir el shell interactivo
- Si responde `"ok": 1` el servidor está funcionando correctamente

**Abrir el shell interactivo:**
```bash
mongo
```

**Cerrar MongoDB:**
```bash
sudo pkill mongod
```
- `pkill mongod` — mata el proceso del servidor por nombre

> **Diferencia clave:** `mongod` es el **servidor** (guarda y sirve los datos), `mongo` es el **cliente** (se conecta al servidor para hacer consultas). Es como la diferencia entre un restaurante (`mongod`) y el mesero que te atiende (`mongo`).

---

## El shell interactivo de MongoDB

Cuando ejecutas `mongo` en la terminal entras al shell interactivo. El prompt cambia de `$` a `>` — esto significa que ya no estás en Linux, estás dentro de MongoDB.

```
$  →  terminal de Linux  (comandos como ls, cd, sudo, pkill)
>  →  shell de MongoDB   (comandos como show dbs, use, db.find())
```

**Comandos dentro del shell `>`:**

```js
show dbs                              // listar todas las bases de datos
use nombre_db                         // seleccionar o crear una base de datos
show collections                      // listar colecciones de la db actual
db.collection.find()                  // ver todos los documentos
db.collection.find().pretty()         // ver documentos con formato legible
db.collection.insert({ key: val })    // insertar un documento
db.collection.updateOne({}, {})       // actualizar un documento
db.collection.deleteOne({})           // eliminar un documento
db.collection.countDocuments()        // contar documentos
db.dropDatabase()                     // eliminar la base de datos actual
exit                                  // salir del shell
```

**Para salir del shell:**
```js
exit
```

Después de `exit` vuelves al prompt `$` de Linux y ahí sí puedes usar comandos como `sudo pkill mongod`.

---

# Task 0 - Listar todas las bases de datos (`0-list_databases`)

## Qué hace
Escribe un script de MongoDB que lista todas las bases de datos disponibles en el servidor.

## Cómo funciona
- El script se ejecuta directamente en el shell de MongoDB usando el comando `mongo`.
- `show dbs` es el comando nativo del shell que muestra todas las bases de datos junto con su tamaño.

## Codigo

`0-list_databases`
```js
// lists all databases in MongoDB
show dbs
```

## Test
```bash
cat 0-list_databases | mongo
```
si MongoDB no está corriendo primero ejecutar:
```bash
sudo -u mongodb /usr/bin/mongod --config /etc/mongod.conf &
```

## Output
```bash
admin        0.000GB
config       0.000GB
local        0.000GB
logs         0.005GB
```

---

# Task 1 - Crear o usar una base de datos (`1-use_or_create_database`)

## Qué hace
Escribe un script que crea o selecciona la base de datos `my_db`. Si ya existe la selecciona, si no existe la crea.

## Cómo funciona
- `use nombre_db` es el comando de MongoDB para seleccionar una base de datos.
- Si la base de datos no existe, MongoDB la crea automáticamente cuando se inserte el primer documento.
- Por eso el output dice `switched to db my_db` y no "created".

## Codigo

`1-use_or_create_database`
```js
// creates or uses the database my_db
use my_db
```

## Test
```bash
cat 1-use_or_create_database | mongo
```

## Output
```bash
switched to db my_db
```

---

# Task 2 - Insertar un documento (`2-insert`)

## Qué hace
Inserta un documento en la colección `school` de la base de datos `my_db`. El documento tiene un atributo `name` con el valor `"Holberton school"`.

## Cómo funciona
- La base de datos no se selecciona dentro del script, se pasa como argumento al comando `mongo`.
- `db.school.insert({})` inserta un documento en la colección `school`.
- Si la colección `school` no existe, MongoDB la crea automáticamente.
- Retorna `WriteResult({ "nInserted": 1 })` confirmando que se insertó 1 documento.

## Codigo

`2-insert`
```js
// inserts a document in the collection school
db.school.insert({ name: "Holberton school" })
```

## Test
```bash
cat 2-insert | mongo my_db
```

## Logica

**`db.school.insert({ name: "Holberton school" })`**
- `db` — referencia a la base de datos activa (la que se pasa en el comando)
- `.school` — nombre de la colección donde se inserta
- `.insert({})` — inserta el documento. Retorna `WriteResult({ "nInserted": 1 })` (a diferencia de `insertOne` que retorna un objeto diferente)
- `{ name: "Holberton school" }` — el documento a insertar (MongoDB agrega `_id` automáticamente)

**`cat 2-insert | mongo my_db`**
El nombre de la base de datos (`my_db`) se pasa directamente al comando `mongo`, no dentro del script. Esto permite reutilizar el script en cualquier base de datos.

## Output
```bash
WriteResult({ "nInserted" : 1 })
```

---

# Task 3 - Listar todos los documentos (`3-all`)

## Qué hace
Lista todos los documentos de la colección `school`.

## Cómo funciona
- `db.school.find()` sin filtros retorna todos los documentos de la colección.
- Cada documento incluye el `_id` que MongoDB genera automáticamente al insertar.

## Codigo

`3-all`
```js
// lists all documents in the collection school
db.school.find()
```

## Test
```bash
cat 3-all | mongo my_db
```

## Logica

**`db.school.find()`**
- Sin argumentos retorna **todos** los documentos de la colección.
- El `_id` es un `ObjectId` que MongoDB genera automáticamente — es único por documento.
- Para verlos con mejor formato se puede usar `.pretty()`:
```js
db.school.find().pretty()
// muestra cada documento con indentación en lugar de una sola línea
```

## Output
```bash
{ "_id" : ObjectId("5a8fad532b69437b63252406"), "name" : "Holberton school" }
```

---

# Task 4 - Listar documentos con filtro (`4-match`)

## Qué hace
Lista todos los documentos de la colección `school` donde `name` sea igual a `"Holberton school"`.

## Cómo funciona
- `db.school.find({ campo: valor })` filtra los documentos que cumplan la condición.
- Es el equivalente a un `WHERE` en SQL.

## Codigo

`4-match`
```js
// lists all documents with name="Holberton school" in the collection school
db.school.find({ name: "Holberton school" })
```

## Test
```bash
cat 4-match | mongo my_db
```

## Logica

**`db.school.find({ name: "Holberton school" })`**
- El objeto `{}` dentro de `find` es el **filtro** — solo retorna documentos que coincidan.
- Comparado con Task 3, la diferencia es:
```js
db.school.find()                          // sin filtro → todos los documentos
db.school.find({ name: "Holberton school" }) // con filtro → solo los que coincidan
```
- En SQL sería equivalente a:
```sql
SELECT * FROM school WHERE name = 'Holberton school';
```

## Output
```bash
{ "_id" : ObjectId("5a8fad532b69437b63252406"), "name" : "Holberton school" }
```

---

# Task 5 - Contar documentos (`5-count`)

## Qué hace
Muestra el número total de documentos en la colección `school`.

## Cómo funciona
- `db.school.countDocuments()` cuenta todos los documentos de la colección.
- Retorna un número entero.

## Codigo

`5-count`
```js
// displays the number of documents in the collection school
db.school.countDocuments({})
```

## Test
```bash
cat 5-count | mongo my_db
```

## Logica

**`db.school.countDocuments()`**
- Sin filtro cuenta **todos** los documentos de la colección.
- También acepta un filtro para contar solo los que coincidan:
```js
db.school.countDocuments({ name: "Holberton school" })
```
- En SQL sería equivalente a:
```sql
SELECT COUNT(*) FROM school;
```

## Output
```bash
1
```

---

# Task 6 - Actualizar documentos (`6-update`)

## Qué hace
Agrega el atributo `address` con valor `"972 Mission street"` a todos los documentos de `school` donde `name` sea `"Holberton school"`.

## Cómo funciona
- `updateMany` actualiza **todos** los documentos que coincidan con el filtro.
- `$set` agrega o modifica atributos sin tocar los demás campos del documento.

## Codigo

`6-update`
```js
// adds address attribute to all documents with name="Holberton school"
db.school.updateMany(
    { name: "Holberton school" },
    { $set: { address: "972 Mission street" } }
)
```

## Test
```bash
cat 6-update | mongo my_db
```

## Logica

**`updateMany(filtro, modificacion)`**
- Primer argumento `{ name: "Holberton school" }` — el filtro, igual que en `find()`
- Segundo argumento `{ $set: { address: "..." } }` — la modificación a aplicar
- Actualiza **todos** los documentos que coincidan (a diferencia de `updateOne` que solo modifica el primero)

**`$set`**
Operador de MongoDB que agrega o sobreescribe campos sin eliminar los demás:
```js
// antes:  { name: "Holberton school" }
// después: { name: "Holberton school", address: "972 Mission street" }
```
Sin `$set` se reemplazaría el documento completo con solo `{ address: "..." }`.

**Diferencia entre `updateOne` y `updateMany`:**
```js
db.school.updateOne(...)   // modifica solo el primer documento que coincida
db.school.updateMany(...)  // modifica TODOS los documentos que coincidan
```

## Output
```bash
{ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }
```

---

# Task 7 - Eliminar documentos por filtro (`7-delete`)

## Qué hace
Elimina todos los documentos de la colección `school` donde `name` sea `"Holberton school"`.

## Cómo funciona
- `deleteMany` elimina **todos** los documentos que coincidan con el filtro.
- Si `4-match` no retorna nada después, significa que todos fueron eliminados correctamente.

## Codigo

`7-delete`
```js
// deletes all documents with name="Holberton school" in the collection school
db.school.deleteMany({ name: "Holberton school" })
```

## Test
```bash
cat 7-delete | mongo my_db
```

## Logica

**`deleteMany({ filtro })`**
- Elimina todos los documentos que coincidan con el filtro.
- Diferencia con `deleteOne`:
```js
db.school.deleteOne({ name: "Holberton school" })   // elimina solo el primero
db.school.deleteMany({ name: "Holberton school" })  // elimina todos
```
- Para eliminar **todos** los documentos de la colección sin borrarla:
```js
db.school.deleteMany({})  // filtro vacío = todos
```

## Output
```bash
{ "acknowledged" : true, "deletedCount" : 1 }
```

---

# Task 8 - Listar todos los documentos en Python (`8-all.py`)

## Qué hace
Función de Python que retorna todos los documentos de una colección de MongoDB. Si no hay documentos retorna una lista vacía.

## Cómo funciona
- Usa `PyMongo`, la librería de Python para conectarse y operar con MongoDB.
- `mongo_collection` es el objeto de colección que se recibe como argumento — ya viene conectado.
- `find()` sin argumentos retorna todos los documentos como un cursor, que se convierte a lista con `list()`.

## Codigo

`8-main.py`
```python
#!/usr/bin/env python3
""" 8-main """
from pymongo import MongoClient
list_all = __import__('8-all').list_all

if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
    school_collection = client.my_db.school
    schools = list_all(school_collection)
    for school in schools:
        print("[{}] {}".format(school.get('_id'), school.get('name')))
```

`8-all.py`
```python
#!/usr/bin/env python3
"""Module that lists all documents in a MongoDB collection."""


def list_all(mongo_collection):
    """Return a list of all documents in the collection."""
    documents = list(mongo_collection.find())
    if not documents:
        return []
    return documents
```

## Test
Antes de probar, asegúrate de tener documentos en la colección. Si la borraste en el Task 7, inserta datos de prueba:
```bash
mongo my_db --eval 'db.school.insertMany([{name: "Holberton school"}, {name: "UCSD"}])'
```

Luego ejecuta:
```bash
./8-main.py
```

## Logica

**`MongoClient('mongodb://127.0.0.1:27017')`**
Crea la conexión al servidor de MongoDB. `127.0.0.1:27017` es la dirección local y el puerto por defecto de MongoDB.

**`client.my_db.school`**
Accede a la colección `school` dentro de la base de datos `my_db`. Es equivalente a `use my_db` + trabajar con `school`.

**`mongo_collection.find()`**
Retorna un **cursor** — no una lista directamente. Un cursor es un iterador que apunta a los resultados sin cargarlos todos en memoria.

**`list(cursor)`**
Convierte el cursor a una lista de diccionarios Python. Cada documento de MongoDB se convierte en un `dict`.
```python
# cada documento se ve así en Python:
{'_id': ObjectId('5a8f60cfd4321e1403ba7ab9'), 'name': 'Holberton school'}
```

**`if not documents: return []`**
Si la colección está vacía, `find()` retorna un cursor vacío y `list()` retorna `[]`. Este chequeo cumple el requisito del ejercicio de retornar explícitamente una lista vacía.

## Output
```bash
[5a8f60cfd4321e1403ba7ab9] Holberton school
[5a8f60cfd4321e1403ba7aba] UCSD
```

---

# Task 9 - Insertar un documento en Python (`9-insert_school.py`)

## Qué hace
Función de Python que inserta un nuevo documento en una colección usando `**kwargs` y retorna el `_id` generado.

## Cómo funciona
- `**kwargs` permite pasar cualquier número de atributos como argumentos nombrados.
- `insert_one(kwargs)` inserta el diccionario de kwargs como documento.
- Retorna el `_id` del documento insertado mediante `result.inserted_id`.

## Codigo

`9-main.py`
```python
#!/usr/bin/env python3
""" 9-main """
from pymongo import MongoClient
list_all = __import__('8-all').list_all
insert_school = __import__('9-insert_school').insert_school

if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
    school_collection = client.my_db.school
    new_school_id = insert_school(school_collection, name="UCSF", address="505 Parnassus Ave")
    print("New school created: {}".format(new_school_id))

    schools = list_all(school_collection)
    for school in schools:
        print("[{}] {} {}".format(school.get('_id'), school.get('name'), school.get('address', "")))
```

`9-insert_school.py`
```python
#!/usr/bin/env python3
"""Module that inserts a new document in a MongoDB collection."""


def insert_school(mongo_collection, **kwargs):
    """Insert a new document in a collection and return its _id."""
    result = mongo_collection.insert_one(kwargs)
    return result.inserted_id
```

## Test
```bash
./9-main.py
```

## Logica

**`**kwargs`**
Recibe cualquier número de argumentos nombrados y los agrupa en un diccionario:
```python
insert_school(col, name="UCSF", address="505 Parnassus Ave")
# kwargs = {'name': 'UCSF', 'address': '505 Parnassus Ave'}
```
Esto permite insertar documentos con cualquier estructura sin cambiar la función.

**`insert_one(kwargs)`**
Inserta el diccionario `kwargs` directamente como documento en la colección.

**`result.inserted_id`**
El objeto retornado por `insert_one` tiene el atributo `inserted_id` con el `ObjectId` generado automáticamente por MongoDB para el nuevo documento.

## Output
```bash
New school created: 5a8f60cfd4321e1403ba7abb
[5a8f60cfd4321e1403ba7ab9] Holberton school
[5a8f60cfd4321e1403ba7aba] UCSD
[5a8f60cfd4321e1403ba7abb] UCSF 505 Parnassus Ave
```

---

# Task 10 - Actualizar topics de una escuela (`10-update_topics.py`)

## Qué hace
Función de Python que reemplaza todos los topics de un documento en la colección `school` buscando por nombre.

## Cómo funciona
- Usa `update_many` para actualizar todos los documentos que coincidan con el nombre.
- `$set` reemplaza el valor del campo `topics` con la nueva lista.

## Codigo

`10-main.py`
```python
#!/usr/bin/env python3
""" 10-main """
from pymongo import MongoClient
list_all = __import__('8-all').list_all
update_topics = __import__('10-update_topics').update_topics

if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
    school_collection = client.my_db.school
    update_topics(school_collection, "Holberton school", ["Sys admin", "AI", "Algorithm"])

    schools = list_all(school_collection)
    for school in schools:
        print("[{}] {} {}".format(school.get('_id'), school.get('name'), school.get('topics', "")))

    update_topics(school_collection, "Holberton school", ["iOS"])

    schools = list_all(school_collection)
    for school in schools:
        print("[{}] {} {}".format(school.get('_id'), school.get('name'), school.get('topics', "")))
```

`10-update_topics.py`
```python
#!/usr/bin/env python3
"""Module that updates topics of a school document in a MongoDB collection."""


def update_topics(mongo_collection, name, topics):
    """Update all topics of a school document based on the name."""
    mongo_collection.update_many(
        { "name": name },
        { "$set": { "topics": topics } }
    )
```

## Test
```bash
./10-main.py
```

## Logica

**`update_many({ "name": name }, { "$set": { "topics": topics } })`**
- Primer argumento — filtro: busca todos los documentos donde `name` coincida.
- Segundo argumento — modificación: reemplaza el campo `topics` con la nueva lista.

**`$set`**
Reemplaza solo el campo indicado sin tocar los demás campos del documento:
```python
# antes:  { name: "Holberton school" }
# después: { name: "Holberton school", topics: ["Sys admin", "AI", "Algorithm"] }
```
Si `topics` ya existía, lo sobreescribe completamente con la nueva lista.

## Output
```bash
[5a8f60cfd4321e1403ba7abb] UCSF
[5a8f60cfd4321e1403ba7aba] UCSD
[5a8f60cfd4321e1403ba7ab9] Holberton school ['Sys admin', 'AI', 'Algorithm']
[5a8f60cfd4321e1403ba7abb] UCSF
[5a8f60cfd4321e1403ba7aba] UCSD
[5a8f60cfd4321e1403ba7ab9] Holberton school ['iOS']
```

---

# Task 11 - Escuelas por topic (`11-schools_by_topic.py`)

## Qué hace
Función de Python que retorna la lista de escuelas que tienen un topic específico.

## Cómo funciona
- Busca en el campo `topics` (que es una lista) todos los documentos que contengan el valor buscado.
- MongoDB puede buscar dentro de arrays directamente con `find({ "campo": valor })`.

## Codigo

`11-main.py`
```python
#!/usr/bin/env python3
""" 11-main """
from pymongo import MongoClient
list_all = __import__('8-all').list_all
insert_school = __import__('9-insert_school').insert_school
schools_by_topic = __import__('11-schools_by_topic').schools_by_topic

if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
    school_collection = client.my_db.school

    j_schools = [
        { 'name': "Holberton school", 'topics': ["Algo", "C", "Python", "React"]},
        { 'name': "UCSF", 'topics': ["Algo", "MongoDB"]},
        { 'name': "UCLA", 'topics': ["C", "Python"]},
        { 'name': "UCSD", 'topics': ["Cassandra"]},
        { 'name': "Stanford", 'topics': ["C", "React", "Javascript"]}
    ]
    for j_school in j_schools:
        insert_school(school_collection, **j_school)

    schools = schools_by_topic(school_collection, "Python")
    for school in schools:
        print("[{}] {} {}".format(school.get('_id'), school.get('name'), school.get('topics', "")))
```

`11-schools_by_topic.py`
```python
#!/usr/bin/env python3
"""Module that returns schools having a specific topic."""


def schools_by_topic(mongo_collection, topic):
    """Return list of schools that have the specified topic."""
    return list(mongo_collection.find({ "topics": topic }))
```

## Test
```bash
./11-main.py
```

## Logica

**`find({ "topics": topic })`**
Cuando `topics` es un array, MongoDB busca automáticamente dentro del array sin necesidad de operadores especiales:
```python
# documentos en la colección:
{ name: "Holberton school", topics: ["Algo", "C", "Python", "React"] }
{ name: "UCLA",             topics: ["C", "Python"] }
{ name: "UCSD",             topics: ["Cassandra"] }

# find({ "topics": "Python" }) retorna solo los que tienen "Python" en el array:
# → Holberton school, UCLA
```

En SQL sería equivalente a:
```sql
SELECT * FROM school WHERE 'Python' IN topics;
```

## Output
```bash
[5a90731fd4321e1e5a3f53e3] Holberton school ['Algo', 'C', 'Python', 'React']
[5a90731fd4321e1e5a3f53e5] UCLA ['C', 'Python']
```

---

# Task 12 - Estadísticas de logs de Nginx (`12-log_stats.py`)

## Qué hace
Script de Python que muestra estadísticas de los logs de Nginx almacenados en MongoDB: total de documentos, conteo por método HTTP y conteo de requests al path `/status`.

## Cómo funciona
- Se conecta a la base de datos `logs` y la colección `nginx`.
- Usa `count_documents({})` para contar todos los logs.
- Itera sobre los métodos HTTP contando cuántos documentos tienen cada uno.
- Cuenta los documentos con `method=GET` y `path=/status` para el "status check".

## Setup — cargar los datos de prueba
```bash
curl -o dump.zip -s "https://s3.eu-west-3.amazonaws.com/hbtn.intranet.project.files/holbertonschool-webstack/411/dump.zip"
unzip dump.zip
mongorestore dump
```

## Codigo

`12-log_stats.py`
```python
#!/usr/bin/env python3
"""Script that provides stats about Nginx logs stored in MongoDB."""
from pymongo import MongoClient


if __name__ == "__main__":
    client = MongoClient('mongodb://127.0.0.1:27017')
    collection = client.logs.nginx

    print("{} logs".format(collection.count_documents({})))
    print("Methods:")
    for method in ["GET", "POST", "PUT", "PATCH", "DELETE"]:
        count = collection.count_documents({"method": method})
        print("\tmethod {}: {}".format(method, count))
    status = collection.count_documents({"method": "GET", "path": "/status"})
    print("{} status check".format(status))
```

## Test
```bash
./12-log_stats.py
```

## Logica

**`print("{} logs".format(collection.count_documents({})))`**
`count_documents({})` cuenta **todos** los documentos de la colección — el `{}` vacío significa "sin filtro, tráeme todo". El resultado se imprime con `.format()` para reemplazar `{}` en el string por el número. Por ejemplo, si hay 94778 documentos, imprime `94778 logs`.

**`client.logs.nginx`**
Accede a la colección `nginx` dentro de la base de datos `logs`. Es distinto a los tasks anteriores que usaban `my_db`.

**`for method in ["GET", "POST", "PUT", "PATCH", "DELETE"]`**
Itera sobre los 5 métodos HTTP en el orden exacto que pide el ejercicio y cuenta los documentos de cada uno.

**`\t`**
Tabulación — el ejercicio requiere que cada línea de método tenga una tabulación antes. Es importante para que el output sea exactamente igual al esperado.

**`count_documents({"method": "GET", "path": "/status"})`**
Filtra con dos condiciones a la vez — equivale a un `WHERE method = 'GET' AND path = '/status'` en SQL.

## Output
```bash
94778 logs
Methods:
    method GET: 93842
    method POST: 229
    method PUT: 0
    method PATCH: 0
    method DELETE: 0
47415 status check
```

---

## Métodos de PyMongo

Referencia de los métodos y atributos de **PyMongo** usados en los tasks de Python.

```python
# Conexión
MongoClient('mongodb://127.0.0.1:27017')   # conectar al servidor
client.my_db.school                         # acceder a colección (db → colección)

# Operaciones CRUD
collection.find()                           # retorna cursor con todos los documentos
collection.find({ "key": "val" })           # retorna cursor con documentos filtrados
collection.find_one({ "key": "val" })       # retorna un solo documento
collection.insert_one(dict)                 # inserta un documento, retorna InsertOneResult
collection.update_many(filtro, update)      # actualiza todos los documentos que coincidan
collection.delete_many(filtro)              # elimina todos los documentos que coincidan

# Atributos de resultados
result.inserted_id                          # _id del documento insertado (insert_one)
result.modified_count                       # cantidad de documentos modificados (update)
result.deleted_count                        # cantidad de documentos eliminados (delete)
```

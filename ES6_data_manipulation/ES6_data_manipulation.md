# ES6 Data Manipulation

## Learning Objectives

---

### Como crear un array

Hay varias formas de crear un array en JavaScript:

```javascript
// 1. Array literal — la forma mas comun
const fruits = ['apple', 'banana', 'cherry'];

// 2. Array vacio y luego push
const nums = [];
nums.push(1);
nums.push(2);
// [1, 2]

// 3. new Array() con longitud fija
const empty = new Array(3);
// [ <3 empty items> ]  -- 3 slots vacios, no tiene valores aun

// 4. new Array() con valores
const letters = new Array('a', 'b', 'c');
// ['a', 'b', 'c']

// 5. Array.from() — convierte cualquier iterable o array-like a array
const fromString = Array.from('hello');
// ['h', 'e', 'l', 'l', 'o']

const fromSet = Array.from(new Set([1, 2, 2, 3]));
// [1, 2, 3]

// Array.from con funcion de mapeo (segundo argumento)
const squares = Array.from({ length: 5 }, (_, i) => i * i);
// [0, 1, 4, 9, 16]

// 6. Spread operator sobre un iterable
const copy = [...fruits];
// ['apple', 'banana', 'cherry']

const combined = [...fruits, 'mango'];
// ['apple', 'banana', 'cherry', 'mango']
```

**Cual usar:**
- Para datos conocidos de antemano: array literal `[]`
- Para generar una secuencia o convertir algo: `Array.from()`
- Para combinar o copiar arrays: spread `[...arr]`
- `new Array(n)` casi nunca se usa directamente

> JavaScript no tiene un tipo `List` nativo. El array `[]` cumple ese rol — es la estructura de lista ordenada en JS.

---

### Como crear un Set

Un `Set` almacena valores **unicos** — no admite duplicados.

```javascript
// 1. Set vacio
const set = new Set();
set.add(1);
set.add(2);
set.add(2); // ignorado, ya existe
// Set { 1, 2 }

// 2. Set desde un array (la forma mas comun)
const set2 = new Set([10, 20, 30, 20]);
// Set { 10, 20, 30 }  -- el 20 duplicado se elimina

// 3. Set desde un string
const letters = new Set('hello');
// Set { 'h', 'e', 'l', 'o' }  -- la 'l' duplicada se elimina

// Operaciones basicas
set2.has(10);    // true
set2.delete(10);
set2.size;       // 2

// Convertir de vuelta a array
const arr = [...set2]; // [20, 30]
```

**Cual usar:**
- Para eliminar duplicados de un array: `new Set(array)`
- Para verificar existencia rapidamente: `.has()` es mas eficiente que `array.includes()`
- Cuando el orden no importa y solo necesitas saber si algo esta o no

---

### Como crear un Map

Un `Map` almacena pares **clave-valor** donde la clave puede ser cualquier tipo.

```javascript
// 1. Map vacio y luego .set()
const map = new Map();
map.set('name', 'Guillaume');
map.set('age', 25);
// Map { 'name' => 'Guillaume', 'age' => 25 }

// 2. Map desde un array de pares [clave, valor] (la forma mas comun para datos fijos)
const map2 = new Map([
  ['Apples', 10],
  ['Bananas', 5],
  ['Pasta', 1],
]);
// Map { 'Apples' => 10, 'Bananas' => 5, 'Pasta' => 1 }

// 3. Map con claves de distintos tipos
const map3 = new Map();
map3.set(1, 'numero como clave');
map3.set(true, 'booleano como clave');
map3.set({ id: 1 }, 'objeto como clave');

// Operaciones basicas
map2.get('Apples');   // 10
map2.has('Pasta');    // true
map2.delete('Pasta');
map2.size;            // 2

// Iterar
for (const [key, value] of map2) {
  console.log(key, value);
}
// 'Apples' 10
// 'Bananas' 5
```

**Cual usar:**
- Cuando necesitas un diccionario con claves que no son strings
- Cuando el orden de insercion importa
- Cuando necesitas saber el tamaño con `.size` sin contar manualmente
- Para datos que cambian frecuentemente (agregar/eliminar entradas)

---

### Como usar map, filter y reduce en arrays

Los tres son metodos de `Array.prototype` que transforman o reducen un array sin modificar el original.

#### map
Recorre cada elemento y retorna un **nuevo array** con el resultado de aplicar una funcion a cada uno. El array resultante tiene la misma longitud que el original.

```javascript
const students = [
  { id: 1, firstName: 'Guillaume' },
  { id: 2, firstName: 'James' },
];

const names = students.map((student) => student.firstName);
// ['Guillaume', 'James']

const ids = students.map((student) => student.id);
// [1, 2]
```

#### filter
Recorre cada elemento y retorna un **nuevo array** con solo los elementos que cumplen una condicion (los que retornan `true` en el callback). La longitud puede ser menor o igual a la original.

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter((n) => n % 2 === 0);
// [2, 4, 6]

const students = [
  { id: 1, firstName: 'Guillaume', location: 'San Francisco' },
  { id: 2, firstName: 'James', location: 'Columbia' },
  { id: 5, firstName: 'Serena', location: 'San Francisco' },
];

const sf = students.filter((s) => s.location === 'San Francisco');
// [{ id: 1, ... }, { id: 5, ... }]
```

#### reduce
Recorre cada elemento y **acumula** un unico valor resultado. Recibe un callback con `(acumulador, elemento)` y un valor inicial para el acumulador.

```javascript
const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((acc, n) => acc + n, 0);
// 10

// Ejemplo con objetos: convertir array a objeto usando el id como clave
const students = [
  { id: 1, firstName: 'Guillaume' },
  { id: 2, firstName: 'James' },
];

const byId = students.reduce((acc, student) => {
  acc[student.id] = student;
  return acc;
}, {});
// { 1: { id: 1, firstName: 'Guillaume' }, 2: { id: 2, firstName: 'James' } }
```

**Diferencia clave:**
| Metodo | Retorna | Longitud |
|--------|---------|----------|
| `map` | nuevo array transformado | igual al original |
| `filter` | nuevo array filtrado | menor o igual |
| `reduce` | un solo valor (numero, string, objeto, array) | — |

---

### Typed Arrays

Son arrays de longitud fija que almacenan un **unico tipo de dato binario**. A diferencia de los arrays normales (que pueden mezclar strings, numeros, objetos), los Typed Arrays trabajan directamente sobre memoria en formato binario.

Se usan principalmente para: procesamiento de imagenes, audio, WebGL, comunicacion con APIs binarias (WebSockets, FileReader).

Los tipos mas comunes:

| Tipo | Bytes por elemento | Rango |
|------|--------------------|-------|
| `Int8Array` | 1 | -128 a 127 |
| `Uint8Array` | 1 | 0 a 255 |
| `Int16Array` | 2 | -32768 a 32767 |
| `Int32Array` | 4 | -2^31 a 2^31-1 |
| `Float32Array` | 4 | decimales de 32 bits |
| `Float64Array` | 8 | decimales de 64 bits |

```javascript
// Crear un buffer de memoria de 16 bytes
const buffer = new ArrayBuffer(16);

// Crear una vista de enteros de 8 bits sobre ese buffer
const int8 = new Int8Array(buffer);
int8[0] = 42;
console.log(int8[0]); // 42

// Si intentas guardar un valor fuera del rango, se trunca
int8[1] = 200; // 200 no cabe en Int8 (max 127)
console.log(int8[1]); // -56  <-- overflow, no lanza error

// Crear directamente sin buffer
const floats = new Float64Array([1.5, 2.7, 3.14]);
console.log(floats[2]); // 3.14
```

> Los Typed Arrays tienen muchos de los metodos de Array normal (`map`, `filter`, `reduce`, `forEach`), pero no todos (no tienen `push`, `pop`, ni `splice` porque son de longitud fija).

---

### Set, Map y WeakMap

#### Set
Una coleccion de valores **unicos**. No admite duplicados. No tiene indices — se recorre con `for...of` o `.forEach`.

```javascript
const set = new Set([1, 2, 3, 2, 1]);
console.log(set); // Set(3) { 1, 2, 3 }  -- duplicados eliminados

set.add(4);       // agrega
set.delete(2);    // elimina
set.has(3);       // true -- verificar existencia
set.size;         // 3

// Convertir a array
const arr = [...set]; // [1, 3, 4]

// Uso comun: eliminar duplicados de un array
const withDups = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(withDups)]; // [1, 2, 3]
// new Set(withDups) elimina duplicados -> Set { 1, 2, 3 }
// ... expande el Set dentro de [] para convertirlo de vuelta a array
```

#### Map
Una coleccion de pares **clave-valor** donde la clave puede ser **cualquier tipo** (no solo strings como en los objetos normales). Mantiene el orden de insercion.

```javascript
const map = new Map();

map.set('name', 'Guillaume');   // clave string
map.set(1, 'first');            // clave number
map.set({ key: 'obj' }, 'val'); // clave objeto

map.get('name');   // 'Guillaume'
map.has(1);        // true
map.delete(1);
map.size;          // 2

// Iterar
for (const [key, value] of map) {
  console.log(key, value);
  // 'name' 'Guillaume'
  // { key: 'obj' } 'val'
  // (el 1 fue eliminado con .delete(1), no aparece)
}

// Diferencia con objeto normal:
// - Map acepta cualquier tipo de clave
// - Map mantiene orden de insercion
// - Map tiene .size directamente
// - Objeto es mejor para datos estaticos con claves string conocidas
```

#### WeakMap
Como `Map`, pero las claves **deben ser objetos** y las referencias son **debiles** — si el objeto-clave ya no tiene referencias en el programa, el recolector de basura puede eliminarlo automaticamente (junto con su entrada en el WeakMap).

No es iterable y no tiene `.size`.

```javascript
let obj1 = { name: 'Guillaume' };
let obj2 = { name: 'James' };

const weakMap = new WeakMap();
weakMap.set(obj1, 'active');
weakMap.set(obj2, 'inactive');

weakMap.get(obj1);  // 'active'
weakMap.has(obj2);  // true

// Si eliminamos la referencia al objeto, la entrada en WeakMap
// puede ser recolectada por el garbage collector automaticamente
obj1 = null; // la entrada { name: 'Guillaume' } puede desaparecer

// Uso tipico: asociar metadata privada a un objeto sin evitar que sea eliminado
```

**Resumen comparativo:**

| Estructura | Claves | Valores | Duplicados | Iterable | Uso tipico |
|------------|--------|---------|------------|----------|------------|
| `Set` | — | cualquier tipo | No | Si | Coleccion de valores unicos |
| `Map` | cualquier tipo | cualquier tipo | No (por clave) | Si | Diccionario flexible |
| `WeakMap` | solo objetos | cualquier tipo | No (por clave) | No | Metadata privada sin retener objetos |

---

## Task 0 — Basic list of objects

### Que hace
Retorna un array de objetos con informacion de estudiantes. Cada objeto tiene tres propiedades: `id` (Number), `firstName` (String) y `location` (String).

### Por que
Es el punto de partida del proyecto. Los tasks siguientes recibiran esta lista como input y la manipularan con `map`, `filter`, `reduce`, `Set`, `Map`, etc.

### Main
```javascript
import getListStudents from './0-get_list_students';

console.log(getListStudents());
```

### Codigo
```javascript
export default function getListStudents() {
  return [
    { id: 1, firstName: 'Guillaume', location: 'San Francisco' },
    { id: 2, firstName: 'James', location: 'Columbia' },
    { id: 5, firstName: 'Serena', location: 'San Francisco' },
  ];
}
```

### Test
```bash
npm run dev 0-main.js
```

### Logica
- La funcion no recibe parametros — solo retorna datos fijos.
- Se usa un **array literal** `[...]` que contiene tres objetos `{...}` directamente dentro del `return`. No hace falta declarar una variable intermedia.
- Cada objeto tiene exactamente tres propiedades en el orden que pide el enunciado: `id`, `firstName`, `location`. El nombre de la propiedad tiene que coincidir exactamente (case-sensitive) porque los tasks siguientes van a acceder a ellas por nombre.
- El orden de los objetos dentro del array importa — Guillaume va primero, James segundo, Serena tercero.
- Los valores de `id` son los del enunciado y no siguen una secuencia continua (1, 2, 5).

### Output
```
[
  { id: 1, firstName: 'Guillaume', location: 'San Francisco' },
  { id: 2, firstName: 'James', location: 'Columbia' },
  { id: 5, firstName: 'Serena', location: 'San Francisco' }
]
```

---

## Task 1 — More mapping

### Que hace
Recibe un array de objetos de estudiantes y retorna un array con solo los `id` de cada uno. Si el argumento no es un array, retorna un array vacio.

### Por que
Practica el uso de `map` para extraer una propiedad especifica de cada objeto en un array. Tambien introduce validacion del tipo del argumento con `instanceof Array`.

### Main
```javascript
import getListStudentIds from './1-get_list_student_ids';
import getListStudents from './0-get_list_students';

console.log(getListStudentIds('hello'));
console.log(getListStudentIds(getListStudents()));
```

### Codigo
```javascript
export default function getListStudentIds(students) {
  if (!(students instanceof Array)) return [];
  return students.map((student) => student.id);
}
```

### Test
```bash
npm run dev 1-main.js
```

### Logica
- `students instanceof Array` pregunta: "¿es `students` una instancia de `Array`?". 
  + Si pasas un string como `'hello'`, retorna `false` porque un string no es un array. 
  + El `!` invierte la condicion, entonces si NO es array, entra al `if` y retorna `[]` inmediatamente sin seguir ejecutando.
- Si el argumento si es un array, se llama a `.map()` sobre el. 
  + `map` recorre cada elemento del array uno por uno y ejecuta la funcion flecha `(student) => student.id` en cada uno. 
  + Esa funcion recibe el objeto completo `{ id: 1, firstName: 'Guillaume', ... }` y retorna solo su propiedad `id`.
- El resultado de `map` es un **nuevo array** con los valores retornados por cada llamada: `[1, 2, 5]`. 
  + El array original de objetos no se modifica.
- Se podria usar tambien `Array.isArray(students)` en lugar de `instanceof Array` — hacen lo mismo en la mayoria de los casos, pero `instanceof` es mas directo cuando trabajas con arrays del mismo contexto.

### Output
```
[]
[ 1, 2, 5 ]
```

---

## Task 2 — Filter

### Que hace
Recibe un array de estudiantes y una ciudad (string), y retorna un nuevo array con solo los estudiantes cuya `location` coincide con la ciudad indicada.

### Por que
Practica el uso de `filter` para seleccionar un subconjunto de elementos de un array segun una condicion.

### Main
```javascript
import getListStudents from './0-get_list_students';
import getStudentsByLocation from './2-get_students_by_loc';

const students = getListStudents();

console.log(getStudentsByLocation(students, 'San Francisco'));
```

### Codigo
```javascript
export default function getStudentsByLocation(students, city) {
  return students.filter((student) => student.location === city);
}
```

### Test
```bash
npm run dev 2-main.js
```

### Logica
- `filter` recorre cada objeto del array y ejecuta la funcion flecha `(student) => student.location === city` en cada uno.
- La funcion flecha compara la propiedad `location` del objeto con el parametro `city` usando `===` (igualdad estricta — mismo valor y mismo tipo).
- Si la comparacion retorna `true`, el elemento se incluye en el nuevo array. Si retorna `false`, se descarta.
- El array original `students` no se modifica — `filter` siempre crea un array nuevo.
- No hace falta validar si `students` es un array porque el enunciado garantiza que se pasa la lista de `getListStudents`.

### Output
```
[
  { id: 1, firstName: 'Guillaume', location: 'San Francisco' },
  { id: 5, firstName: 'Serena', location: 'San Francisco' }
]
```

---

## Task 3 — Reduce

### Que hace
Recibe un array de estudiantes y retorna la suma de todos sus `id`.

### Por que
Practica el uso de `reduce` para acumular un unico valor numerico a partir de un array de objetos.

### Main
```javascript
import getListStudents from './0-get_list_students';
import getStudentIdsSum from './3-get_ids_sum';

const students = getListStudents();
const value = getStudentIdsSum(students);

console.log(value);
```

### Codigo
```javascript
export default function getStudentIdsSum(students) {
  return students.reduce((acc, student) => acc + student.id, 0);
}
```

### Test
```bash
npm run dev 3-main.js
```

### Logica
- `reduce` recorre cada objeto del array y ejecuta la funcion `(acc, student) => acc + student.id` en cada iteracion.
- `acc` es el acumulador — empieza en `0` (el segundo argumento de `reduce`) y en cada paso se le suma el `id` del estudiante actual.
- Iteracion por iteracion: `0 + 1 = 1` → `1 + 2 = 3` → `3 + 5 = 8`.
- Al final `reduce` retorna el valor final del acumulador: `8`.
- El `0` como valor inicial es importante — sin el, `reduce` usaria el primer elemento del array como acumulador inicial, lo que aqui daria un objeto en vez de un numero.

### Output
```
8
```

---

## Task 4 — Combine

### Que hace
Recibe un array de estudiantes, una ciudad y un array de objetos con notas (`newGrades`). Retorna un nuevo array con los estudiantes de esa ciudad, cada uno con una propiedad `grade` agregada. Si un estudiante no tiene nota en `newGrades`, su `grade` sera `'N/A'`.

### Por que
Practica combinar `filter` y `map` en cadena, y usar `find` dentro del `map` para buscar un valor relacionado en otro array.

### Main
```javascript
import getListStudents from './0-get_list_students';
import updateStudentGradeByCity from './4-update_grade_by_city';

console.log(updateStudentGradeByCity(getListStudents(), 'San Francisco', [{ studentId: 5, grade: 97 }, { studentId: 1, grade: 86 }]));

console.log(updateStudentGradeByCity(getListStudents(), 'San Francisco', [{ studentId: 5, grade: 97 }]));
```

### Codigo
```javascript
export default function updateStudentGradeByCity(students, city, newGrades) {
  return students
    .filter((student) => student.location === city)
    .map((student) => {
      const gradeObj = newGrades.find((g) => g.studentId === student.id);
      return { ...student, grade: gradeObj ? gradeObj.grade : 'N/A' };
    });
}
```

### Test
```bash
npm run dev 4-main.js
```

### Logica
- Se encadenan `filter` y `map` directamente — el resultado de `filter` es un array, y sobre ese array se llama `map` de inmediato.
- **filter**: conserva solo los estudiantes cuya `location` coincide con `city`. El resultado es un array mas pequeno con los estudiantes de esa ciudad.
- **map**: recorre cada estudiante filtrado y construye un objeto nuevo con la nota incluida. Dentro del map se hacen dos cosas:
  - `newGrades.find((g) => g.studentId === student.id)` busca en el array `newGrades` el primer objeto cuyo `studentId` sea igual al `id` del estudiante actual. Si lo encuentra retorna ese objeto; si no, retorna `undefined`.
  - `{ ...student, grade: gradeObj ? gradeObj.grade : 'N/A' }` usa el spread operator para copiar todas las propiedades del estudiante y agrega (o sobreescribe) la propiedad `grade`. Si `gradeObj` existe, usa `gradeObj.grade`; si es `undefined`, pone `'N/A'`.
- El operador ternario `condicion ? valorSiTrue : valorSiFalse` es equivalente a un `if/else` en una sola linea.

### Output
```
[
  { id: 1, firstName: 'Guillaume', location: 'San Francisco', grade: 86 },
  { id: 5, firstName: 'Serena', location: 'San Francisco', grade: 97 }
]
[
  { id: 1, firstName: 'Guillaume', location: 'San Francisco', grade: 'N/A' },
  { id: 5, firstName: 'Serena', location: 'San Francisco', grade: 97 }
]
```

---

## Task 5 — Typed Arrays

### Que hace
Crea un `ArrayBuffer` de longitud `length`, escribe el valor `value` como `Int8` en la posicion `position`, y retorna un `DataView` sobre ese buffer. Si `position` esta fuera del rango del buffer, lanza un error.

### Por que
Practica el uso de `ArrayBuffer` y `DataView` para trabajar con memoria binaria de bajo nivel. `DataView` permite leer y escribir distintos tipos de datos en posiciones especificas de un buffer.

### Main
```javascript
import createInt8TypedArray from './5-typed_arrays';

console.log(createInt8TypedArray(10, 2, 89));
```

### Codigo
```javascript
export default function createInt8TypedArray(length, position, value) {
  if (position >= length || position < 0) {
    throw new Error('Position outside range');
  }
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  view.setInt8(position, value);
  return view;
}
```

### Test
```bash
npm run dev 5-main.js
```

### Logica
- `new ArrayBuffer(length)` reserva un bloque de memoria binaria de `length` bytes, inicializado todo en ceros. Por si solo no permite leer ni escribir — necesitas una vista encima.
- `new DataView(buffer)` crea una vista flexible sobre ese buffer que permite leer y escribir cualquier tipo numerico (`Int8`, `Int16`, `Float64`, etc.) en cualquier posicion y con cualquier orden de bytes.
- Antes de escribir, se valida que `position` este dentro del rango `[0, length - 1]`. Si `position >= length` o es negativo, la escritura fallaria silenciosamente o tiraria un error nativo, por eso se lanza el error manualmente con el mensaje exacto que pide el enunciado.
- `view.setInt8(position, value)` escribe el valor como un entero de 8 bits (1 byte) en el byte numero `position` del buffer.
- Se retorna el `DataView`, no el `ArrayBuffer` directamente — el enunciado lo confirma con el output que muestra `DataView { ... }`.

### Output
```
DataView {
  byteLength: 10,
  byteOffset: 0,
  buffer: ArrayBuffer {
    [Uint8Contents]: <00 00 59 00 00 00 00 00 00 00>,
    byteLength: 10
  }
}
```
> `59` en hexadecimal es `89` en decimal — el valor que escribimos en la posicion 2.

---

## Task 6 — Set data structure
### Que hace
Recibe un array con cualquier tipo de elementos y retorna un nuevo objeto `Set` que contiene esos elementos.

### Por que
Practica la creación de la estructura de datos `Set` a partir de un iterable (como un array).  
Es la manera más directa, rápida y estandarizada en ES6 para eliminar elementos duplicados de un array, ya que la principal característica de un `Set` es que solo almacena valores únicos.

### Main
```javascript
import setFromArray from './6-set.js';

console.log(setFromArray([12, 32, 15, 78, 98, 15]));
```

### Codigo
```javascript
export default function setFromArray(array) {
  return new Set(array);
}
```

### Test
```bash
npm run dev 6-main.js
```

### Logica
- La función toma un único parámetro, `array`, que puede contener cualquier tipo de datos (números, strings, objetos, etc.).

- Se utiliza el constructor `new Set(iterable)`. Como un array en JavaScript es un elemento iterable, se puede pasar directamente como argumento.

- Al instanciar el `Set`, este recorre internamente el array y añade cada elemento. Como la regla fundamental de un Set es no tener duplicados, el segundo `15` del array original es automáticamente ignorado.

- La función retorna directamente la nueva instancia de `Set`.

#### Output
```
Set { 12, 32, 15, 78, 98 }
```

---

## Task 7 — More set data structure
### Que hace
Recibe un `Set` y un `Array`, y retorna un booleano (`true` o `false`) indicando si todos los elementos presentes en el array existen dentro del set.

### Por que
Practica la validación de datos cruzando estructuras.  
Específicamente, combina la eficiencia de búsqueda de un `Set` mediante su método `.has()` (que es mucho más rápido que buscar en un array) con el método iterativo `.every()` de los Arrays.

### Main
```javascript
import hasValuesFromArray from './7-has_array_values.js';

console.log(hasValuesFromArray(new Set([1, 2, 3, 4, 5]), [1]));
console.log(hasValuesFromArray(new Set([1, 2, 3, 4, 5]), [10]));
console.log(hasValuesFromArray(new Set([1, 2, 3, 4, 5]), [1, 10]));
```

### Codigo
```javascript
export default function hasValuesFromArray(set, array) {
  return array.every((element) => set.has(element));
}
```

### Test
```bash
npm run dev 7-main.js
```

### Logica
- La función utiliza el método `Array.prototype.every()`.
  + Este método recorre cada elemento del array y ejecuta una función de comprobación en cada uno.

- La comprobación es `set.has(element)`, la cual retorna `true` si el elemento está en el `Set` y `false` si no lo está.

- El método `.every()` solo retornará `true` si todas las iteraciones retornan `true`.
  + Si encuentra al menos un elemento que el `Set` no tiene (retornando `false`), detiene la ejecución inmediatamente y toda la función retorna `false`.

- Alternativamente, se podría hacer con un bucle `for...of` o un `.reduce()`, pero `.every()` expresa exactamente la intención de la lógica (verificar si "todos" cumplen la condición).

### Output
```
true
false
false
```

---

## Task 8 — Clean set
### Que hace
Recibe un Set y un string (`startString`).  
Retorna un único string que contiene todos los valores del Set que comienzan con el startString, pero eliminando esa parte inicial de cada palabra.  
Los valores resultantes se unen separados por un guion (-).  
Si el startString está vacío o no es válido, retorna un string vacío.

### Por que
Practica la conversión de un Set a un Array para poder utilizar métodos de manipulación de ES6 como filter y map.  
También refuerza el manejo de strings (con startsWith y slice) y la validación de casos límite (edge cases), como cuando se pasa un string vacío o tipos de datos incorrectos.

### Main
```javascript
import cleanSet from './8-clean_set.js';

console.log(cleanSet(new Set(['bonjovi', 'bonaparte', 'bonappetit', 'banana']), 'bon'));
console.log(cleanSet(new Set(['bonjovi', 'bonaparte', 'bonappetit', 'banana']), ''));
```

### Codigo
```javascript
export default function cleanSet(set, startString) {
  if (!startString || typeof startString !== 'string') {
    return '';
  }

  return [...set]
    .filter((value) => typeof value === 'string' && value.startsWith(startString))
    .map((value) => value.slice(startString.length))
    .join('-');
}
```

### Test
```bash
npm run dev 8-main.js
```
### Logica
- **Validación inicial**: 
  + Se comprueba si `startString` es un valor falso (como un string vacío `''` o `undefined`) o si no es de tipo `string`. 
  + Si se cumple alguna de estas condiciones, se retorna un string vacío `''` inmediatamente. 
  + Esto evita errores y comportamientos no deseados (como retornar todo el `Set` original).

- **Conversión a Array**: 
  + Se utiliza el spread operator `[...set]` para convertir el `Set` en un array tradicional, lo que nos permite encadenar métodos de ES6.

- `.filter()`: 
  + Recorre el array y conserva solo los elementos que son de tipo `string` y que empiezan exactamente con el `startString` (usando el método `.startsWith()`).

- `.map()`: 
  + Transforma los elementos filtrados. 
  + Utiliza `value.slice(startString.length)` para recortar el inicio de la palabra, conservando únicamente el "resto" del string.

- `.join('-')`: 
  + Finalmente, toma el array resultante de strings recortados y los une en un solo string, colocando un guion `-` entre cada uno de ellos.

### Output
```
jovi-aparte-appetit

```
> La segunda linea es vacia — cuando `startString` es `''`, la validacion inicial retorna `''` directamente.

---

## Task 9 — Map data structure

### Que hace
Retorna un `Map` con 5 elementos de groceries, donde cada clave es el nombre del producto (`String`) y cada valor es la cantidad (`Number`).

### Por que
Practica la creacion directa de un `Map` con datos fijos, usando el constructor con un array de pares `[clave, valor]`.

### Main
```javascript
import groceriesList from './9-groceries_list';

console.log(groceriesList());
```

### Codigo
```javascript
export default function groceriesList() {
  return new Map([
    ['Apples', 10],
    ['Tomatoes', 10],
    ['Pasta', 1],
    ['Rice', 1],
    ['Banana', 5],
  ]);
}
```

### Test
```bash
npm run dev 9-main.js
```

### Logica
- El constructor `new Map()` acepta un array de pares `[clave, valor]` como argumento inicial. Cada par es un array de dos elementos: el primero es la clave y el segundo el valor.
- A diferencia de un objeto `{}`, un `Map` mantiene el orden de insercion garantizado, lo que explica que el output siempre aparezca en el mismo orden que se definieron los elementos.
- Las claves son `strings` y los valores son `numbers` — el `Map` puede mezclar tipos sin restricciones.

### Output
```
Map {
  'Apples' => 10,
  'Tomatoes' => 10,
  'Pasta' => 1,
  'Rice' => 1,
  'Banana' => 5
}
```

---

## Task 10 — More map data structure

### Que hace
Recibe un `Map` y modifica directamente todas las entradas cuyo valor sea `1`, cambiandolas a `100`. Si el argumento no es un `Map`, lanza un error.

### Por que
Practica la mutacion directa de un `Map` usando `forEach`, y la validacion del tipo del argumento con `instanceof`.

### Main
```javascript
import updateUniqueItems from './10-update_uniq_items';
import groceriesList from './9-groceries_list';

const map = groceriesList();
console.log(map);

updateUniqueItems(map);
console.log(map);
```

### Codigo
```javascript
export default function updateUniqueItems(map) {
  if (!(map instanceof Map)) throw new Error('Cannot process');
  map.forEach((value, key) => {
    if (value === 1) map.set(key, 100);
  });
}
```

### Test
```bash
npm run dev 10-main.js
```

### Logica
- `map instanceof Map` verifica que el argumento sea un `Map`. 
  + Si no lo es, lanza `Error('Cannot process')` inmediatamente.
- `map.forEach((value, key) => {...})` itera sobre cada entrada del `Map`. 
  + A diferencia de `Array.forEach` donde el callback recibe `(elemento, indice)`, en `Map.forEach` el orden es `(valor, clave)` — clave va segundo.
- Dentro del callback, si el valor es exactamente `1` (`===`), se llama a `map.set(key, 100)` para sobreescribir ese valor en el mismo `Map`.
- La funcion **muta el Map original** — no retorna nada (`undefined`). 
  + Por eso en el `main` se llama sin asignar el resultado, y el segundo `console.log(map)` muestra el mapa ya modificado.
- Esta es la diferencia clave con `map` (el metodo de Array) que siempre crea un nuevo array sin tocar el original.

### Output
```
Map {
  'Apples' => 10,
  'Tomatoes' => 10,
  'Pasta' => 1,
  'Rice' => 1,
  'Banana' => 5
}
Map {
  'Apples' => 10,
  'Tomatoes' => 10,
  'Pasta' => 100,
  'Rice' => 100,
  'Banana' => 5
}
```

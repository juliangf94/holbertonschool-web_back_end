# ES6 Basic

## ¿Qué es ES6?

ES6 (también llamado ECMAScript 2015) es la sexta versión del estándar ECMAScript — el estándar en el que está basado JavaScript. Fue lanzado en 2015 y trajo una gran cantidad de nuevas funcionalidades que modernizaron el lenguaje.

Antes de ES6, JavaScript tenía varias limitaciones que hacían el código más difícil de escribir y mantener. ES6 introdujo sintaxis más limpia, nuevas formas de declarar variables, funciones más compactas, y muchas herramientas que los desarrolladores usan hoy en día como estándar.

---

## Nuevas features introducidas en ES6

| Feature | Descripción |
|---|---|
| `const` y `let` | Nuevas formas de declarar variables con mejor control de scope |
| Arrow functions | Sintaxis compacta para funciones: `() => {}` |
| Default parameters | Parámetros con valores por defecto en funciones |
| Rest parameters | Agrupar argumentos variables en un array: `...args` |
| Spread operator | Expandir arrays u objetos: `...array` |
| Template literals | Strings con interpolación: `` `Hola ${nombre}` `` |
| Destructuring | Extraer valores de arrays/objetos fácilmente |
| Classes | Sintaxis más clara para OOP en JavaScript |
| Modules | `import` / `export` nativos |
| Promises | Manejo de operaciones asíncronas |
| Iterators y `for...of` | Nueva forma de iterar sobre estructuras de datos |
| Map y Set | Nuevas estructuras de datos |

---

## ¿Cuál es la diferencia entre `const`, `let` y `var`?

### `var` (antes de ES6)
- **Scope**: function-scoped — existe en toda la función donde se declara
- **Re-declarable**: sí
- **Re-asignable**: sí
- **Hoisting**: sí (se "sube" al inicio de la función, puede usarse antes de declararse)

### `let` (ES6)
- **Scope**: block-scoped — solo existe dentro del bloque `{}` donde se declara
- **Re-declarable**: no (error si se declara dos veces en el mismo scope)
- **Re-asignable**: sí
- **Hoisting**: sí, pero no inicializado (Temporal Dead Zone)

### `const` (ES6)
- **Scope**: block-scoped — igual que `let`
- **Re-declarable**: no
- **Re-asignable**: no (error si intentas reasignar)
- **Hoisting**: sí, pero no inicializado (Temporal Dead Zone)

```javascript
// var — function scoped
function ejemplo() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 — x existe fuera del if!
}

// let — block scoped
function ejemplo2() {
  if (true) {
    let y = 10;
  }
  console.log(y); // ReferenceError — y no existe fuera del if
}

// const — no se puede reasignar
const PI = 3.14;
PI = 3;  // TypeError: Assignment to constant variable
```

**Regla general:**
- Usa `const` por defecto
- Usa `let` cuando necesites reasignar el valor
- Nunca uses `var` en código moderno

---

## Block-scoped variables

"Block-scoped" significa que la variable solo existe dentro del bloque `{}` en el que fue declarada — ya sea un `if`, un `for`, un `while`, o cualquier par de llaves.

```javascript
{
  let blockVar = "solo existo aquí";
  const blockConst = "yo también";
}
console.log(blockVar);   // ReferenceError
console.log(blockConst); // ReferenceError

// var ignora el bloque:
{
  var globalish = "existo fuera también";
}
console.log(globalish); // "existo fuera también" — no debería!
```

---

## Arrow functions y parámetros por defecto

### Arrow functions
Las arrow functions son una sintaxis más compacta para escribir funciones. Se escriben con `=>` en lugar de la palabra `function`.

```javascript
// Función tradicional
function sumar(a, b) {
  return a + b;
}

// Arrow function equivalente
const sumar = (a, b) => a + b;

// Con un solo parámetro — los paréntesis son opcionales
const doble = n => n * 2;

// Sin parámetros — los paréntesis son obligatorios
const saludar = () => 'Hola!';

// Con cuerpo de función (varias líneas) — necesita return explícito
const multiplicar = (a, b) => {
  const resultado = a * b;
  return resultado;
};
```

### La diferencia clave: `this`
La diferencia más importante entre una función tradicional y una arrow function es cómo manejan `this`.

- En una **función tradicional**, `this` depende de cómo se llama la función — puede cambiar dependiendo del contexto.
- En una **arrow function**, `this` se hereda del contexto donde fue definida y nunca cambia.

```javascript
// Problema con función tradicional
function Timer() {
  this.segundos = 0;
  setInterval(function() {
    this.segundos++;          // ERROR: this aquí NO es el Timer,
    console.log(this.segundos); // es el contexto de setInterval
  }, 1000);
}

// Solución con arrow function
function Timer() {
  this.segundos = 0;
  setInterval(() => {
    this.segundos++;          // CORRECTO: this es el Timer
    console.log(this.segundos); // porque arrow function hereda el this
  }, 1000);
}
```

### Parámetros por defecto
ES6 permite asignar valores por defecto a los parámetros de una función. Si el argumento no se pasa (o se pasa `undefined`), se usa el valor por defecto.

```javascript
// Sin parámetros por defecto (antes de ES6)
function saludar(nombre) {
  nombre = nombre || 'extraño';
  return `Hola, ${nombre}!`;
}

// Con parámetros por defecto (ES6)
function saludar(nombre = 'extraño') {
  return `Hola, ${nombre}!`;
}

saludar('Alice');  // "Hola, Alice!"
saludar();         // "Hola, extraño!"
saludar(undefined); // "Hola, extraño!" — undefined activa el default
saludar(null);      // "Hola, null!" — null NO activa el default
```

---

## Rest y Spread parameters

### Rest parameters (`...`)
El rest parameter agrupa todos los argumentos restantes de una función en un array. Se escribe con `...` antes del último parámetro.

```javascript
// Sin rest — forma antigua
function sumar() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// Con rest — forma ES6
function sumar(...numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}

sumar(1, 2, 3);       // 6
sumar(1, 2, 3, 4, 5); // 15

// Rest siempre debe ser el último parámetro
function log(nivel, ...mensajes) {
  console.log(`[${nivel}]`, mensajes);
}
log('ERROR', 'archivo no encontrado', 'línea 42');
// [ERROR] ['archivo no encontrado', 'línea 42']
```

### Spread operator (`...`)
El spread operator hace lo opuesto al rest — **expande** un array u objeto en elementos individuales. Usa la misma sintaxis `...` pero en un contexto diferente.

```javascript
// Expandir un array en argumentos
const numeros = [1, 2, 3];
console.log(Math.max(...numeros)); // 3  — equivale a Math.max(1, 2, 3)

// Combinar arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinado = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copiar un array
const copia = [...arr1]; // [1, 2, 3] — nueva referencia, no el mismo array

// Expandir objetos
const persona = { nombre: 'Alice', edad: 30 };
const conEmail = { ...persona, email: 'alice@mail.com' };
// { nombre: 'Alice', edad: 30, email: 'alice@mail.com' }
```

**Diferencia clave:**
- `...args` en la **declaración** de una función → es **rest** (agrupa)
- `...array` en una **llamada** o literal → es **spread** (expande)

---

## String templating en ES6 (Template Literals)

Los template literals son strings delimitados por backticks (`` ` ``) en lugar de comillas. Permiten incrustar expresiones JavaScript directamente dentro del string con `${}`.

```javascript
const nombre = 'Alice';
const edad = 30;

// Antes de ES6 — concatenación
const mensaje = 'Hola, ' + nombre + '. Tienes ' + edad + ' años.';

// ES6 — template literal
const mensaje = `Hola, ${nombre}. Tienes ${edad} años.`;

// Se pueden poner expresiones completas dentro de ${}
const precio = 100;
const iva = 0.21;
console.log(`Total con IVA: ${precio * (1 + iva)}`); // "Total con IVA: 121"

// Strings multilínea — sin necesidad de \n
const html = `
  <div>
    <h1>${nombre}</h1>
    <p>Edad: ${edad}</p>
  </div>
`;
```

---

## Object creation y sus propiedades en ES6

ES6 introdujo varias formas más concisas de crear y trabajar con objetos.

### Shorthand properties
Si el nombre de la variable es igual al nombre de la propiedad, no hay que repetirlo.

```javascript
const nombre = 'Alice';
const edad = 30;

// Antes de ES6
const persona = { nombre: nombre, edad: edad };

// ES6 — shorthand
const persona = { nombre, edad };
// { nombre: 'Alice', edad: 30 }
```

### Computed property names
ES6 permite usar expresiones como nombres de propiedades con `[]`.

```javascript
const campo = 'nombre';
const persona = {
  [campo]: 'Alice',        // equivale a nombre: 'Alice'
  [`${campo}Upper`]: 'ALICE'  // equivale a nombreUpper: 'ALICE'
};
```

### Method shorthand
Forma más corta de definir métodos en un objeto.

```javascript
// Antes de ES6
const objeto = {
  saludar: function() {
    return 'Hola';
  }
};

// ES6 — method shorthand
const objeto = {
  saludar() {
    return 'Hola';
  }
};
```

### Destructuring
Extraer valores de objetos o arrays en variables individuales.

```javascript
// Destructuring de objeto
const persona = { nombre: 'Alice', edad: 30, ciudad: 'Paris' };
const { nombre, edad } = persona;
console.log(nombre); // 'Alice'
console.log(edad);   // 30

// Con alias
const { nombre: n, edad: e } = persona;
console.log(n); // 'Alice'

// Destructuring de array
const colores = ['rojo', 'verde', 'azul'];
const [primero, segundo] = colores;
console.log(primero); // 'rojo'
console.log(segundo); // 'verde'
```

---

## Iterators y for...of loops

### ¿Qué es un iterator?
Un iterator es un objeto que sabe cómo recorrer una secuencia de valores uno por uno. Tiene un método `next()` que devuelve `{ value, done }`.

```javascript
// Crear un iterator manualmente
function crearIterator(array) {
  let index = 0;
  return {
    next() {
      if (index < array.length) {
        return { value: array[index++], done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

const it = crearIterator([10, 20, 30]);
console.log(it.next()); // { value: 10, done: false }
console.log(it.next()); // { value: 20, done: false }
console.log(it.next()); // { value: 30, done: false }
console.log(it.next()); // { value: undefined, done: true }
```

### ¿Qué es un iterable?
Un iterable es cualquier objeto que tenga el método `[Symbol.iterator]()` que devuelve un iterator. En JavaScript, los siguientes tipos son iterables por defecto: arrays, strings, Map, Set.

```javascript
const array = [1, 2, 3];
const iterator = array[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
```

### `for...of`
`for...of` es la forma más simple de iterar sobre cualquier iterable. Es la alternativa moderna a `for`, `forEach`, y `for...in`.

```javascript
// Array
const frutas = ['manzana', 'naranja', 'pera'];
for (const fruta of frutas) {
  console.log(fruta);
}
// 'manzana'
// 'naranja'
// 'pera'

// String — itera sobre cada carácter
for (const letra of 'hola') {
  console.log(letra); // 'h', 'o', 'l', 'a'
}

// Map
const mapa = new Map([['a', 1], ['b', 2]]);
for (const [clave, valor] of mapa) {
  console.log(`${clave}: ${valor}`); // 'a: 1', 'b: 2'
}
```

**Diferencia entre `for...of` y `for...in`:**

```javascript
const array = ['a', 'b', 'c'];

for (const i in array) {
  console.log(i); // '0', '1', '2' — itera sobre los ÍNDICES (keys)
}

for (const val of array) {
  console.log(val); // 'a', 'b', 'c' — itera sobre los VALORES
}
```

**Regla:** usa `for...of` para iterar valores, `for...in` para iterar propiedades de objetos.

---

## Setup del proyecto

### 1. Instalar NodeJS 20.x.x

```bash
curl -sL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs -y
nodejs -v   # debe mostrar v20.x.x
npm -v      # debe mostrar 9.x.x o 10.x.x
```

### 2. Instalar dependencias

```bash
npm install --save-dev jest
npm install --save-dev babel-jest @babel/core @babel/preset-env
npm install --save-dev eslint
npm install
```

### 3. Correr un task

```bash
npm run dev <archivo-main.js>
```

### 4. Correr tests

```bash
npm test
npm test <archivo>.test.js   # un solo test
```

### 5. Correr el linter

```bash
npm run lint <archivo>.js
```

---

## Archivos de configuración

### `package.json`
Define los scripts del proyecto y las dependencias. Los scripts `dev`, `test`, y `lint` son los que usa Holberton para ejecutar y evaluar el código.

### `babel.config.js`
Babel transpila el código ES6 moderno a una versión de JavaScript compatible con versiones anteriores de Node. Sin esto, `import`/`export` no funcionarían.

### `.eslintrc.js`
ESLint analiza el código buscando errores de estilo y malas prácticas. El checker de Holberton corre ESLint automáticamente.

---

## Tasks

---

### Task 0 — Const or let? (`0-constants.js`)

## Qué hace
Reemplaza las declaraciones `var` por `const` en `taskFirst` y por `let` en `taskNext`.

## Por qué
- `taskFirst` declara `task` y nunca la reasigna → usar `const`
- `taskNext` declara `combination` y luego la reasigna con `+=` → usar `let`

## Codigo
`0-main.js`
```js
import { taskFirst, taskNext } from './0-constants.js';

console.log(`${taskFirst()} ${taskNext()}`);

```
`0-constants.js`
```javascript
export function taskFirst() {
  const task = 'I prefer const when I can.';
  return task;
}

export function getLast() {
  return ' is okay';
}

export function taskNext() {
  let combination = 'But sometimes let';
  combination += getLast();

  return combination;
}

```

## Test
```bash
npm run dev 0-main.js
```

## Logica

**`const task`**:  
`task` se asigna una vez y nunca se modifica — es el caso ideal para `const`. Si intentaras reasignarla, obtendrías un `TypeError`.

**`let combination`**:  
`combination` empieza con un valor y luego se le concatena el resultado de `getLast()` con `+=`. Como se reasigna, debe ser `let` — `const` no lo permitiría.

**`export function`**:  
Todas las funciones deben exportarse para que los archivos de test (`0-main.js`) puedan importarlas con `import`.

## Output
```
I prefer const when I can. But sometimes let is okay
```

---

### Task 1 — Block Scope (`1-block-scoped.js`)

## Qué hace
Modifica las variables dentro de `taskBlock` para que las variables declaradas dentro del bloque `if` no sobreescriban las variables del scope exterior.

## Por qué
Con `var`, todas las declaraciones dentro del `if` sobreescriben las del exterior porque `var` es function-scoped — no respeta los bloques `{}`. Al cambiar a `const`, cada declaración dentro del `if` crea una nueva variable block-scoped que no afecta a la de afuera.

## Codigo

`1-main.js`
```javascript
import taskBlock from './1-block-scoped.js';

console.log(taskBlock(true));
console.log(taskBlock(false));
```

`1-block-scoped.js`
```javascript
export default function taskBlock(trueOrFalse) {
  const task = false;
  const task2 = true;

  if (trueOrFalse) {
    const task = true;
    const task2 = false;
  }

  return [task, task2];
}
```

## Test
```bash
npm run dev 1-main.js
```

## Logica

**El problema con `var`**
Con `var`, la declaración `var task = true` dentro del `if` no crea una nueva variable — sobreescribe la del exterior porque ambas comparten el mismo function scope:
```javascript
// Con var — INCORRECTO
var task = false;
if (true) {
  var task = true;   // misma variable, la sobreescribe
}
console.log(task);   // true — fue sobreescrita!
```

**La solución con `const`**
Con `const` (o `let`), la declaración dentro del `if` crea una variable nueva que solo existe dentro de ese bloque `{}`. La variable exterior no se ve afectada:
```javascript
// Con const — CORRECTO
const task = false;
if (true) {
  const task = true;  // variable NUEVA, solo existe dentro del if
}
console.log(task);    // false — la exterior no fue tocada
```

**`export default`**
A diferencia del Task 0 que usaba `export function`, este task usa `export default` — solo puede haber un `export default` por archivo y se importa sin llaves: `import taskBlock from './1-block-scoped.js'`.

## Output
```
[ false, true ]
[ false, true ]
```
Siempre retorna `[false, true]` sin importar el argumento, porque las variables del `if` nunca sobreescriben las del exterior.

---

### Task 2 — Arrow functions (`2-arrow.js`)

## Qué hace
Reescribe la función `add` usando sintaxis de arrow function, eliminando la necesidad de `const self = this`.

## Por qué
En el código original, `const self = this` es un workaround clásico para capturar el valor de `this` antes de entrar a una función tradicional — porque las funciones tradicionales tienen su propio `this` que puede cambiar. Con una arrow function, `this` se hereda automáticamente del contexto exterior, haciendo que `self` sea innecesario.

## Codigo

`2-main.js`
```javascript
import getNeighborhoodsList from './2-arrow.js';

const neighborhoodsList = new getNeighborhoodsList();
const res = neighborhoodsList.addNeighborhood('Noe Valley');
console.log(res);
```

`2-arrow.js`
```javascript
export default function getNeighborhoodsList() {
  this.sanFranciscoNeighborhoods = ['SOMA', 'Union Square'];

  this.addNeighborhood = (newNeighborhood) => {
    this.sanFranciscoNeighborhoods.push(newNeighborhood);
    return this.sanFranciscoNeighborhoods;
  };
}
```

## Test
```bash
npm run dev 2-main.js
```

## Logica

**El problema con `const self = this`**
En el código original, `add` es una función tradicional. Cuando se llama, su `this` ya no apunta al objeto `getNeighborhoodsList` sino al contexto de la llamada. Por eso se necesitaba guardar `this` en `self` antes de entrar:
```javascript
const self = this;                     // guarda el this correcto
this.addNeighborhood = function add(newNeighborhood) {
  self.sanFranciscoNeighborhoods.push(newNeighborhood); // usa self, no this
};
```

**La solución con arrow function**
Una arrow function no tiene su propio `this` — hereda el del contexto donde fue definida (en este caso, el objeto `getNeighborhoodsList`). Por eso `this` siempre apunta al objeto correcto y `self` ya no hace falta:
```javascript
this.addNeighborhood = (newNeighborhood) => {
  this.sanFranciscoNeighborhoods.push(newNeighborhood); // this es correcto
};
```

**Función anónima**
Al convertirla a arrow function, `add` pierde su nombre — pasa a ser una función anónima asignada a `this.addNeighborhood`.

## Output
```
[ 'SOMA', 'Union Square', 'Noe Valley' ]
```

---

### Task 3 — Parameter defaults (`3-default-parameter.js`)

## Qué hace
Condensa la función `getSumOfHoods` a una sola línea usando parámetros por defecto en lugar de los bloques `if`.

## Por qué
Los dos bloques `if` solo existen para asignar un valor cuando el parámetro no fue pasado (`=== undefined`). ES6 permite hacer esto directamente en la firma de la función con `= valor`, eliminando la necesidad de esos checks.

## Codigo

`3-main.js`
```javascript
import getSumOfHoods from './3-default-parameter.js';

console.log(getSumOfHoods(34));
console.log(getSumOfHoods(34, 3));
console.log(getSumOfHoods(34, 3, 4));
```

`3-default-parameter.js`
```javascript
export default function getSumOfHoods(initialNumber, expansion1989 = 89, expansion2019 = 19) {
  return initialNumber + expansion1989 + expansion2019;
}
```

## Test
```bash
npm run dev 3-main.js
```

## Logica

**Antes — con bloques `if`**
El código original chequeaba manualmente si cada parámetro era `undefined` y le asignaba un valor:
```javascript
if (expansion1989 === undefined) {
  expansion1989 = 89;
}
```

**Después — con default parameters**
ES6 permite definir el valor por defecto directamente en la firma de la función. Si el argumento no se pasa o se pasa `undefined`, se usa automáticamente el valor por defecto:
```javascript
function getSumOfHoods(initialNumber, expansion1989 = 89, expansion2019 = 19)
```

**Verificando el output:**
```
getSumOfHoods(34)        → 34 + 89 + 19 = 142  ✓
getSumOfHoods(34, 3)     → 34 +  3 + 19 =  56  ✓
getSumOfHoods(34, 3, 4)  → 34 +  3 +  4 =  41  ✓
```

## Output
```
142
56
41
```

---

# Task 4 — Rest parameter syntax for functions

## Qué hace

`returnHowManyArguments` recibe cualquier cantidad de argumentos y devuelve cuántos se pasaron.

## Por qué

El **rest parameter** (`...args`) permite capturar todos los argumentos de una función en un array, sin importar cuántos sean. Es la solución de ES6 para funciones con número variable de parámetros.

Antes de ES6 se usaba el objeto `arguments` (no es un array real, no tiene métodos como `.length` directamente útil en todos los contextos). Con rest parameter obtenemos un array real.

```javascript
// Antes de ES6
function cuantos() {
  return arguments.length;
}

// Con ES6 rest parameter
function cuantos(...args) {
  return args.length;
}
```

## Codigo

**4-main.js** (archivo de prueba)
```javascript
import returnHowManyArguments from './4-rest-parameter.js';

console.log(returnHowManyArguments("one"));
console.log(returnHowManyArguments("one", "two", 3, "4th"));
```

**4-rest-parameter.js** (tu archivo)
```javascript
export default function returnHowManyArguments(...args) {
  return args.length;
}
```

## Test

```bash
npm run dev 4-main.js
```

## Logica

El rest parameter `...args` agrupa TODOS los argumentos en un array llamado `args`. Luego `args.length` devuelve cuántos elementos tiene ese array.

```
returnHowManyArguments("one")               → args = ["one"]          → length = 1
returnHowManyArguments("one", "two", 3, "4th") → args = ["one","two",3,"4th"] → length = 4
```

**Reglas del rest parameter:**
- Siempre va con `...` antes del nombre
- Debe ser el **último parámetro** de la función
- Solo puede haber **uno** por función

```javascript
// Válido
function fn(a, b, ...rest) { }

// Inválido — rest no puede estar en el medio
function fn(a, ...rest, b) { }
```

## Output
```
1
4
```

---

# Task 5 — The wonders of spread syntax

## Qué hace

`concatArrays` recibe dos arrays y un string, y devuelve un solo array con todos los elementos concatenados — incluyendo cada carácter del string como elemento individual.

## Por qué

El **spread operator** (`...`) expande un iterable (array, string, etc.) en elementos individuales dentro de otro array. Un string en JavaScript es iterable, por lo que `...string` lo convierte en caracteres sueltos.

```javascript
// Sin spread — no funciona como queremos
['a', 'b'] + ['c', 'd']  // "a,bc,d" (string, no array)

// Con spread — funciona perfecto
[...['a', 'b'], ...['c', 'd']]  // ['a', 'b', 'c', 'd']

// Spread sobre un string
[...'Hello']  // ['H', 'e', 'l', 'l', 'o']
```

## Codigo

**5-main.js** (archivo de prueba)
```javascript
import concatArrays from './5-spread-operator.js';

console.log(concatArrays(['a', 'b'], ['c', 'd'], 'Hello'));
```

**5-spread-operator.js** (tu archivo)
```javascript
export default function concatArrays(array1, array2, string) {
  return [...array1, ...array2, ...string];
}
```

## Test

```bash
npm run dev 5-main.js
```

## Logica

El cuerpo debe ser **una sola línea**. Piensa en cómo usar `...` para expandir cada uno de los tres parámetros dentro de un nuevo array `[]`.

Recuerda que un string también es iterable en JavaScript — `...'Hello'` lo convierte en caracteres individuales, igual que haría con un array.

## Output
```
[
  'a', 'b', 'c',
  'd', 'H', 'e',
  'l', 'l', 'o'
]
```

---

# Task 6 — Take advantage of template literals

## Qué hace

`getSanFranciscoDescription` devuelve una descripción de San Francisco usando template literals en lugar de concatenación con `+`.

## Por qué

Los **template literals** (backticks `` ` ``) permiten incrustar variables directamente dentro de un string usando `${}`, en lugar de cortarlo con `+`. El resultado es el mismo pero el código es más legible y fácil de mantener.

```javascript
// Concatenación clásica — difícil de leer
'Hola ' + nombre + ', tienes ' + edad + ' años.'

// Template literal — mucho más limpio
`Hola ${nombre}, tienes ${edad} años.`
```

También soportan expresiones dentro de `${}`:
```javascript
`El doble es ${numero * 2}`
`Hoy es ${new Date().toLocaleDateString()}`
```

## Codigo

**6-main.js** (archivo de prueba)
```javascript
import getSanFranciscoDescription from './6-string-interpolation.js';

console.log(getSanFranciscoDescription());
```

**6-string-interpolation.js** (tu archivo)
```javascript
export default function getSanFranciscoDescription() {
  const year = 2017;
  const budget = {
    income: '$119,868',
    gdp: '$154.2 billion',
    capita: '$178,479',
  };

  return `As of ${year}, it was the seventh-highest income county in the United States, with a per capita personal income of ${budget.income}. As of 2015, San Francisco proper had a GDP of ${budget.gdp}, and a GDP per capita of ${budget.capita}.`;
}
```

## Test

```bash
npm run dev 6-main.js
```

## Logica

La tarea pide reemplazar toda la concatenación con `+` por un solo template literal. Cada variable (`year`, `budget.income`, etc.) se inserta con `${}`. El resultado es exactamente el mismo string, pero escrito en una sola línea limpia con backticks.

## Output
```
As of 2017, it was the seventh-highest income county in the United States, with a per capita personal income of $119,868. As of 2015, San Francisco proper had a GDP of $154.2 billion, and a GDP per capita of $178,479.
```

---

# Task 7 — Object property value shorthand syntax

## Qué hace

`getBudgetObject` crea y devuelve un objeto `budget` con tres propiedades. La tarea pide reescribirlo usando la sintaxis shorthand de ES6 para propiedades de objetos.

## Por qué

Cuando el nombre de la propiedad y el nombre de la variable son iguales, ES6 permite escribirlo una sola vez en lugar de repetirlo:

```javascript
// Forma larga — repetitivo
const budget = {
  income: income,
  gdp: gdp,
  capita: capita,
};

// Shorthand — más limpio
const budget = {
  income,
  gdp,
  capita,
};
```

JavaScript entiende que `income` significa `income: income`. El resultado es exactamente el mismo objeto.

## Codigo

**7-main.js** (archivo de prueba)
```javascript
import getBudgetObject from './7-getBudgetObject.js';

console.log(getBudgetObject(400, 700, 900));
```

**7-getBudgetObject.js** (tu archivo)
```javascript
export default function getBudgetObject(income, gdp, capita) {
  const budget = {
    income,
    gdp,
    capita,
  };

  return budget;
}
```

## Test

```bash
npm run dev 7-main.js
```

## Logica

Solo hay que eliminar el `: variable` de cada propiedad donde la clave y el valor tienen el mismo nombre. ES6 infiere el valor automáticamente desde el scope.

## Output
```
{ income: 400, gdp: 700, capita: 900 }
```

---

# Task 8 — No need to create empty objects before adding in properties

## Qué hace

`getBudgetForCurrentYear` crea un objeto `budget` cuyas claves incluyen el año actual. La tarea pide reescribirlo usando **computed property names** directamente en el objeto literal, eliminando el objeto vacío `{}` y las asignaciones posteriores.

## Por qué

ES6 permite calcular el nombre de una propiedad en el momento de definir el objeto, usando `[]` dentro del literal:

```javascript
// Antes — objeto vacío + asignaciones
const obj = {};
obj[`key-${value}`] = 42;

// Con computed property names — directo en el literal
const obj = {
  [`key-${value}`]: 42,
};
```

Dentro de `[]` se puede usar cualquier expresión: variables, template literals, llamadas a funciones, etc.

## Codigo

**8-main.js** (archivo de prueba)
```javascript
import getBudgetForCurrentYear from './8-getBudgetCurrentYear.js';

console.log(getBudgetForCurrentYear(2100, 5200, 1090));
```

**8-getBudgetCurrentYear.js** (tu archivo)
```javascript
function getCurrentYear() {
  const date = new Date();
  return date.getFullYear();
}

export default function getBudgetForCurrentYear(income, gdp, capita) {
  const budget = {
    [`income-${getCurrentYear()}`]: income,
    [`gdp-${getCurrentYear()}`]: gdp,
    [`capita-${getCurrentYear()}`]: capita,
  };

  return budget;
}
```

## Test

```bash
npm run dev 8-main.js
```

## Logica

En lugar de crear `budget = {}` y luego asignar cada propiedad con `budget[...] = valor`, se define todo dentro del objeto literal. Cada clave usa un template literal dentro de `[]` para combinar el nombre fijo (`income-`, `gdp-`, `capita-`) con el año devuelto por `getCurrentYear()`.

## Output
```
{ 'income-2026': 2100, 'gdp-2026': 5200, 'capita-2026': 1090 }
```

---

# Task 9 — ES6 method properties

## Qué hace

`getFullBudgetObject` crea un objeto que combina las propiedades de `budget` con dos métodos para formatear el income. La tarea pide reescribir los métodos usando la sintaxis shorthand de ES6.

## Por qué

ES6 permite definir métodos en objetos sin escribir la palabra `function`, igual que se hace en clases:

```javascript
// Forma larga — con function
const obj = {
  saludar: function (nombre) {
    return `Hola ${nombre}`;
  },
};

// Shorthand — sin function
const obj = {
  saludar(nombre) {
    return `Hola ${nombre}`;
  },
};
```

El comportamiento es idéntico, pero el código es más limpio y consistente con la sintaxis de clases.

## Codigo

**9-main.js** (archivo de prueba)
```javascript
import getFullBudgetObject from './9-getFullBudget.js';

const fullBudget = getFullBudgetObject(20, 50, 10);

console.log(fullBudget.getIncomeInDollars(fullBudget.income));
console.log(fullBudget.getIncomeInEuros(fullBudget.income));
```

**9-getFullBudget.js** (tu archivo)
```javascript
import getBudgetObject from './7-getBudgetObject.js';

export default function getFullBudgetObject(income, gdp, capita) {
  const budget = getBudgetObject(income, gdp, capita);
  const fullBudget = {
    ...budget,
    getIncomeInDollars(income) {
      return `$${income}`;
    },
    getIncomeInEuros(income) {
      return `${income} euros`;
    },
  };

  return fullBudget;
}
```

## Test

```bash
npm run dev 9-main.js
```

## Logica

El único cambio es eliminar `: function` de cada método. En lugar de `getIncomeInDollars: function (income)`, se escribe directamente `getIncomeInDollars(income)`. El spread `...budget` copia las propiedades de `getBudgetObject` y luego se agregan los dos métodos.

## Output
```
$20
20 euros
```

---

# Task 10 — For...of Loops

## Qué hace

`appendToEachArrayValue` recorre un array y antepone `appendString` a cada elemento. La tarea pide reemplazar `for...in` y `var` por `for...of` y `const`.

## Por qué

### `for...in` vs `for...of`

| | `for...in` | `for...of` |
|---|---|---|
| Itera sobre | índices (keys) | valores directamente |
| Funciona con | objetos, arrays | cualquier iterable (array, string, Map, Set...) |
| ES6 | no | sí |

```javascript
const arr = ['a', 'b', 'c'];

for (const idx in arr)   console.log(idx);   // '0', '1', '2'
for (const val of arr)   console.log(val);   // 'a', 'b', 'c'
```

**Ejemplo completo — mismo array, tres formas de recorrerlo:**

```javascript
const frutas = ['manzana', 'pera', 'uva'];

// for...in → da los índices (0, 1, 2)
for (const i in frutas) {
  console.log(i, frutas[i]);
}
// 0 manzana
// 1 pera
// 2 uva

// for...of → da los valores directamente
for (const fruta of frutas) {
  console.log(fruta);
}
// manzana
// pera
// uva

// for...of con .entries() → da [índice, valor] al mismo tiempo
for (const [i, fruta] of frutas.entries()) {
  console.log(i, fruta);
}
// 0 manzana
// 1 pera
// 2 uva
```

`for...in` se inventó para objetos (`{key: value}`), no para arrays. Usarlo en arrays puede dar resultados raros si el array tiene propiedades extra. `for...of` es la forma correcta de ES6 para iterar arrays.

Para modificar el array por índice usando `for...of`, se usa `array.entries()` que devuelve pares `[índice, valor]`:

```javascript
for (const [idx, value] of array.entries()) {
  array[idx] = 'nuevo-' + value;
}
```

## Codigo

**10-main.js** (archivo de prueba)
```javascript
import appendToEachArrayValue from './10-loops.js';

console.log(appendToEachArrayValue(['appended', 'fixed', 'displayed'], 'correctly-'));
```

**10-loops.js** (tu archivo)
```javascript
export default function appendToEachArrayValue(array, appendString) {
  for (const [idx, value] of array.entries()) {
    array[idx] = appendString + value;
  }

  return array;
}
```

## Test

```bash
npm run dev 10-main.js
```

## Logica

- `for...in` itera índices → hay que acceder al valor con `array[idx]`
- `for...of` con `.entries()` da directamente `[índice, valor]` en cada vuelta
- `var` se reemplaza por `const` ya que los valores no se reasignan

## Output
```
[ 'correctly-appended', 'correctly-fixed', 'correctly-displayed' ]
```

---

# Task 11 — Iterator

## Qué hace

`createEmployeesObject` recibe el nombre de un departamento y un array de empleados, y devuelve un objeto donde la clave es el nombre del departamento y el valor es el array.

## Por qué

Este task combina dos features de ES6 ya vistas:
- **Computed property names** (`[departmentName]`) para usar una variable como clave
- **Property shorthand** — el valor ya es el array `employees` directamente

Sin computed property names no se podría hacer dinámicamente:
```javascript
// Esto NO funciona — crea la clave literal "departmentName"
return { departmentName: employees };

// Esto SÍ funciona — usa el valor de la variable como clave
return { [departmentName]: employees };
```

## Codigo

**11-main.js** (archivo de prueba)
```javascript
import createEmployeesObject from './11-createEmployeesObject.js';

console.log(createEmployeesObject("Software", [ "Bob", "Sylvie" ]));
```

**11-createEmployeesObject.js** (tu archivo)
```javascript
export default function createEmployeesObject(departmentName, employees) {
  return {
    [departmentName]: employees,
  };
}
```

## Test

```bash
npm run dev 11-main.js
```

## Logica

La función puede resolverse en una sola línea con `return`. El nombre del departamento va entre `[]` para que JavaScript lo interprete como variable y no como string literal.

**Resumen de cómo se interpretan las claves y valores:**

```javascript
// { } sin corchetes → clave es el string literal "departmentName"
{ departmentName: employees }
// → { departmentName: ['Bob', 'Sylvie'] }  ← clave siempre igual

// [ ] con corchetes → clave es el VALOR de la variable
{ [departmentName]: employees }
// → { Software: ['Bob', 'Sylvie'] }  ← clave cambia según el argumento
```

Para el valor — `employees` sin nada extra asigna el array completo tal cual:

```javascript
{ [departmentName]: employees }
// → { Software: ['Bob', 'Sylvie'] }   ← array completo como valor

// Si usaras ...employees (spread), explotaría el array en elementos sueltos
// pero eso no tiene sentido aquí porque los valores son strings, no pares clave-valor
```

La regla es: `[]` solo afecta las **claves**, no los valores. El valor `employees` siempre es el array entero.

## Output
```
{ Software: [ 'Bob', 'Sylvie' ] }
```

---

# Task 12 — Let's create a report object

## Qué hace

`createReportObject` recibe el objeto `employeesList` (resultado de combinar varios `createEmployeesObject`) y devuelve un reporte con dos propiedades:
- `allEmployees`: copia de todos los departamentos y sus empleados
- `getNumberOfDepartments`: método que devuelve cuántos departamentos hay

## Por qué

Este task combina tres features de ES6 ya vistas:
- **Spread** (`...employeesList`) para copiar todas las propiedades del objeto en `allEmployees`
- **Method shorthand** para definir `getNumberOfDepartments` sin la palabra `function`
- **`Object.keys()`** para contar las claves (departamentos) del objeto

```javascript
Object.keys({ engineering: [...], marketing: [...] })
// → ['engineering', 'marketing']  → .length = 2
```

## Codigo

**12-main.js** (archivo de prueba)
```javascript
import createEmployeesObject from './11-createEmployeesObject.js';
import createReportObject from './12-createReportObject.js';

const employees = {
    ...createEmployeesObject('engineering', ['Bob', 'Jane']),
    ...createEmployeesObject('marketing', ['Sylvie'])
};

const report = createReportObject(employees);
console.log(report.allEmployees);
console.log(report.getNumberOfDepartments(report.allEmployees));
```

**12-createReportObject.js** (tu archivo)
```javascript
export default function createReportObject(employeesList) {
  return {
    allEmployees: {
      ...employeesList,
    },
    getNumberOfDepartments(employeesList) {
      return Object.keys(employeesList).length;
    },
  };
}
```

## Test

```bash
npm run dev 12-main.js
```

## Logica

**Paso 1** — Se llama dos veces a `createEmployeesObject` y se combinan con spread:
```
createEmployeesObject('engineering', ['Bob', 'Jane']) → { engineering: ['Bob', 'Jane'] }
createEmployeesObject('marketing', ['Sylvie'])        → { marketing: ['Sylvie'] }

spread de los dos juntos:
employees = { engineering: ['Bob', 'Jane'], marketing: ['Sylvie'] }
```

**Paso 2** — `employees` entra como argumento a `createReportObject`.
Dentro de la función, `employeesList` = `{ engineering: ['Bob', 'Jane'], marketing: ['Sylvie'] }`

**Paso 3** — Se construye el objeto de retorno:
```javascript
allEmployees: { ...employeesList }
// spread copia todas las propiedades de employeesList dentro del nuevo objeto
// → allEmployees: { engineering: ['Bob', 'Jane'], marketing: ['Sylvie'] }
```

**Paso 4** — Se llama al método:
```javascript
report.getNumberOfDepartments(report.allEmployees)
// Object.keys({ engineering: [...], marketing: [...] }) → ['engineering', 'marketing']
// ['engineering', 'marketing'].length → 2
```

En resumen: `createEmployeesObject` arma piezas, el spread las une en `employees`, `createReportObject` las empaqueta en un reporte, y el método cuenta las claves del objeto final.

## Output
```
{ engineering: [ 'Bob', 'Jane' ], marketing: [ 'Sylvie' ] }
2
```

# ES6 Classes

## ¿Qué es una clase en JavaScript?

Una **clase** en ES6 es una plantilla para crear objetos. Define qué propiedades y métodos tendrán esos objetos. Es una sintaxis más limpia para lo que antes se hacía con funciones constructoras.

```javascript
// Antes de ES6 — función constructora
function Animal(nombre) {
  this.nombre = nombre;
}
Animal.prototype.hablar = function () {
  return `${this.nombre} hace un sonido.`;
};

// Con ES6 — clase
class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }
  hablar() {
    return `${this.nombre} hace un sonido.`;
  }
}
```

El resultado es el mismo objeto, pero la sintaxis de clase es más clara y organizada.

---

## Estructura de una clase

```javascript
class NombreClase {
  constructor(param1, param2) {
    // Se ejecuta automáticamente al hacer new NombreClase()
    this.propiedad1 = param1;
    this.propiedad2 = param2;
  }

  metodo() {
    return this.propiedad1;
  }

  static metodoEstatico() {
    // Se llama en la clase, no en la instancia
    return 'soy estático';
  }
}
```

---

## Convenciones de nombres

- Clases: **PascalCase** → `ClassRoom`, `HolbertonCourse`
- Propiedades privadas: prefijo `_` → `_maxStudentsSize`, `_name`
- El prefijo `_` es solo una convención — no hace la propiedad realmente privada en JavaScript estándar

---

## Setup

```bash
cd ES6_classes
npm install
```

## Correr archivos

```bash
npm run dev <archivo>
# Ejemplo:
npm run dev 0-main.js
```

---

# Task 0 — You used to attend a place like this at some point

## Qué hace

Crea la clase `ClassRoom` que acepta un argumento `maxStudentsSize` y lo asigna a la propiedad `_maxStudentsSize`.

## Por qué

El `constructor` es el método especial que se ejecuta automáticamente cuando se hace `new ClassRoom(10)`. El prefijo `_` en `_maxStudentsSize` es una convención para indicar que es una propiedad "privada" (aunque técnicamente es accesible desde fuera).

```javascript
const room = new ClassRoom(10);
// JavaScript llama constructor(10)
// this._maxStudentsSize = 10
console.log(room._maxStudentsSize); // 10
```

## Codigo

**0-main.js** (archivo de prueba)
```javascript
import ClassRoom from './0-classroom';

const room = new ClassRoom(10);
console.log(room._maxStudentsSize);
```

**0-classroom.js** (tu archivo)
```javascript
export default class ClassRoom {
  constructor(maxStudentsSize) {
    this._maxStudentsSize = maxStudentsSize;
  }
}
```

## Test

```bash
npm run dev 0-main.js
```

## Logica

El `constructor` recibe `maxStudentsSize` y lo guarda como `this._maxStudentsSize`. Cuando luego se accede a `room._maxStudentsSize`, JavaScript devuelve el valor guardado.

## Output
```
10
```

---

# Task 1 — Let's make some classrooms

## Qué hace

`initializeRooms` devuelve un array con 3 instancias de `ClassRoom` con tamaños 19, 20 y 34.

## Por qué

Este task practica crear objetos desde una clase importada y devolverlos en un array. Se usa `import` para traer la clase de otro archivo y `new` para crear cada instancia.

```javascript
// Importar una clase de otro archivo
import ClassRoom from './0-classroom';

// Crear instancias
const room = new ClassRoom(19);  // { _maxStudentsSize: 19 }
```

## Codigo

**1-main.js** (archivo de prueba)
```javascript
import initializeRooms from './1-make_classrooms';

console.log(initializeRooms());
```

**1-make_classrooms.js** (tu archivo)
```javascript
import ClassRoom from './0-classroom';

export default function initializeRooms() {
  return [new ClassRoom(19), new ClassRoom(20), new ClassRoom(34)];
}
```

## Test

```bash
npm run dev 1-main.js
```

## Logica

La función crea tres instancias de `ClassRoom` con los tamaños requeridos y las devuelve directamente en un array literal. El `import` trae la clase del archivo anterior.

## Output
```
[
  ClassRoom { _maxStudentsSize: 19 },
  ClassRoom { _maxStudentsSize: 20 },
  ClassRoom { _maxStudentsSize: 34 }
]
```

---

# Task 2 — A Course, Getters, and Setters

## Qué hace

`HolbertonCourse` es una clase con tres atributos (`name`, `length`, `students`) que valida el tipo de cada uno al asignarlos, tanto en el constructor como al usar los setters.

## Por qué

### Getters y Setters

Los **getters** y **setters** permiten controlar cómo se leen y asignan las propiedades de un objeto. Se definen con `get` y `set`:

```javascript
class Ejemplo {
  get nombre() {        // se llama al leer: obj.nombre
    return this._nombre;
  }

  set nombre(value) {   // se llama al asignar: obj.nombre = 'algo'
    this._nombre = value;
  }
}
```

El setter es el lugar ideal para validar tipos — si el valor no es válido, se lanza un `TypeError`.

### Por qué usar `this.name = name` en el constructor (no `this._name`)

Si se usa `this.name = name` en el constructor, JavaScript llama al **setter** automáticamente. Así la validación se ejecuta tanto al crear el objeto como al reasignar después.

```javascript
constructor(name) {
  this.name = name;   // llama al setter → valida el tipo
}
```

## Codigo

**2-main.js** (archivo de prueba)
```javascript
import HolbertonCourse from './2-hbtn_course';

const c1 = new HolbertonCourse('ES6', 1, ['Bob', 'Jane']);
console.log(c1.name);
c1.name = 'Python 101';
console.log(c1);

try {
  c1.name = 12;
} catch (err) {
  console.log(err);
}

try {
  const c2 = new HolbertonCourse('ES6', '1', ['Bob', 'Jane']);
} catch (err) {
  console.log(err);
}
```

**2-hbtn_course.js** (tu archivo)
```javascript
export default class HolbertonCourse {
  constructor(name, length, students) {
    this.name = name;
    this.length = length;
    this.students = students;
  }

  get name() { return this._name; }
  set name(value) {
    if (typeof value !== 'string') throw new TypeError('Name must be a string');
    this._name = value;
  }

  get length() { return this._length; }
  set length(value) {
    if (typeof value !== 'number') throw new TypeError('Length must be a number');
    this._length = value;
  }

  get students() { return this._students; }
  set students(value) {
    if (!Array.isArray(value)) throw new TypeError('Students must be an array of strings');
    this._students = value;
  }
}
```

## Test

```bash
npm run dev 2-main.js
```

## Logica

El constructor usa `this.name = name` (sin `_`) para pasar por el setter y validar el tipo. Si el tipo no es correcto, `typeof` lo detecta y se lanza un `TypeError`. Para arrays se usa `Array.isArray()` porque `typeof []` devuelve `'object'`, no `'array'`.

## Output
```
ES6
HolbertonCourse { _name: 'Python 101', _length: 1, _students: [ 'Bob', 'Jane' ] }
TypeError: Name must be a string
TypeError: Length must be a number
```

---

# Task 3 — Methods, static methods, computed methods names..... MONEY

## Qué hace

`Currency` es una clase con dos atributos (`code`, `name`) con getters/setters, y un método `displayFullCurrency` que los devuelve en formato `name (code)`.

## Por qué

Un **método de instancia** es una función definida dentro de la clase que puede acceder a las propiedades del objeto con `this`. Se llama sobre una instancia: `dollar.displayFullCurrency()`.

```javascript
class Currency {
  displayFullCurrency() {
    return `${this._name} (${this._code})`;
  }
}
```

Diferencia con un **método estático** (`static`): los métodos estáticos se llaman en la clase, no en la instancia (`Currency.metodo()`), y no tienen acceso a `this`.

## Codigo

**3-main.js** (archivo de prueba)
```javascript
import Currency from './3-currency';

const dollar = new Currency('$', 'Dollars');
console.log(dollar.displayFullCurrency());
```

**3-currency.js** (tu archivo)
```javascript
export default class Currency {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }

  get code() { return this._code; }

  set code(value) {
    if (typeof value !== 'string') throw new TypeError('Code must be a string');
    this._code = value;
  }

  get name() { return this._name; }

  set name(value) {
    if (typeof value !== 'string') throw new TypeError('Name must be a string');
    this._name = value;
  }

  displayFullCurrency() {
    return `${this._name} (${this._code})`;
  }
}
```

## Test

```bash
npm run dev 3-main.js
```

## Logica

El método `displayFullCurrency` usa un template literal para combinar `_name` y `_code` en el formato requerido. Se accede directamente a `this._name` y `this._code` (con `_`) desde dentro de la clase.

## Output
```
Dollars ($)
```

---

# Task 4 — Pricing

## Qué hace

`Pricing` tiene dos atributos (`amount`, `currency`), getters/setters con validación de tipos, el método `displayFullPrice` que muestra el precio completo, y el método estático `convertPrice` que multiplica un monto por una tasa de conversión.

## Por qué

### Métodos estáticos (`static`)

Un método `static` pertenece a la **clase**, no a una instancia. Se llama directamente sobre la clase:

```javascript
Pricing.convertPrice(100, 1.2)  // 120 ✓
p.convertPrice(100, 1.2)        // Error — no existe en la instancia
```

Son útiles para operaciones que no necesitan datos de un objeto específico — como una conversión matemática.

### Validar instancias de otra clase

Para verificar que `currency` sea una instancia de `Currency` se usa `instanceof`:

```javascript
if (!(value instanceof Currency)) throw new TypeError('...');
```

## Codigo

**4-main.js** (archivo de prueba)
```javascript
import Pricing from './4-pricing';
import Currency from './3-currency';

const p = new Pricing(100, new Currency('EUR', 'Euro'));
console.log(p);
console.log(p.displayFullPrice());
```

**4-pricing.js** (tu archivo)
```javascript
import Currency from './3-currency';

export default class Pricing {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  get amount() { return this._amount; }

  set amount(value) {
    if (typeof value !== 'number') throw new TypeError('Amount must be a number');
    this._amount = value;
  }

  get currency() { return this._currency; }

  set currency(value) {
    if (!(value instanceof Currency)) throw new TypeError('Currency must be a Currency instance');
    this._currency = value;
  }

  displayFullPrice() {
    return `${this._amount} ${this._currency.name} (${this._currency.code})`;
  }

  static convertPrice(amount, conversionRate) {
    return amount * conversionRate;
  }
}
```

## Test

```bash
npm run dev 4-main.js
```

## Logica

`displayFullPrice` accede a `this._currency.name` y `this._currency.code` usando los getters de la clase `Currency`. `convertPrice` es estático porque solo hace una operación matemática — no necesita ninguna propiedad del objeto.

## Output
```
Pricing { _amount: 100, _currency: Currency { _code: 'EUR', _name: 'Euro' } }
100 Euro (EUR)
```

---

# Task 5 — A Building

## Qué hace

`Building` es una **clase abstracta** — se puede instanciar directamente, pero cualquier clase que la extienda **debe** implementar el método `evacuationWarningMessage`. Si no lo hace, el constructor lanza un error.

## Por qué

JavaScript no tiene clases abstractas nativas como Python o Java. Se simula usando `new.target` en el constructor:

```javascript
new.target  // es la clase que se está instanciando directamente
```

- `new Building(100)` → `new.target === Building` → no hay error
- `new TestBuilding(200)` → `new.target === TestBuilding` → se verifica si tiene el método

```javascript
if (new.target !== Building && typeof this.evacuationWarningMessage !== 'function') {
  throw new Error('Class extending Building must override evacuationWarningMessage');
}
```

Esta condición dice: "si no soy `Building` yo mismo Y no tengo el método → lanza error".

## Codigo

**5-main.js** (archivo de prueba)
```javascript
import Building from './5-building';

const b = new Building(100);
console.log(b);

class TestBuilding extends Building {}

try {
  new TestBuilding(200);
} catch (err) {
  console.log(err);
}
```

**5-building.js** (tu archivo)
```javascript
export default class Building {
  constructor(sqft) {
    if (new.target !== Building && typeof this.evacuationWarningMessage !== 'function') {
      throw new Error('Class extending Building must override evacuationWarningMessage');
    }
    this._sqft = sqft;
  }

  get sqft() {
    return this._sqft;
  }
}
```

## Test

```bash
npm run dev 5-main.js
```

## Logica

**¿Por qué `this._sqft` y no `this.sqft` en el constructor?**

La regla depende de si existe un setter:

| Situación | En el constructor | ¿Por qué? |
|---|---|---|
| Hay setter | `this.sqft = sqft` | Llama al setter → valida el tipo |
| Solo getter | `this._sqft = sqft` | Sin setter, asignar a `this.sqft` lanzaría `TypeError` en modo estricto |

Las clases en JavaScript usan modo estricto por defecto. Si defines un getter sin setter e intentas hacer `this.sqft = sqft`, JavaScript lanza: `Cannot set property sqft of #<Building>`.

Por eso cuando solo hay getter, se asigna directo a la propiedad con `_`.

La validación de clase abstracta va **antes** de la asignación para que el error se lance inmediatamente al intentar instanciar una subclase sin el método requerido.

## Output
```
Building { _sqft: 100 }
Error: Class extending Building must override evacuationWarningMessage
```

---

# Task 6 — Inheritance

## Qué hace

`SkyHighBuilding` extiende `Building`, agrega el atributo `floors`, y sobreescribe `evacuationWarningMessage` para devolver un mensaje con el número de pisos.

## Por qué

### `extends` y `super`

`extends` indica que una clase hereda de otra. En el constructor de la subclase, **`super()` debe llamarse antes de usar `this`** — es obligatorio cuando hay constructor propio:

```javascript
class SkyHighBuilding extends Building {
  constructor(sqft, floors) {
    super(sqft);        // llama al constructor de Building → asigna this._sqft
    this._floors = floors;  // ahora sí se puede usar this
  }
}
```

### Override de método

Al definir `evacuationWarningMessage()` en la subclase, se sobreescribe el comportamiento. La subclase ya satisface la condición de `Building` (`typeof this.evacuationWarningMessage === 'function'`), así que no lanza error.

### Getters heredados

El getter `sqft` se hereda de `Building` — no hace falta redefinirlo. Solo se define el getter nuevo `floors`.

## Codigo

**6-main.js** (archivo de prueba)
```javascript
import SkyHighBuilding from './6-sky_high';

const building = new SkyHighBuilding(140, 60);
console.log(building.sqft);
console.log(building.floors);
console.log(building.evacuationWarningMessage());
```

**6-sky_high.js** (tu archivo)
```javascript
import Building from './5-building';

export default class SkyHighBuilding extends Building {
  constructor(sqft, floors) {
    super(sqft);
    this._floors = floors;
  }

  get floors() {
    return this._floors;
  }

  evacuationWarningMessage() {
    return `Evacuate slowly the ${this._floors} floors`;
  }
}
```

## Test

```bash
npm run dev 6-main.js
```

## Logica

`super(sqft)` delega la asignación de `_sqft` al constructor de `Building`. La subclase solo se encarga de `_floors`. El getter `sqft` se hereda automáticamente — no hay que redefinirlo.

## Output
```
140
60
Evacuate slowly the 60 floors
```

---

# Task 7 — Airport

## Qué hace

`Airport` tiene dos atributos (`name`, `code`) y sobreescribe la descripción por defecto del objeto usando `Symbol.toStringTag` para que devuelva el código del aeropuerto.

## Por qué

### `Symbol.toStringTag`

`Symbol.toStringTag` es un símbolo especial de JavaScript que controla qué devuelve `Object.prototype.toString()` cuando se llama sobre el objeto:

```javascript
airportSF.toString()  // → '[object SFO]'
//                              ↑ el tag
```

Sin `Symbol.toStringTag`, `toString()` devolvería `[object Object]`. Al definirlo como getter, se personaliza ese tag:

```javascript
get [Symbol.toStringTag]() {
  return this._code;  // 'SFO'
}
// → toString() devuelve '[object SFO]'
```

Node.js también usa este símbolo para el formato de `console.log`, por eso aparece `Airport [SFO] { ... }` en lugar de `Airport { ... }`.

## Codigo

**7-main.js** (archivo de prueba)
```javascript
import Airport from './7-airport';

const airportSF = new Airport('San Francisco Airport', 'SFO');
console.log(airportSF);
console.log(airportSF.toString());
```

**7-airport.js** (tu archivo)
```javascript
export default class Airport {
  constructor(name, code) {
    this._name = name;
    this._code = code;
  }

  get [Symbol.toStringTag]() {
    return this._code;
  }
}
```

## Test

```bash
npm run dev 7-main.js
```

## Logica

El constructor asigna directo a `this._name` y `this._code` (sin pasar por setter) porque el task no pide getters ni setters. Solo se define `Symbol.toStringTag` como getter computed que devuelve `this._code`.

## Output
```
Airport [SFO] { _name: 'San Francisco Airport', _code: 'SFO' }
[object SFO]
```

---

# Task 8 — Primitive - Holberton Class

## Qué hace

`HolbertonClass` controla cómo se convierte el objeto a un tipo primitivo: cuando se castea a `Number` devuelve `size`, cuando se castea a `String` devuelve `location`.

## Por qué

### `Symbol.toPrimitive`

`Symbol.toPrimitive` es un símbolo especial que controla la conversión de un objeto a un valor primitivo. Recibe un argumento `hint` que indica qué tipo se está pidiendo:

| hint | cuándo ocurre | ejemplo |
|---|---|---|
| `'number'` | se necesita un número | `Number(obj)`, `+obj` |
| `'string'` | se necesita un string | `String(obj)`, template literals |
| `'default'` | contexto ambiguo | `obj + ''`, `obj == 1` |

```javascript
[Symbol.toPrimitive](hint) {
  if (hint === 'number') return this._size;
  if (hint === 'string') return this._location;
  return this._size;  // default
}
```

### Diferencia con `Symbol.toStringTag` (Task 7)

| Símbolo | Controla |
|---|---|
| `Symbol.toStringTag` | qué devuelve `toString()` — solo strings |
| `Symbol.toPrimitive` | cualquier conversión primitiva (number, string, default) |

## Codigo

**8-main.js** (archivo de prueba)
```javascript
import HolbertonClass from './8-hbtn_class';

const hc = new HolbertonClass(12, 'Mezzanine');
console.log(Number(hc));
console.log(String(hc));
```

**8-hbtn_class.js** (tu archivo)
```javascript
export default class HolbertonClass {
  constructor(size, location) {
    this._size = size;
    this._location = location;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this._size;
    if (hint === 'string') return this._location;
    return this._size;
  }
}
```

## Test

```bash
npm run dev 8-main.js
```

## Logica

`Number(hc)` llama a `Symbol.toPrimitive` con `hint = 'number'` → devuelve `this._size`.
`String(hc)` llama a `Symbol.toPrimitive` con `hint = 'string'` → devuelve `this._location`.

## Output
```
12
Mezzanine
```

---

# Task 9 — Hoisting

## Qué hace

Corregir código roto que crea dos clases (`HolbertonClass`, `StudentHolberton`) y una lista de estudiantes. El código original tenía 5 bugs.

## Por qué — Bugs encontrados y corregidos

### Bug 1: Hoisting de clases
Las clases en JS **no** se elevan (no hacen hoisting) como `var`. Usar una clase antes de declararla lanza `ReferenceError`.

```javascript
// ❌ Error — HolbertonClass aún no existe
const class2019 = new HolbertonClass(2019, 'San Francisco');
export class HolbertonClass { ... }

// ✓ Correcto — definir primero, usar después
export class HolbertonClass { ... }
const class2019 = new HolbertonClass(2019, 'San Francisco');
```

### Bug 2: Parámetro faltante en constructor
```javascript
// ❌ Faltaba holbertonClass
constructor(firstName, lastName) { ... }

// ✓ Correcto
constructor(firstName, lastName, holbertonClass) { ... }
```

### Bug 3: `self` en lugar de `this`
```javascript
// ❌ self no existe en JS (es de Python)
return `${self._firstName} ...`

// ✓ Correcto
return `${this._firstName} ...`
```

### Bug 4: Recursión infinita en getter
```javascript
// ❌ this.holbertonClass llama al propio getter → bucle infinito
get holbertonClass() { return this.holbertonClass; }

// ✓ Correcto
get holbertonClass() { return this._holbertonClass; }
```

### Bug 5: Export named vs default
```javascript
// ❌ export const es named — el main importa como default
export const listOfStudents = [...];

// ✓ Correcto
const listOfStudents = [...];
export default listOfStudents;
```

## Codigo

**9-main.js** (archivo de prueba)
```javascript
import listOfStudents from './9-hoisting';

console.log(listOfStudents);

const listPrinted = listOfStudents.map(
  (student) => student.fullStudentDescription,
);

console.log(listPrinted);
```

## Test

```bash
npm run dev 9-main.js
```

## Output
```
[ StudentHolberton { _firstName: 'Guillaume', ... }, ... ]
[
  'Guillaume Salva - 2020 - San Francisco',
  'John Doe - 2020 - San Francisco',
  'Albert Clinton - 2019 - San Francisco',
  'Donald Bush - 2019 - San Francisco',
  'Jason Sandler - 2019 - San Francisco'
]
```

---

# Task 10 — Vroom

## Qué hace

`Car` tiene tres atributos y un método `cloneCar` que crea una nueva instancia de la **misma clase** que el objeto actual — incluso si es una subclase.

## Por qué

### El problema sin `Symbol.species`

Si `cloneCar` hiciera simplemente `new Car()`, el clon siempre sería un `Car`, nunca un `TestCar`:

```javascript
// ❌ tc2 instanceof TestCar → false
cloneCar() {
  return new Car();
}
```

### `Symbol.species` — la solución

`Symbol.species` es un símbolo estático que devuelve el constructor que debe usarse para crear objetos derivados. Al definirlo como `return this` en un getter estático, cada subclase hereda su propio constructor:

```javascript
static get [Symbol.species]() {
  return this;  // 'this' en un método estático es la clase misma
}
```

Cuando `TestCar` hereda este getter, `TestCar[Symbol.species]` devuelve `TestCar`.

### En `cloneCar`

```javascript
cloneCar() {
  return new this.constructor[Symbol.species]();
}
// this.constructor   → TestCar (la clase real de la instancia)
// [Symbol.species]   → TestCar (heredado del getter estático)
// new TestCar()      → { _brand: undefined, ... }
```

## Codigo

**10-main.js** (archivo de prueba)
```javascript
import Car from './10-car';

class TestCar extends Car {}

const tc1 = new TestCar('Nissan', 'Turbo', 'Pink');
const tc2 = tc1.cloneCar();

console.log(tc1);
console.log(tc1 instanceof TestCar);
console.log(tc2);
console.log(tc2 instanceof TestCar);
console.log(tc1 == tc2);
```

**10-car.js** (tu archivo)
```javascript
export default class Car {
  constructor(brand, motor, color) {
    this._brand = brand;
    this._motor = motor;
    this._color = color;
  }

  static get [Symbol.species]() {
    return this;
  }

  cloneCar() {
    return new this.constructor[Symbol.species]();
  }
}
```

## Test

```bash
npm run dev 10-main.js
```

## Logica

**¿Cuál es la diferencia entre `cloneCar()` y simplemente hacer `new Car()`?**

```javascript
// Sin Symbol.species — siempre crea Car base
cloneCar() { return new Car(); }
tc2 instanceof TestCar  // → false ❌

// Con Symbol.species — crea la misma clase que el objeto actual
cloneCar() { return new this.constructor[Symbol.species](); }
tc2 instanceof TestCar  // → true ✓
```

`cloneCar` no sabe de antemano qué subclase lo va a llamar. Con `Symbol.species` se adapta automáticamente: si lo llama un `TestCar`, devuelve un `TestCar`; si lo llama un `SportsCar`, devuelve un `SportsCar`. Sin ese mecanismo siempre devolvería un `Car` base, rompiendo la herencia.

El clon se crea sin argumentos → todos los atributos son `undefined`. `tc1 == tc2` es `false` porque son objetos diferentes en memoria.

## Output
```
TestCar { _brand: 'Nissan', _motor: 'Turbo', _color: 'Pink' }
true
TestCar { _brand: undefined, _motor: undefined, _color: undefined }
true
false
```

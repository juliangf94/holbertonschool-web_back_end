# ES6 Promises

## Learning Objectives

---

### Que es una Promise (como, por que y que)

Una **Promise** es un objeto que representa el resultado eventual de una operacion asincrona. En lugar de bloquear el programa esperando un resultado, la Promise te promete que en algun momento tendra un valor — o fallara.

Una Promise puede estar en uno de tres estados:

| Estado | Descripcion |
|--------|-------------|
| `pending` | La operacion aun no termino |
| `fulfilled` | La operacion termino con exito — tiene un valor |
| `rejected` | La operacion fallo — tiene un error |

```javascript
// Crear una Promise manualmente
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve('Operacion exitosa'); // pasa a fulfilled
  } else {
    reject(new Error('Algo malio sal')); // pasa a rejected
  }
});
```

**Por que existen:** antes de las Promises, el codigo asincrono se manejaba con callbacks anidados, lo que generaba el "callback hell" — codigo imposible de leer. Las Promises permiten encadenar operaciones asincronas de forma lineal y legible.

---

### Como usar then, resolve y catch

#### `.then(onFulfilled, onRejected)`
Se ejecuta cuando la Promise se resuelve. Recibe el valor con el que se llamo `resolve`.

```javascript
promise
  .then((value) => {
    console.log(value); // 'Operacion exitosa'
  });
```

#### `.catch(onRejected)`
Se ejecuta cuando la Promise es rechazada. Es equivalente a `.then(null, onRejected)`.

```javascript
promise
  .then((value) => console.log(value))
  .catch((error) => console.error(error.message));
```

#### `Promise.resolve(value)`
Crea una Promise ya resuelta con el valor dado. Util para retornar un valor sincrono como si fuera una Promise.

```javascript
const resolved = Promise.resolve(42);
resolved.then((val) => console.log(val)); // 42
```

---

### Metodos del objeto Promise

#### `Promise.resolve(value)`
Retorna una Promise ya resuelta con `value`.

#### `Promise.reject(error)`
Retorna una Promise ya rechazada con `error`.

#### `Promise.all(iterable)`
Recibe un array de Promises y retorna una nueva Promise que:
- Se resuelve cuando **todas** se resuelven — retorna un array con todos los valores.
- Se rechaza en cuanto **una** falla — retorna el error de la primera que fallo.

```javascript
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then((values) => console.log(values)); // [1, 2, 3]
```

#### `Promise.allSettled(iterable)`
Como `all`, pero espera a que **todas** terminen sin importar si fallan. Retorna un array de objetos con `{ status, value/reason }`.

```javascript
Promise.allSettled([
  Promise.resolve('ok'),
  Promise.reject(new Error('fail')),
]).then((results) => console.log(results));
// [
//   { status: 'fulfilled', value: 'ok' },
//   { status: 'rejected', reason: Error: fail }
// ]
```

#### `Promise.race(iterable)`
Retorna una Promise que se resuelve o rechaza con el resultado de la **primera** que termine.

#### `Promise.any(iterable)`
Retorna una Promise que se resuelve con la **primera** que tenga exito. Si todas fallan, se rechaza.

---

### Throw / Try

`try/catch` en codigo asincrono con `async/await` funciona igual que en codigo sincrono. Si una Promise es rechazada dentro de un bloque `await`, el error se puede capturar con `catch`.

```javascript
async function fetchData() {
  try {
    const result = await Promise.reject(new Error('Fallo la conexion'));
    console.log(result);
  } catch (error) {
    console.error('Capturado:', error.message); // 'Capturado: Fallo la conexion'
  }
}
```

`throw` lanza un error manualmente — dentro de una funcion `async`, equivale a retornar una Promise rechazada.

```javascript
async function validate(value) {
  if (value < 0) throw new Error('El valor no puede ser negativo');
  return value * 2;
}

validate(-1).catch((e) => console.log(e.message)); // 'El valor no puede ser negativo'
```

---

### El operador await

`await` pausa la ejecucion de una funcion `async` hasta que la Promise se resuelve, y retorna su valor. Solo se puede usar dentro de funciones `async`.

```javascript
async function getUser() {
  const user = await Promise.resolve({ name: 'Guillaume' });
  console.log(user.name); // 'Guillaume'
}
```

Sin `await`, tendrias que usar `.then()`:

```javascript
Promise.resolve({ name: 'Guillaume' }).then((user) => console.log(user.name));
```

Ambos hacen lo mismo, pero `await` hace el codigo mas legible.

---

### Como usar una funcion async

Una funcion declarada con `async` **siempre retorna una Promise**, aunque retorne un valor simple.

```javascript
async function greet() {
  return 'Hello';
}

greet().then((msg) => console.log(msg)); // 'Hello'
// Es equivalente a:
// Promise.resolve('Hello').then(...)
```

Puedes usar `await` dentro para esperar otras Promises:

```javascript
async function loadData() {
  const photo = await uploadPhoto();       // espera la primera
  const user = await createUser();         // luego espera la segunda
  console.log(photo.body, user.firstName); // 'photo-profile-1' 'Guillaume'
}
```

O en paralelo con `Promise.all` para no esperar una por una:

```javascript
async function loadDataParallel() {
  const [photo, user] = await Promise.all([uploadPhoto(), createUser()]);
  console.log(photo.body, user.firstName);
}
```

---

## Task 0 — Keep every promise you make

### Que hace
Retorna una `Promise` vacia usando la funcion `getResponseFromAPI`.

### Por que
Verifica que se sabe crear y retornar una `Promise`. El `instanceof Promise` en el main confirma que el valor retornado es efectivamente una instancia de `Promise`.

### Main
```javascript
import getResponseFromAPI from './0-promise';

const response = getResponseFromAPI();
console.log(response instanceof Promise);
```

### Codigo
```javascript
export default function getResponseFromAPI() {
  return new Promise((resolve, reject) => {});
}
```

### Test
```bash
npm run dev 0-main.js
```

### Logica
- `new Promise((resolve, reject) => {})` crea una Promise que queda en estado `pending` indefinidamente — nunca se llama ni `resolve` ni `reject`.
- Eso es suficiente para que `instanceof Promise` retorne `true`, que es lo unico que verifica el main.
- El constructor de `Promise` recibe una funcion ejecutora `(resolve, reject)` que corre sincrónicamente al crear la Promise.

### Output
```
true
```

---

## Task 1 — Don't make a promise if you can't keep it

### Que hace
Retorna una `Promise` que se resuelve o rechaza dependiendo del valor booleano del argumento `success`. Si es `true`, resuelve con un objeto `{ status: 200, body: 'Success' }`; si es `false`, rechaza con un `Error`.

### Por que
Practica el uso del constructor `new Promise(resolve, reject)` con logica condicional — la base de como se controla el flujo asincrono segun el resultado de una operacion.

### Main
```javascript
import getFullResponseFromAPI from './1-promise';

console.log(getFullResponseFromAPI(true));
console.log(getFullResponseFromAPI(false));
```

### Codigo
```javascript
export default function getFullResponseFromAPI(success) {
  return new Promise((resolve, reject) => {
    if (success) {
      resolve({ status: 200, body: 'Success' });
    } else {
      reject(new Error('The fake API is not working currently'));
    }
  });
}
```

### Test
```bash
npm run dev 1-main.js
```

### Logica
- El constructor `new Promise((resolve, reject) => {...})` recibe una funcion ejecutora que corre sincrónicamente. Dentro de ella se decide si la Promise termina bien (`resolve`) o mal (`reject`).
- `resolve({ status: 200, body: 'Success' })` pasa la Promise al estado `fulfilled` con ese objeto como valor.
- `reject(new Error('...'))` pasa la Promise al estado `rejected` con un objeto `Error`. Se usa `new Error(mensaje)` y no un string simple, porque las buenas practicas de JavaScript indican que los rechazos siempre deben ser instancias de `Error`.
- El output muestra las dos Promises instantáneamente — como el codigo es sincrono dentro del constructor, el estado ya es `fulfilled` o `rejected` antes de que `console.log` las imprima.

### Output
```
Promise { { status: 200, body: 'Success' } }
Promise {
  <rejected> Error: The fake API is not working currently
    ...
}
```

---

## Task 2 — Catch me if you can!

### Que hace
Recibe una Promise como argumento y le agrega tres handlers: uno para cuando se resuelve (retorna un objeto con `status` y `body`), uno para cuando es rechazada (retorna un `Error` vacio), y un `.finally` que siempre loguea un mensaje en consola sin importar el resultado.

### Por que
Practica el encadenamiento de `.then()`, `.catch()` y `.finally()` sobre una Promise existente — el patron mas comun para manejar resultados asincronos.

### Main
```javascript
import handleResponseFromAPI from './2-then';

const promise = Promise.resolve();
handleResponseFromAPI(promise);
```

### Codigo
```javascript
export default function handleResponseFromAPI(promise) {
  return promise
    .then(() => ({ status: 200, body: 'success' }))
    .catch(() => new Error())
    .finally(() => console.log('Got a response from the API'));
}
```

### Test
```bash
npm run dev 2-main.js
```

### Logica
- `.then(() => ({ status: 200, body: 'success' }))` — cuando la Promise se resuelve, retorna un objeto nuevo. Los parentesis extra `({ ... })` son necesarios para que JavaScript interprete `{...}` como un objeto y no como un bloque de codigo.
- `.catch(() => new Error())` — cuando la Promise es rechazada, retorna un `Error` vacio. Notar que se retorna el error, no se lanza con `throw` — eso hace que la Promise resultante quede en estado `fulfilled` con el `Error` como valor.
- `.finally(() => console.log('Got a response from the API'))` — se ejecuta siempre, tanto si la Promise se resolvio como si fue rechazada. No recibe ningun argumento y no puede modificar el valor que pasa al siguiente handler — solo sirve para efectos secundarios como loguear o limpiar recursos.

### Output
```
Got a response from the API
```

---

## Task 3 — Handle multiple successful promises

### Que hace
Importa `uploadPhoto` y `createUser` desde `utils.js`, resuelve ambas Promises en paralelo con `Promise.all`, y loguea `body firstName lastName` en consola. Si alguna falla, loguea `'Signup system offline'`.

### Por que
Practica el uso de `Promise.all` para ejecutar multiples operaciones asincronas en paralelo y manejar el resultado combinado — o el error si alguna falla.

### Main
```javascript
import handleProfileSignup from './3-all';

handleProfileSignup();
```

### Codigo
```javascript
import { uploadPhoto, createUser } from './utils';

export default function handleProfileSignup() {
  return Promise.all([uploadPhoto(), createUser()])
    .then(([photo, user]) => {
      console.log(`${photo.body} ${user.firstName} ${user.lastName}`);
    })
    .catch(() => console.log('Signup system offline'));
}
```

### Test
```bash
npm run dev 3-main.js
```

### Logica
- `Promise.all([uploadPhoto(), createUser()])` lanza las dos Promises **al mismo tiempo** (en paralelo), no una despues de la otra. Espera a que ambas terminen y retorna un array con sus resultados en el mismo orden del array original.
- En el `.then`, se usa **destructuring** `([photo, user])` para extraer los dos resultados directamente del array: `photo` es el resultado de `uploadPhoto` y `user` el de `createUser`.
- `photo.body` es `'photo-profile-1'`, `user.firstName` es `'Guillaume'`, `user.lastName` es `'Salva'` — segun el formato que devuelven las funciones de `utils.js`.
- Si cualquiera de las dos Promises falla, `Promise.all` se rechaza inmediatamente y el `.catch` loguea `'Signup system offline'`.
- Las importaciones usan `{ }` (named exports) porque `utils.js` exporta las funciones con nombre, no como `export default`.

### Output
```
photo-profile-1 Guillaume Salva
```

---

## Task 4 — Simple promise

### Que hace
Recibe `firstName` y `lastName` como parametros y retorna una Promise ya resuelta con un objeto `{ firstName, lastName }`.

### Por que
Practica el uso de `Promise.resolve()` para retornar un valor sincrono envuelto en una Promise — el patron mas simple de funcion asincrona.

### Main
```javascript
import signUpUser from './4-user-promise';

console.log(signUpUser('Bob', 'Dylan'));
```

### Codigo
```javascript
export default function signUpUser(firstName, lastName) {
  return Promise.resolve({ firstName, lastName });
}
```

### Test
```bash
npm run dev 4-main.js
```

### Logica
- `Promise.resolve(value)` crea directamente una Promise en estado `fulfilled` con `value` como resultado. Es un atajo para `new Promise((resolve) => resolve(value))`.
- `{ firstName, lastName }` usa **object shorthand** — es equivalente a `{ firstName: firstName, lastName: lastName }`.
- El output muestra `Promise { { firstName: 'Bob', lastName: 'Dylan' } }` porque `console.log` imprime la Promise y su valor interno de forma sincrona, antes de que se ejecute ningun `.then`.

### Output
```
Promise { { firstName: 'Bob', lastName: 'Dylan' } }
```

---

## Task 5 — Reject the promises
### Que hace
Recibe un string (`fileName`) y retorna una Promesa que es rechazada inmediatamente.  
El motivo del rechazo es un objeto `Error` con el mensaje especificando que el archivo no puede ser procesado.

### Por que
Practica la creación explícita de promesas en estado de rechazo (rejected) utilizando el método estático `Promise.reject()`.  
Además, refuerza la buena práctica de rechazar promesas lanzando instancias del objeto estándar `Error` de JavaScript en lugar de usar strings simples, lo cual es crucial para el manejo adecuado de excepciones (stack traces).

### Main
```JavaScript
import uploadPhoto from './5-photo-reject';

console.log(uploadPhoto('guillaume.jpg'));
```
### Codigo
```JavaScript
export default function uploadPhoto(fileName) {
  return Promise.reject(new Error(`${fileName} cannot be processed`));
}
```
### Test
```Bash
npm run dev 5-main.js
```
### Logica
- La función recibe el parámetro `fileName` (un string).

- Se utiliza `Promise.reject()` para crear y retornar directamente una Promesa que ya se resolvió negativamente.

- Dentro del `reject`, se instancia un nuevo error utilizando `new Error()`.

- Se utilizan los template literals (las comillas invertidas) para interpolar dinámicamente el valor de la variable fileName dentro del mensaje del error: `${fileName}` cannot be processed.

#### Output
```
Promise {
  <rejected> Error: guillaume.jpg cannot be processed
  ..
    ..
}
```

---

## Task 6 — Handle multiple promises
### Que hace
Recibe tres strings (firstName, lastName y fileName).  
Llama a dos funciones asíncronas (signUpUser y uploadPhoto) y retorna una promesa que resuelve en un array.  
Este array contiene un objeto por cada promesa, detallando su estado (status) y el valor o error (value).

### Por que
Practica el uso de Promise.allSettled().  
A diferencia de Promise.all() (que falla inmediatamente si una sola promesa del grupo es rechazada), allSettled espera a que todas las promesas terminen su ejecución, sin importar si tuvieron éxito o fallaron.  
Esto es ideal cuando necesitas ejecutar múltiples operaciones independientes y necesitas recopilar el resultado final de todas ellas.

### Main

```JavaScript
import handleProfileSignup from './6-final-user';

console.log(handleProfileSignup("Bob", "Dylan", "bob_dylan.jpg"));
```
### Codigo
```JavaScript
import signUpUser from './4-user-promise';
import uploadPhoto from './5-photo-reject';

export default function handleProfileSignup(firstName, lastName, fileName) {
  return Promise.allSettled([
    signUpUser(firstName, lastName),
    uploadPhoto(fileName),
  ]).then((results) =>
    results.map((result) => ({
      status: result.status,
      value: result.status === 'fulfilled' ? result.value : String(result.reason),
    }))
  );
}
```
### Test
```Bash
npm run dev 6-main.js
```
### Logica
- Se importan las funciones de los tasks anteriores.  

- Se llama a Promise.allSettled() pasándole un array con la invocación de las dos promesas: signUpUser(firstName, lastName) y uploadPhoto(fileName).  

  + Cuando ambas promesas finalizan, allSettled entrega un array de objetos.

- Si una promesa fue exitosa, el objeto es: { status: 'fulfilled', value: <resultado> }.

- Si fue rechazada, el objeto es: { status: 'rejected', reason: <error> }.

- Como el enunciado exige que la estructura de salida siempre tenga la clave value (incluso para los errores), encadenamos un .then() con un .map().

- En el .map(), verificamos el estado.  
  + Si fue fulfilled, asignamos result.value a value. 
  + Si fue rejected, asignamos String(result.reason) a value (convertir a string asegura que el mensaje del objeto Error se almacene correctamente como texto).

### Output
```
Promise { <pending> }
```
**Nota sobre el output**: En la terminal verás Promise { <pending> } porque el console.log() en tu 6-main.js se ejecuta de forma síncrona, imprimiendo la Promesa antes de que tenga tiempo de resolverse.  
Si usaras un .then() en el main.js o un await, verías el array resultante completo.

---

## Task 7 — Load balancer
### Que hace
Recibe dos promesas (chinaDownload y USDownload) y retorna el valor de la promesa que se resuelva primero.


### Por que
Practica el uso del método estático Promise.race().  
Este método es ideal cuando tienes múltiples operaciones asíncronas compitiendo y solo te interesa el resultado de la primera que termine (por ejemplo, hacer un ping a varios servidores y quedarse con la respuesta del más rápido, actuando como un "balanceador de carga" rudimentario).


### Main
```JavaScript
import loadBalancer from "./7-load_balancer";

const ukSuccess = 'Downloading from UK is faster';
const frSuccess = 'Downloading from FR is faster';

const promiseUK = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, ukSuccess);
});

const promiseUKSlow = new Promise(function(resolve, reject) {
    setTimeout(resolve, 400, ukSuccess);
});

const promiseFR = new Promise(function(resolve, reject) {
    setTimeout(resolve, 200, frSuccess);
});

const test = async () => {
    console.log(await loadBalancer(promiseUK, promiseFR));
    console.log(await loadBalancer(promiseUKSlow, promiseFR));
}

test();
```
### Codigo
```JavaScript
export default function loadBalancer(chinaDownload, USDownload) {
  return Promise.race([chinaDownload, USDownload]);
}
```
### Test
```Bash
npm run dev 7-main.js
```
### Logica
Promise.race() recibe un array (o cualquier iterable) de promesas.  

La función retorna una nueva promesa que se resuelve o se rechaza tan pronto como una de las promesas del array se resuelva o se rechace, adoptando el valor o el motivo de esa primera promesa.  

En el main, al comparar promiseUK (100ms) contra promiseFR (200ms), gana UK. Al comparar promiseUKSlow (400ms) contra promiseFR (200ms), gana FR.


#### Output
```
Downloading from UK is faster
Downloading from FR is faster
```

---

## Task 8 — Throw an error
### Que hace
Recibe un numerador y un denominador. Si el denominador es 0, lanza un error personalizado. De lo contrario, retorna el resultado de la división.


### Por que
Practica el lanzamiento manual de excepciones utilizando la palabra clave throw y el constructor estándar Error. Es un concepto fundamental para proteger el código contra cálculos imposibles o estados inválidos antes de que ocurran fallos en cadena o se retornen valores como Infinity o NaN.


### Main
```JavaScript
import divideFunction from './8-try';

console.log(divideFunction(10, 2));
console.log(divideFunction(10, 0));
```
### Codigo
```JavaScript
export default function divideFunction(numerator, denominator) {
  if (denominator === 0) {
    throw new Error('cannot divide by 0');
  }
  return numerator / denominator;
}
```
### Test
```Bash
npm run dev 8-main.js
```
### Logica
Se utiliza una estructura condicional if para verificar si denominator es exactamente igual a 0.

Si es 0, se detiene la ejecución normal de la función y se lanza el error usando throw new Error('mensaje').

Si no es 0, la ejecución continúa normalmente y se retorna el resultado de la división numerator / denominator.


#### Output
```
5
..../8-try.js:15
  throw Error('cannot divide by 0');
  ^
.....
```

---

## Task 9 — Throw error / try catch
### Que hace
Recibe una función (mathFunction), ejecuta esa función de manera segura capturando cualquier error, y almacena el resultado o el mensaje de error en un array llamado queue. Finalmente, siempre añade el mensaje 'Guardrail was processed' al array antes de retornarlo.

### Por que
Practica la estructura completa de manejo de errores en JavaScript: try...catch...finally. Sirve para garantizar que, incluso si una parte del código falla estrepitosamente (como dividir por 0), el programa no se detenga por completo y pueda registrar el error (en el catch) y realizar tareas de limpieza o confirmación (en el finally).

### Main
```JavaScript
import guardrail from './9-try';
import divideFunction from './8-try';

console.log(guardrail(() => { return divideFunction(10, 2)}));
console.log(guardrail(() => { return divideFunction(10, 0)}));
```
### Codigo
```JavaScript
export default function guardrail(mathFunction) {
  const queue = [];
  try {
    queue.push(mathFunction());
  } catch (error) {
    queue.push(String(error));
  } finally {
    queue.push('Guardrail was processed');
  }
  return queue;
}
```
### Test
```Bash
npm run dev 9-main.js
```
### Logica
Se inicializa el array vacío queue = [].

En el bloque try, se intenta ejecutar la función mathFunction(). Si tiene éxito (como al dividir 10 entre 2), su valor de retorno (5) se añade al final de queue.

Si mathFunction() lanza un error (como sucede al dividir entre 0 en la segunda prueba), el bloque try se detiene inmediatamente y el control pasa al bloque catch. Se captura el error y se añade al array convertido a string usando String(error).

El bloque finally se ejecuta siempre, sin importar si el bloque try tuvo éxito o si saltó al catch. Aquí se añade el mensaje 'Guardrail was processed'.

Por último, la función retorna el array completo.

#### Output
```
[ 5, 'Guardrail was processed' ]
[ 'Error: cannot divide by 0', 'Guardrail was processed' ]
```

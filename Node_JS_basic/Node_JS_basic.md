# Node JS Basic

## Learning Objectives

---

### Ejecutar JavaScript con NodeJS

Node.js es un entorno (environment) runtime de JavaScript **open-source y multiplataforma** que ejecuta el motor V8 de Chrome fuera del navegador. Esto permite usar JavaScript en el servidor.

**Caracteristicas clave:**
- Corre en un **proceso unico** — no crea un hilo nuevo por cada peticion.
- Usa un modelo **asincrono y no bloqueante**: cuando una operacion de I/O (red, base de datos, archivos) esta pendiente, Node no se bloquea — continua ejecutando otro codigo y retoma cuando llega la respuesta.
- Este modelo permite que un solo servidor maneje **miles de conexiones simultaneas** con muy poco overhead.
- Permite que los desarrolladores frontend usen el mismo lenguaje en el backend.

```bash
# Ejecutar un archivo basico
node 0-main.js

# Para archivos que usan sintaxis ES6 (import/export), se usa Babel
npm run dev <archivo>
```

---

### Modulos en NodeJS

Node.js usa el sistema de modulos **CommonJS** por defecto. Cada archivo es un modulo independiente.

```javascript
// --- archivo: mi-modulo.js ---

// Definimos la funcion normalmente
function saludar(nombre) {
  console.log(`Hola ${nombre}`);
}

// module.exports asigna lo que este archivo "exporta" al exterior.
// Otros archivos que hagan require() de este archivo recibiran exactamente este valor.
module.exports = saludar;


// --- archivo: main.js ---

// require() carga el modulo y retorna lo que ese archivo exporto con module.exports.
// El './' indica que es un archivo local (no un modulo de npm).
const saludar = require('./mi-modulo');

saludar('Julian'); // imprime: Hola Julian
```

**Diferencia con ES6 modules:**

| CommonJS (Node) | ES6 Modules |
|-----------------|-------------|
| `module.exports = fn` | `export default fn` |
| `const fn = require('./file')` | `import fn from './file'` |
| Sincrono | Asincrono |
| No necesita Babel en Node | Necesita Babel o `"type": "module"` |

---

### Leer archivos con el modulo `fs`

El modulo `fs` (filesystem) viene incluido en Node.js y permite leer, escribir y manipular archivos.

```javascript
// 'fs' es un modulo nativo de Node — no necesita instalarse con npm
const fs = require('fs');

// readFileSync bloquea el hilo hasta que el archivo termina de leerse.
// Devuelve el contenido directamente como valor de retorno.
// 'utf8' indica que queremos el contenido como texto (string), no como Buffer (bytes).
const contenido = fs.readFileSync('archivo.txt', 'utf8');
console.log(contenido);

// readFile NO bloquea el hilo — Node sigue ejecutando otro codigo mientras espera.
// Cuando el archivo termina de leerse, Node llama al callback con dos argumentos:
//   err  — null si todo salio bien, un objeto Error si algo fallo
//   data — el contenido del archivo (string si se paso 'utf8', Buffer si no)
fs.readFile('archivo.txt', 'utf8', (err, data) => {
  // Siempre se chequea el error primero — patron estandar de Node ("error-first callback")
  if (err) throw err;
  console.log(data);
});
```

---

### Acceder a argumentos y variables de entorno con `process`

`process` es un objeto global disponible en cualquier archivo Node sin necesidad de importarlo.

```javascript
// process.argv es un array con todos los tokens escritos en la terminal.
// Indice 0: la ruta al ejecutable de node
// Indice 1: la ruta al archivo que se esta corriendo
// Indice 2 en adelante: los argumentos que paso el usuario
// node script.js arg1 arg2
console.log(process.argv);
// ['node', '/path/script.js', 'arg1', 'arg2']

// Para leer el primer argumento del usuario se usa el indice 2
const arg1 = process.argv[2]; // 'arg1'

// process.env es un objeto con todas las variables de entorno del sistema operativo.
// Se leen como propiedades del objeto — si la variable no existe, devuelve undefined.
console.log(process.env.HOME);   // '/home/juliangf94'  (definida por el sistema)
console.log(process.env.PORT);   // undefined si no se definio antes de correr el script
// Para definir una variable antes de correr: PORT=3000 node script.js
```

---

### `process.stdout` y `process.stdin` — Entrada y salida estandar

Node expone los tres canales estandar del sistema operativo como streams dentro del objeto `process`:

| Canal | Descripcion | Direccion |
|-------|-------------|-----------|
| `process.stdin`  | Entrada estandar — lo que el usuario escribe o lo que llega por pipe | Readable |
| `process.stdout` | Salida estandar — lo que se imprime en la terminal | Writable |
| `process.stderr` | Salida de errores — separada de stdout para no mezclar output normal con errores | Writable |

**`process.stdout` — escribir en la terminal:**

```javascript
// console.log() usa process.stdout internamente, pero agrega \n automaticamente
// y no permite control exacto del formato
console.log('hola');              // imprime: hola\n

// process.stdout.write() imprime exactamente lo que se le pasa — sin \n extra
process.stdout.write('hola');     // imprime: hola   (sin salto de linea)
process.stdout.write('hola\n');   // imprime: hola\n (con salto de linea explicito)

// Util cuando se quiere construir la salida caracter a caracter o sin saltos automaticos
```

**`process.stdin` — leer input del usuario o de un pipe:**

```javascript
// process.stdin emite eventos porque es un Readable Stream
// El evento 'data' se dispara cada vez que llega un chunk de texto:
//   - En modo interactivo: cuando el usuario presiona Enter
//   - En modo pipe (echo "texto" | node script.js): con el contenido del pipe
process.stdin.on('data', (data) => {
  // data llega como Buffer (bytes) — .toString() lo convierte a string legible
  // .trim() elimina el \n que agrega Enter al final
  const input = data.toString().trim();
  process.stdout.write(`Recibido: ${input}\n`);
});

// El evento 'close' se dispara cuando stdin se cierra:
//   - Fin de pipe (el pipe termino de enviar datos)
//   - Ctrl+D en la terminal (EOF manual)
//   - NO se dispara con Ctrl+C (eso mata el proceso sin pasar por aqui)
process.stdin.on('close', () => {
  process.stdout.write('stdin cerrado\n');
});
```

**Diferencia clave entre `console.log` y `process.stdout.write`:**

| | `console.log(x)` | `process.stdout.write(x)` |
|---|---|---|
| Salto de linea | Automatico (`\n` al final) | Solo si se incluye en el string |
| Tipo aceptado | Cualquier cosa (objetos, arrays) | Solo strings o Buffers |
| Uso tipico | Debugging, logs generales | Output con formato exacto |

---

### Servidor HTTP con Node JS nativo

El modulo `http` permite crear un servidor sin frameworks externos.

```javascript
// 'http' es un modulo nativo de Node — no necesita instalarse con npm
const http = require('http');

// createServer recibe un callback que se ejecuta cada vez que llega una peticion.
// req (IncomingMessage) — contiene toda la informacion de la peticion: URL, metodo, headers, body
// res (ServerResponse)  — objeto que usamos para construir y enviar la respuesta
const server = http.createServer((req, res) => {
  // statusCode define el codigo HTTP de la respuesta (200 = OK)
  res.statusCode = 200;
  // setHeader agrega un encabezado HTTP a la respuesta
  // 'Content-Type: text/plain' le dice al cliente que el cuerpo es texto plano
  res.setHeader('Content-Type', 'text/plain');
  // end() envia el cuerpo de la respuesta y cierra la conexion
  // Si no se llama a end(), el cliente quedara esperando indefinidamente
  res.end('Hello World\n');
});

// listen() pone el servidor a escuchar en el puerto indicado.
// El callback se ejecuta una sola vez cuando el servidor esta listo.
server.listen(1245, () => {
  console.log('Server running at http://localhost:1245/');
});
```

---

### Servidor HTTP con Express JS

Express simplifica la creacion de servidores con rutas y middleware.

```javascript
// express es un paquete de npm — debe instalarse con: npm install express
const express = require('express');

// express() crea la instancia principal de la aplicacion
// Sobre este objeto se registran rutas, middleware y configuracion
const app = express();

// app.get() registra un handler para peticiones GET a la ruta '/'
// Express parsea automaticamente la URL y llama al callback correcto
// req — peticion entrante, res — respuesta que vamos a enviar
app.get('/', (req, res) => {
  // res.send() detecta el tipo del argumento y ajusta el Content-Type automaticamente:
  // string → 'text/html', object → 'application/json'
  // Tambien llama a res.end() internamente — no hay que cerrarlo a mano
  res.send('Hello World');
});

// app.listen() funciona igual que server.listen() del modulo http nativo,
// pero internamente Express crea el servidor HTTP por nosotros
app.listen(1245, () => {
  console.log('Express server running');
});
```

**Diferencia clave con `http` nativo:** Express maneja automaticamente las rutas, los metodos HTTP y los codigos de estado. Con `http` hay que parsear la URL manualmente.

---

### Rutas avanzadas con Express

```javascript
// Los dos puntos (:) definen un segmento dinamico llamado "parametro de ruta".
// Si el cliente pide GET /students/CS, Express captura 'CS' como field.
app.get('/students/:field', (req, res) => {
  // req.params es un objeto con todos los parametros de ruta definidos con ':'
  // { field: 'CS' }  si la URL fue /students/CS
  const { field } = req.params;
  res.send(`Field: ${field}`);
});

// Se pueden registrar tantas rutas como se necesiten.
// Express las evalua en orden de registro — la primera que coincide gana.
app.get('/homepage', (req, res) => res.send('Homepage'));
app.get('/about', (req, res) => res.send('About'));
```

---

### Mocha — Framework de testing

Mocha es un framework de testing para Node.js que ejecuta los tests **en serie** (uno a la vez), lo que hace que los errores sean faciles de rastrear. Soporta callbacks, Promises y `async/await`.

**Estructura tipica de un test (interfaz BDD):**

```javascript
// assert es el modulo de aserciones nativo de Node — no requiere instalacion
const assert = require('assert');

// describe() agrupa tests que prueban la misma unidad o comportamiento.
// El string es solo una etiqueta descriptiva — aparece en el reporte de resultados.
describe('Array', function () {
  // it() define un test individual. El string describe lo que se espera que pase.
  it('should return -1 when value is not present', function () {
    // assert.equal() compara con == (igualdad no estricta)
    // Si los valores no son iguales, lanza un AssertionError y el test falla
    assert.equal([1, 2, 3].indexOf(4), -1);
    // indexOf devuelve -1 cuando el elemento no existe en el array
  });
});
```

**Hooks para setup y teardown:**

```javascript
describe('Suite', function () {
  // before: ideal para inicializar una conexion a base de datos o levantar un servidor
  before(function () { /* corre una vez antes de todos los tests */ });
  // after: ideal para cerrar conexiones o limpiar recursos al terminar
  after(function () { /* corre una vez despues de todos los tests */ });
  // beforeEach: ideal para resetear el estado antes de cada test (evita que un test afecte al siguiente)
  beforeEach(function () { /* corre antes de cada test */ });
  // afterEach: ideal para limpiar mocks, timers, o archivos temporales creados por cada test
  afterEach(function () { /* corre despues de cada test */ });

  it('test 1', function () { /* ... */ });
  it('test 2', function () { /* ... */ });
});
```

**Tests asincronos con async/await:**

```javascript
// async/await funciona en Mocha sin configuracion extra.
// Mocha detecta que el callback retorna una Promise y espera a que se resuelva.
// Si la Promise se rechaza, Mocha marca el test como fallido automaticamente.
it('fetches data', async function () {
  const data = await fetchSomething(); // pausa aqui hasta que la Promise resuelva
  assert.equal(data.status, 200);      // si status no es 200, el test falla
});
```

**Comandos utiles:**
- `.only` — corre solo ese test: `it.only('...', fn)`
- `.skip` — salta ese test: `it.skip('...', fn)`

---

### Nodemon

Nodemon es una herramienta de desarrollo que monitorea los archivos del proyecto y reinicia automaticamente la aplicacion Node.js cuando detecta un cambio. Reemplaza el comando `node` de forma transparente — no requiere cambios en el codigo.

**Instalacion:**
```bash
# Como dependencia local de desarrollo (recomendado)
npm install --save-dev nodemon
```

**Uso:**
```bash
# Sin nodemon — hay que reiniciar manualmente con cada cambio
node server.js

# Con nodemon — reinicia automaticamente al guardar
npm run dev server.js

# Reinicio manual sin guardar: escribe 'rs' + Enter en la terminal
```

**Flags utiles:**

| Flag | Descripcion |
|------|-------------|
| `-e js,json` | Vigilar solo estas extensiones |
| `--watch <dir>` | Limitar monitoreo a un directorio especifico |
| `--ignore <patron>` | Excluir archivos del monitoreo |
| `--delay <ms>` | Esperar X milisegundos antes de reiniciar |
| `--exec <cmd>` | Usar otro ejecutable en lugar de `node` |

**Configuracion persistente** — agregar en `package.json`:
```json
{
  "nodemonConfig": {
    "ignore": ["test/*"],
    "delay": 1000
  }
}
```

---

## Task 0 — Executing basic javascript with Node JS

### Que hace
Crea una funcion `displayMessage` que imprime un string en `STDOUT` (la consola).

### Por que
Es el punto de entrada al proyecto — muestra como exportar una funcion con `module.exports` y como ejecutar un archivo con `node` directamente, sin Babel.

### Main
```javascript
const displayMessage = require('./0-console');

displayMessage('Hello NodeJS!');
```

### Codigo
```javascript
// El parametro 'string' recibe el valor que se pase al llamar la funcion
function displayMessage(string) {
  // console.log imprime el valor en STDOUT seguido de un salto de linea (\n)
  // STDOUT es la salida estandar — lo que aparece en la terminal al correr el script
  console.log(string);
}

// module.exports expone la funcion para que otros archivos la puedan importar con require()
// Sin esta linea, el archivo no exporta nada y require() devolveria un objeto vacio {}
module.exports = displayMessage;
```

### Test
```bash
node 0-main.js
```

### Logica
- `console.log(string)` imprime el argumento en `STDOUT` seguido de un salto de linea.
- `module.exports = displayMessage` exporta la funcion para que otros archivos puedan importarla con `require('./0-console')`.
- Este proyecto usa **CommonJS** (`module.exports` / `require`) en lugar de ES6 modules (`export` / `import`) porque es la sintaxis nativa de Node.js sin necesidad de Babel.

### Output
```
Hello NodeJS!
```

---

## Task 1 — Using Process stdin

### Que hace
Lee el nombre del usuario desde `STDIN` y lo imprime. Cuando `stdin` se cierra (fin del input), muestra un mensaje de cierre.

### Por que
Demuestra como leer datos del usuario en la terminal usando `process.stdin` — el canal de entrada estandar de Node, equivalente al teclado o a un pipe en la linea de comandos.

### Codigo
```javascript
// process.stdout.write() imprime texto sin agregar \n automaticamente
// Se usa en lugar de console.log para tener control exacto del formato de salida
process.stdout.write('Welcome to Holberton School, what is your name?\n');

// process.stdin emite el evento 'data' cada vez que llega un chunk de texto.
// En modo interactivo: se emite cuando el usuario presiona Enter.
// En modo pipe (echo "John" | node 1-stdin.js): se emite con el contenido del pipe.
process.stdin.on('data', (data) => {
  // data es un Buffer — .toString() lo convierte a string, .trim() elimina el \n del Enter
  process.stdout.write(`Your name is: ${data.toString().trim()}\n`);
});

// El evento 'close' se dispara cuando stdin se cierra (fin del pipe o Ctrl+D).
// En modo interactivo con Ctrl+C (SIGINT), el proceso muere sin pasar por aqui.
// Por eso en el ejemplo interactivo no aparece este mensaje.
process.stdin.on('close', () => {
  process.stdout.write('This important software is now closing\n');
});
```

### Test
```bash
# Modo interactivo — el usuario escribe el nombre y presiona Enter
node 1-stdin.js

# Modo pipe — stdin se cierra automaticamente al terminar el pipe
echo "John" | node 1-stdin.js
```

### Logica
- `process.stdout.write()` imprime sin salto de linea automatico, a diferencia de `console.log()`.
- `process.stdin` es un readable stream. El evento `'data'` se dispara cuando llega input.
- El evento `'close'` solo se activa cuando stdin llega a EOF (fin de pipe o Ctrl+D), no con Ctrl+C.
- Por eso en el ejemplo interactivo no aparece el mensaje de cierre — el usuario termino con Ctrl+C.

### Output
```
# Modo interactivo
Welcome to Holberton School, what is your name?
Bob
Your name is: Bob

# Modo pipe
Welcome to Holberton School, what is your name?
Your name is: John
This important software is now closing
```

---

## Task 2 — Reading a file synchronously with Node JS

### Que hace
Lee el archivo `database.csv`, cuenta el total de estudiantes y los agrupa por campo (`CS`, `SWE`), imprimiendo el conteo y la lista de nombres de cada grupo.

### Por que
Demuestra como leer y parsear un archivo CSV de forma **sincrona** con `fs.readFileSync`, manejar errores con `try/catch`, y filtrar lineas vacias que el CSV puede tener al final.

### Main
```javascript
// 2-main_0.js — archivo no existe, debe lanzar error
const countStudents = require('./2-read_file');
countStudents("nope.csv");

// 2-main_1.js — archivo existe, imprime estadisticas
const countStudents = require('./2-read_file');
countStudents("database.csv");
```

### Codigo
```javascript
const fs = require('fs');

function countStudents(path) {
  try {
    // readFileSync bloquea hasta leer el archivo completo y retorna el contenido como string
    const data = fs.readFileSync(path, 'utf8');

    // split('\n') divide el string en un array de lineas
    // filter() elimina las lineas vacias — el CSV puede tener lineas en blanco al final
    const lines = data.split('\n').filter((line) => line.trim() !== '');

    // La primera linea es el encabezado (firstname,lastname,age,field) — se descarta con slice(1)
    const students = lines.slice(1);

    console.log(`Number of students: ${students.length}`);

    // Construir un objeto { CS: ['Johann', ...], SWE: ['Guillaume', ...] }
    const fields = {};
    students.forEach((student) => {
      const parts = student.split(','); // ['Johann', 'Kerbrou', '30', 'CS']
      const field = parts[3];           // cuarta columna = campo de estudio
      const firstname = parts[0];       // primera columna = nombre
      if (!fields[field]) fields[field] = [];
      fields[field].push(firstname);
    });

    // Iterar sobre cada campo e imprimir conteo y lista de nombres
    Object.keys(fields).forEach((field) => {
      console.log(`Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`);
    });
  } catch (e) {
    // Si readFileSync falla (archivo no existe, sin permisos, etc.), lanzamos nuestro propio error
    throw new Error('Cannot load the database');
  }
}

module.exports = countStudents;
```

### Test
```bash
node 2-main_0.js   # debe lanzar: Error: Cannot load the database
node 2-main_1.js   # debe imprimir conteos y listas
```

### Logica
- `fs.readFileSync` lanza una excepcion si el archivo no existe — el `try/catch` la captura y relanza con el mensaje requerido.
- `.split('\n').filter(line => line.trim() !== '')` elimina lineas vacias que pueden aparecer al final del CSV.
- `.slice(1)` descarta la primera linea (encabezado `firstname,lastname,age,field`).
- El objeto `fields` se construye dinamicamente — si aparece un campo nuevo en el CSV, se agrega solo.
- `Object.keys(fields)` devuelve un array con las claves del objeto (`['CS', 'SWE']`). Se usa para iterar sobre los campos sin saber de antemano cuantos hay ni como se llaman. El orden es el de insercion — el mismo orden en que se fueron encontrando en el CSV.

### Output
```
# node 2-main_0.js
Error: Cannot load the database

# node 2-main_1.js
Number of students: 10
Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
```

---

## Task 3 — Reading a file asynchronously with Node JS

### Que hace
Igual que Task 2 pero usando `fs.readFile` (asincrono). La funcion retorna una `Promise` que resuelve cuando termina de leer y procesar el CSV, o rechaza si el archivo no existe.

### Por que
Demuestra la diferencia clave entre lectura sincrona y asincrona: al ser no bloqueante, el codigo que esta despues de llamar a `countStudents()` se ejecuta **inmediatamente**, sin esperar a que el archivo termine de leerse. El output `After!` aparece antes que los datos de los estudiantes precisamente por esto.

### Main
```javascript
// 3-main_0.js — archivo no existe, la Promise se rechaza
const countStudents = require('./3-read_file_async');

countStudents("nope.csv")
    .then(() => { console.log("Done!"); })
    .catch((error) => { console.log(error); });

// 3-main_1.js — archivo existe, "After!" aparece antes porque la lectura es asincrona
const countStudents = require('./3-read_file_async');

countStudents("database.csv")
    .then(() => { console.log("Done!"); })
    .catch((error) => { console.log(error); });
console.log("After!");  // esto corre sincrono, antes de que el archivo termine de leerse
```

### Codigo
```javascript
const fs = require('fs');

function countStudents(path) {
  // new Promise() envuelve la operacion asincrona para que el llamador pueda usar .then()/.catch()
  return new Promise((resolve, reject) => {
    // fs.readFile NO bloquea — Node sigue ejecutando el resto del script mientras lee
    fs.readFile(path, 'utf8', (err, data) => {
      // El callback se ejecuta cuando Node termina de leer (o falla)
      if (err) {
        // reject() hace que la Promise falle — el .catch() del llamador lo recibe
        reject(new Error('Cannot load the database'));
        return;
      }
      const emptyLines = data.split('\n').filter((line) => line.trim() !== '');
      const students = emptyLines.slice(1);

      console.log(`Number of students: ${students.length}`);

      const fields = {};
      students.forEach((student) => {
        const parts = student.split(',');
        const field = parts[3];
        const firstname = parts[0];
        if (!fields[field]) fields[field] = [];
        fields[field].push(firstname);
      });

      Object.keys(fields).forEach((field) => {
        console.log(`Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`);
      });

      // resolve() indica que la Promise termino con exito — el .then() del llamador se ejecuta
      resolve();
    });
  });
}

module.exports = countStudents;
```

### Test
```bash
node 3-main_0.js   # debe imprimir: Error: Cannot load the database
node 3-main_1.js   # debe imprimir: After! primero, luego los datos, luego Done!
```

### Logica
- `new Promise((resolve, reject) => {...})` envuelve el callback asincrono de `fs.readFile` para exponerlo como Promise.
- `fs.readFile` no bloquea el hilo — `console.log("After!")` en el main corre sincrono antes de que el archivo termine de leerse.
- En el callback, si `err` existe se llama `reject(new Error(...))` y se hace `return` para no seguir ejecutando.
- Si todo sale bien, se procesan los datos exactamente igual que en Task 2, y al final se llama `resolve()` para que el `.then()` se dispare.
- La diferencia con Task 2: aqui no se usa `try/catch` — los errores llegan por el parametro `err` del callback.

### Diagrama — Flujo de ejecucion con Promise

**Flujo de `3-main_1.js`:**
```
node 3-main_1.js
│
├─► [SINCRONO] countStudents("database.csv") es llamada
│       │
│       └─► Crea y retorna una Promise (estado: PENDING)
│               │
│               └─► fs.readFile(...) le dice a Node: "lee este archivo, avisame cuando termines"
│                       │
│                       └─► Node delega la lectura al sistema operativo y CONTINUA
│
├─► [SINCRONO] console.log("After!")          ← imprime "After!" AHORA
│
│   ... Node espera eventos del event loop ...
│
└─► [ASINCRONO] El SO termina de leer el archivo, Node ejecuta el callback
        │
        ├─► err === null → todo bien
        ├─► procesa el CSV e imprime los datos de estudiantes
        └─► resolve() es llamado → Promise pasa de PENDING a FULFILLED
                │
                └─► .then(() => console.log("Done!"))  ← imprime "Done!" AL FINAL
```

**Los tres estados de una Promise:**
```
           reject(error)
PENDING ──────────────────► REJECTED  →  .catch() se ejecuta
   │
   └── resolve()
           │
           ▼
       FULFILLED  →  .then() se ejecuta
```

### Output
```
# node 3-main_0.js
Error: Cannot load the database

# node 3-main_1.js
After!
Number of students: 10
Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
Done!
```

---

## Task 4 — Create a small HTTP server using Node's HTTP module

### Que hace
Crea un servidor HTTP con el modulo nativo `http` que responde `Hello Holberton School!` como texto plano a cualquier URL en el puerto 1245.

### Por que
Demuestra como crear un servidor HTTP sin frameworks externos. Al no filtrar por URL (`req.url`), cualquier endpoint devuelve la misma respuesta.

### Codigo
```javascript
const http = require('http');

// http.createServer() crea el servidor — el callback se ejecuta en cada peticion entrante
// req: informacion de la peticion (URL, metodo, headers)
// res: objeto para construir y enviar la respuesta
const app = http.createServer((req, res) => {
  // statusCode 200 = OK
  res.statusCode = 200;
  // Content-Type: text/plain indica que el cuerpo es texto plano (no HTML ni JSON)
  res.setHeader('Content-Type', 'text/plain');
  // end() envia el cuerpo y cierra la conexion — obligatorio para que el cliente reciba la respuesta
  res.end('Hello Holberton School!\n');
});

// listen() pone el servidor a escuchar en el puerto 1245
// El servidor responde a CUALQUIER endpoint porque no hay logica de ruteo
app.listen(1245);

// app se exporta para que los tests puedan acceder al servidor sin levantarlo ellos mismos
module.exports = app;
```

### Test
```bash
# Terminal 1 — levantar el servidor
node 4-http.js

# Terminal 2 — probar diferentes endpoints
curl localhost:1245 && echo ""
curl localhost:1245/any_endpoint && echo ""
```

### Logica
- No se usa `req.url` para filtrar rutas — el mismo callback responde a cualquier peticion sin importar la URL.
- `res.end('Hello Holberton School!\n')` envia el cuerpo. Sin `end()`, el cliente queda esperando.
- `app` se asigna a la variable antes de exportarla con `module.exports = app` — el enunciado lo requiere explicitamente.
- No hay callback en `listen()` porque el enunciado no pide imprimir nada al iniciar.

### Output
```
# curl localhost:1245
Hello Holberton School!

# curl localhost:1245/any_endpoint
Hello Holberton School!
```

---

## Task 5 — Create a more complex HTTP server using Node's HTTP module

### Que hace
Extiende el servidor de Task 4 con dos rutas: `/` devuelve el saludo, `/students` lee el CSV de forma asincrona y devuelve la lista de estudiantes como cuerpo de la respuesta HTTP.

### Por que
Demuestra como combinar `http` nativo con `fs.readFile` asincrono dentro de un servidor: se usa `req.url` para rutear, y la respuesta se construye dentro del `.then()` de la Promise para esperar que el archivo termine de leerse antes de enviarla.

### Codigo
```javascript
const http = require('http');
const fs = require('fs');

// countStudents retorna una Promise que resuelve con el texto de la lista de estudiantes.
// A diferencia de Task 3, aqui construimos un string en lugar de usar console.log,
// porque necesitamos enviar el texto como cuerpo HTTP, no imprimirlo en la terminal.
function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }
      const emptyLines = data.split('\n').filter((line) => line.trim() !== '');
      const students = emptyLines.slice(1);

      // Construimos el output como string acumulado en lugar de console.log
      let output = `Number of students: ${students.length}\n`;

      const fields = {};
      students.forEach((student) => {
        const parts = student.split(',');
        const field = parts[3];
        const firstname = parts[0];
        if (!fields[field]) fields[field] = [];
        fields[field].push(firstname);
      });

      Object.keys(fields).forEach((field) => {
        output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
      });

      resolve(output); // resuelve con el string completo listo para enviar
    });
  });
}

const app = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/') {
    res.end('Hello Holberton School!\n');
  } else if (req.url === '/students') {
    // process.argv[2] es el path al CSV pasado como argumento: node 5-http.js database.csv
    countStudents(process.argv[2])
      .then((data) => {
        // res.end() solo puede llamarse una vez — concatenamos todo el cuerpo antes
        res.end(`This is the list of our students\n${data}`);
      })
      .catch((err) => {
        res.end(`This is the list of our students\n${err.message}\n`);
      });
  }
});

app.listen(1245);

module.exports = app;
```

### Test
```bash
# Terminal 1 — levantar el servidor con el CSV como argumento
node 5-http.js database.csv

# Terminal 2 — probar las rutas
curl localhost:1245 && echo ""
curl localhost:1245/students && echo ""
```

### Logica
- `req.url` contiene la ruta de la peticion (`'/'`, `'/students'`). Se usa para decidir que responder.
- `countStudents` se reimplementa aqui para construir un string en lugar de usar `console.log` — la respuesta HTTP necesita el texto como valor, no impreso en terminal.
- `resolve(output)` pasa el string al `.then()`, donde se concatena con el encabezado y se envia con `res.end()`.
- `process.argv[2]` lee el path del CSV del argumento de la linea de comandos (`node 5-http.js database.csv`).
- `res.end()` solo puede llamarse una vez por peticion — por eso se espera a que la Promise resuelva antes de llamarlo.

### Diagrama — Flujo de una peticion a `/students`

```
Cliente (curl)          Servidor Node                   Sistema de archivos
     │                       │                                  │
     │  GET /students         │                                  │
     │──────────────────────►│                                  │
     │                       │                                  │
     │                       ├─ req.url === '/students'         │
     │                       │                                  │
     │                       ├─ countStudents(process.argv[2])  │
     │                       │   └─ new Promise(...)            │
     │                       │       └─ fs.readFile(path) ─────►│
     │                       │                                  │
     │                  [Node sigue libre — no bloquea]         │
     │                       │                                  │
     │                       │◄─────────── callback(err, data) ─┤
     │                       │                                  │
     │                       ├─ parsea CSV, construye output    │
     │                       ├─ resolve(output)                 │
     │                       │   └─ .then(data =>               │
     │                       │       res.end("This is..." + data))
     │                       │                                  │
     │◄──────────────────────┤ HTTP 200 — cuerpo completo       │
     │                       │                                  │

     ── ruta / ──────────────────────────────────────────────────
     │  GET /                 │
     │──────────────────────►│
     │                       ├─ req.url === '/'
     │                       ├─ res.end('Hello Holberton School!\n')
     │◄──────────────────────┤ HTTP 200 — inmediato (sin I/O)
```

---

## Task 6 — Create a small HTTP server using Express

### Que hace
Crea el mismo servidor que Task 4 pero usando Express. Solo responde en `/` — cualquier otra ruta devuelve automaticamente un error 404 en HTML generado por Express.

### Por que
Muestra la diferencia clave entre `http` nativo y Express: con `http` hay que manejar manualmente todas las rutas (incluyendo las inexistentes); Express maneja el 404 por defecto sin codigo extra.

### Codigo
```javascript
const express = require('express');

// express() crea la instancia de la aplicacion
const app = express();

// app.get() registra un handler solo para GET /
// Express NO responde a otras rutas con este handler — las desconocidas devuelven 404 automaticamente
app.get('/', (req, res) => {
  // res.send() con un string envia Content-Type: text/html por defecto
  // Para texto plano se usa res.type('text').send(...) o simplemente res.send() que aqui es suficiente
  res.send('Hello Holberton School!');
});

app.listen(1245);

module.exports = app;
```

### Test
```bash
# Terminal 1
node 6-http_express.js

# Terminal 2
curl localhost:1245 && echo ""           # Hello Holberton School!
curl localhost:1245/any_endpoint && echo ""  # 404 HTML de Express
```

### Logica
- `app.get('/', ...)` solo captura `GET /`. Express no tiene handler para otras rutas, por lo que devuelve su pagina de error 404 en HTML automaticamente.
- A diferencia de Task 4, no se necesita `req.url` ni `res.statusCode` — Express los maneja internamente.
- `res.send('Hello Holberton School!')` no lleva `\n` porque Express agrega sus propios headers y el cliente (`curl`) recibe el texto correctamente igual.

### Diferencia con Task 4 (`http` nativo)

| | Task 4 (`http`) | Task 6 (Express) |
|---|---|---|
| Rutas desconocidas | Responde igual a todas | 404 automatico en HTML |
| Manejo de URL | Manual con `req.url` | Declarativo con `app.get()` |
| Content-Type | Se setea a mano | Express lo infiere |
| Lineas de codigo | Mas | Menos |

### Output
```
# curl localhost:1245
Hello Holberton School!

# curl localhost:1245/any_endpoint
<!DOCTYPE html>
<html lang="en">
...
<pre>Cannot GET /any_endpoint</pre>
...
</html>
```

### Output
```
# curl localhost:1245
Hello Holberton School!

# curl localhost:1245/any_endpoint
Cannot GET /any_endpoint  (404 automatico de Express)
```

---

## Task 7 — Create a more complex HTTP server using Express

### Que hace
Version Express del servidor de Task 5: dos rutas (`/` y `/students`) usando `app.get()` en lugar de `req.url` manual. Misma logica de lectura asincrona del CSV.

### Por que
Muestra como Express simplifica el ruteo — cada ruta es un handler independiente en lugar de un bloque `if/else` sobre `req.url`. La logica de negocio (`countStudents`) es identica a Task 5.

### Codigo
```javascript
const express = require('express');
const fs = require('fs');

// Misma funcion que Task 5 — construye el output como string para enviarlo via res.send()
function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }
      const emptyLines = data.split('\n').filter((line) => line.trim() !== '');
      const students = emptyLines.slice(1);
      let output = `Number of students: ${students.length}\n`;
      const fields = {};
      students.forEach((student) => {
        const parts = student.split(',');
        const field = parts[3];
        const firstname = parts[0];
        if (!fields[field]) fields[field] = [];
        fields[field].push(firstname);
      });
      Object.keys(fields).forEach((field) => {
        output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
      });
      resolve(output);
    });
  });
}

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

app.get('/students', (req, res) => {
  countStudents(process.argv[2])
    .then((data) => {
      // res.type('txt') establece Content-Type: text/plain antes de enviar
      res.type('txt').send(`This is the list of our students\n${data}`);
    })
    .catch((err) => {
      res.type('txt').send(`This is the list of our students\n${err.message}\n`);
    });
});

app.listen(1245);

module.exports = app;
```

### Test
```bash
# Terminal 1
node 7-http_express.js database.csv

# Terminal 2
curl localhost:1245 && echo ""
curl localhost:1245/students && echo ""
```

### Logica
- `app.get('/students', ...)` reemplaza el `else if (req.url === '/students')` de Task 5 — Express rutea automaticamente.
- `res.type('txt')` es el shorthand de Express para `Content-Type: text/plain` — necesario porque `res.send()` con un string largo podria inferir `text/html`.
- `res.type('txt').send(...)` es encadenado — `res.type()` retorna el mismo objeto `res`.
- La funcion `countStudents` es identica a Task 5 — la unica diferencia es como se envia la respuesta (`res.send` vs `res.end`).

### Diagrama — Flujo de una peticion a `/students`

```
Cliente (curl)          Express (app)              fs / disco
     │                       │                         │
     │  GET /students         │                         │
     │──────────────────────►│                         │
     │                       ├─ app.get('/students')   │
     │                       │   coincide              │
     │                       ├─ countStudents(argv[2]) │
     │                       │   └─ fs.readFile() ────►│
     │                       │                         │
     │                  [no bloquea]                   │
     │                       │                         │
     │                       │◄──── callback(err,data) ┤
     │                       │                         │
     │                       ├─ parsea CSV             │
     │                       ├─ resolve(output)        │
     │                       │   └─ .then(data =>      │
     │                       │   res.type('txt')       │
     │                       │   .send("This is..."))  │
     │◄──────────────────────┤ HTTP 200 text/plain     │

     ── ruta / ─────────────────────────────────────────
     │  GET /                 │
     │──────────────────────►│
     │                       ├─ app.get('/')
     │                       ├─ res.send('Hello...')
     │◄──────────────────────┤ HTTP 200 — inmediato

     ── ruta desconocida ───────────────────────────────
     │  GET /foo              │
     │──────────────────────►│
     │                       ├─ ningun handler coincide
     │                       ├─ Express genera 404 HTML
     │◄──────────────────────┤ HTTP 404 automatico
```

### Diferencia con Task 5 (`http` nativo)

| | Task 5 (`http`) | Task 7 (Express) |
|---|---|---|
| Ruteo | `if (req.url === '/students')` | `app.get('/students', ...)` |
| Respuesta | `res.end(texto)` | `res.type('txt').send(texto)` |
| Content-Type | `res.setHeader(...)` manual | `res.type('txt')` |
| Rutas desconocidas | Sin respuesta (conexion cuelga) | 404 automatico |

### Output
```
# curl localhost:1245
Hello Holberton School!

# curl localhost:1245/students
This is the list of our students
Number of students: 10
Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
```

---

## Task 8 — Organize a complex HTTP server using Express

### Que hace
Refactoriza el servidor en una estructura de directorios con capas separadas: utilidades, controladores, rutas y servidor. Usa ES6 (`import`/`export`) con Babel.

### Estructura
```
full_server/
├── utils.js                      # readDatabase — lee el CSV y retorna un objeto por campos
├── controllers/
│   ├── AppController.js          # getHomepage → GET /
│   └── StudentsController.js     # getAllStudents → GET /students
│                                 # getAllStudentsByMajor → GET /students/:major
├── routes/
│   └── index.js                  # conecta rutas con controladores
└── server.js                     # instancia Express, aplica rutas, escucha en 1245
```

### Por que
Un solo archivo con toda la logica no escala. La separacion en capas permite que cada archivo tenga una sola responsabilidad: las rutas solo conectan URLs con handlers, los controladores solo manejan requests/responses, y la utilidad solo lee datos.

---

### 8.1 — `full_server/utils.js`

```javascript
import fs from 'fs';

// readDatabase devuelve un objeto { CS: ['Johann', ...], SWE: ['Guillaume', ...] }
// A diferencia de countStudents en tasks anteriores, NO incluye el total — solo agrupa por campo
export function readDatabase(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        // Rechaza con el error original — el controlador decide que status enviar
        reject(err);
        return;
      }
      const lines = data.split('\n').filter((line) => line.trim() !== '');
      const students = lines.slice(1); // descarta el encabezado

      const fields = {};
      students.forEach((student) => {
        const parts = student.split(',');
        const field = parts[3];
        const firstname = parts[0];
        if (!fields[field]) fields[field] = [];
        fields[field].push(firstname);
      });

      resolve(fields); // { CS: [...], SWE: [...] }
    });
  });
}
```

---

### 8.2 — `full_server/controllers/AppController.js`

```javascript
export default class AppController {
  // Metodo estatico — se llama como AppController.getHomepage sin instanciar la clase
  static getHomepage(req, res) {
    res.status(200).send('Hello Holberton School!');
  }
}
```

---

### 8.3 — `full_server/controllers/StudentsController.js`

```javascript
import { readDatabase } from '../utils';

export default class StudentsController {
  static getAllStudents(req, res) {
    readDatabase(process.argv[2])
      .then((fields) => {
        // Ordena los campos alfabeticamente sin distinguir mayusculas/minusculas
        const sorted = Object.keys(fields).sort((a, b) =>
          a.toLowerCase().localeCompare(b.toLowerCase()));

        let output = 'This is the list of our students\n';
        sorted.forEach((field) => {
          output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
        });

        res.status(200).send(output);
      })
      .catch(() => res.status(500).send('Cannot load the database'));
  }

  static getAllStudentsByMajor(req, res) {
    const { major } = req.params;

    // Valida que el campo sea CS o SWE antes de leer el archivo
    if (major !== 'CS' && major !== 'SWE') {
      res.status(500).send('Major parameter must be CS or SWE');
      return;
    }

    readDatabase(process.argv[2])
      .then((fields) => {
        const students = fields[major] || [];
        res.status(200).send(`List: ${students.join(', ')}`);
      })
      .catch(() => res.status(500).send('Cannot load the database'));
  }
}
```

---

### 8.4 — `full_server/routes/index.js`

```javascript
import { Router } from 'express';
import AppController from '../controllers/AppController';
import StudentsController from '../controllers/StudentsController';

const router = Router();

// Cada ruta delega la logica al controlador — las rutas no hacen logica propia
router.get('/', AppController.getHomepage);
router.get('/students', StudentsController.getAllStudents);
router.get('/students/:major', StudentsController.getAllStudentsByMajor);

export default router;
```

---

### 8.5 — `full_server/server.js`

```javascript
import express from 'express';
import router from './routes/index';

const app = express();

// app.use('/') aplica el router a todas las rutas
app.use('/', router);

app.listen(1245);

// export default es ES6 — el enunciado lo requiere explicitamente
export default app;
```

---

### 8.6 — `.babelrc` y `package.json`

**.babelrc** — configura Babel para transpilar ES6 al nivel de Node actual:
```json
{
  "presets": [["babel-preset-env", { "targets": { "node": "current" } }]]
}
```

**package.json** — script `dev` actualizado:
```json
"dev": "nodemon --exec babel-node --presets babel-preset-env ./full_server/server.js ./database.csv"
```

---

### Test
```bash
# Terminal 1
npm run dev

# Terminal 2
curl localhost:1245 && echo ""
curl localhost:1245/students && echo ""
curl localhost:1245/students/SWE && echo ""
curl localhost:1245/students/French && echo ""   # 500
```

### Logica
- `readDatabase` retorna `{ CS: [...], SWE: [...] }` — el objeto se comparte entre ambos controladores.
- `process.argv[2]` se evalua en el momento de cada peticion, no al arrancar — esto permite que los tests pasen un archivo diferente en runtime.
- `Object.keys(fields).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))` ordena los campos alfabeticamente sin importar mayusculas.
- La validacion de `major` ocurre antes de leer el archivo — si el parametro es invalido, se responde de inmediato sin I/O innecesario.
- `export default app` (ES6) en lugar de `module.exports = app` (CommonJS) porque este servidor usa Babel.

### Diagrama — Capas del servidor

```
npm run dev
    │
    └─► babel-node transpila ES6 → CommonJS en memoria
            │
            └─► server.js
                    │
                    ├─► import router from './routes/index'
                    │           │
                    │           ├─► import AppController
                    │           └─► import StudentsController
                    │                       │
                    │                       └─► import readDatabase from '../utils'
                    │
                    └─► app.use('/', router)
                                │
                    ┌───────────┼──────────────────────┐
                    │           │                      │
               GET /      GET /students     GET /students/:major
                    │           │                      │
             AppController  StudentsController   StudentsController
             .getHomepage   .getAllStudents      .getAllStudentsByMajor
                    │           │                      │
                 200 OK    readDatabase()        valida major
                                │                readDatabase()
                             200 OK              200 / 500
```

### Output
```
# curl localhost:1245
Hello Holberton School!

# curl localhost:1245/students
This is the list of our students
Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy

# curl localhost:1245/students/SWE
List: Guillaume, Joseph, Paul, Tommy

# curl localhost:1245/students/French
Major parameter must be CS or SWE  (HTTP 500)
```

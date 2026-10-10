# Landing Pilar Tecno – Biblioteca de libros (front)

Material didáctico de **Pilar Tecno** (módulo React, Clase 7). Es el front de una
biblioteca: lista libros, permite buscarlos, agregarlos, editarlos, eliminarlos
y marcarlos como prestados o devueltos.

## Cómo se conecta todo

```
Este front (React + Vite)  →  API (Node + Express, puerto 3000)  →  MongoDB Atlas
   localhost:5173               localhost:3000/libros                 base en la nube
```

- El front **no habla directo con la base de datos**: usa `axios` para llamar a la API
  (ver [src/services/recursoService.ts](src/services/recursoService.ts)).
- La API (repo `api-libros`) es la que se conecta a **MongoDB Atlas** con la variable
  de entorno `MONGO_URI`.
- Por eso, **primero hay que levantar la API** y después el front.

## Requisitos

- [Node.js](https://nodejs.org) 20 o superior (incluye `npm`)
- La API `api-libros` corriendo en `http://localhost:3000`
- Un cluster de MongoDB Atlas y su cadena de conexión (la usa la API, no el front)

## Instalar y correr

### 1. La API (en su propia carpeta)

```bash
cd api-libros
npm install
```

Crear un archivo `.env` con la cadena de conexión de Atlas:

```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/biblioteca
```

```bash
npm run dev
```

Si todo va bien se ve `Conexión exitosa a MongoDB Atlas` en la consola.

### 2. El front (esta carpeta)

```bash
npm install
npm run dev
```

Abrir la URL que muestra la terminal (normalmente http://localhost:5173).

### Otros comandos

| Comando           | Qué hace                                      |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en vivo    |
| `npm run build`   | Chequea tipos con TypeScript y genera `dist/` |
| `npm run preview` | Sirve el build para probarlo                  |
| `npm run lint`    | Revisa el código con Oxlint                   |

## Dependencias: qué es cada una

| Paquete                        | Para qué se usa                                                   |
| ------------------------------ | ----------------------------------------------------------------- |
| `react`, `react-dom`           | La librería para armar la interfaz con componentes                |
| `react-router-dom`             | Navegación entre páginas (inicio y libros) sin recargar           |
| `axios`                        | Hacer pedidos HTTP a la API (GET, POST, PUT, DELETE)              |
| `bootstrap`, `react-bootstrap` | Estilos y componentes ya hechos (botones, modales, grilla, forms) |
| `bootstrap-icons`              | Íconos (`<i className="bi bi-search">`)                           |
| `formik`                       | Manejar formularios (valores, envío, errores)                     |
| `yup`                          | Validar los datos del formulario con un esquema                   |
| `vite`                         | Herramienta que levanta y empaqueta el proyecto                   |
| `typescript`                   | JavaScript con tipos, para detectar errores antes de ejecutar     |
| `oxlint`                       | Linter: avisa de errores y malas prácticas                        |

## Estructura del proyecto

```
src/
├── components/      Un componente por carpeta (tsx + css propio)
│   ├── BarraNavegacion/
│   ├── BotonColor/
│   ├── FiltrosLibros/    Buscador con debounce (usa useEffect)
│   ├── ListaLibros/      Carga y muestra los libros (usa useEffect)
│   ├── ModalLibro/       Formulario de alta y edición
│   ├── TarjetaAgregar/
│   └── TarjetaLibro/
├── pages/           Pantallas completas (PaginaInicio, PaginaLibros)
├── services/        Llamadas a la API (recursoService.ts)
├── types/           Tipos de TypeScript (Recurso)
└── App.tsx          Rutas de la aplicación
```

La idea de **una carpeta por componente** es que cada uno tenga junto todo lo suyo
(código y estilos), así es fácil de encontrar, mover o borrar.

## Qué se enseña en esta clase: `useEffect`

`useEffect` sirve para ejecutar código **después de que React dibuja el componente**:
pedir datos a una API, usar temporizadores, suscribirse a eventos. Son "efectos
secundarios": cosas que no son solo calcular qué mostrar.

```tsx
useEffect(() => {
  // código a ejecutar
  return () => {
    // (opcional) limpieza
  };
}, [dependencias]);
```

El **array de dependencias** decide cuándo se vuelve a ejecutar:

| Dependencias | Cuándo corre el efecto                           |
| ------------ | ------------------------------------------------ |
| `[]`         | Una sola vez, al montar el componente            |
| `[texto]`    | Al montar y cada vez que cambia `texto`          |
| sin array    | Después de **cada** render (casi siempre evitar) |

### Ejemplo 1: cargar datos al montar

En [ListaLibros.tsx](src/components/ListaLibros/ListaLibros.tsx) se piden los libros a la
API una sola vez, cuando aparece el componente:

```tsx
useEffect(() => {
  obtenerRecursos()
    .then((libros) => setDatos(libros))
    .catch(() => setError("No se pudieron cargar los libros"))
    .finally(() => setCargando(false));
}, []); // [] = solo al montar
```

Pasos: React dibuja la lista vacía y el cartel de "cargando" → el efecto pide los
datos → al llegar, `setDatos` provoca un nuevo render con los libros.

### Ejemplo 2: debounce con función de limpieza

En [FiltrosLibros.tsx](src/components/FiltrosLibros/FiltrosLibros.tsx) no se busca en
cada tecla, sino cuando el usuario **deja de escribir 400 ms**:

```tsx
useEffect(() => {
  const temporizador = setTimeout(() => {
    onBuscar({ texto, categoria, estado });
  }, 400);

  return () => clearTimeout(temporizador); // limpieza
}, [texto, categoria, estado]);
```

La **función de limpieza** (el `return`) corre antes de volver a ejecutar el efecto: si
el usuario escribe otra letra, se cancela el temporizador anterior y se arma uno nuevo.
Así se evitan decenas de pedidos innecesarios a la API.

## Errores comunes

- **"No se pudieron cargar los libros"**: la API no está corriendo o no conecta con
  Atlas. Revisar la consola de la API y el `MONGO_URI`.
- **Atlas rechaza la conexión**: agregar tu IP en _Network Access_ del cluster.
- **Cambió el puerto de la API**: actualizar `BASE_URL` en
  [src/services/recursoService.ts](src/services/recursoService.ts).

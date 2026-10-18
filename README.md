# Laboratorio-de-Tecnologias
En este repositorio se encuentra un proyecto web full stack. Se utilizaron HTML5, CSS, Node,js, React, entre otros.  

# Guía de organización de componentes del frontend

El frontend utiliza React y se organiza principalmente **por funcionalidades del negocio**. La landing y el gestor forman parte de una misma aplicación.

La distinción entre pantallas públicas y privadas se resuelve mediante React Router, layouts y control de acceso. No se deben crear dos estructuras paralelas llamadas `landing` y `gestor`.

## Estructura general

```text
src/
├── features/
│   ├── home/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── index.js
│   ├── auth/
│   ├── clientes/
│   ├── vehiculos/
│   ├── turnos/
│   ├── fichas/
│   ├── presupuestos/
│   └── ordenes-trabajo/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── layout/
│   └── utils/
│
├── App.jsx
├── router.jsx
├── main.jsx
└── index.css
```

No es necesario crear todas estas carpetas desde el inicio. Cada carpeta debe agregarse cuando aparezca una necesidad concreta.

## `features`

Una `feature` representa una funcionalidad o área del negocio.

Ejemplos del sistema:

- `home`: contenido de la landing.
- `auth`: inicio de sesión y control de acceso.
- `clientes`: gestión de clientes.
- `vehiculos`: gestión de vehículos.
- `turnos`: agenda y turnos.
- `fichas`: fichas de ingreso y egreso.
- `presupuestos`: creación y gestión de presupuestos.
- `ordenes-trabajo`: seguimiento de trabajos realizados.

Cada feature puede tener su propia estructura:

```text
features/
└── turnos/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/
    ├── data/
    └── index.js
```

## `features/[feature]/components`

Contiene componentes que pertenecen exclusivamente a una funcionalidad.

Ejemplo para la landing:

```text
features/
└── home/
    └── components/
        ├── HeroSection/
        │   ├── HeroSection.jsx
        │   └── HeroSection.css
        ├── ServicesSection/
        │   ├── ServicesSection.jsx
        │   └── ServicesSection.css
        ├── ServiceCard/
        │   ├── ServiceCard.jsx
        │   └── ServiceCard.css
        ├── FaqSection/
        │   ├── FaqSection.jsx
        │   └── FaqSection.css
        └── FaqItem/
            └── FaqItem.jsx
```

Estos componentes no se colocan en `shared` porque conocen conceptos específicos de la landing.

Otros ejemplos:

```text
features/clientes/components/ClienteForm.jsx
features/clientes/components/ClientesTable.jsx

features/turnos/components/TurnoForm.jsx
features/turnos/components/TurnoCard.jsx

features/presupuestos/components/PresupuestoDetalle.jsx
```

Aunque dos componentes sean visualmente parecidos, deben permanecer dentro de su feature si trabajan con conceptos diferentes del negocio.

## `features/[feature]/pages`

Contiene pantallas completas asociadas con una ruta.

Una página organiza los componentes de su funcionalidad, pero debería evitar contener todos los detalles de implementación.

Ejemplo:

```jsx
function LandingPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FaqSection />
      <ContactSection />
      <LocationSection />
    </>
  );
}
```

Ejemplos de páginas:

```text
features/home/pages/LandingPage.jsx
features/auth/pages/LoginPage.jsx
features/clientes/pages/ClientesPage.jsx
features/clientes/pages/ClienteDetailPage.jsx
features/turnos/pages/TurnosPage.jsx
```

Una página puede:

- Obtener información mediante hooks.
- Controlar el estado general de la pantalla.
- Organizar varios componentes.
- Leer parámetros de la URL.
- Ejecutar acciones principales de navegación.

## `features/[feature]/data`

Contiene información estática utilizada por una funcionalidad.

Ejemplo:

```text
features/home/data/services.js
features/home/data/faqs.js
```

```js
export const services = [
  {
    id: 1,
    title: "Electricidad",
    icon: "⚡",
  },
  {
    id: 2,
    title: "Cambio de aceite",
    icon: "🛢️",
  },
];
```

Esta carpeta no debe utilizarse para realizar llamadas al backend. Cuando los datos provengan del servidor, esas operaciones deben colocarse en `services`.

## `features/[feature]/services`

Contiene las funciones encargadas de comunicarse con el backend.

Ejemplo:

```text
features/turnos/services/turnosService.js
```

```js
export async function getTurnos() {
  const response = await fetch("/api/turnos");

  if (!response.ok) {
    throw new Error("No se pudieron obtener los turnos");
  }

  return response.json();
}
```

Los componentes no deberían repetir llamadas con `fetch`. La comunicación con el backend debe centralizarse en los servicios de la feature correspondiente.

## `features/[feature]/hooks`

Contiene lógica reutilizable dentro de una funcionalidad.

Ejemplo:

```text
features/turnos/hooks/useTurnos.js
```

Un hook puede encargarse de:

- Cargar datos.
- Manejar estados de carga y error.
- Aplicar filtros.
- Gestionar formularios.
- Encapsular lógica que utilizan varios componentes de la misma feature.

Si el hook solo se utiliza en `turnos`, permanece dentro de `features/turnos/hooks`. Si se utiliza sin modificaciones en varias funcionalidades, puede moverse a `shared/hooks`.

## `shared/components`

Contiene componentes visuales genéricos que pueden utilizarse en varias funcionalidades sin conocer el negocio del taller.

Ejemplos:

```text
shared/
└── components/
    ├── Button/
    │   ├── Button.jsx
    │   └── Button.css
    ├── FormField/
    │   ├── FormField.jsx
    │   └── FormField.css
    ├── Modal/
    │   ├── Modal.jsx
    │   └── Modal.css
    ├── Spinner/
    │   └── Spinner.jsx
    ├── Alert/
    │   └── Alert.jsx
    └── EmptyState/
        └── EmptyState.jsx
```

Ejemplos de uso:

- `Button`: contacto, login, turnos y presupuestos.
- `FormField`: formularios de clientes, vehículos y turnos.
- `Modal`: confirmaciones y visualización de detalles.
- `Spinner`: indicar que se están cargando datos.
- `Alert`: mostrar errores o confirmaciones.
- `EmptyState`: mostrar que un listado no tiene elementos.

La carpeta puede permanecer vacía hasta que exista un componente realmente reutilizable.

### Regla para decidir si un componente es compartido

Se debe preguntar:

> ¿Este componente podría utilizarse sin cambios relacionados con el negocio en varias features?

Si la respuesta es sí, puede pertenecer a `shared/components`.

Si conoce conceptos como servicio, cliente, vehículo, turno o presupuesto, normalmente debe permanecer dentro de su feature.

### Ejemplos que no pertenecen a `shared/components`

```text
ServiceCard
FaqItem
ClienteForm
TurnoCard
VehiculoDetail
PresupuestoTable
```

Estos componentes representan conceptos específicos del sistema.

## `shared/layout`

Contiene componentes que definen la estructura general de una pantalla.

Ejemplo:

```text
shared/
└── layout/
    ├── PublicNavbar/
    │   ├── PublicNavbar.jsx
    │   └── PublicNavbar.css
    ├── ManagerNavbar/
    │   ├── ManagerNavbar.jsx
    │   └── ManagerNavbar.css
    ├── Footer/
    │   ├── Footer.jsx
    │   └── Footer.css
    ├── PublicLayout.jsx
    └── ManagerLayout.jsx
```

El layout público puede incluir:

- Navbar de la landing.
- Contenido de la ruta mediante `<Outlet />`.
- Footer.

El layout del gestor puede incluir:

- Navbar o menú lateral.
- Contenido de la ruta mediante `<Outlet />`.
- Opciones de usuario y cierre de sesión.

El navbar y el footer no se colocan en `shared/components` porque forman parte de la estructura general de las páginas.

## `shared/hooks`

Contiene hooks que pueden utilizarse en distintas funcionalidades.

Ejemplos:

```text
shared/hooks/useFetch.js
shared/hooks/useForm.js
shared/hooks/useDebounce.js
```

Un hook solo debe moverse a `shared` cuando su lógica sea verdaderamente independiente de una funcionalidad concreta.

## `shared/utils`

Contiene funciones auxiliares que no renderizan interfaces ni dependen de React.

Ejemplos:

```text
shared/utils/formatDate.js
shared/utils/formatCurrency.js
shared/utils/validators.js
```

```js
export function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}
```

## Archivos de la raíz de `src`

Los archivos de inicio y configuración general deben permanecer directamente en `src`.

```text
src/
├── App.jsx
├── router.jsx
├── main.jsx
└── index.css
```

Responsabilidades:

- `main.jsx`: inicia React y renderiza la aplicación.
- `App.jsx`: componente principal de la aplicación.
- `router.jsx`: declara rutas, layouts y pantallas.
- `index.css`: variables, normalización y estilos globales.

Estos archivos no pertenecen a una feature.

## Estilos CSS

Los estilos específicos deben permanecer cerca del componente que los utiliza.

```text
ServiceCard/
├── ServiceCard.jsx
└── ServiceCard.css
```

En `index.css` deberían quedar únicamente:

- Variables globales.
- Colores principales.
- Tipografías generales.
- Normalización de estilos.
- Reglas generales de `body`, `html` y `#root`.

Se debe evitar colocar en un único CSS global todos los estilos de la landing y del gestor.

También se deben evitar selectores globales demasiado generales:

```css
/* Evitar */
#logo { }
section { }
footer > div { }
```

Es preferible utilizar nombres específicos:

```css
.public-navbar__logo { }
.footer__logo { }
.hero-section { }
.services-section { }
```

## Convenciones de nombres

Los componentes y sus archivos utilizan PascalCase:

```text
ServiceCard.jsx
LandingPage.jsx
PublicLayout.jsx
```

Las funciones y variables utilizan camelCase:

```js
const menuAbierto = true;
const cerrarMenu = () => {};
```

Los componentes deberían tener nombres descriptivos. Se deben evitar nombres genéricos como:

```text
Component1.jsx
Section.jsx
Card2.jsx
```

Cada archivo debería exportar un componente principal.

## Árbol de decisión

Antes de crear o mover un componente, seguir estas preguntas:

1. ¿Representa una pantalla completa asociada con una ruta?
   - Colocarlo en `features/[feature]/pages`.

2. ¿Forma parte de la estructura general de varias pantallas?
   - Colocarlo en `shared/layout`.

3. ¿Pertenece a una funcionalidad concreta?
   - Colocarlo en `features/[feature]/components`.

4. ¿Es genérico y se utiliza en varias funcionalidades?
   - Colocarlo en `shared/components`.

5. ¿Encapsula lógica reutilizable de React?
   - Colocarlo en `hooks`, dentro de su feature o en `shared`.

6. ¿Se comunica con el backend?
   - Colocarlo en `services`, dentro de la feature correspondiente.

7. ¿Contiene datos estáticos?
   - Colocarlo en `data`, dentro de la feature correspondiente.

8. ¿Es una función auxiliar independiente de React?
   - Colocarla en `shared/utils`.

## Principios generales

- Organizar el proyecto por funcionalidades del negocio.
- Mantener alta cohesión dentro de cada feature.
- Evitar dependencias innecesarias entre features.
- No duplicar componentes o lógica.
- No crear abstracciones antes de necesitarlas.
- No mover un componente a `shared` solamente porque podría reutilizarse en el futuro.
- Una feature puede utilizar elementos de `shared`.
- `shared` no debe depender de una feature.
- Una feature no debería importar archivos internos de otra feature.
- Las páginas públicas y privadas se distinguen mediante rutas y layouts, no mediante dos aplicaciones diferentes.

> Un componente se convierte en compartido cuando existe una necesidad real de reutilización, no solamente porque podría reutilizarse algún día.

# Migración del gestor: vehículos y repuestos

Las pantallas históricas `vehiculos.html` y `repuestos.html` fueron migradas a React. Las rutas finales son `/gestor/vehiculos` y `/gestor/repuestos`. La navegación, el encabezado y el pie de página no se copiaron desde los HTML porque ya los aporta `LayoutGestor` mediante React Router y su `<Outlet />`. Copiarlos habría duplicado la estructura en cada página y provocado dos barras de navegación.

## Cambios realizados

### Página de vehículos

La página se organiza así:

```text
src/features/Vehiculo/
├── VehiculoPage.jsx
├── vehiculos.css
└── components/
    ├── VehiculosForm.jsx
    └── VehiculosList.jsx
```

- `VehiculoPage` es el contenedor de la pantalla. Mantiene el arreglo de vehículos y conecta formulario y listado. Se eligió una página contenedora en lugar de que el formulario modifique la tabla directamente porque los dos componentes necesitan los mismos datos.
- `VehiculosForm` conserva los campos del HTML original: dueño, patente, marca, modelo, año, kilometraje y observaciones. Ahora es un formulario controlado: cada campo usa `value` y `onChange`. Esto se eligió frente a leer el DOM con `document.querySelector` porque React debe ser la fuente de verdad de la interfaz.
- `VehiculosList` muestra la tabla y permite buscar por patente, marca o modelo. La búsqueda se calcula a partir del estado existente; no se guarda una segunda lista filtrada, ya que duplicar ese estado puede desincronizar datos.
- Al guardar, el padre agrega un objeto con `crypto.randomUUID()` como clave estable. No se usó el índice de la lista como `key`, porque al agregar, borrar u ordenar filas React podría asociar una fila visual al dato incorrecto.
- El selector de dueño contiene temporalmente "Sin asignar". No se inventaron clientes de prueba: deberá llenarse con datos reales cuando exista la feature o API de clientes.

### Página de repuestos

La página se organiza así:

```text
src/features/Repuestos/
├── RepuestoPage.jsx
├── repuestos.css
└── components/
    ├── RepuestosForm.jsx
    └── RepuestosList.jsx
```

- `RepuestoPage` aplica el mismo patrón de contenedor con estado local.
- `RepuestosForm` conserva los datos relevantes del HTML: código, nombre, precios de costo y venta, stock, stock mínimo y descripción. Los precios y cantidades usan `type="number"`, en vez de texto libre, para que el navegador impida entradas incompatibles desde el inicio.
- El HTML anterior tenía dos campos llamados "Stock". Se conservó uno y el siguiente se representa como `Stock mínimo`, que es el dato que ya figuraba en la tabla. Mantener dos campos idénticos habría creado datos ambiguos.
- `RepuestosList` busca por código o nombre y formatea los precios con `Intl.NumberFormat` en pesos argentinos. Esto evita concatenar manualmente símbolos y separadores de miles.

### Rutas y estilos

- `router.jsx` ahora asocia las rutas de vehículos y repuestos a las nuevas páginas React. También se eliminaron imports que ya no se usaban o apuntaban a una ruta anterior.
- Los estilos de cada página están junto a su feature y usan el prefijo `.gestion-page`. No se reutilizó el CSS global del HTML porque tenía selectores como `section`, `label` y `.barra` que podían modificar la landing o la navegación del gestor accidentalmente.
- Ambos formularios, tablas y buscadores son responsivos. En pantallas pequeñas las grillas de campos pasan de varias columnas a una sola.

## Estado actual y límites deliberados

Los datos iniciales viven en `data/vehiculos.json` y `data/repuestos.json`, dentro de cada feature. Son datos puros y siguen la forma que deberían tener las entidades al llegar desde una API, por lo que sirven como una primera referencia para el modelo de datos. Se eligió JSON en vez de `data.js` porque no se necesita ejecutar lógica ni importar componentes: solo se representan registros.

Al iniciar cada página, esos registros se cargan en `useState`, por lo que pueden agregarse y buscarse mientras la aplicación está abierta, pero los agregados se pierden al recargar. Se eligió esto frente a conectar una API inexistente o usar `localStorage`: el objetivo de esta migración es trasladar la interfaz a React sin simular persistencia que después podría ocultar errores de integración. Cuando exista la feature de clientes, el campo temporal `dueno` de los vehículos debería reemplazarse por `clienteId` para modelar la relación entre cliente y vehículos sin duplicar información.

Tampoco se usó Context, Redux ni otra librería de estado. El estado solo lo necesita una página y sus hijos directos; introducir estado global en este punto aumentaría complejidad sin aportar reutilización real.

## Mejoras propuestas

1. Conectar ambas features a una API: cargar inicialmente los datos, crear registros con `POST`, y luego incorporar edición y eliminación con confirmación.
2. Crear la feature de clientes y consumirla en el selector de dueño, en lugar de dejar opciones fijas.
3. Validar formato de patente, unicidad de código de repuesto, números no negativos y que el precio de venta no sea menor que el costo.
4. Resaltar repuestos con stock bajo cuando `stock <= stockMinimo` y agregar filtros por esa condición.
5. Añadir estados de carga, error y confirmación para las operaciones de red. Estos deberían vivir en hooks o servicios de cada feature, no dispersos entre componentes visuales.
6. Extraer componentes realmente repetidos, como una tabla vacía o un campo de formulario, a `shared/components` solo cuando otra feature los use sin cambios ligados a vehículos o repuestos.

# Inicio de sesión (login)

El gestor (`/gestor`) solo se puede usar con una sesión iniciada. Si alguien entra sin sesión, la aplicación lo manda a `/login`.

Mientras no exista el backend, los usuarios se simulan en `labtech-backend/data/usuarios.json`. Ese archivo no guarda las contraseñas, sino su hash (SHA-256 con un `salt` distinto por usuario).

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin303!` | ADMINISTRADOR |
| `mecanico` | `Mecanico303!` | MECANICO |
| `ex.mecanico` | `ExMecanico303!` | MECANICO (inactivo, no puede iniciar sesión) |

Son datos de prueba: no deben usarse contraseñas reales en este archivo ni en el JSON.

## Cómo funciona

- `features/auth/services/authService.js` simula el endpoint `POST /api/auth/login`: controla usuario y contraseña y devuelve un token con formato JWT que vence en 8 horas.
- `features/auth/utils/token.js` guarda el token en el navegador (`localStorage`) y lee sus datos.
- `features/auth/context/AuthProvider.jsx` mantiene la sesión para toda la aplicación y la cierra sola cuando vence el token. Se accede con el hook `useAuth`.
- `features/auth/components/GestorProtegido.jsx` controla la entrada al gestor.

Limitación: como todo corre en el navegador, la simulación no es segura de verdad. Cuando exista el backend, el servidor controlará la contraseña y firmará el token; las pantallas no cambian.

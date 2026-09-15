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

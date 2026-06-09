# Aplicación Web - Taller Next.js (Cortes 3 y 4)

Este es un proyecto [Next.js](https://nextjs.org) desarrollado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Cómo Ejecutar el Código

### Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- **Node.js**: versión 18.0 o superior ([descargar aquí](https://nodejs.org/))
- **npm** o **yarn** (incluido con Node.js)
- **Git** (para clonar el repositorio)

### Instalación

1. **Clonar el repositorio:**

    ```bash
    git clone <url-del-repositorio>
    cd taller-next-corte-3-y-4-los-ingeniebrios
    ```

2. **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

### Ejecución en Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3001](http://localhost:3001). El servidor recargará automáticamente cuando hagas cambios en los archivos.

### Compilación para Producción

Para generar una versión optimizada para producción:

```bash
npm run build
npm run start
```

---

## Criterios de Evaluación del Proyecto

### 1. Mockups de la Aplicación (20%)

La aplicación fue diseñada previamente en Figma con una identidad visual coherente en todas las pantallas. Se definió una **paleta de colores consistente** con los colores de marca de la Universidad Icesi, que se aplica en toda la interfaz, desde los botones de acción hasta los fondos y elementos interactivos. Los lineamientos visuales garantizan uniformidad en espaciado, tipografía y componentes reutilizables.

📌 **Figma Mockups:** 

### 2. Interfaz de Usuario (30%)

La interfaz fue construida con **componentes React modulares** en Next.js. Cada sección tiene su propio componente:

- **Autenticación:** Páginas de Login y Register (`/src/app/(public)/login`, `/src/app/(public)/register`) con validación en tiempo real de campos (email institucional, contraseña segura, confirmación de campos)
- **Feed Principal:** Componentes como `PostCard`, `FeedFilters` y `PostList` que permite filtrar posts por categorías (Programación, Diseño, Matemáticas, etc.)
- **Navegación:** Barra de navegación (`Navbar`) que facilita el movimiento entre secciones
- **Sistema de filtros:** Los usuarios pueden filtrar contenido por categoría con una interfaz intuitiva y responsive

El diseño es **atractivo y funcional** con uso de iconos SVG, avatares de usuarios, niveles de experiencia mostrados en cada publicación, y mensajes de error personalizados (en lugar de `window.alert`).

### 3. Gestión del Estado (10%)

El estado se gestiona usando **React Hooks** (useState). La aplicación mantiene:

- **Estado de categoría seleccionada** en el Feed: Los usuarios pueden cambiar la categoría filtrada y este estado se actualiza en tiempo real, filtrando automáticamente los posts mostrados
- **Estado de autenticación:** Gestión de login y registro con tokens almacenados en localStorage, incluyendo email del usuario y estado de carga durante peticiones al servidor

### 4. Funcionalidades (20%)

Las funcionalidades clave implementadas incluyen:

- **Sistema de autenticación:** Login con email institucional (@u.icesi.edu.co) y registro con validación de contraseña segura
- **Feed de preguntas y respuestas:** Visualización de posts categorizados con información del autor.
- **Filtrado por categorías:** Los usuarios pueden explorar contenido específico de su interés (6 categorías disponibles)
- **Validación de formularios:** Validación en cliente de campos requeridos, formatos de email, fortaleza de contraseña y coincidencia de contraseñas

### 5. Pruebas (10%)

Se implementaron **pruebas E2E automatizadas** con Cypress para validar:

- Flujos de autenticación (login y registro exitosos)
- Interacción con el feed y filtrado de categorías
- Comportamiento responsive en diferentes tamaños de pantalla
- Manejo de errores y mensajes de validación

### 6. Despliegue (10%)

La aplicación está lista para ser **desplegada en Vercel** para el frontend, con integración al backend. Los requisitos de despliegue incluyen:

- **Frontend en Vercel:** Conexión automática con GitHub para despliegues continuos
- **Backend:** Desplegado en Railway o plataforma alternativa
- **Variables de entorno:** Configuración segura de endpoints del API y credenciales
- **Testing en producción:** Validación de que la aplicación funciona correctamente en el entorno desplegado

---

## Estructura del Proyecto

```
src/
├── app/              # Rutas y layouts de Next.js
├── common/           # Componentes reutilizables
└── lib/              # Utilidades y configuraciones
```

---

## Aprende Más

Para aprender más sobre Next.js, consulta los siguientes recursos:

- [Next.js Documentation](https://nextjs.org/docs) - características y API de Next.js
- [Learn Next.js](https://nextjs.org/learn) - tutorial interactivo
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

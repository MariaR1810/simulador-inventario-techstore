# Sistema de Gestion de Inventario - TechStore

Es un simulador interactivo de inventario desarrollado como una **Single Page Application (SPA)**. El objetivo principal de este proyecto fue dominar la manipulación avanzada del DOM, la gestión del estado en memoria y la persistencia de datos del lado del cliente utilizando JavaScript moderno (ES6+).

## Características Principales (Features)

* **CRUD Completo:** Permite registrar, listar (leer), editar y eliminar productos en tiempo real sin recargar la página.
* **Cálculo Financiero Automatizado:** El sistema procesa de forma dinámica la inversión total y calcula el margen de ganancia promedio del inventario, incluyendo control de errores matemáticos (como la prevención de división por cero).
* **Persistencia Local:** Los datos sobreviven a las recargas del navegador mediante la integración con la API de almacenamiento local.
* **Interfaz Limpia y Responsiva:** Diseño basado en una paleta de colores pastel suaves utilizando variables nativas de CSS y layouts flexibles.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica para la accesibilidad y orden del contenido.
* **CSS3:** Estructuración con Flexbox, diseño responsivo y gestión de temas visuales mediante Variables CSS (`--propiedad`).
* **Vanilla JavaScript (ES6+):** Lógica pura sin frameworks, manejo de eventos nativos y manipulación dinámica del árbol del DOM.

## 🧠 Lógica de Ingeniería y Arquitectura

Para este desarrollo apliqué un enfoque guiado por datos:

1. **Estado Centralizado:** El inventario no se lee directamente del HTML; se mantiene en un array central de objetos en la memoria RAM que actúa como la "fuente de la verdad". Cualquier acción (crear, editar, borrar) modifica este array primero.
2. **Renderizado Reactivo Nativo:** Creé una función de renderizado que se encarga de limpiar el contenedor visual y redibujar las filas del DOM y las métricas financieras cada vez que el estado central cambia.
3. **Mapeo para Edición (Update):** La funcionalidad de edición implementa una variable temporal que retiene el ID del producto seleccionado mediante métodos de búsqueda en arreglos, permitiendo al formulario conmutar de forma inteligente entre la creación de un elemento nuevo o la actualización de uno existente.
4. **Mecanismo de Persistencia:** [Explica aquí brevemente qué métodos usaste (JSON.stringify / JSON.parse) y para qué sirvieron en el almacenamiento local].

## 📋 Cómo Ejecutar el Proyecto

1. Clona este repositorio o descarga los archivos.
2. Abre el archivo `index.html` directamente en cualquier navegador moderno, o ejecútalo utilizando una extensión de servidor local (como Live Server en VS Code).

---
Desarrollado por MariaR1810 - Ingeniería de Sistemas.



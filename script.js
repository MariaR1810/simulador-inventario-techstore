/**
 * SIMULADOR DE INVENTARIO WEB
 * -------------------------------------------------------------
 * Archivo de lógica de negocio (Plantilla lista para implementar)
 * 
 * En este archivo deberás programar la lógica del simulador. 
 * A continuación, se detalla la estructura básica recomendada para:
 * 1. Seleccionar los elementos del DOM.
 * 2. Manejar el estado de la aplicación (los productos).
 * 3. Escuchar los eventos del usuario (clicks, envíos de formulario).
 * 4. Renderizar y persistir los datos en LocalStorage.
 */

// ==========================================================================
// 1. REFERENCIAS A ELEMENTOS DEL DOM
// ==========================================================================

// Botones de interacción
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelarModal = document.getElementById('btn-cancelar-modal');
const btnEditarProducto = document.getElementById('btn-editar-producto');
const btnGuardarProducto = document.getElementById('btn-guardar-producto');

// Modal y Formulario
const modalIngreso = document.getElementById('modal-ingreso');
const formularioProducto = document.getElementById('formulario-producto');

// Entradas de Texto (Campos del formulario)
const inputNombre = document.getElementById('input-nombre');
const inputCategoria = document.getElementById('input-categoria');
const inputProveedor = document.getElementById('input-proveedor');
const inputPrecio = document.getElementById('input-precio');
const inputCosto = document.getElementById('input-costo');

// Salidas y Contenedores
const listaProductos = document.getElementById('lista-productos');
const sinProductosPlaceholder = document.getElementById('sin-productos');

// Métricas del Dashboard
const salidaTotalProductos = document.getElementById('salida-total-productos');
const salidaInversion = document.getElementById('salida-inversion');
const salidaMargen = document.getElementById('salida-margen');


// ==========================================================================
// 2. ESTADO DE LA APLICACIÓN
// ==========================================================================
// Aquí guardarás el array de productos cargados. 
// Ejemplo de estructura de un producto:
// { id: 'uuid-o-timestamp', nombre: 'Laptop', categoria: 'Electrónica', proveedor: 'ABC', precio: 1000, costo: 700 }
let inventario = [];


// ==========================================================================
// 3. INICIALIZACIÓN DE LA APP (EVENTO DOMContentLoaded)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Cargar los datos del disco duro del navegador
    cargarDeLocalStorage();

    // Pintar lo que se haya recuperado (si es que había algo)
    renderizarTabla();
    actualizarMetricas();

    console.log("¡Simulador de Inventario Inicializado!");
});


// ==========================================================================
// 4. FUNCIONES DE APERTURA / CIERRE DE MODAL
// ==========================================================================

/**
 * Muestra el modal agregando la clase 'active' o modificando el style.display
 */
function abrirModal() {
    //modalIngreso.style.display = 'flex';
    modalIngreso.classList.add('active');
}

/**
 * Oculta el modal removiendo la clase 'active' o modificando el style.display
 * TIP: Recuerda también resetear el formulario al cerrar.
 */
function cerrarModal() {
    modalIngreso.classList.remove('active');
    formularioProducto.reset();
    delete formularioProducto.dataset.id;

    // Restaurar títulos por defecto para la próxima vez que se abra como "Agregar"
    modalIngreso.querySelector('h2').textContent = 'Agregar Producto';
    btnGuardarProducto.textContent = 'Guardar Producto';
}



// ==========================================================================
// 5. EVENT LISTENERS PARA EL MODAL
// ==========================================================================

// Abrir modal al hacer click en el botón de agregar
btnAbrirModal.addEventListener('click', abrirModal);

// Cerrar modal al hacer click en el botón "X"
btnCerrarModal.addEventListener('click', cerrarModal);

// Cerrar modal al hacer click en el botón "Cancelar"
btnCancelarModal.addEventListener('click', cerrarModal);

// Opcional: Cerrar modal si el usuario hace click fuera del contenido (en el overlay)
modalIngreso.addEventListener('click', (e) => {
    if (e.target === modalIngreso) {
        cerrarModal();
    }
});


// ==========================================================================
// 6. CONTROLADORES DE INVENTARIO (CREAR - EDITAR - ELIMINAR)
// ==========================================================================

/**
 * Se activa al enviar (submit) el formulario de producto.
 * @param {Event} e - Objeto de evento del formulario
 */
function guardarProducto(e) {
    // Evita que la página se recargue por defecto al enviar el formulario
    e.preventDefault();

    // 1. Capturar y convertir los valores de los inputs
    const nombre = inputNombre.value;
    const categoria = inputCategoria.value;
    const proveedor = inputProveedor.value;
    const precio = parseFloat(inputPrecio.value);
    const costo = parseFloat(inputCosto.value);

    if (precio <= costo) {
        alert('El precio debe ser mayor que el costo');
        return;
    }

    const idEdicion = formularioProducto.dataset.id;

    if (idEdicion) {
        // MODO EDICIÓN: Actualizar el producto existente
        const producto = inventario.find(p => p.id == idEdicion);
        if (producto) {
            producto.nombre = nombre;
            producto.categoria = categoria;
            producto.proveedor = proveedor;
            producto.precio = precio;
            producto.costo = costo;
        }
        // Limpiar el atributo dataset.id
        delete formularioProducto.dataset.id;
    } else {
        // MODO CREACIÓN: Agregar nuevo producto
        const nuevoProducto = {
            id: Date.now(),
            nombre,
            categoria,
            proveedor,
            precio,
            costo
        };
        inventario.push(nuevoProducto);
    }
    // Actualizar vista, métricas y almacenamiento
    renderizarTabla();
    actualizarMetricas();
    guardarEnLocalStorage();
    // 7. Cerrar modal y limpiar formulario
    cerrarModal();
}

// Escuchar el evento submit del formulario
formularioProducto.addEventListener('submit', guardarProducto);

/**
 * Edita un producto del array por su ID único.
 * @param {string|number} id - Identificador del producto a editar
 */
function editarProducto(id) {
    // 1. Buscar el producto por ID
    const producto = inventario.find(p => p.id === id);
    if (!producto) return;

    // 2. Llenar el formulario con los datos
    inputNombre.value = producto.nombre;
    inputCategoria.value = producto.categoria;
    inputProveedor.value = producto.proveedor;
    inputPrecio.value = producto.precio;
    inputCosto.value = producto.costo;

    // 3 y 4. Cambiar textos del modal
    modalIngreso.querySelector('h2').textContent = 'Editar Producto';
    btnGuardarProducto.textContent = 'Actualizar Producto';

    // 6. Guardar el ID en dataset para saber cuál actualizar al enviar
    formularioProducto.dataset.id = id;

    // Abrir el modal
    abrirModal();
}

/**
 * Elimina un producto del array por su ID único.
 * @param {string|number} id - Identificador del producto a eliminar
 */
function eliminarProducto(id) {
    // 1. Filtramos el array para conservar solo los productos que NO coincidan con el ID seleccionado
    inventario = inventario.filter(producto => producto.id !== id);

    // 2. Volvemos a redibujar la tabla con el array actualizado
    renderizarTabla();

    // 3. Guardar los datos en el almacenamiento local (LocalStorage)
    guardarEnLocalStorage();

    // 4. Volvemos a recalcular las métricas del dashboard
    actualizarMetricas();
}


// ==========================================================================
// 7. FUNCIONES DE RENDERIZADO Y CÁLCULO
// ==========================================================================

/**
 * Recorre el array de productos en el estado y crea las filas HTML correspondientes.
 * TIP: Si no hay productos, puedes mostrar el div #sin-productos y ocultar la tabla.
 */
function renderizarTabla() {
    // CONTROL DEL ESTADO VACÍO:
    // Si el array de inventario está vacío (length === 0), quitamos 'hidden' para mostrar el cartel.
    // Si tiene productos, le añadimos 'hidden' para ocultarlo.
    if (inventario.length === 0) {
        sinProductosPlaceholder.classList.remove('hidden');
    } else {
        sinProductosPlaceholder.classList.add('hidden');
    }

    // 1. Limpiar por completo el contenedor antes de inyectar las filas reales
    listaProductos.innerHTML = '';

    // 2. Recorrer el array de productos e inyectar una fila por cada elemento
    inventario.forEach((producto) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td class="product-name">
                <div class="product-icon"><i class="fa-solid fa-box"></i></div>
                <span>${producto.nombre}</span>
            </td>
            <td><span class="category-tag">${producto.categoria}</span></td>
            <td class="price-value">$${producto.costo.toFixed(2)}</td>
            <td class="price-value">$${producto.precio.toFixed(2)}</td>
            <td class="vendor-name">${producto.proveedor}</td>
            <td class="text-center">
                <button class="btn btn-edit btn-sm" onclick="editarProducto(${producto.id})">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">
                    <i class="fa-solid fa-trash-can"></i> Eliminar
                </button>
            </td>
        `;

        listaProductos.appendChild(fila);
    });
}

/**
 * Realiza los cálculos y actualiza las métricas en la interfaz de usuario:
 * - Cantidad Total de Productos.
 * - Inversión Total (Suma de los costos de compra * cantidad, o simplemente la suma de costos).
 * - Margen de Ganancia Promedio % (Fórmula: ((Precio Venta - Costo Compra) / Precio Venta) * 100).
 */

function actualizarMetricas() {
    // 1. Cantidad Total de Productos es simplemente el tamaño del array
    const totalProductos = inventario.length;

    // 2. Calcular la Inversión Total sumando el costo de cada producto
    let inversionTotal = 0;
    // Variables para calcular el margen promedio después
    let sumaMargenes = 0;

    inventario.forEach((producto) => {
        // Acumulamos el costo de compra
        inversionTotal += producto.costo;

        // Fórmula del Margen de Ganancia de ESTE producto: ((Precio - Costo) / Precio) * 100
        // Usamos un condicional por si el precio es 0, para evitar división por cero
        if (producto.precio > 0) {
            const margenProducto = ((producto.precio - producto.costo) / producto.precio) * 100;
            sumaMargenes += margenProducto;
        }
    });

    // 3. Calcular el Margen Promedio
    const margenPromedio = totalProductos > 0 ? (sumaMargenes / totalProductos) : 0;

    // 4. Inyectar los valores calculados en las etiquetas HTML correspondientes
    salidaTotalProductos.textContent = totalProductos;
    salidaInversion.textContent = `$${inversionTotal.toFixed(2)}`;
    salidaMargen.textContent = `${margenPromedio.toFixed(0)}%`;
}


// ==========================================================================
// 8. PERSISTENCIA CON LOCALSTORAGE
// ==========================================================================

/**
 * Guarda el estado actual del inventario en localStorage como string JSON.
 */
function guardarEnLocalStorage() {
    // Convertimos el array de objetos a una cadena de texto plana y la guardamos
    localStorage.setItem('inventario', JSON.stringify(inventario));
}

/**
 * Carga los productos guardados en localStorage si existen, de lo contrario inicializa vacío.
 */
function cargarDeLocalStorage() {
    const datosGuardados = localStorage.getItem('inventario');

    // Si existen datos viejos en el navegador, los transformamos de texto a array de JS
    if (datosGuardados) {
        inventario = JSON.parse(datosGuardados);
    } else {
        inventario = [];
    }
}
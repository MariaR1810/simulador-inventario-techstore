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

function abrirModal() {
    modalIngreso.classList.add('active');
}

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
btnAbrirModal.addEventListener('click', abrirModal);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelarModal.addEventListener('click', cerrarModal);
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

    cerrarModal();
}

formularioProducto.addEventListener('submit', guardarProducto);

/**
 * Edita un producto del array por su ID único.
 * @param {string|number} id - Identificador del producto a editar
 */
function editarProducto(id) {
    const producto = inventario.find(p => p.id === id);
    if (!producto) return;

    inputNombre.value = producto.nombre;
    inputCategoria.value = producto.categoria;
    inputProveedor.value = producto.proveedor;
    inputPrecio.value = producto.precio;
    inputCosto.value = producto.costo;

    modalIngreso.querySelector('h2').textContent = 'Editar Producto';
    btnGuardarProducto.textContent = 'Actualizar Producto';

    // Guarda el ID en dataset para saber cuál actualizar al enviar
    formularioProducto.dataset.id = id;

    abrirModal();
}

/**
 * Elimina un producto del array por su ID único.
 * @param {string|number} id - Identificador del producto a eliminar
 */
function eliminarProducto(id) {
    inventario = inventario.filter(producto => producto.id !== id);
    renderizarTabla();
    guardarEnLocalStorage();
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

    // Limpia por completo el contenedor antes de inyectar las filas reales
    listaProductos.innerHTML = '';

    // Recorre el array de productos e inyecta una fila por cada elemento
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
    const totalProductos = inventario.length;

    // Calcula la Inversión Total sumando el costo de cada producto
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

    // Calcula el Margen Promedio
    const margenPromedio = totalProductos > 0 ? (sumaMargenes / totalProductos) : 0;

    // Inyecta los valores calculados en las etiquetas HTML correspondientes
    salidaTotalProductos.textContent = totalProductos;
    salidaInversion.textContent = `$${inversionTotal.toFixed(2)}`;
    salidaMargen.textContent = `${margenPromedio.toFixed(0)}%`;
}


// ==========================================================================
// 8. PERSISTENCIA CON LOCALSTORAGE
// ==========================================================================

function guardarEnLocalStorage() {
    // Convierte el array de objetos a una cadena de texto plana y la guardamos
    localStorage.setItem('inventario', JSON.stringify(inventario));
}

function cargarDeLocalStorage() {
    // Obtiene los datos guardados
    const datosGuardados = localStorage.getItem('inventario');

    // Si existen datos viejos en el navegador, los transforma de texto a array de JS
    if (datosGuardados) {
        inventario = JSON.parse(datosGuardados);
    } else {
        inventario = [];
    }
}
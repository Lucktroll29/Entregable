function iniciarFormularioSeguimiento() {

    const formulario = document.getElementById('form-seguimiento');

    // Validar si existe
    if (!formulario) return;

    formulario.addEventListener('submit', guardarSeguimiento);
}

let seguimientosGlobal = [];

// Guardar seguimiento
async function guardarSeguimiento(e) {

    e.preventDefault();

    // Formulario actual
    const formulario = e.target;

    // Extraer datos
    const formData = new FormData(formulario);

    const datosSeguimiento = Object.fromEntries(formData.entries());

    console.log("Enviando seguimiento:", datosSeguimiento);

    try {

        const response = await fetch('http://localhost:3000/guardar-seguimiento', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(datosSeguimiento)

        });

        const result = await response.json();

        if (result.success) {

            mostrarAlerta("¡Seguimiento guardado correctamente!", 'success');

            formulario.reset();

        } else {

            console.error("Error del servidor:", result.error);

            mostrarAlerta("Error al guardar: " + result.error, 'error');

        }

    } catch (error) {

        console.error("Error de conexión:", error);

        mostrarAlerta("No se pudo conectar con el servidor.", 'error');

    }

}

// Función para buscar seguimientos
async function buscarSeguimiento() {

    const nombre = document.getElementById('valor-busqueda-candidato').value;
    const cargo = document.getElementById('valor-busqueda-cargo').value;

    if (!nombre && !cargo) {
        mostrarAlerta("Por favor ingrese al menos un valor de búsqueda", 'warning');
        return;
    }

    try {

        const response = await fetch('http://localhost:3000/buscar-seguimiento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, cargo })
        });

        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            mostrarAlerta("No se encontraron resultados");
            return;
        }

        mostrarTablaSeguimiento(result.data);

    } catch (error) {
        console.error(error);
        mostrarAlerta("Error en la búsqueda");
    }
}

// Función para mostrar tabla de seguimientos
function mostrarTablaSeguimiento(dataArray) {

    seguimientosGlobal = dataArray;

    const contenedor = document.getElementById('principalcontent');

    let html = `
        
        <h2 class="titulo">Resultados de Seguimiento</h2>

        <div class="tabla-container">

            <table class="tabla-resultados">
                <thead>
                    <tr>
                        <th>Requisición</th>
                        <th>Candidato</th>
                        <th>Cargo</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Fecha Postulación</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    const estados = {
        1: "Postulado",
        2: "Pendiente de Postular",
        3: "Entrevistas y Pruebas",
        4: "No seleccionado",
        5: "Entrevista con el Líder",
        6: "Seleccionado",
        7: "Contratado",
        8: "Contactado",
        9: "Prueba Técnica",
        10: "Team Assessment"
    };

    dataArray.forEach(row => {
        html += `<tr>
            <td>${row.numero_requisicion || 'N/A'}</td>
            <td>${row.nombre_candidato}</td>
            <td>${row.cargo_candidato}</td>
            <td>${row.telefono_candidato}</td>
            <td>${row.correo_candidato}</td>
            <td>${row.fecha_postulacion.split('T')[0]}</td>
            <td>${estados[row.estado]}</td>
            <td>${row.observacion || 'Sin observaciones'}</td>
            <td><button class="btn-ver" onclick="verDetalles(${row.id_registro})">Editar</button></td>
        </tr>`;
    });

    html += '</table>';
    html += '</div>';

    contenedor.innerHTML = html;
}

function verDetalles(id_registro) {

    const seguimiento = seguimientosGlobal.find(item => item.id_registro == id_registro);

    if (!seguimiento) {
        mostrarAlerta("Registro no encontrado");
        return;
    }

    const estados = {
        1: "Postulado",
        2: "Pendiente de Postular",
        3: "Entrevistas y Pruebas",
        4: "No seleccionado",
        5: "Entrevista con el Líder",
        6: "Seleccionado",
        7: "Contratado",
        8: "Contactado",
        9: "Prueba Técnica",
        10: "Team Assessment"
    };

    let opcionesEstados = '';

    for (const key in estados) {

        opcionesEstados += `
            <option value="${key}" ${seguimiento.estado == key ? 'selected' : ''}>
                ${estados[key]}
            </option>
        `;
    }

    const html = `
    
        <div class="card">
            <h2 class="titulo">Editar Seguimiento</h2>

            <form id="form-editar-seguimiento">

                <input type="hidden" id="edit-id" value="${seguimiento.id_registro}">

                <div class="form-row">

                    <div class="form-group">
                        <label>Requisición</label>
                        <input type="text" value="${seguimiento.numero_requisicion || ''}" readonly>
                    </div>

                    <div class="form-group">
                        <label>Cargo</label>
                        <input type="text" value="${seguimiento.cargo_candidato || ''}" readonly>
                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="edit-nombre" value="${seguimiento.nombre_candidato || ''}">
                    </div>

                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="text" id="edit-telefono" value="${seguimiento.telefono_candidato || ''}">
                    </div>

                </div>

                <div class="form-row">

                    <div class="form-group">
                        <label>Correo</label>
                        <input type="email" id="edit-correo" value="${seguimiento.correo_candidato || ''}">
                    </div>

                    <div class="form-group">
                        <label>Estado</label>
                        <select id="edit-estado">
                            ${opcionesEstados}
                        </select>
                    </div>

                </div>

                <div class="form-group">
                    <label>Observaciones</label>
                    <textarea id="edit-observacion">${seguimiento.observacion || ''}</textarea>
                </div>

                <br>

                <button type="button" class="btn-save" onclick="actualizarSeguimiento()">
                    Actualizar
                </button>

            </form>
        </div>
    `;

    document.getElementById('contenedor-edicion').innerHTML = html;

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

async function actualizarSeguimiento() {
    debugger;
    const datos = {

        id_registro: document.getElementById('edit-id').value,

        nombre_candidato: document.getElementById('edit-nombre').value,

        telefono_candidato: document.getElementById('edit-telefono').value,

        correo_candidato: document.getElementById('edit-correo').value,

        estado: document.getElementById('edit-estado').value,

        observacion: document.getElementById('edit-observacion').value
    };

    try {

        const response = await fetch('http://localhost:3000/actualizar-seguimiento', {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(datos)

        });

        const result = await response.json();

        if (result.success) {

            mostrarAlerta("Seguimiento actualizado correctamente", 'success');

            buscarSeguimiento();

        } else {

            mostrarAlerta(result.error || "Error actualizando", 'error');
        }

    } catch (error) {

        console.error(error);

        mostrarAlerta("Error de conexión", 'error');
    }
}
function iniciarFormularioCalificacion() {

    const formulario = document.getElementById('form-calificacion');

    // Validar si existe
    if (!formulario) return;

    formulario.addEventListener('submit', guardarCalificacion);
}

let dataGlobal = [];


//Funcion para Guardar el registro del formulario de ingreso
async function guardarCalificacion(e) {

    e.preventDefault();

    // Formulario actual
    const formulario = e.target;

    // Extraer datos
    const formData = new FormData(formulario);

    const datosCandidato = Object.fromEntries(formData.entries());

    console.log("Enviando a Postgres:", datosCandidato);

    try {

        const response = await fetch('http://localhost:3000/guardar-calificacion', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(datosCandidato)

        });

        const result = await response.json();

        if (result.success) {

            mostrarAlerta("¡Éxito! El candidato fue guardado en la base de datos.", 'success');

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

//Funcion para buscar dentro de la base de datos
async function buscarCandidato() {

    const tipo = document.getElementById('tipo-busqueda').value;
    const valor = document.getElementById('valor-busqueda').value;

    try {

        const response = await fetch('http://localhost:3000/buscar-candidato', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo, valor })
        });

        const result = await response.json();

        if (!result.success || !result.data) {
            mostrarAlerta("No se encontró el candidato", 'warning');
            return;
        }

        mostrarTablaCalificaciones(result.data);

    } catch (error) {
        console.error(error);
        mostrarAlerta("Error en la búsqueda", 'error');
    }
}

function mostrarTablaCalificaciones(dataArray) {

    const contenedor = document.getElementById('principalcontent');

    if (!contenedor) return;

    let html = `
        <h2 class="titulo">Resultados de Calificación</h2>

        <table class="tabla-resultados">
            <thead>
                <tr>
                    <th>Candidato</th>
                    <th>Cargo Candidato</th>
                    <th>Calificador</th>
                    <th>Puntaje Técnico</th>
                    <th>Puntaje Entrevista</th>
                    <th>Apto</th>
                    <th>Requisición</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    dataArray.forEach(item => {

        html += `
            <tr>
                <td>${item.nombre_candidato}</td>
                <td>${item.cargo_candidato}</td>
                <td>${item.nombre_calificador}</td>
                <td>${item.puntaje_tecnico}</td>
                <td>${item.puntaje_entrevista}</td>
                <td>${item.apto ? 'Sí' : 'No'}</td>
                <td>${item.numero_requisicion || 'N/A'}</td>
                <td>${item.observacion || 'Sin observaciones'}</td>
            </tr>
        `;
    });

    //Para en un futuro tener un boton de ver detalles
    // <td>
    //     <button onclick="verDetalle(${item.id_registro})">
    //         Ver
    //     </button>
    // </td>

    html += `
            </tbody>
        </table>
    `;

    contenedor.innerHTML = html;
}

function verDetalle(id) {

    const registro = dataGlobal.find(item => item.id_registro === id);

    if (!registro) return;

    const modal = document.getElementById('modal-detalle');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <p><strong>Candidato:</strong> ${registro.nombre_candidato}</p>
        <p><strong>Cargo:</strong> ${registro.cargo_camdidato}</p>
        <p><strong>Calificador:</strong> ${registro.nombre_calificador}</p>

        <hr>

        <p><strong>Observaciones:</strong></p>
        <p>${registro.observacion || 'Sin observaciones'}</p>
    `;

    modal.classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modal-detalle').classList.add('hidden');
}
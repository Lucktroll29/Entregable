function iniciarFormularioSeguimiento() {

    const formulario = document.getElementById('form-seguimiento');

    // Validar si existe
    if (!formulario) return;

    formulario.addEventListener('submit', guardarSeguimiento);
}


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

            alert("¡Seguimiento guardado correctamente!");

            formulario.reset();

        } else {

            console.error("Error del servidor:", result.error);

            alert("Error al guardar: " + result.error);

        }

    } catch (error) {

        console.error("Error de conexión:", error);

        alert("No se pudo conectar con el servidor.");

    }

}

// Función para buscar seguimientos
async function buscarSeguimiento() {

    const nombre = document.getElementById('valor-busqueda-candidato').value;
    const cargo = document.getElementById('valor-busqueda-cargo').value;

    if (!nombre && !cargo) {
        alert("Por favor ingrese al menos un valor de búsqueda");
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
            alert("No se encontraron resultados");
            return;
        }

        mostrarTablaSeguimiento(result.data);

    } catch (error) {
        console.error(error);
        alert("Error en la búsqueda");
    }
}

// Función para mostrar tabla de seguimientos
function mostrarTablaSeguimiento(dataArray) {

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
            <td><button class="btn-ver" onclick="verDetalles(${row.id})">Editar</button></td>
        </tr>`;
    });

    html += '</table>';
    html += '</div>';

    contenedor.innerHTML = html;
}
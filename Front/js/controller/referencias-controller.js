function iniciarFormularioReferencias() {

    const formulario = document.getElementById('form-referencias');

    // Validar si existe
    if (!formulario) return;

    formulario.addEventListener('submit', guardarReferencia);
}

let referenciasGlobal = [];

// Guardar referencia
async function guardarReferencia(e) {

    e.preventDefault();

    // Formulario actual
    const formulario = e.target;

    // Extraer datos
    const formData = new FormData(formulario);

    const datosReferencia = Object.fromEntries(formData.entries());

    console.log("Enviando referencia:", datosReferencia);

    try {

        const response = await fetch('http://localhost:3000/guardar-referencia', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(datosReferencia)

        });

        const result = await response.json();

        if (result.success) {

            mostrarAlerta("¡Referencia guardada correctamente!", 'success');

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

// Función para buscar referencias
async function buscarReferencia() {

    const nombre = document.getElementById('valor-busqueda-candidato').value;
    const cargo = document.getElementById('valor-busqueda-cargo').value;

    try {

        const response = await fetch('http://localhost:3000/buscar-referencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, cargo })
        });

        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            mostrarAlerta("No se encontraron resultados", 'warning');
            return;
        }

        mostrarTablaReferencias(result.data);

    } catch (error) {
        console.error(error);
        mostrarAlerta("Error en la búsqueda", 'error');
    }
}

// Función para mostrar tabla de referencias
function mostrarTablaReferencias(dataArray) {

    referenciasGlobal = dataArray;

    const contenedor = document.getElementById('contenido-referencias');

    let html = `
        
        <h2 class="titulo">Resultados de Referencias</h2>

        <div class="tabla-container">

            <table class="tabla-resultados">
                <thead>
                    <tr>
                        <th>Candidato</th>
                        <th>Cargo</th>
                        <th>Empresa</th>
                        <th>Referente</th>
                        <th>Teléfono</th>
                        <th>Recontrato</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;

    dataArray.forEach(row => {
        const recontrato = row.recontrato === 'true' || row.recontrato === true ? 'Sí' : 'No';
        html += `<tr>
            <td>${row.nombre_candidato}</td>
            <td>${row.cargo_candidato}</td>
            <td>${row.nombre_empresa}</td>
            <td>${row.nombre_referente}</td>
            <td>${row.telefono_referente}</td>
            <td>${recontrato}</td>
            <td><button class="btn-ver" onclick="verDetallesReferencia(${row.id_registro})">Ver</button></td>
        </tr>`;
    });

    html += '</tbody></table>';
    html += '</div>';

    contenedor.innerHTML = html;
}

function verDetallesReferencia(id) {

    const referencia = referenciasGlobal.find(item => item.id_registro == id);

    if (!referencia) {
        mostrarAlerta("Registro no encontrado", 'error');
        return;
    }

    console.log("Referencia encontrada:", referencia);

    let contenedorEdicion = document.getElementById('contenedor-referencias-detalle');
    
    // Si no existe el contenedor, lo creamos
    if (!contenedorEdicion) {
        contenedorEdicion = document.createElement('div');
        contenedorEdicion.id = 'contenedor-referencias-detalle';
        document.getElementById('contenido-referencias').parentNode.appendChild(contenedorEdicion);
        console.log("Contenedor creado dinámicamente");
    }

    const html = `
    
        <div class="card" style="margin-top: 20px;">
            <h2 class="titulo">Detalles de Referencia</h2>

            <div>
                <p><strong>1- Datos del candidato</strong></p>
                <br>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre del candidato</label>
                        <input type="text" value="${referencia.nombre_candidato || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Cargo</label>
                        <input type="text" value="${referencia.cargo_candidato || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Area</label>
                        <input type="text" value="${referencia.area_cargo || ''}" readonly>
                    </div>
                </div>

                <p><strong>2- Información de Referencia</strong></p>
                <br>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre de la Empresa</label>
                        <input type="text" value="${referencia.nombre_empresa || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Cargo que Desempeñó</label>
                        <input type="text" value="${referencia.cargo_desempenado || ''}" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Recontrato ¿Si ó No?</label>
                        <input type="text" value="${referencia.recontrato === 'true' || referencia.recontrato === true ? 'Sí' : 'No'}" readonly>
                    </div>
                    <div class="form-group">
                        <label>¿Porque?</label>
                        <input type="text" value="${referencia.motivo_recontrato || ''}" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Nombre Referente</label>
                        <input type="text" value="${referencia.nombre_referente || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Relación con el Candidato</label>
                        <input type="text" value="${referencia.relacion_candidato || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Telefono Referente</label>
                        <input type="text" value="${referencia.telefono_referente || ''}" readonly>
                    </div>
                </div>

                <p><strong>3- Información laboral</strong></p>
                <br>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo contrato</label>
                        <input type="text" value="${referencia.tipo_contrato || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Cargo</label>
                        <input type="text" value="${referencia.cargo_ocupado || ''}" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha de Ingreso</label>
                        <input type="date" value="${referencia.fecha_ingreso?.split('T')[0] || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Fecha de Salida</label>
                        <input type="date" value="${referencia.fecha_salida?.split('T')[0] || ''}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Motivo Retiro</label>
                        <input type="text" value="${referencia.motivo_retiro || ''}" readonly>
                    </div>
                </div>

                <p><strong>4- Información adicional</strong></p>
                <br>

                <div class="form-group">
                    <label>¿Cómo describiría el desempeño general del candidato/a en el cargo que ocupó?</label>
                    <textarea readonly style="resize: none;">${referencia.desempeno || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿Cuáles eran sus responsabilidades principales?</label>
                    <textarea readonly style="resize: none;">${referencia.responsabilidades || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿Hubo algún logro o resultado destacado que recuerde de su gestión?</label>
                    <textarea readonly style="resize: none;">${referencia.logros || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿Cuáles considera que son las principales fortalezas profesionales del candidato?</label>
                    <textarea readonly style="resize: none;">${referencia.fortalezas || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿Cuáles considera que son las principales oportunidades de mejora profesionales del candidato?</label>
                    <textarea readonly style="resize: none;">${referencia.oportunidades || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿Cómo era su relación con el equipo de trabajo y líderes?</label>
                    <textarea readonly style="resize: none;">${referencia.relacion_equipo || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿Es una persona confiable?</label>
                    <textarea readonly style="resize: none;">${referencia.confiable || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>¿La desvinculación del candidato se dio en buenos términos?</label>
                    <textarea readonly style="resize: none;">${referencia.desvinculacion || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>Observaciones</label>
                    <textarea readonly style="resize: none;">${referencia.observacion || ''}</textarea>
                </div>
            </div>
        </div>
    `;

    console.log("Inyectando HTML en contenedor");
    contenedorEdicion.innerHTML = html;

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

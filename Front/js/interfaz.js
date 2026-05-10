// FUNCIÓN PARA MOSTRAR ALERTAS PERSONALIZADOS
function mostrarAlerta(mensaje, tipo = 'info') {
  const alertaDiv = document.createElement('div');
  alertaDiv.className = `custom-alert alert-${tipo}`;
  alertaDiv.textContent = mensaje;
  document.body.appendChild(alertaDiv);

  setTimeout(() => {
    alertaDiv.classList.add('hidden');
    setTimeout(() => alertaDiv.remove(), 300);
  }, 3000);
}

function showModule(moduleId, element) {

  // ocultar módulos
  document.querySelectorAll('.module').forEach(module => {
    module.classList.remove('active');
  });

  // mostrar módulo seleccionado
  document.getElementById(moduleId).classList.add('active');

  // limpiar menú activo
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });

  // activar item actual
  element.classList.add('active');

  // cambiar título header
  document.getElementById('module-title').textContent =
    element.textContent.trim();
}


// VALIDAR LOGIN
if (localStorage.getItem('usuarioLogueado') !== 'true') {
  mostrarAlerta("No has iniciado sesión. Redirigiendo al login...", 'warning');
  setTimeout(() => window.location.href = 'login.html', 1500);
}


// CERRAR SESIÓN
function logout() {
  mostrarAlerta("Sesión cerrada. Redirigiendo al login...", 'info');
  localStorage.clear();
  setTimeout(() => window.location.href = 'login.html', 1500);
}


// CARGAR VISTAS DINÁMICAS de Calificacion
async function cargarVistaClasificacion(vista) {

  const contenedor = document.getElementById('contenido-calificacion');

  let ruta = '';

  if (vista === 'ingreso') {
    ruta = './modules/calificacion/ingreso.html';
  }

  if (vista === 'buscar') {
    ruta = './modules/calificacion/buscar.html';
  }

  try {

    const response = await fetch(ruta);

    const html = await response.text();

    contenedor.innerHTML = html;
    if (vista === 'ingreso') {
      iniciarFormularioCalificacion();
    } else if (vista === 'buscar') {
      buscarCandidato();
    }

  } catch (error) {

    console.error('Error cargando vista:', error);

  }
}

// CARGAR VISTAS DINÁMICAS de Seguimiento
async function cargarVistaSeguimiento(vista) {

  const contenedor = document.getElementById('contenido-seguimiento');

  let ruta = '';

  if (vista === 'ingreso') {
    ruta = './modules/seguimiento/ingreso.html';
  }

  if (vista === 'buscar') {
    ruta = './modules/seguimiento/buscar.html';
  }

  try {

    const response = await fetch(ruta);

    const html = await response.text();

    contenedor.innerHTML = html;
    if (vista === 'ingreso') {
      iniciarFormularioSeguimiento();
    }

  } catch (error) {

    console.error('Error cargando vista:', error);

  }
}


// CARGA INICIAL
window.addEventListener('DOMContentLoaded', () => {
  cargarVistaClasificacion('ingreso');
  cargarVistaSeguimiento('ingreso');
});
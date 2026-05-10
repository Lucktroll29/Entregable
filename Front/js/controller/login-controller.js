// FUNCIÓN PARA MOSTRAR ALERTAS PERSONALIZADOS EN LOGIN
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

document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        const result = await response.json();

        if (result.success) {
            // Guardamos el nombre del usuario en el navegador para usarlo luego
            localStorage.setItem('usuarioLogueado', true);
            mostrarAlerta("¡Bienvenido!", 'success');
            setTimeout(() => window.location.href = 'index.html', 1500); 
        } else {
            mostrarAlerta("Error: Credenciales inválidas, intenta nuevamente.", 'error');
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarAlerta("No se pudo conectar con el servidor de autenticación.", 'error');
    }
});
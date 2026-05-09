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
            alert(`¡Bienvenido!`);
            window.location.href = 'index.html'; 
        } else {
            alert("Error: Ha ocurrido un error inesperado" + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor de autenticación.");
    }
});
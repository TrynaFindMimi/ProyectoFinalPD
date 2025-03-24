document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar elementos del DOM
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const cambiarEstadoButtons = document.querySelectorAll(".btn-cambiar-estado");

    // Función para manejar las pestañas
    function manejarPestanas() {
        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Remover clase 'active' de todos los botones y contenidos
                tabButtons.forEach(btn => btn.classList.remove("active"));
                tabContents.forEach(content => content.classList.remove("active"));

                // Añadir clase 'active' al botón y contenido seleccionado
                button.classList.add("active");
                const tabId = button.getAttribute("data-tab");
                document.getElementById(tabId).classList.add("active");
            });
        });
    }

    // Función para cambiar el estado de un envío
    function cambiarEstado() {
        cambiarEstadoButtons.forEach(button => {
            button.addEventListener("click", () => {
                const envio = button.closest(".envio");
                const estadoActual = envio.getAttribute("data-estado");
                const porEnviarSection = document.getElementById("por-enviar");
                const enviadosSection = document.getElementById("enviados");
                const estadoSpan = envio.querySelector(".estado");

                if (estadoActual === "sin-enviar") {
                    // Cambiar a "Enviado"
                    envio.setAttribute("data-estado", "enviado");
                    estadoSpan.textContent = "Enviado";
                    estadoSpan.classList.remove("sin-enviar");
                    estadoSpan.classList.add("enviado");
                    button.textContent = "Marcar como Sin Enviar";
                    enviadosSection.appendChild(envio);
                } else if (estadoActual === "enviado") {
                    // Cambiar a "Sin Enviar"
                    envio.setAttribute("data-estado", "sin-enviar");
                    estadoSpan.textContent = "Sin Enviar";
                    estadoSpan.classList.remove("enviado");
                    estadoSpan.classList.add("sin-enviar");
                    button.textContent = "Marcar como Enviado";
                    porEnviarSection.appendChild(envio);
                }
            });
        });
    }

    // Inicializar funcionalidades
    manejarPestanas();
    cambiarEstado();
});
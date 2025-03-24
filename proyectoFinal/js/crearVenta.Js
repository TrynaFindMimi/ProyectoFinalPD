document.addEventListener("DOMContentLoaded", function() {
    const porEnviarSection = document.getElementById("por-enviar");
    const enviadosSection = document.getElementById("enviados");
    const tabButtons = document.querySelectorAll(".tab-btn");

    // URL de la API
    const apiUrl = "http://localhost/tienda/api.php"; // Ajusta esta URL según tu servidor

    // Función para obtener los envíos desde la API
    async function cargarEnvios() {
        try {
            const response = await fetch(`${apiUrl}?action=get_envios`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const envios = await response.json();

            // Limpiar secciones
            porEnviarSection.innerHTML = "";
            enviadosSection.innerHTML = "";

            // Renderizar envíos
            envios.forEach(envio => {
                const envioHTML = `
                    <div class="envio" data-estado="${envio.estado}" data-id="${envio.id}">
                        <div class="envio-info">
                            <h3>Envío #${envio.id.toString().padStart(3, '0')}</h3>
                            <p><strong>Cliente:</strong> ${envio.cliente}</p>
                            <p><strong>Dirección:</strong> ${envio.departamento}</p>
                            <p><strong>Estado:</strong> <span class="estado ${envio.estado === 'sin-enviar' ? 'sin-enviar' : 'enviado'}">
                                ${envio.estado === 'sin-enviar' ? 'Sin Enviar' : 'Enviado'}
                            </span></p>
                        </div>
                        <div class="productos-envio">
                            <h4>Productos:</h4>
                            <ul>
                                ${JSON.parse(envio.productos).map(producto => `<li>${producto.nombre} - ${producto.cantidad} unidad${producto.cantidad > 1 ? 'es' : ''}</li>`).join('')}
                            </ul>
                        </div>
                        <button class="btn-cambiar-estado">
                            ${envio.estado === 'sin-enviar' ? 'Marcar como Enviado' : 'Marcar como Sin Enviar'}
                        </button>
                    </div>
                `;

                if (envio.estado === "sin-enviar") {
                    porEnviarSection.insertAdjacentHTML("beforeend", envioHTML);
                } else {
                    enviadosSection.insertAdjacentHTML("beforeend", envioHTML);
                }
            });

            // Volver a agregar eventos después de renderizar
            agregarEventosCambioEstado();
        } catch (error) {
            console.error("Error al cargar los envíos:", error);
            porEnviarSection.innerHTML = "<p>Error al cargar los envíos.</p>";
            enviadosSection.innerHTML = "<p>Error al cargar los envíos.</p>";
        }
    }

    // Función para manejar las pestañas
    function manejarPestanas() {
        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                tabButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const tabId = button.getAttribute("data-tab");
                document.querySelectorAll(".tab-content").forEach(content => {
                    content.classList.remove("active");
                });
                document.getElementById(tabId).classList.add("active");
            });
        });
    }

    // Función para cambiar el estado de un envío y actualizar la base de datos
    function agregarEventosCambioEstado() {
        const cambiarEstadoButtons = document.querySelectorAll(".btn-cambiar-estado");
        cambiarEstadoButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const envio = button.closest(".envio");
                const id = envio.getAttribute("data-id");
                const estadoActual = envio.getAttribute("data-estado");
                const nuevoEstado = estadoActual === "sin-enviar" ? "enviado" : "sin-enviar";

                try {
                    const response = await fetch(`${apiUrl}?action=update_envio&id=${id}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ estado: nuevoEstado })
                    });
                    const result = await response.json();

                    if (result.message) {
                        // Actualizar UI
                        envio.setAttribute("data-estado", nuevoEstado);
                        const estadoSpan = envio.querySelector(".estado");
                        estadoSpan.textContent = nuevoEstado === "sin-enviar" ? "Sin Enviar" : "Enviado";
                        estadoSpan.classList.toggle("sin-enviar", nuevoEstado === "sin-enviar");
                        estadoSpan.classList.toggle("enviado", nuevoEstado === "enviado");
                        button.textContent = nuevoEstado === "sin-enviar" ? "Marcar como Enviado" : "Marcar como Sin Enviar";

                        if (nuevoEstado === "sin-enviar") {
                            porEnviarSection.appendChild(envio);
                        } else {
                            enviadosSection.appendChild(envio);
                        }
                    } else {
                        console.error("Error al actualizar el estado:", result.error);
                        alert("No se pudo actualizar el estado del envío.");
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                    alert("Error al conectar con el servidor.");
                }
            });
        });
    }

    manejarPestanas();
    cargarEnvios();
});
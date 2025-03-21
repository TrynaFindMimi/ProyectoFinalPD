document.querySelectorAll(".tab-btn").forEach((boton) => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
        boton.classList.add("active");
        document.getElementById(boton.getAttribute("data-tab")).classList.add("active");
    });
});

document.querySelectorAll(".btn-cambiar-estado").forEach((boton) => {
    boton.addEventListener("click", () => {
        const envio = boton.closest(".envio");
        const estadoActual = envio.getAttribute("data-estado");
        const nuevoEstado = estadoActual === "enviado" ? "sin-enviar" : "enviado";
        const destinoTab = nuevoEstado === "enviado" ? "enviados" : "por-enviar";
        envio.setAttribute("data-estado", nuevoEstado);
        const estadoSpan = envio.querySelector(".estado");
        estadoSpan.textContent = nuevoEstado === "enviado" ? "Enviado" : "Sin Enviar";
        estadoSpan.className = `estado ${nuevoEstado}`;
        boton.textContent = nuevoEstado === "enviado" ? "Marcar como Sin Enviar" : "Marcar como Enviado";
        document.getElementById(destinoTab).appendChild(envio);
        alert(`Estado cambiado a: ${nuevoEstado === "enviado" ? "Enviado" : "Sin Enviar"}`);
    });
});
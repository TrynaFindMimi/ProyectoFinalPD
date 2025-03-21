function abrirModalPagoSaldo(numeroReserva) {
    const reserva = document.querySelector(`.reserva[data-numero="${numeroReserva}"]`);
    const saldo = reserva.dataset.saldo;
    const modal = document.getElementById("modal-pago-saldo");
    if (modal && saldo !== "0.00") {
        document.getElementById("numero-reserva").textContent = numeroReserva;
        document.getElementById("saldo-pendiente").textContent = saldo;
        modal.style.display = "block";
    }
}

function cerrarModalPagoSaldo() {
    const modal = document.getElementById("modal-pago-saldo");
    if (modal) {
        modal.style.display = "none";
    }
}

function pagarSaldoConQR() {
    const numeroReserva = document.getElementById("numero-reserva").textContent;
    alert(`Pago con QR para la Reserva #${numeroReserva} procesado.`);
    actualizarEstadoReserva(numeroReserva);
    cerrarModalPagoSaldo();
}

function pagarSaldoEnEfectivo() {
    const numeroReserva = document.getElementById("numero-reserva").textContent;
    alert(`Por favor, realiza el pago en efectivo para la Reserva #${numeroReserva} en la tienda.`);
    cerrarModalPagoSaldo();
}

function actualizarEstadoReserva(numeroReserva) {
    const reserva = document.querySelector(`.reserva[data-numero="${numeroReserva}"]`);
    if (reserva) {
        reserva.dataset.saldo = "0.00";
        reserva.querySelector(".reserva-info p:nth-child(5)").innerHTML = "<strong>Saldo Pendiente:</strong> 0.00 Bs";
        const btnPagar = reserva.querySelector(".btn-pagar-saldo");
        btnPagar.textContent = "Pagado";
        btnPagar.disabled = true;
    }
}

function mostrarDetalles(numeroReserva) {
    const reserva = document.querySelector(`.reserva[data-numero="${numeroReserva}"]`);
    const modal = document.getElementById("modal-detalles");
    if (modal && reserva) {
        const fecha = reserva.dataset.fecha;
        const anticipo = reserva.dataset.anticipo;
        const tipoAnticipo = reserva.dataset.tipoAnticipo;
        const destino = reserva.dataset.destino;
        const saldo = reserva.dataset.saldo;
        const total = reserva.dataset.total;

        document.getElementById("detalle-numero-reserva").textContent = numeroReserva;
        document.getElementById("detalle-info").innerHTML = `
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Anticipo:</strong> ${anticipo} Bs (${tipoAnticipo})</p>
            <p><strong>Destino:</strong> ${destino}</p>
            <p><strong>Saldo Pendiente:</strong> ${saldo} Bs</p>
            <p><strong>Total:</strong> ${total} Bs</p>
        `;
        modal.style.display = "block";
    }
}

function cerrarModalDetalles() {
    const modal = document.getElementById("modal-detalles");
    if (modal) {
        modal.style.display = "none";
    }
}

window.addEventListener("click", function(event) {
    const modalPago = document.getElementById("modal-pago-saldo");
    const modalDetalles = document.getElementById("modal-detalles");
    if (event.target === modalPago) {
        cerrarModalPagoSaldo();
    } else if (event.target === modalDetalles) {
        cerrarModalDetalles();
    }
});
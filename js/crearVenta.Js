function abrirModalPago() {
    const modal = document.getElementById("modal-pago");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error("El modal de pago no se encontró en el DOM.");
    }
}

function cerrarModalPago() {
    const modal = document.getElementById("modal-pago");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("El modal de pago no se encontró en el DOM.");
    }
}

function pagarConQR() {
    alert("Pago con QR seleccionado.");
    cerrarModalPago();
}

function pagarEnEfectivo() {
    alert("Pago en efectivo seleccionado.");
    cerrarModalPago();
}

function abrirModalReserva() {
    const modal = document.getElementById("modal-reserva");
    if (modal) {
        modal.style.display = "block";
    } else {
        console.error("El modal de reserva no se encontró en el DOM.");
    }
}

function cerrarModalReserva() {
    const modal = document.getElementById("modal-reserva");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("El modal de reserva no se encontró en el DOM.");
    }
}

function registrarReserva(tipo) {
    const form = document.getElementById("reserva-form");
    if (!form.checkValidity()) {
        alert("Por favor, completa el nombre antes de continuar.");
        return;
    }

    const nombre = document.getElementById("nombre").value;
    const ci = document.getElementById("ci").value || "No especificado";
    const departamento = document.getElementById("departamento").value || "No especificado";
    const anticipo = document.getElementById("anticipo").value || 0;
    const saldoTotal = document.getElementById("saldo-total").value;

    if (tipo === "pendiente") {
        alert(`Reserva registrada como PAGO PENDIENTE:\nNombre: ${nombre}\nCI: ${ci}\nDepartamento: ${departamento}\nSaldo Total: ${saldoTotal}\nAnticipo: 0.00 Bs\nEstado: Pago pendiente por 880.00 Bs`);
    } else if (tipo === "anticipo") {
        if (anticipo > 0 && anticipo <= 880) {
            const pendiente = (880 - anticipo).toFixed(2);
            alert(`Reserva registrada con ANTICIPO:\nNombre: ${nombre}\nCI: ${ci}\nDepartamento: ${departamento}\nSaldo Total: ${saldoTotal}\nAnticipo: ${anticipo} Bs\nEstado: Pago pendiente por ${pendiente} Bs`);
        } else if (anticipo > 880) {
            alert("El anticipo no puede ser mayor al saldo total.");
            return;
        } else {
            alert("Por favor, ingresa un monto de anticipo válido mayor a 0.");
            return;
        }
    }

    cerrarModalReserva();
}

document.getElementById("reserva-form").addEventListener("submit", function(event) {
    event.preventDefault();
});

function eliminarProducto(button) {
    const producto = button.closest(".producto-carrito");
    if (producto) {
        producto.remove();
        actualizarResumen();
    }
}

function actualizarResumen() {
    const precios = document.querySelectorAll(".producto-carrito .precio");
    let subtotal = 0;
    precios.forEach(precio => {
        subtotal += parseFloat(precio.textContent.replace(" Bs", ""));
    });
    const envio = 50.00;
    const total = subtotal + envio;

    document.querySelector(".subtotal").textContent = `${subtotal.toFixed(2)} Bs`;
    document.querySelector(".envio").textContent = `${envio.toFixed(2)} Bs`;
    document.querySelector(".total span").textContent = `${total.toFixed(2)} Bs`;
    document.getElementById("saldo-total").value = `${total.toFixed(2)} Bs`;
}

document.querySelectorAll(".eliminar").forEach(button => {
    button.addEventListener("click", function() {
        eliminarProducto(this);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    actualizarResumen();
});
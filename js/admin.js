document.addEventListener("DOMContentLoaded", () => {
    // Botones "Ver más" para pedidos
    document.querySelectorAll(".btn-ver-mas").forEach((boton) => {
        boton.addEventListener("click", () => {
            const pedido = boton.closest(".pedido").querySelector("h3").textContent;
            alert(`Más información del ${pedido}`);
        });
    });

    // Botón "Agregar Producto"
    document.querySelector(".btn-agregar-producto").addEventListener("click", () => {
        alert("Abrir formulario para agregar producto");
    });

    // Botón "Ajustar Precio"
    document.querySelector(".btn-ajustar-precio").addEventListener("click", () => {
        alert("Abrir formulario para ajustar precio de producto");
    });

    // Filtro de pedidos
    const filtroPedidos = document.getElementById("buscar-pedido");
    const pedidos = document.querySelectorAll(".pedido");

    filtroPedidos.addEventListener("input", () => {
        const filtro = filtroPedidos.value.toLowerCase();
        pedidos.forEach((pedido) => {
            const vendedor = pedido.getAttribute("data-vendedor").toLowerCase();
            const numeroPedido = pedido.getAttribute("data-pedido").toLowerCase();
            if (vendedor.includes(filtro) || numeroPedido.includes(filtro)) {
                pedido.style.display = "flex";
            } else {
                pedido.style.display = "none";
            }
        });
    });

    // Botones de turnos
    const btnManana = document.getElementById("btn-manana");
    const btnTarde = document.getElementById("btn-tarde");
    const turnosManana = document.querySelectorAll(".turno-manana");
    const turnosTarde = document.querySelectorAll(".turno-tarde");

    btnManana.addEventListener("click", () => {
        btnManana.classList.add("active");
        btnTarde.classList.remove("active");
        turnosManana.forEach((turno) => (turno.style.display = "flex"));
        turnosTarde.forEach((turno) => (turno.style.display = "none"));
    });

    btnTarde.addEventListener("click", () => {
        btnTarde.classList.add("active");
        btnManana.classList.remove("active");
        turnosTarde.forEach((turno) => (turno.style.display = "flex"));
        turnosManana.forEach((turno) => (turno.style.display = "none"));
    });

    // Gráfico Día
    const ctxDia = document.getElementById("chart-dia").getContext("2d");
    new Chart(ctxDia, {
        type: "doughnut",
        data: {
            labels: ["QR", "Efectivo"],
            datasets: [{
                data: [1800, 1350],
                backgroundColor: ["#F28CAB", "#5C3D4A"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%", // Hace el doughnut más delgado
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    // Gráfico Semana
    const ctxSemana = document.getElementById("chart-semana").getContext("2d");
    new Chart(ctxSemana, {
        type: "doughnut",
        data: {
            labels: ["QR", "Efectivo"],
            datasets: [{
                data: [9000, 6750],
                backgroundColor: ["#F28CAB", "#5C3D4A"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    // Gráfico Mes
    const ctxMes = document.getElementById("chart-mes").getContext("2d");
    new Chart(ctxMes, {
        type: "doughnut",
        data: {
            labels: ["QR", "Efectivo"],
            datasets: [{
                data: [36000, 27000],
                backgroundColor: ["#F28CAB", "#5C3D4A"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
});
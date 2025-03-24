document.addEventListener("DOMContentLoaded", function() {
    const usuariosValidos = {
        "admin": { password: "admin123", nombre: "Admin", rol: "Administrador" },
        "empleado": { password: "emp456", nombre: "Juan Pérez", rol: "Empleado" }
    };

    let usuarioActual = null;

    const loginBtn = document.getElementById("login-btn");
    const loginLink = document.getElementById("login-link");
    const modalLogin = document.getElementById("modal-login");
    const closeModal = document.querySelector(".close");
    const loginForm = document.getElementById("login-form");

    const gananciasDia = { qr: 1800, efectivo: 1350 };
    const gananciasSemana = { qr: 9000, efectivo: 6750 };
    const gananciasMes = { qr: 36000, efectivo: 27000 };

    function abrirModalLogin() {
        modalLogin.style.display = "flex";
    }

    function cerrarModalLogin() {
        modalLogin.style.display = "none";
        document.getElementById("login-error").style.display = "none";
    }

    function actualizarPanelUsuario() {
        const usuarioInfo = document.querySelector(".usuario-info");
        if (usuarioActual) {
            usuarioInfo.innerHTML = `
                <h2>Usuario</h2>
                <p><strong>Usuario:</strong> ${usuarioActual.nombre}</p>
                <p><strong>Rol:</strong> ${usuarioActual.rol}</p>
                <p><a href="#" id="cerrar-sesion" class="login-link">Cerrar Sesión</a></p>
            `;
            loginBtn.style.display = "none";
            document.getElementById("cerrar-sesion").addEventListener("click", cerrarSesion);
            mostrarDatos();
        } else {
            usuarioInfo.innerHTML = `
                <h2>Usuario</h2>
                <p><strong>Usuario:</strong> No iniciado</p>
                <p><strong>Rol:</strong> N/A</p>
                <p><a href="#" id="login-link" class="login-link">Iniciar Sesión</a></p>
            `;
            loginBtn.style.display = "block";
            document.getElementById("login-link").addEventListener("click", abrirModalLogin);
            ocultarDatos();
        }
    }

    function cerrarSesion() {
        usuarioActual = null;
        actualizarPanelUsuario();
    }

    function mostrarDatos() {
        const gananciasHorizontal = document.querySelector(".ganancias-horizontal");
        const pedidosLista = document.getElementById("pedidos-lista");
        const turnosLista = document.getElementById("turnos-lista");

        gananciasHorizontal.style.opacity = "1";
        pedidosLista.style.opacity = "1";
        turnosLista.style.opacity = "1";

        cargarGraficos();
        agregarEventosFiltros();
    }

    function ocultarDatos() {
        const gananciasHorizontal = document.querySelector(".ganancias-horizontal");
        const pedidosLista = document.getElementById("pedidos-lista");
        const turnosLista = document.getElementById("turnos-lista");

        gananciasHorizontal.style.opacity = "0.3";
        pedidosLista.style.opacity = "0.3";
        turnosLista.style.opacity = "0.3";
    }

    function cargarGraficos() {
        const chartDiaCtx = document.getElementById("chart-dia").getContext("2d");
        new Chart(chartDiaCtx, {
            type: "doughnut",
            data: {
                labels: [`QR (${gananciasDia.qr} Bs)`, `Efectivo (${gananciasDia.efectivo} Bs)`],
                datasets: [{
                    data: [gananciasDia.qr, gananciasDia.efectivo],
                    backgroundColor: ["#F28CAB", "#E06B8A"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: "70%",
                plugins: { legend: { display: false }, title: { display: false } }
            }
        });

        const chartSemanaCtx = document.getElementById("chart-semana").getContext("2d");
        new Chart(chartSemanaCtx, {
            type: "doughnut",
            data: {
                labels: [`QR (${gananciasSemana.qr} Bs)`, `Efectivo (${gananciasSemana.efectivo} Bs)`],
                datasets: [{
                    data: [gananciasSemana.qr, gananciasSemana.efectivo],
                    backgroundColor: ["#F28CAB", "#E06B8A"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: "70%",
                plugins: { legend: { display: false }, title: { display: false } }
            }
        });

        const chartMesCtx = document.getElementById("chart-mes").getContext("2d");
        new Chart(chartMesCtx, {
            type: "doughnut",
            data: {
                labels: [`QR (${gananciasMes.qr} Bs)`, `Efectivo (${gananciasMes.efectivo} Bs)`],
                datasets: [{
                    data: [gananciasMes.qr, gananciasMes.efectivo],
                    backgroundColor: ["#F28CAB", "#E06B8A"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: "70%",
                plugins: { legend: { display: false }, title: { display: false } }
            }
        });
    }

    function agregarEventosFiltros() {
        const buscarPedido = document.getElementById("buscar-pedido");
        const filtroMetodo = document.getElementById("filtro-metodo");
        const filtroEstado = document.getElementById("filtro-estado");
        const pedidos = document.querySelectorAll(".pedido");

        function filtrarPedidos() {
            const buscarTexto = buscarPedido.value.toLowerCase();
            const metodo = filtroMetodo.value;
            const estado = filtroEstado.value;

            pedidos.forEach(pedido => {
                const vendedor = pedido.dataset.vendedor.toLowerCase();
                const cliente = pedido.dataset.cliente.toLowerCase();
                const numero = pedido.dataset.pedido.toLowerCase();
                const metodoPago = pedido.dataset.metodo;
                const estadoPedido = pedido.dataset.estado;

                const coincideBusqueda = vendedor.includes(buscarTexto) || cliente.includes(buscarTexto) || numero.includes(buscarTexto);
                const coincideMetodo = !metodo || metodo === metodoPago;
                const coincideEstado = !estado || estado === estadoPedido;

                pedido.style.display = coincideBusqueda && coincideMetodo && coincideEstado ? "" : "none";
            });
        }

        buscarPedido.addEventListener("input", filtrarPedidos);
        filtroMetodo.addEventListener("change", filtrarPedidos);
        filtroEstado.addEventListener("change", filtrarPedidos);

        const btnManana = document.getElementById("btn-manana");
        const btnTarde = document.getElementById("btn-tarde");
        const turnosManana = document.querySelectorAll(".turno-manana");
        const turnosTarde = document.querySelectorAll(".turno-tarde");

        btnManana.addEventListener("click", () => {
            btnManana.classList.add("active");
            btnTarde.classList.remove("active");
            turnosManana.forEach(turno => turno.style.display = "");
            turnosTarde.forEach(turno => turno.style.display = "none");
        });

        btnTarde.addEventListener("click", () => {
            btnTarde.classList.add("active");
            btnManana.classList.remove("active");
            turnosTarde.forEach(turno => turno.style.display = "");
            turnosManana.forEach(turno => turno.style.display = "none");
        });
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (usuariosValidos[username] && usuariosValidos[username].password === password) {
            usuarioActual = { nombre: usuariosValidos[username].nombre, rol: usuariosValidos[username].rol };
            actualizarPanelUsuario();
            cerrarModalLogin();
        } else {
            document.getElementById("login-error").style.display = "block";
        }
    });

    loginBtn.addEventListener("click", abrirModalLogin);
    loginLink.addEventListener("click", abrirModalLogin);
    closeModal.addEventListener("click", cerrarModalLogin);

    actualizarPanelUsuario();
});
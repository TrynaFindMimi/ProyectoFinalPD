document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost/proyectoFinal/api_inventario.php')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          productos = data;
          const productGrid = document.querySelector('.product-grid');
          data.forEach(producto => {
              const productDiv = document.createElement('div');
              productDiv.classList.add('product');
              productDiv.setAttribute('data-name', producto.nombre);
              productDiv.setAttribute('data-description', producto.descripcion);
              productDiv.setAttribute('data-brand', producto.marca);
              productDiv.setAttribute('data-type', producto.categoria);
              productDiv.innerHTML = `
                  <h3>${producto.nombre}</h3>
                  <p>${producto.descripcion}</p>
                  <p>Precio: Bs ${parseFloat(producto.precio).toFixed(2)}</p>
                  <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
              `;
              productGrid.appendChild(productDiv);
          });
          document.querySelectorAll('.add-to-cart').forEach(button => {
              button.addEventListener('click', () => {
                  const producto_id = button.getAttribute('data-id');
                  const nombre = button.getAttribute('data-nombre');
                  const precio = parseFloat(button.getAttribute('data-precio'));
                  fetch('http://localhost/proyectoFinal/api_inventario.php?action=add_to_cart', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ producto_id, nombre, precio })
                  })
                  .then(response => {
                      if (!response.ok) {
                          throw new Error(`HTTP error! Status: ${response.status}`);
                      }
                      return response.json();
                  })
                  .then(data => {
                      if (data.message) {
                          alert(data.message);
                      } else {
                          alert(data.error);
                      }
                  })
                  .catch(error => console.error('Error al agregar al carrito:', error));
              });
          });
          configurarFiltros();
      })
      .catch(error => console.error('Error al cargar inventario:', error));
});

let productos = [];

function renderProductos(productosFiltrados) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = '';
  if (productosFiltrados.length === 0) {
      productGrid.innerHTML = '<p>No se encontraron productos.</p>';
      return;
  }
  productosFiltrados.forEach(producto => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.setAttribute('data-name', producto.nombre);
      productDiv.setAttribute('data-description', producto.descripcion);
      productDiv.setAttribute('data-brand', producto.marca);
      productDiv.setAttribute('data-type', producto.categoria);
      productDiv.innerHTML = `
          <h3>${producto.nombre}</h3>
          <p>${producto.descripcion}</p>
          <p>Precio: Bs ${parseFloat(producto.precio).toFixed(2)}</p>
          <button class="add-to-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
      `;
      productGrid.appendChild(productDiv);
  });
  document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
          const producto_id = button.getAttribute('data-id');
          const nombre = button.getAttribute('data-nombre');
          const precio = parseFloat(button.getAttribute('data-precio'));
          fetch('http://localhost/proyectoFinal/api_inventario.php?action=add_to_cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ producto_id, nombre, precio })
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              if (data.message) {
                  alert(data.message);
              } else {
                  alert(data.error);
              }
          })
          .catch(error => console.error('Error al agregar al carrito:', error));
      });
  });
}

function configurarFiltros() {
  const searchInput = document.getElementById('search-input');
  const brandFilter = document.getElementById('brand-filter');
  const typeFilter = document.getElementById('type-filter');
  searchInput.addEventListener('input', filtrarProductos);
  brandFilter.addEventListener('change', filtrarProductos);
  typeFilter.addEventListener('change', filtrarProductos);
}

function filtrarProductos() {
  const busqueda = document.getElementById('search-input').value.toLowerCase();
  const marca = document.getElementById('brand-filter').value;
  const categoria = document.getElementById('type-filter').value;
  const productosFiltrados = productos.filter(producto => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda) || 
                              producto.descripcion.toLowerCase().includes(busqueda);
      const coincideMarca = !marca || producto.marca.toLowerCase() === marca.toLowerCase();
      const coincideCategoria = !categoria || producto.categoria.toLowerCase() === categoria.toLowerCase();
      return coincideBusqueda && coincideMarca && coincideCategoria;
  });
  renderProductos(productosFiltrados);
}
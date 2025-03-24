
class Pedido {
  constructor() {
    if (Pedido.instance) {
      return Pedido.instance;
    }
    this.items = [];
    Pedido.instance = this;
  }

  agregarProducto(producto) {
    const itemExistente = this.items.find(item => item.producto.nombre === producto.nombre);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.items.push({ producto: producto, cantidad: 1 });
    }
  }

  eliminarProducto(nombre) {
    this.items = this.items.filter(item => item.producto.nombre !== nombre);
  }

  actualizarCantidad(nombre, cantidad) {
    const item = this.items.find(item => item.producto.nombre === nombre);
    if (item && cantidad > 0) {
      item.cantidad = cantidad;
    } else if (item && cantidad <= 0) {
      this.eliminarProducto(nombre);
    }
  }

  obtenerTotal() {
    return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }

  obtenerItems() {
    return this.items;
  }

  limpiarCarrito() {
    this.items = [];
  }
}

const pedidoSingleton = new Pedido();
export default pedidoSingleton;
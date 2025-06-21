function calcularTotal() {
  const items = document.querySelectorAll('.menu-grid .item');
  let total = 0;

  items.forEach(item => {
    const precio = parseFloat(item.getAttribute('data-price')) || 0;
    const cantidad = parseInt(item.querySelector('input').value) || 0;
    total += precio * cantidad;
  });

  document.getElementById('total-amount').innerHTML = `<strong>Total: $${total.toFixed(2)} USD</strong>`;
  return total;
}

setInterval(calcularTotal, 500); // Actualiza el total en tiempo real

function generarID() {
  const now = new Date();
  return 'ORD-' + now.getFullYear().toString().slice(2) + 
         (now.getMonth()+1).toString().padStart(2, '0') + 
         now.getDate().toString().padStart(2, '0') + '-' + 
         Math.floor(Math.random() * 9000 + 1000);
}

function enviarPedido() {
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const metodo = document.getElementById('metodo').value;
  const extras = document.getElementById('extras').value;
  const total = calcularTotal().toFixed(2);
  const idOrden = generarID();

  const items = document.querySelectorAll('.menu-grid .item');
  let pedido = `*🚀 Mission Burrito 3.0*\n*Order ID:* ${idOrden}\n\n`;

  items.forEach(item => {
    const nombre = item.querySelector('h3').innerText;
    const cantidad = item.querySelector('input').value;
    if (cantidad > 0) {
      pedido += `• ${cantidad} x ${nombre}\n`;
    }
  });

  pedido += `\n📞 Teléfono: ${telefono}`;
  pedido += `\n📍 Dirección: ${direccion}`;
  pedido += `\n💳 Pago: ${metodo}`;
  pedido += `\n💰 Total: $${total} USD`;
  pedido += `\n📝 Notas: ${extras}`;

  const numeroCliente = "15756370077";
  const numeroMensajero = "15751234567";

  const urlCliente = `https://wa.me/${numeroCliente}?text=${encodeURIComponent(pedido)}`;
  const urlMensajero = `https://wa.me/${numeroMensajero}?text=${encodeURIComponent(pedido)}`;

  window.open(urlCliente, '_blank');
  window.open(urlMensajero, '_blank');
}

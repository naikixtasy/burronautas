const precios = {
  f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 7, rel: 6, win: 7,
  coke: 2, zero: 2, sprite: 2, pepper: 2
};

function calcularTotal() {
  let total = 0;
  for (const id in precios) {
    const cantidad = parseInt(document.getElementById(id)?.value || 0);
    total += cantidad * precios[id];
  }

  const deliveryFee = 3.00;
  const totalConEnvio = total + deliveryFee;

  document.getElementById("total").innerHTML = `
    🧾 Subtotal: $${total.toFixed(2)}<br>
    🚚 Delivery Fee: $${deliveryFee.toFixed(2)}<br>
    💲 <strong>Total: $${totalConEnvio.toFixed(2)}</strong>
  `;

  return totalConEnvio.toFixed(2); // Regresa el total con envío incluido
}


// Recalcular total en tiempo real
document.querySelectorAll("input[type='number']").forEach(input => {
  input.addEventListener("input", calcularTotal);
});

function enviarPedido() {
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const metodo = document.getElementById('metodo').value;
  const extras = document.getElementById('extras').value.trim();
  const total = calcularTotal();
  const idOrden = Math.floor(Math.random() * 90000 + 10000);

  const items = document.querySelectorAll('.menu-grid .item');
  let pedido = `🛸 *Burronautas 🚀*\n🧾 *Orden No. ${idOrden}*\n\n`;

  items.forEach(item => {
    const nombre = item.querySelector('h3').childNodes[0].textContent.trim();
    const input = item.querySelector('input');
    const cantidad = parseInt(input?.value || 0);
    const id = input?.id;
    if (cantidad > 0) {
      pedido += `• ${cantidad} x ${nombre} - $${(cantidad * precios[id]).toFixed(2)}\n`;
    }
  });

  pedido += `\n💲 *Total (incluye envío): $${total}*`;
  pedido += `\n📞 *Teléfono / Phone:* ${telefono}`;
  pedido += `\n📍 *Dirección / Address:* ${direccion}`;
  pedido += `\n💳 *Pago / Payment:* ${metodo}`;
  pedido += `\n📝 *Notas / Notes:* ${extras}`;

  const url = `https://wa.me/15756370077?text=${encodeURIComponent(pedido)}`;
  window.open(url, '_blank');
}

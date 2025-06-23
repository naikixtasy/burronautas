const precios = {
  f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 7, rel: 6, win: 7,
  coke: 2, zero: 2, sprite: 2, pepper: 2
};

function calcularTotal() {
  const precios = {
    f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
    coke: 2, zero: 2, sprite: 2, pepper: 2
  };

  let total = 0;
  let burritos = [];

  for (const id in precios) {
    const cantidad = parseInt(document.getElementById(id)?.value || 0);
    const subtotal = cantidad * precios[id];
    total += subtotal;

    // Solo cuenta burritos para aplicar 2x1
    if (['f_q', 'r_q', 'pic', 'por', 'chi', 'mol', 'rel', 'win'].includes(id)) {
      for (let i = 0; i < cantidad; i++) {
        burritos.push(precios[id]);
      }
    }
  }

  // Verifica si está dentro del periodo de promoción
  const hoy = new Date();
  const inicioPromo = new Date("2025-06-30");
  const finPromo = new Date("2025-07-04");
  let descuento = 0;
  let promoActiva = false;

  if (hoy >= inicioPromo && hoy <= finPromo && burritos.length >= 2) {
    descuento = Math.min(...burritos);
    total -= descuento;
    promoActiva = true;
  }

  // Agrega cargo de entrega
  total += 3;

  let textoPromo = promoActiva
    ? `💲Total: $${total.toFixed(2)} (2x1 activo + $3 delivery fee)`
    : `💲Total: $${total.toFixed(2)} (incluye $3 delivery fee)`;

  document.getElementById("total").innerText = textoPromo;
  return total.toFixed(2);
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


document.addEventListener("DOMContentLoaded", () => {
  // Mostrar banner promocional si la fecha está dentro del rango
  const hoy = new Date();
  const inicioPromo = new Date("2025-06-30");
  const finPromo = new Date("2025-07-04");
  if (hoy >= inicioPromo && hoy <= finPromo) {
    document.getElementById("promo-banner").style.display = "block";
  }

  // Recalcular total al cargar y cuando se cambie una cantidad
  document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", calcularTotal);
  });

  calcularTotal(); // Inicializa total en 0 al cargar
});

function calcularTotal() {
  const precios = {
    f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
    coke: 2, zero: 2, sprite: 2, pepper: 2
  };

  const deliveryFee = 3;
  const hoy = new Date();
  const inicioPromo = new Date("2025-06-30");
  const finPromo = new Date("2025-07-04");

  let total = 0;
  const burritoIds = ["f_q", "r_q", "pic", "por", "chi", "mol", "rel", "win"];
  let burritoPrices = [];

  for (const id in precios) {
    const cantidad = parseInt(document.getElementById(id)?.value || 0);
    const precioUnitario = precios[id];
    const subtotal = cantidad * precioUnitario;
    total += subtotal;

    if (burritoIds.includes(id)) {
      for (let i = 0; i < cantidad; i++) {
        burritoPrices.push(precioUnitario);
      }
    }
  }

  if (hoy >= inicioPromo && hoy <= finPromo && burritoPrices.length >= 2) {
    burritoPrices.sort((a, b) => a - b); // menor a mayor
    total -= burritoPrices[0]; // aplica 2x1, descuenta el más barato
  }

  const totalConEnvio = total + deliveryFee;

  document.getElementById("total").innerHTML = `
    🧾 Subtotal: $${total.toFixed(2)}<br>
    🚚 Delivery Fee: $${deliveryFee.toFixed(2)}<br>
    🪐 <strong>Total: $${totalConEnvio.toFixed(2)}</strong>
  `;

  return totalConEnvio.toFixed(2);
}

function generarNumeroOrden() {
  const ahora = new Date();
  return 'B-' + ahora.getTime();
}

function enviarPedido() {
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const metodo = document.getElementById('metodo').value;
  const extras = document.getElementById('extras').value;
  const numeroOrden = generarNumeroOrden();

  const precios = {
    f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
    coke: 2, zero: 2, sprite: 2, pepper: 2
  };

  let pedido = `🛰️ *Burronautas Order #${numeroOrden}*

`;
  const items = document.querySelectorAll('.menu-grid .item');

  items.forEach(item => {
    const nombre = item.querySelector('h3').innerText;
    const input = item.querySelector('input');
    const cantidad = parseInt(input?.value || 0);
    if (cantidad > 0) {
      pedido += `• ${cantidad} x ${nombre}
`;
    }
  });

  const total = document.getElementById('total').textContent;

  pedido += `
📞 *Teléfono / Phone:* ${telefono}`;
  pedido += `
📍 *Dirección / Address:* ${direccion}`;
  pedido += `
💳 *Pago / Payment:* ${metodo}`;
  pedido += `
📝 *Notas / Notes:* ${extras}`;
  pedido += `
💰 *${total}*`;
  pedido += `
🔢 *Order ID:* ${numeroOrden}`;

  const url = \`https://wa.me/15756370077?text=\${encodeURIComponent(pedido)}\`;
  window.open(url, '_blank');
}

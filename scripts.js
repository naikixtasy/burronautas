const precios = {
  f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
  coke: 2, zero: 2, sprite: 2, pepper: 2
};

const burritoIds = ["f_q", "r_q", "pic", "por", "chi", "mol", "rel", "win"];

function estaEnPromocion() {
  const hoy = new Date();
  const inicio = new Date("2025-06-30");
  const fin = new Date("2025-07-04");
  return hoy >= inicio && hoy <= fin;
}

function calcularTotal() {
  let totalSinDescuento = 0;
  let burritos = [];

  for (const id in precios) {
    const cantidad = parseInt(document.getElementById(id)?.value || 0);
    const precioUnitario = precios[id];
    totalSinDescuento += cantidad * precioUnitario;

    if (burritoIds.includes(id) && cantidad > 0) {
      for (let i = 0; i < cantidad; i++) {
        burritos.push(precioUnitario);
      }
    }
  }

  let descuento = 0;
  if (estaEnPromocion() && burritos.length >= 2) {
    burritos.sort((a, b) => a - b);
    for (let i = 0; i + 1 < burritos.length; i += 2) {
      descuento += burritos[i]; // uno gratis por cada par
    }
  }

  const envio = 3;
  const totalFinal = totalSinDescuento - descuento + envio;

  // Actualiza visualmente el desglose si los elementos existen
  const subtotalElem = document.getElementById("subtotal");
  const descuentoElem = document.getElementById("descuento");
  const envioElem = document.getElementById("envio");
  const totalFinalElem = document.getElementById("totalFinal");

  if (subtotalElem) subtotalElem.innerText = `🧾 Subtotal sin descuento: $${totalSinDescuento.toFixed(2)}`;
  if (descuentoElem) descuentoElem.innerText = `🎁 Descuento 2x1 aplicado: -$${descuento.toFixed(2)}`;
  if (envioElem) envioElem.innerText = `🚚 Envío: +$${envio.toFixed(2)}`;
  if (totalFinalElem) totalFinalElem.innerText = `💰 Total con descuento y envío: $${totalFinal.toFixed(2)}`;

  // Actualiza el total general
  document.getElementById("total").innerText = `Total: $${totalFinal.toFixed(2)} USD`;
  return totalFinal.toFixed(2);
}

// Recalcular en tiempo real
document.querySelectorAll("input[type='number']").forEach(input => {
  input.addEventListener("input", calcularTotal);
});

function generarNumeroOrden() {
  return 'B-' + Date.now();
}

function enviarPedido() {
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const metodo = document.getElementById('metodo').value;
  const extras = document.getElementById('extras').value.trim();
  const total = calcularTotal();
  const numeroOrden = generarNumeroOrden();

  const items = document.querySelectorAll('.menu-grid .item');
  let pedido = `🛰️ *Burronautas Order #${numeroOrden}*\n\n`;

  items.forEach(item => {
    const nombre = item.querySelector('h3').innerText;
    const cantidad = item.querySelector('input').value;
    if (parseInt(cantidad) > 0) {
      pedido += `• ${cantidad} x ${nombre}\n`;
    }
  });

  pedido += `\n📞 *Teléfono / Phone:* ${telefono}`;
  pedido += `\n📍 *Dirección / Address:* ${direccion}`;
  pedido += `\n💳 *Pago / Payment:* ${metodo}`;
  pedido += `\n📝 *Notas / Notes:* ${extras}`;
  pedido += `\n💰 *Total (incluye envío): $${total}*`;
  pedido += `\n🔢 *Order ID:* ${numeroOrden}`;

  const url = `https://wa.me/15756370077?text=${encodeURIComponent(pedido)}`;
  window.open(url, '_blank');
}

// Mostrar banner promocional 2x1
window.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date();
  const inicioPromo = new Date("2025-06-30");
  const finPromo = new Date("2025-07-04");
  if (hoy >= inicioPromo && hoy <= finPromo) {
    document.getElementById("promo-banner").style.display = "block";
  }
});
<script>
  tsParticles.load("tsparticles", {
    background: {
      color: {
        value: "#0a001f"
      }
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 60,
        density: {
          enable: true,
          area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.6,
        random: true
      },
      size: {
        value: 2,
        random: true
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: false,
        straight: false,
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: false
        },
        onClick: {
          enable: false
        }
      }
    },
    detectRetina: true
  });
</script>


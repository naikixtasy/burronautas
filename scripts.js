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
      descuento += burritos[i];
    }
  }

  const envio = 3;
  const totalFinal = totalSinDescuento - descuento + envio;

  document.getElementById("subtotal").innerText = `🧾 Subtotal sin descuento: $${totalSinDescuento.toFixed(2)}`;
  document.getElementById("descuento").innerText = `🎁 Descuento 2x1 aplicado: -$${descuento.toFixed(2)}`;
  document.getElementById("envio").innerText = `🚚 Envío: +$${envio.toFixed(2)}`;
  document.getElementById("totalFinal").innerText = `💰 Total con descuento y envío: $${totalFinal.toFixed(2)}`;
  document.getElementById("total").innerText = `Total: $${totalFinal.toFixed(2)} USD`;

  return totalFinal.toFixed(2);
}

document.querySelectorAll("input[type='number']").forEach(input => {
  input.addEventListener("input", calcularTotal);
});

function generarNumeroOrden() {
  return 'B-' + Date.now();
}

function generarLinkMaps(direccion) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
}

function enviarPedido() {
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const metodo = document.getElementById('metodo').value;
  const extras = document.getElementById('extras').value.trim();
  const total = calcularTotal();
  const numeroOrden = generarNumeroOrden();
  const mapsLink = generarLinkMaps(direccion);

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
  pedido += `\n🗺️ *Mapa:* ${mapsLink}`;
  pedido += `\n💳 *Pago / Payment:* ${metodo}`;
  pedido += `\n📝 *Notas / Notes:* ${extras}`;
  pedido += `\n💰 *Total (incluye envío): $${total}*`;
  pedido += `\n🔢 *Order ID:* ${numeroOrden}`;

  const url = `https://wa.me/15756370077?text=${encodeURIComponent(pedido)}`;
  window.open(url, '_blank');
}

function initAutocomplete() {
  const input = document.getElementById("direccion");
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["address"],
    componentRestrictions: { country: "us" }
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    input.value = place.formatted_address || place.name;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (estaEnPromocion()) {
    document.getElementById("promo-banner").style.display = "block";
  }
});
tsParticles.load("tsparticles", {
  background: {
    color: "#0b001a"
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 150,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: ["#ffffff", "#bb86fc", "#80d8ff", "#ff4081"]
    },
    links: {
      color: "#ffffff",
      distance: 120,
      enable: true,
      opacity: 0.2,
      width: 1
    },
    collisions: {
      enable: false
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce"
      },
      random: false,
      speed: 1,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 900
      },
      value: 60
    },
    opacity: {
      value: 0.3
    },
    shape: {
      type: "circle"
    },
    size: {
      value: { min: 1, max: 4 }
    }
  },
  detectRetina: true
});


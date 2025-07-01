// Precios
const precios = {
  f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
  coke: 2, zero: 2, sprite: 2, pepper: 2,
  mex: 3
};

const burritoIds = ["f_q", "r_q", "pic", "por", "chi", "mol", "rel", "win"];

function estaEnPromocion() {
  const hoy = new Date();
  const inicio = new Date("2025-06-30");
  const fin = new Date("2025-07-04");
  return hoy >= inicio && hoy <= fin;
}

function calcularEnvio() {
  const lat = parseFloat(document.getElementById("address").getAttribute("data-lat"));
  const lng = parseFloat(document.getElementById("address").getAttribute("data-lng"));

  if (isNaN(lat) || isNaN(lng)) return 3.00;

  const baseLat = 32.2967;
  const baseLng = -106.7470;
  const R = 3958.8;
  const toRad = deg => deg * (Math.PI / 180);

  const dLat = toRad(lat - baseLat);
  const dLng = toRad(lng - baseLng);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(baseLat)) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;
  document.getElementById("distanciaValor").innerText = distancia.toFixed(2);

  if (distancia <= 5) return 3.00;
  const extraMillas = distancia - 5;
  return 3.00 + Math.ceil(extraMillas / 2) * 1.00;
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

  const envio = calcularEnvio();
  const totalFinal = totalSinDescuento - descuento + envio;

  document.getElementById("subtotal").innerText = `🧾 Subtotal (no discount): $${totalSinDescuento.toFixed(2)}`;
  document.getElementById("descuento").innerText = `🎁 2x1 Discount applied: -$${descuento.toFixed(2)}`;
  document.getElementById("envio").innerText = `🚚 Delivery: +$${envio.toFixed(2)}`;
  document.getElementById("totalFinal").innerText = `💰 Total (with discount and delivery): $${totalFinal.toFixed(2)}`;
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

function generarTextoPedido() {
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('address').value.trim();
  const fechaEntrega = document.getElementById('fecha').value;
  const metodo = document.getElementById('metodo').value;
  const extras = document.getElementById('extras').value.trim();
  const total = calcularTotal();
  const numeroOrden = generarNumeroOrden();
  const mapsLink = generarLinkMaps(direccion);

  const items = document.querySelectorAll('.menu-grid .item');
  let pedido = `🛰️ *Burronautas Order #${numeroOrden}*\n\n`;
  let hayProductos = false;

  items.forEach(item => {
    const nombre = item.querySelector('h3').innerText;
    const cantidad = item.querySelector('input').value;
    if (parseInt(cantidad) > 0) {
      hayProductos = true;
      pedido += `• ${cantidad} x ${nombre}\n`;
    }
  });

  if (!hayProductos) return null;

  pedido += `\n📞 *Phone:* ${telefono}`;
  pedido += `\n📍 *Address:* ${direccion}`;
  pedido += `\n📅 *Delivery Date:* ${fechaEntrega}`;
  if (fechaEntrega !== new Date().toISOString().split('T')[0]) {
    pedido += `\n⚠️ *ADVANCE ORDER!* / *¡ORDEN ANTICIPADA!*`;
  }

  pedido += `\n🗺️ *Map:* ${mapsLink}`;
  pedido += `\n💳 *Payment Method:* ${metodo}`;
  pedido += `\n📝 *Notes:* ${extras}`;
  pedido += `\n💰 *Total (with delivery): $${total}*`;
  pedido += `\n🔢 *Order ID:* ${numeroOrden}`;

  return { texto: pedido, hayProductos, numeroOrden };
}

function enviarPedido() {
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('address').value.trim();
  const fechaEntrega = document.getElementById('fecha').value;

  if (!telefono || !direccion || !fechaEntrega) {
    alert("⚠️ Please fill in your phone number, address, and delivery date. / Por favor llena el número de teléfono, la dirección y la fecha.");
    return;
  }

  const { texto, hayProductos, numeroOrden } = generarTextoPedido();
  if (!hayProductos) {
    alert("⚠️ Please select at least one product before sending. / Debes seleccionar al menos un producto.");
    return;
  }

  registrarEnSheet({
    orderId: numeroOrden,
    items: Array.from(document.querySelectorAll('.menu-grid .item')).filter(item => parseInt(item.querySelector('input').value) > 0).map(item => {
      const nombre = item.querySelector('h3').innerText;
      const cantidad = item.querySelector('input').value;
      return `${cantidad} x ${nombre}`;
    }),
    telefono,
    direccion,
    fechaEntrega,
    metodo: document.getElementById('metodo').value,
    extras: document.getElementById('extras').value.trim(),
    total: calcularTotal()
  });

  const url = `https://wa.me/15756370077?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

function prepararMensajeInstagram() {
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('address').value.trim();
  const fechaEntrega = document.getElementById('fecha').value;

  if (!telefono || !direccion || !fechaEntrega) {
    alert("⚠️ Please fill in your phone number, address, and delivery date. / Por favor llena el número de teléfono, la dirección y la fecha.");
    return;
  }

  const { texto, hayProductos } = generarTextoPedido();

  if (!hayProductos) {
    alert("⚠️ Please select at least one product. / Debes seleccionar al menos un producto.");
    return;
  }

  navigator.clipboard.writeText(texto).then(() => {
    alert("✅ Your order has been copied. We'll now redirect you to Instagram to paste it. / Tu pedido ha sido copiado. Ahora te llevamos a Instagram para que lo pegues.");
    window.open("https://www.instagram.com/burronautas_las_cruces/", "_blank");
  }).catch(err => {
    alert("❌ Could not copy the order. Try again. / No se pudo copiar el pedido. Intenta de nuevo.");
    console.error(err);
  });
}

function initAutocomplete() {
  const input = document.getElementById("address");
  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: ["us"] },
    fields: ["formatted_address", "geometry"],
  });

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    const address = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    document.getElementById("address").setAttribute("data-maps-link", mapsLink);
    document.getElementById("address").setAttribute("data-formatted-address", address);
    document.getElementById("address").setAttribute("data-lat", lat);
    document.getElementById("address").setAttribute("data-lng", lng);

    calcularTotal();
  });
}

function registrarEnSheet(data) {
  const direccionTexto = document.getElementById("address").getAttribute("data-formatted-address") 
                      || document.getElementById("address").value;

  const datosFinales = {
    ...data,
    direccion: direccionTexto
  };

  fetch('https://script.google.com/macros/s/AKfycbxtNszQtCUlSoLtUQmbX59VrDJ11EhC0rYftkUaUspjWi_exrKK87OkVr9y99Z6hF-F/exec', {
    method: 'POST',
    body: JSON.stringify(datosFinales),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.text())
  .then(result => console.log("✅ Registered in Google Sheets:", result))
  .catch(error => console.error("❌ Registration failed:", error));
}

window.initAutocomplete = initAutocomplete;

// tsParticles config (no change)
tsParticles.load("tsparticles", {
  background: { color: "#0b001a" },
  fpsLimit: 60,
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" }, resize: true },
    modes: { repulse: { distance: 150, duration: 0.4 } }
  },
  particles: {
    color: { value: ["#ffffff", "#bb86fc", "#80d8ff", "#ff4081"] },
    links: { color: "#ffffff", distance: 120, enable: true, opacity: 0.2, width: 1 },
    collisions: { enable: false },
    move: { enable: true, speed: 1, direction: "none", random: false, straight: false, outModes: { default: "bounce" } },
    number: { density: { enable: true, area: 900 }, value: 60 },
    opacity: { value: 0.3 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 4 } }
  },
  detectRetina: true
});

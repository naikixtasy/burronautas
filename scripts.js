let autocomplete;
let distanciaGlobal = 0;

function initAutocomplete() {
  const input = document.getElementById('address');
  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: "us" }
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    const base = new google.maps.LatLng(32.3112, -106.7637); // Dirección base
    const destino = place.geometry.location;

    const distanciaMillas = google.maps.geometry.spherical.computeDistanceBetween(base, destino) * 0.000621371;
    const distanciaRedondeada = Math.round(distanciaMillas * 10) / 10;
    distanciaGlobal = distanciaRedondeada;
    document.getElementById('distanciaValor').innerText = distanciaRedondeada.toFixed(1);

    actualizarTotales();
  });
}

function actualizarTotales() {
  const precios = {
    f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
    coke: 2, zero: 2, sprite: 2, pepper: 2, mex: 3
  };

  const burritos = ["f_q", "r_q", "pic", "por", "chi", "mol", "rel", "win"];

  let subtotal = 0;
  let burritoPreciosIndividuales = [];

  for (let id in precios) {
    const cantidad = parseInt(document.getElementById(id).value) || 0;
    subtotal += precios[id] * cantidad;

    if (burritos.includes(id)) {
      for (let i = 0; i < cantidad; i++) {
        burritoPreciosIndividuales.push(precios[id]);
      }
    }
  }

  // Descuento 2x1 válido hasta el 5 de julio
  burritoPreciosIndividuales.sort((a, b) => b - a);
  let descuento = 0;
  const hoy = new Date();
  const limite = new Date("2025-07-05");
  if (hoy <= limite) {
    while (burritoPreciosIndividuales.length > 1) {
      const precioAlto = burritoPreciosIndividuales.shift();
      const precioBajo = burritoPreciosIndividuales.pop();
      descuento += precioBajo;
    }
  }

  // Calcular envío
  let envio = 0;
  let mensajeEnvio = "";

  if (distanciaGlobal > 0) {
    envio = 3;
    if (distanciaGlobal > 5) {
      const extra = Math.ceil((distanciaGlobal - 5) / 2);
      envio += extra;
      mensajeEnvio = `🚨 Extra charge for distance: +$${extra}.00 USD / Cargo adicional por distancia: +$${extra}.00 USD`;
    }
  }

  const total = subtotal + envio - descuento;

  document.getElementById("subtotal").innerHTML = `Subtotal: $${subtotal.toFixed(2)} USD`;
  document.getElementById("descuento").innerHTML = descuento > 0 ? `🎉 Discount: -$${descuento.toFixed(2)} USD` : "";
  document.getElementById("envio").innerHTML = `🚚 Delivery Fee: $${envio.toFixed(2)} USD`;
  document.getElementById("mensajeEnvioExtra").innerHTML = mensajeEnvio;
  document.getElementById("total").innerHTML = `Total: $${total.toFixed(2)} USD`;
  document.getElementById("totalFinal").innerHTML = "";
}

document.querySelectorAll("input[type='number']").forEach(input => {
  input.addEventListener("input", actualizarTotales);
});

function generarResumenPedidoLista() {
  const items = document.querySelectorAll(".menu-grid .item");
  let resumen = "";
  items.forEach(item => {
    const titulo = item.querySelector("h3").innerText;
    const cantidad = parseInt(item.querySelector("input").value);
    if (cantidad > 0) {
      const nombre = titulo.split(" ($")[0];
      const precio = titulo.split(" ($")[1].replace(")", "");
      resumen += `* ${cantidad} x ${nombre} ($${precio})\n`;
    }
  });
  return resumen;
}

function enviarPedido() {
  const telefono = document.getElementById("telefono").value;
  const address = document.getElementById("address").value;
  const fecha = document.getElementById("fecha").value;
  const metodo = document.getElementById("metodo").value;
  const extras = document.getElementById("extras").value;
  const total = document.getElementById("total").innerText.split(": $")[1];
  const distanciaTexto = document.getElementById("distanciaValor").innerText;

  const pedido = generarResumenPedidoLista();
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const orderId = "B-" + Date.now();

  const mensaje = `🛰️ Burronautas Order #${orderId}\n\n${pedido}\n📞 Teléfono / Phone: ${telefono}\n📍 Dirección / Address: ${address}\n📅 Fecha de entrega / Delivery Date: ${fecha}\n🗺️ Mapa: ${mapsLink}\n💳 Pago / Payment: ${metodo}\n📝 Notas / Notes: ${extras}\n🚚 Distancia estimada: ${distanciaTexto} mi\n💰 Total (incluye envío): $${total}\n🔢 Order ID: ${orderId}`;

  const whatsappURL = `https://wa.me/15756370077?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
}

function prepararMensajeInstagram() {
  const telefono = document.getElementById("telefono").value;
  const address = document.getElementById("address").value;
  const fecha = document.getElementById("fecha").value;
  const metodo = document.getElementById("metodo").value;
  const extras = document.getElementById("extras").value;
  const total = document.getElementById("total").innerText.split(": $")[1];
  const distanciaTexto = document.getElementById("distanciaValor").innerText;

  const pedido = generarResumenPedidoLista();
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const orderId = "B-" + Date.now();

  const mensaje = `🛰️ Burronautas Order #${orderId}\n\n${pedido}\n📞 Teléfono / Phone: ${telefono}\n📍 Dirección / Address: ${address}\n📅 Fecha de entrega / Delivery Date: ${fecha}\n🗺️ Mapa: ${mapsLink}\n💳 Pago / Payment: ${metodo}\n📝 Notas / Notes: ${extras}\n🚚 Distancia estimada: ${distanciaTexto} mi\n💰 Total (incluye envío): $${total}\n🔢 Order ID: ${orderId}`;

  navigator.clipboard.writeText(mensaje).then(() => {
    alert("📋 Message copied! Now paste it in Instagram Direct. / ¡Mensaje copiado! Pega en Instagram Direct.");
  });
}

window.onload = () => {
  actualizarTotales();
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").setAttribute("min", hoy);
  initAutocomplete();
};

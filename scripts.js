let autocomplete;
let distanciaGlobal = 0;

function initAutocomplete() {
  const input = document.getElementById("address");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", calcularDistancia);
}

function calcularDistancia() {
  const place = autocomplete.getPlace();
  if (!place.geometry || !place.geometry.location) {
    return;
  }

  const destino = place.geometry.location;
  const base = new google.maps.LatLng(32.303189, -106.735188); // Dirección base: 100 Vista Del Monte, Las Cruces

  const distancia = google.maps.geometry.spherical.computeDistanceBetween(base, destino);
  const millas = distancia / 1609.34;
  distanciaGlobal = millas;

  document.getElementById("distanciaValor").textContent = millas.toFixed(2);

  actualizarTotales();
}

function actualizarTotales() {
  const precios = {
    f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 6, rel: 7, win: 6,
    coke: 2, zero: 2, sprite: 2, pepper: 2, mex: 3
  };

  let subtotal = 0;
  for (let id in precios) {
    const cantidad = parseInt(document.getElementById(id).value) || 0;
    subtotal += precios[id] * cantidad;
  }

  // Calcular descuento 2x1
  let cantidades = Object.keys(precios).map(id => {
    const cantidad = parseInt(document.getElementById(id).value) || 0;
    return Array(cantidad).fill(precios[id]);
  }).flat();

  cantidades.sort((a, b) => a - b);
  let descuento = 0;
  for (let i = 0; i < cantidades.length - 1; i += 2) {
    descuento += Math.min(cantidades[i], cantidades[i + 1]);
  }

  // Calcular envío
  let envio = 0;
  let mensajeEnvio = "";

  if (distanciaGlobal > 0) {
    envio = 3; // Base fee
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

function generarResumenPedido() {
  const items = document.querySelectorAll(".menu-grid .item");
  let resumen = "";
  items.forEach(item => {
    const titulo = item.querySelector("h3").innerText.split(" ($")[0];
    const cantidad = item.querySelector("input").value;
    if (parseInt(cantidad) > 0) {
      resumen += `- ${titulo}: ${cantidad}\n`;
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

  const pedido = generarResumenPedido();
  const total = document.getElementById("total").innerText;

  const mensaje = `🚀 *Burronautas Order* 🚀\n\n📦 *Order Summary / Resumen del Pedido:*\n${pedido}\n🏡 *Delivery Address:* ${address}\n📅 *Date:* ${fecha}\n💵 *Payment:* ${metodo}\n📞 *Phone:* ${telefono}\n📝 *Notes:* ${extras}\n\n${total}`;

  const whatsappURL = `https://wa.me/15756370077?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
}

function prepararMensajeInstagram() {
  const telefono = document.getElementById("telefono").value;
  const address = document.getElementById("address").value;
  const fecha = document.getElementById("fecha").value;
  const metodo = document.getElementById("metodo").value;
  const extras = document.getElementById("extras").value;

  const pedido = generarResumenPedido();
  const total = document.getElementById("total").innerText;

  const mensaje = `🚀 BURRONAUTAS Order\n\n📦 Order Summary:\n${pedido}\n🏡 Address: ${address}\n📅 Date: ${fecha}\n💵 Payment: ${metodo}\n📞 Phone: ${telefono}\n📝 Notes: ${extras}\n\n${total}`;
  navigator.clipboard.writeText(mensaje).then(() => {
    alert("📋 Message copied! Now paste it in Instagram Direct. / ¡Mensaje copiado! Pega en Instagram Direct.");
  });
}

window.onload = () => {
  actualizarTotales();

  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").setAttribute("min", hoy);
};

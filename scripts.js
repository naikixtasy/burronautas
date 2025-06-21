<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Mission: Burrito 3.0</title>
  <link rel="stylesheet" href="styles.css" />
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>
<body>

<header>
  <img src="logomb.png" alt="Mission Burrito Logo">
  <h1>🚀 Mission: Burrito 3.0</h1>
  <p>Fuel your day with Space-Ready Burritos! / ¡Combustible espacial para tu día!</p>
</header>

<!-- 🫔 BURRITOS -->
<section class="menu-grid">
  <div class="item"><img src="frijolesconqueso.png"><h3>Frijoles con Queso / Beans & Cheese<br>$4</h3><input type="number" id="f_q" min="0" value="0"></div>
  <div class="item"><img src="rajasconqueso.png"><h3>Rajas con Queso / Anaheim, Onions & Cheese<br>$6</h3><input type="number" id="r_q" min="0" value="0"></div>
  <div class="item"><img src="picadillo.png"><h3>Picadillo / Ground Beef & Potatoes<br>$7</h3><input type="number" id="pic" min="0" value="0"></div>
  <div class="item"><img src="asado de puerco.png"><h3>Puerco en Rojo / Pork in Red Chile<br>$7</h3><input type="number" id="por" min="0" value="0"></div>
  <div class="item"><img src="chicharron.png"><h3>Chicharrón Verde / Green Pork Rinds<br>$7</h3><input type="number" id="chi" min="0" value="0"></div>
  <div class="item"><img src="mole.png"><h3>Mole / Chicken in Mole Sauce<br>$7</h3><input type="number" id="mol" min="0" value="0"></div>
  <div class="item"><img src="chilerelleno.png"><h3>Chile Relleno / Stuffed Pepper<br>$6</h3><input type="number" id="rel" min="0" value="0"></div>
  <div class="item"><img src="winnie.png"><h3>Winnie / Sausage & Beans<br>$7</h3><input type="number" id="win" min="0" value="0"></div>
</section>

<!-- 🥤 SODAS -->
<section class="menu-grid">
  <div class="item"><img src="cocacola.png" class="soda"><h3>Coca Cola<br>$2</h3><input type="number" id="coke" min="0" value="0"></div>
  <div class="item"><img src="cocazero.png" class="soda"><h3>Coca Zero<br>$2</h3><input type="number" id="zero" min="0" value="0"></div>
  <div class="item"><img src="sprite.png" class="soda"><h3>Sprite<br>$2</h3><input type="number" id="sprite" min="0" value="0"></div>
  <div class="item"><img src="drpepper.png" class="soda"><h3>Dr Pepper<br>$2</h3><input type="number" id="pepper" min="0" value="0"></div>
</section>

<!-- 📝 FORMULARIO -->
<section class="order-section">
  <label for="telefono">📱 Número de Teléfono / Phone Number</label>
  <input type="tel" id="telefono" placeholder="575-000-0000">

  <label for="direccion">📍 Dirección de Entrega / Delivery Address</label>
  <input type="text" id="direccion" placeholder="Calle, número, colonia / Street, number, neighborhood">

  <label for="metodo">💳 Método de Pago / Payment Method</label>
  <select id="metodo">
    <option value="Efectivo">💵 Efectivo / Cash</option>
    <option value="Cash App $naiquia86">💸 Cash App $naiquia86</option>
    <option value="PayPal @Naiqui">💻 PayPal @Naiqui</option>
  </select>

  <label for="extras">📝 Extras o notas / Extras or Notes:</label>
  <textarea id="extras" placeholder="Agrega instrucciones, combos o comentarios aquí..."></textarea>

  <h3 id="total">💲Total: $0.00</h3>
  <button onclick="enviarPedido()">📦 Enviar Pedido por WhatsApp / Send Order via WhatsApp</button>
</section>

<!-- 💳 PAGO -->
<footer class="payment">
  <h3>Opciones de Pago / Payment Options:</h3>
  <p><strong>Cash App:</strong> <a href="https://cash.app/$naiquia86" target="_blank">$naiquia86</a></p>
  <p><strong>PayPal:</strong> <a href="https://paypal.me/Naiqui" target="_blank">@Naiqui</a></p>
  <p><strong>También aceptamos pagos en efectivo / We also accept Cash Payments</strong></p>
</footer>

<a class="btn-whatsapp" href="#" onclick="enviarPedido()"><i class="fab fa-whatsapp"></i> Ordenar</a>

<!-- 📜 SCRIPT -->
<script>
  const precios = {
    f_q: 4, r_q: 6, pic: 7, por: 7, chi: 7, mol: 7, rel: 6, win: 7,
    coke: 2, zero: 2, sprite: 2, pepper: 2
  };

  function calcularTotal() {
    let total = 0;
    for (const id in precios) {
      const cantidad = parseInt(document.getElementById(id).value) || 0;
      total += cantidad * precios[id];
    }
    document.getElementById("total").innerText = `💲Total: $${total.toFixed(2)}`;
    return total.toFixed(2);
  }

  document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", calcularTotal);
  });

  function enviarPedido() {
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const metodo = document.getElementById('metodo').value;
    const extras = document.getElementById('extras').value;
    const total = calcularTotal();
    const idOrden = Math.floor(Math.random() * 90000 + 10000);

    const items = document.querySelectorAll('.menu-grid .item');
    let pedido = `🛸 *Mission: Burrito 3.0*\n🧾 *Orden No. ${idOrden}*\n\n`;

    items.forEach(item => {
      const nombre = item.querySelector('h3').innerText.split('<br>')[0];
      const input = item.querySelector('input');
      const cantidad = parseInt(input.value);
      if (cantidad > 0) {
        const id = input.id;
        pedido += `• ${cantidad} x ${nombre} - $${(cantidad * precios[id]).toFixed(2)}\n`;
      }
    });

    pedido += `\n💲 *Total: $${total}*`;
    pedido += `\n📞 *Teléfono / Phone:* ${telefono}`;
    pedido += `\n📍 *Dirección / Address:* ${direccion}`;
    pedido += `\n💳 *Pago / Payment:* ${metodo}`;
    pedido += `\n📝 *Notas / Notes:* ${extras}`;

    const url = `https://wa.me/15756370077?text=${encodeURIComponent(pedido)}`;
    window.open(url, '_blank');
  }
</script>

</body>
</html>

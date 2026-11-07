export async function onRequestPost({ request, env }) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return reply(500, { ok: false, message: "Telegram ещё не настроен на сервере." });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return reply(400, { ok: false, message: "Не удалось прочитать заявку." });
  }

  const clean = (value, max) => String(value ?? "").trim().slice(0, max);
  const name = clean(data.name, 100);
  const phone = clean(data.phone, 60);
  const product = clean(data.product, 120);
  const comment = clean(data.comment, 1000);

  if (!name || !phone || !product) {
    return reply(400, { ok: false, message: "Заполните имя, телефон и заказ." });
  }

  const message = [
    "🥐 НОВЫЙ ПРЕДЗАКАЗ BIOFROST",
    "",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Заказ: ${product}`,
    `Комментарий: ${comment || "не указан"}`
  ].join("\n");

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message })
    });
    const result = await telegramResponse.json();
    if (!telegramResponse.ok || !result.ok) {
      return reply(502, { ok: false, message: "Telegram не принял заявку. Проверьте настройки бота." });
    }
    return reply(200, { ok: true, message: "Заявка отправлена! Скоро свяжемся с вами." });
  } catch {
    return reply(502, { ok: false, message: "Не удалось связаться с Telegram. Попробуйте позже." });
  }
}

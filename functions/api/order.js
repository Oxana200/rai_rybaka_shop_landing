

const prices = {
    kit: 1510,
    net: 255,
    bait: 65
};

const deliveryNames = {
    branch: "Відділення Нової пошти",
    courier: "Кур'єрська доставка",
    meest: "Meest Пошта",
    rozetka: "Точка видачі ROZETKA",
    ukrposhta: "Укрпошта"
};

// Перевірка роботи API
export function onRequestGet() {
    return Response.json(
        { status: "API працює" },
        { headers: { "Cache-Control": "no-store" } }
    );
}

// Приймання замовлення
export async function onRequestPost({ request, env }) {
    const reply = (data, status = 200) =>
        Response.json(data, {
            status,
            headers: { "Cache-Control": "no-store" }
        });

    try {
        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
            return reply({ error: "Server not configured" }, 500);
        }

        const contentType = request.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return reply({ error: "Invalid content type" }, 415);
        }

        // Отримання даних замовлення
        const body = await request.text();

        if (body.length > 10000) {
            return reply({ error: "Request too large" }, 413);
        }

        const order = JSON.parse(body);

        if (
            !order ||
            typeof order !== "object" ||
            Array.isArray(order)
        ) {
            return reply({ error: "Invalid order" }, 400);
        }

        const clean = (value, max = 200) =>
            typeof value === "string"
                ? value.trim().slice(0, max)
                : "";

        const name = clean(order.name);
        const phone = clean(order.phone, 30);
        const city = clean(order.city);
        const address = clean(order.delivery_address);
        const comment = clean(order.comment, 500);
        const delivery = clean(order.delivery_type, 30);

        // Обов'язкові тільки ім'я та телефон
        if (
            !name ||
            !/^\+?[0-9()\s-]{9,20}$/.test(phone)
        ) {
            return reply({ error: "Invalid name or phone" }, 400);
        }

        // Доставка необов'язкова, але значення перевіряємо
        if (delivery && !deliveryNames[delivery]) {
            return reply({ error: "Invalid delivery type" }, 400);
        }

        // Перевірка додаткових товарів
        const selectedExtras = order.extras ?? [];

        if (
            !Array.isArray(selectedExtras) ||
            selectedExtras.some(
                item => !["net", "bait"].includes(item)
            )
        ) {
            return reply({ error: "Invalid extras" }, 400);
        }

        const extras = [...new Set(selectedExtras)];

        // Розрахунок вартості
        const total =
            prices.kit +
            extras.reduce(
                (sum, item) => sum + prices[item],
                0
            );

        // Повідомлення для Telegram
        const message = [
            "🎣 НОВЕ ЗАМОВЛЕННЯ — РАЙ РИБАКА",
            "",
            `👤 Покупець: ${name}`,
            `📞 Телефон: ${phone}`,
            `📍 Місто: ${city || "Не вказано"}`,
            `🚚 Доставка: ${deliveryNames[delivery] || "Не обрано"}`,
            `📦 Адреса / відділення: ${address || "Не вказано"}`,
            "",
            `🎣 Риболовний набір 16 в 1 — ${prices.kit} грн`,
            ...extras.map(item =>
                item === "net"
                    ? `➕ Підсак — ${prices.net} грн`
                    : `➕ Прикормка — ${prices.bait} грн`
            ),
            "",
            `💰 РАЗОМ: ${total} грн`,
            comment ? `💬 Коментар: ${comment}` : ""
        ].filter(Boolean).join("\n");

        // Telegram
        const token = String(env.TELEGRAM_BOT_TOKEN).trim();
        const chatId = String(env.TELEGRAM_CHAT_ID).trim();

        if (!/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
            console.error("Invalid Telegram token format");

            return reply(
                { error: "Invalid server configuration" },
                500
            );
        }

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            }
        );

        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json()
                .catch(() => ({}));

            console.error(
                "Telegram delivery failed:",
                telegramResponse.status,
                errorData.description || "Unknown error"
            );

            return reply({ error: "Delivery failed" }, 502);
        }

        return reply({ success: true, total });

    } catch (error) {
        console.error("Order processing error:", error?.name);

        return reply(
            { error: "Could not process order" },
            400
        );
    }
}

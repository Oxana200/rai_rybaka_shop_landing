// Порядок фотографій. Тут можна змінювати назви та файли.
const photos = [
    { file: "nabir.webp", title: "Риболовний набір" },
    { file: "symka.webp", title: "Чохол" },
    { file: "vydka.webp", title: "Вудочки" },
    { file: "kotushka.webp", title: "Котушки" },
    { file: "sadok.webp", title: "Садок" },
    { file: "snasti_nabir.webp", title: "Снасті — загальний вигляд" },
    { file: "korm.webp", title: "Прикормка" },
    { file: "bononec.webp", title: "Сигналізатори Бубонець" },
    { file: "snasti_korop.webp", title: "Снасть на коропа" },
    { file: "snasti_karas.webp", title: "Снасть на карася" },

    // Решта фотографій
    { file: "boil_nabir.webp", title: "Шило, сверло і протяжка" },
    { file: "hachku.webp", title: "Гачки" },
    { file: "hruzuku.webp", title: "Грузила" },
    { file: "poplavku.webp", title: "Поплавки" },
    { file: "pufic.webp", title: "Насадка Пуфік" },
    { file: "stoporku.webp", title: "Стопорки" },
    { file: "svitliachku.webp", title: "Світлячки" },
    { file: "sadok2.webp", title: "Садок — додаткове фото" },
    { file: "symka2.webp", title: "Чохол — додаткове фото" },
];

const carousel = document.querySelector(".carousel");

if (carousel) {
    const list = carousel.querySelector(".carousel-list");
    const prevButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const currentCounter = carousel.querySelector("#current-slide");
    const totalCounter = carousel.querySelector("#total-slides");
    const caption = carousel.querySelector("#slide-caption");

    let currentIndex = 0;

    // Створюємо слайди.
    const slides = photos.map((photo, index) => {
        const slide = document.createElement("li");
        slide.className = "carousel-slide";
        slide.hidden = index !== 0;

        const image = document.createElement("img");
        image.src = `./images/${photo.file}`;
        image.alt = photo.title;
        image.width = 480;
        image.height = 480;
        image.loading = index === 0 ? "eager" : "lazy";
        image.draggable = false;

        slide.append(image);
        list.append(slide);

        return slide;
    });

    totalCounter.textContent = photos.length;

    // Показуємо потрібне фото.
    function showSlide(index) {
        // Після останнього фото переходимо до першого і навпаки.
        currentIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.hidden = slideIndex !== currentIndex;
        });

        currentCounter.textContent = currentIndex + 1;
        caption.textContent = photos[currentIndex].title;
    }

    prevButton.disabled = slides.length < 2;
    nextButton.disabled = slides.length < 2;

    prevButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
    });

    // Свайп на телефоні. Вертикальна прокрутка залишається доступною.
    let touchStartX = 0;
    let touchStartY = 0;

    list.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].clientX;
            touchStartY = event.changedTouches[0].clientY;
        },
        { passive: true }
    );

    list.addEventListener(
        "touchend",
        (event) => {
            const deltaX = event.changedTouches[0].clientX - touchStartX;
            const deltaY = event.changedTouches[0].clientY - touchStartY;

            // Перемикаємо лише при достатньому горизонтальному русі.
            if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) {
                return;
            }

            showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
        },
        { passive: true }
    );

    showSlide(0);
}

/* Надсилання замовлення в Telegram */


const WORKER_URL =
    "https://rai-rybaka-orders.oxanamoisiuk7.workers.dev/";


const orderForm = document.querySelector("#order-form");

if (orderForm) {
    const submitButton = orderForm.querySelector(
        'button[type="submit"]'
    );
    const formStatus = document.querySelector("#form-status");

    submitButton.disabled = false;

    orderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!orderForm.reportValidity()) return;

        const formData = new FormData(orderForm);

        const order = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            city: formData.get("city"),
            delivery_type: formData.get("delivery_type"),
            delivery_address: formData.get("delivery_address"),
            comment: formData.get("comment"),
            extras: formData.getAll("extras")
        };

        submitButton.disabled = true;
        submitButton.textContent = "Надсилаємо...";
        formStatus.textContent = "";

        try {
            const response = await fetch(WORKER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error("Помилка надсилання");
            }

            formStatus.textContent =
                "✅ Дякуємо! Ваше замовлення прийнято. " +
                "Ми скоро з вами зв'яжемося.";

            orderForm.reset();
        } catch (error) {
            formStatus.textContent =
                "❌ Не вдалося надіслати замовлення. " +
                "Спробуйте ще раз.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Підтвердити замовлення";
        }
    });
}


/* Карусель відгуків покупців */

const reviewsList = document.querySelector("#reviews-list");

if (reviewsList) {
    const cards = [...reviewsList.querySelectorAll(".review-card")];
    const prev = document.querySelector(".reviews-prev");
    const next = document.querySelector(".reviews-next");
    const current = document.querySelector("#review-current");
    const total = document.querySelector("#review-total");

    total.textContent = cards.length;

    function getCurrentIndex() {
        if (!cards.length) return 0;

        const position = reviewsList.scrollLeft;

        let closestIndex = 0;
        let smallestDistance = Infinity;

        cards.forEach((card, index) => {
            const distance = Math.abs(card.offsetLeft -
                cards[0].offsetLeft - position);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    function getVisibleCount() {
        if (!cards.length) return 0;

        const gap = parseFloat(
            getComputedStyle(reviewsList).gap
        ) || 0;

        return Math.max(
            1,
            Math.floor(
                (reviewsList.clientWidth + gap + 1) /
                (cards[0].getBoundingClientRect().width + gap)
            )
        );
    }

    function updateControls() {
        const index = getCurrentIndex();
        const maxIndex = Math.max(0, cards.length - getVisibleCount());

        current.textContent = Math.min(index, maxIndex) + 1;

        prev.disabled = index <= 0;
        next.disabled = index >= maxIndex;
    }

    function move(direction) {
        const index = getCurrentIndex();
        const maxIndex = Math.max(0, cards.length - getVisibleCount());
        const target = Math.max(
            0,
            Math.min(index + direction, maxIndex)
        );

        if (!cards[target]) return;

        reviewsList.scrollTo({
            left: cards[target].offsetLeft - cards[0].offsetLeft,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "instant" : "smooth"
        });
    }

    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));

    reviewsList.addEventListener("scroll", updateControls, {
        passive: true
    });

    window.addEventListener("resize", updateControls);

    updateControls();
}

// Порядок фотографій у каруселі.
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
    { file: "boil_nabir.webp", title: "Шило, сверло і протяжка" },
    { file: "hachku.webp", title: "Гачки" },
    { file: "hruzuku.webp", title: "Грузила" },
    { file: "poplavku.webp", title: "Поплавки" },
    { file: "pufic.webp", title: "Насадка Пуфік" },
    { file: "stoporku.webp", title: "Стопорки" },
    { file: "svitliachku.webp", title: "Світлячки" },
    { file: "sadok2.webp", title: "Садок — додаткове фото" },
    { file: "symka2.webp", title: "Чохол — додаткове фото" }
];

// КАРУСЕЛЬ ФОТОГРАФІЙ
const carousel = document.querySelector(".carousel");
if (carousel) {
    const list = carousel.querySelector(".carousel-list");
    const prevButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const currentCounter = carousel.querySelector("#current-slide");
    const totalCounter = carousel.querySelector("#total-slides");
    const caption = carousel.querySelector("#slide-caption");

    let currentIndex = 0;

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

    function showSlide(index) {
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

            if (
                Math.abs(deltaX) < 50 ||
                Math.abs(deltaX) <= Math.abs(deltaY)
            ) {
                return;
            }

            showSlide(currentIndex + (deltaX < 0 ? 1 : -1));
        },
        { passive: true }
    );

    showSlide(0);
}

// ПОВНОЕКРАННИЙ ПЕРЕГЛЯД ФОТО
const photoModal = document.getElementById("photo-modal");
const photoModalImage = document.getElementById("photo-modal-image");
const photoModalClose = document.getElementById("photo-modal-close");
const photoModalPrev = document.getElementById("photo-modal-prev");
const photoModalNext = document.getElementById("photo-modal-next");
const photoModalCounter = document.getElementById("photo-modal-counter");
if (photoModal && photoModalImage && photoModalClose) {
    const galleryImages = [
        ...document.querySelectorAll(".gallery img")
    ];

    let currentPhotoIndex = 0;
    let touchStartX = 0;
    let previousFocus = null;

    function showPhoto(index) {
        if (!galleryImages.length) return;

        currentPhotoIndex =
            (index + galleryImages.length) % galleryImages.length;

        const img = galleryImages[currentPhotoIndex];

        photoModalImage.src = img.currentSrc || img.src;
        photoModalImage.alt = img.alt || "Фото товару";

        photoModalCounter.textContent =
            `${currentPhotoIndex + 1} / ${galleryImages.length}`;
    }

    function closePhotoModal() {
        photoModal.classList.remove("open");
        photoModal.setAttribute("aria-hidden", "true");
        photoModalImage.removeAttribute("src");
        document.body.style.overflow = "";

        if (previousFocus?.isConnected) {
            previousFocus.focus();
        }
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => {
            previousFocus = document.activeElement;
            showPhoto(index);

            photoModal.classList.add("open");
            photoModal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";

            photoModalClose.focus();
        });
    });

    photoModalPrev.addEventListener("click", () => {
        showPhoto(currentPhotoIndex - 1);
    });

    photoModalNext.addEventListener("click", () => {
        showPhoto(currentPhotoIndex + 1);
    });

    photoModalClose.addEventListener("click", closePhotoModal);

    photoModal.addEventListener("click", (event) => {
        if (event.target === photoModal) {
            closePhotoModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!photoModal.classList.contains("open")) return;

        if (event.key === "Escape") {
            closePhotoModal();
        }

        if (event.key === "ArrowLeft") {
            showPhoto(currentPhotoIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showPhoto(currentPhotoIndex + 1);
        }
    });

    photoModal.addEventListener(
        "touchstart",
        (event) => {
            touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
    );

    photoModal.addEventListener(
        "touchend",
        (event) => {
            const touchEndX = event.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    showPhoto(currentPhotoIndex + 1);
                } else {
                    showPhoto(currentPhotoIndex - 1);
                }
            }
        },
        { passive: true }
    );
}

// КАРУСЕЛЬ ВІДГУКІВ
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
            const distance = Math.abs(
                card.offsetLeft - cards[0].offsetLeft - position
            );

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    }

    function getVisibleCount() {
        if (!cards.length) return 0;

        const gap =
            parseFloat(getComputedStyle(reviewsList).gap) || 0;

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
        const maxIndex = Math.max(
            0,
            cards.length - getVisibleCount()
        );

        current.textContent = Math.min(index, maxIndex) + 1;
        prev.disabled = index <= 0;
        next.disabled = index >= maxIndex;
    }

    function move(direction) {
        const index = getCurrentIndex();
        const maxIndex = Math.max(
            0,
            cards.length - getVisibleCount()
        );

        const target = Math.max(
            0,
            Math.min(index + direction, maxIndex)
        );

        if (!cards[target]) return;

        reviewsList.scrollTo({
            left: cards[target].offsetLeft - cards[0].offsetLeft,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "instant"
                : "smooth"
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

// ПІДРАХУНОК ВАРТОСТІ ЗАМОВЛЕННЯ
const BASE_PRICE = 1510;
const extraPrices = {
    net: 255,
    bait: 65
};
const extrasCheckboxes = document.querySelectorAll(
    'input[name="extras"]'
);
const orderTotalElement = document.querySelector("#order-total");
const selectedExtrasElement = document.querySelector("#selected-extras");

function formatPrice(price) {
    return price.toLocaleString("uk-UA") + " грн";
}
function updateOrderTotal() {
    if (!orderTotalElement || !selectedExtrasElement) {
        return;
    }

    let total = BASE_PRICE;

    selectedExtrasElement.replaceChildren();

    extrasCheckboxes.forEach((checkbox) => {
        if (!checkbox.checked) return;

        const price = extraPrices[checkbox.value];

        if (price === undefined) return;

        total += price;

        const row = document.createElement("div");
        row.className = "summary-row";

        const name = document.createElement("span");
        name.textContent =
            checkbox.value === "net"
                ? "Підсак"
                : "Додаткова прикормка";

        const priceElement = document.createElement("span");
        priceElement.textContent = "+ " + formatPrice(price);

        row.append(name, priceElement);
        selectedExtrasElement.append(row);
    });

    orderTotalElement.textContent = formatPrice(total);
}
extrasCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateOrderTotal);
});
updateOrderTotal();
// АВТОМАТИЧНИЙ ПРЕФІКС +380 ДЛЯ ТЕЛЕФОНУ
const phoneInput = document.getElementById("customer-phone");

if (phoneInput) {
    const prefix = "+380";

    phoneInput.value = prefix;

    phoneInput.addEventListener("input", () => {
        let digits = phoneInput.value.replace(/\D/g, "");

        if (digits.startsWith("380")) {
            digits = digits.slice(3);
        }

        phoneInput.value = prefix + digits.slice(0, 9);
    });

    phoneInput.addEventListener("focus", () => {
        if (phoneInput.value === prefix) {
            phoneInput.setSelectionRange(4, 4);
        }
    });
}

// НАДСИЛАННЯ ЗАМОВЛЕННЯ В TELEGRAM 
const WORKER_URL = "/api/order";
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
            updateOrderTotal();
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

// ТАЙМЕР ДО ПІВНОЧІ
function updateCountdown() {
    const now = new Date();

    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    const remaining = midnight.getTime() - now.getTime();

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    const format = (number) => String(number).padStart(2, "0");

    document.getElementById("timer-hours").textContent =
        format(hours);

    document.getElementById("timer-minutes").textContent =
        format(minutes);

    document.getElementById("timer-seconds").textContent =
        format(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// МОБІЛЬНЕ БУРГЕР-МЕНЮ
const burgerButton = document.getElementById("burger-button");
const mobileNav = document.getElementById("mobile-nav");
if (burgerButton && mobileNav) {
    function setMenuOpen(isOpen) {
        burgerButton.classList.toggle("active", isOpen);
        mobileNav.classList.toggle("open", isOpen);

        burgerButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        burgerButton.setAttribute(
            "aria-label",
            isOpen ? "Закрити меню" : "Відкрити меню"
        );
    }

    burgerButton.addEventListener("click", () => {
        const isOpen =
            burgerButton.classList.contains("active");

        setMenuOpen(!isOpen);
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuOpen(false);
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuOpen(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    });
}

// КНОПКА ПОВЕРНЕННЯ ВГОРУ
const scrollTopButton = document.getElementById("scroll-to-top");
if (scrollTopButton) {
    const toggleScrollButton = () => {
        scrollTopButton.classList.toggle(
            "show",
            window.scrollY > 350
        );
    };

    window.addEventListener("scroll", toggleScrollButton, {
        passive: true
    });

    toggleScrollButton();

    scrollTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

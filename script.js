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
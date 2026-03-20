    window.addEventListener('load', function() {
      new Swiper('.hero-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        speed: 4000,
        loop: true,
        grabCursor: true,
        freeMode: true,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        breakpoints: {
          0: { spaceBetween: 12 },
          768: { spaceBetween: 16 },
          1024: { spaceBetween: 20 },
        },
      });
    });

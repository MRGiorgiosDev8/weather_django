document.addEventListener("DOMContentLoaded", function () {

    gsap.to("#logo", {
        rotation: 360,
        duration: 300 / 200,
        ease: "power1.inOut"
    });
});
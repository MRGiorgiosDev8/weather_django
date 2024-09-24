document.addEventListener('DOMContentLoaded', function () {
    gsap.fromTo(".intro-images img",
        { scale: 0, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power1.inOut",
            stagger: 0.2
        }
    );

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".img-intro img",
        { scale: 0 },
        {
            scale: 1,
            ease: "power1.inOut",
            delay: 0.2,
            duration: 0.7,
            scrollTrigger: {
                trigger: ".img-intro",
                start: "top bottom",
                end: "bottom bottom",
                toggleActions: "play none none none",
                markers: false
            }
        }
    );
});
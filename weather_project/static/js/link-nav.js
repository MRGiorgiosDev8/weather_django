document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        const line = link.querySelector('.line');

        link.addEventListener('mouseenter', function () {
            if (!link.classList.contains('active')) {
                gsap.to(line, {
                    scaleX: 1,
                    duration: 0.4,
                    ease: "power1.inOut"
                });
            }
        });

        link.addEventListener('mouseleave', function () {
            if (!link.classList.contains('active')) {
                gsap.to(line, {
                    scaleX: 0,
                    duration: 0.4,
                    ease: "power1.inOut"
                });
            }
        });

        link.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(function (otherLink) {
                otherLink.classList.remove('active');
                const otherLine = otherLink.querySelector('.line');
                gsap.to(otherLine, {
                    scaleX: 0,
                    duration: 0.4,
                    ease: "power1.inOut"
                });
            });

            link.classList.add('active');
            gsap.to(line, {
                scaleX: 1,
                duration: 0.4,
                ease: "power1.inOut"
            });
        });
    });
});
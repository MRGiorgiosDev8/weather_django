$(document).ready(function () {
    const cityDropdown = $('#cityDropdown');
    const navLink = $('#navbarDropdown');
    const line = navLink.find('.line');

    navLink.on('show.bs.dropdown', function () {
        gsap.fromTo(cityDropdown, {
            opacity: 0,
            height: 0,
            display: 'block'
        }, {
            opacity: 1,
            height: 'auto',
            duration: 0.3,
            ease: "power1.inOut",
            onComplete: function () {
                cityDropdown.css('display', '');
            }
        });

        gsap.to(line, {
            scaleX: 1,
            duration: 0.4,
            ease: "power1.inOut"
        });
    });

    navLink.on('hide.bs.dropdown', function () {
        gsap.to(cityDropdown, {
            opacity: 0,
            height: 0,
            duration: 0.3,
            ease: "power1.inOut"
        });

        gsap.to(line, {
            scaleX: 0,
            duration: 0.4,
            ease: "power1.inOut"
        });
    });
});
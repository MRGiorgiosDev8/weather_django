$(document).ready(function () {
    const cityDropdown = $('#cityDropdown');

    $('#navbarDropdown').on('show.bs.dropdown', function () {
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
    });
});
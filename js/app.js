$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('[data-toggle="dropdown"]').bootstrapDropdownHover();

    var open = $('#open_layout_upload'),
        close = $('#close_layout_upload'),
        body = $('body'),
        layout = $('.upload_layout');

    open.click(function() {
        body.addClass('layout_loaded');
        layout.addClass('show');
    });

    close.click(function() {
        body.removeClass('layout_loaded');
        layout.removeClass('show');
    })

    var openMenu = $('#menuOpen'),
        closeMenu = $('#closeMenu'),
        menu = $('#navbarMenu');

    openMenu.on('click', function () {
    	menu.addClass('active');
    });

    closeMenu.on('click', function () {
        menu.removeClass('active');
    })

    $(function() {
        var url = window.location.href,
            menu = $('#navbarMenu li a');
        var activePage = url.substring(url.lastIndexOf('/') + 1);
        menu.each(function() {
            var linkPage = this.href.substring(this.href.lastIndexOf('/') + 1);
            if (activePage == linkPage) {
                $(this).parent().addClass('active');
            }
        });
    });

    new ClipboardJS('.copy');

    $('.js_news').on('click', function() {
        $('#news_last').hide();
    })

    if ($('.newsSlide li').length > 1) {
        $('.newsSlide').slick({
            dots: false,
            arrows: false,
            infinite: true,
            speed: 300,
            autoplay: true,
            autoplaySpeed: 2000,
            slidesToShow: 1,
            slidesToScroll: 1,
        });
    }
});
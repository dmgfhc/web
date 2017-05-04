$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $(window).on('resize', function () {
        var windowWidth = $(window).width();//获取屏幕宽度
        var $itemImage = $('.carousel-inner .item');
        if (windowWidth > 768) {
            $itemImage.each(function (index, el) {
                var $item = $(el);
                var imgSrc = $item.data('large-img');
                $item.css('background-image', 'url(' + imgSrc + ')');
                $item.html('');
            });

        } else if (windowWidth <= 768) {
            $itemImage.each(function (index, el) {
                var $item = $(el);
                var imgSrc = $item.data('small-img');
                $item.html('<img src="' + imgSrc + '"/>');
                $item.css('background-image', '');

            });
        }
    }).trigger('resize');

    var slide = document.querySelector('#slide');
    var startX = 0;
    var endX = 0;
    var carousel = $('#slide .carousel');
    slide.addEventListener('touchstart',function (e) {
        startX = e.touches[0].clientX;
        console.log(startX);

    });
    slide.addEventListener('touchend',function (e) {
        endX = e.changedTouches[0].clientX;
        if(endX-startX >0){
            carousel.carousel('prev');
        }else{
            carousel.carousel('next');
        }
    });




});



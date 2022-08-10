define(["jquery", "swiper"], function ($, Swiper) {
    var swiperArr = [];
    var  step = 1;
    var swiper_initalize = function() {

        $(".swiper-container").not(".initialized").each(function() {

        $(this).find('.swiper-slide img:not(.swiper-lazy)').addClass('swiper-lazy');
        $(this).find('.swiper-slide').each(function(){
            if($(this).find('img.swiper-lazy').length > 0) {
                var preloader = '<div class="swiper-lazy-preloader"><svg class="loader-circular" viewBox="25 25 50 50"><circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg></div>';
                $(this).append(preloader);
            }
        });
                        
        var e=$(this), id="swiper-unique-id-" + step;
        e.addClass("swiper-"+id+" initialized").attr("id", id), 
        e.parent().find(".swiper-pagination").addClass("swiper-pagination-"+id),
        e.parent().find(".swiper-button-prev, .swiper-custom-left").addClass("swiper-button-prev-"+id),
        e.parent().find(".swiper-button-next, .swiper-custom-right").addClass("swiper-button-next-"+id),
        e.parents().is(".mpc-container")&&!e.parents(".mpc-container").data("active")&&e.find("img").removeClass("swiper-lazy").addClass("swiper-pre-lazy"),
        swiperArr["swiper-"+id]=new Swiper(".swiper-"+id, {
            centeredSlides: e.is("[data-centeredSlide]")?true:false,
            lazy: true,
            pagination: {
                el: '.swiper-pagination-'+id,
                type: 'bullets',
                clickable: true
            },
            navigation: {
                nextEl: ".swiper-button-next-"+id,
                prevEl: ".swiper-button-prev-"+id
            },
            autoplay:{
                enabled: e.is("[data-autoplay]")?parseInt(e.attr("data-autoplay")):0,
                delay: e.is("[data-delay]")?parseInt(e.attr("data-delay")) : 2500,
                disableOnInteraction: true,
            },
            spaceBetween: e.attr("data-space") ? parseInt(e.attr("data-space")) : 0,
            slidesPerView: e.attr("data-slides-per-view") ? parseInt(e.attr("data-slides-per-view")) : 'auto',
            breakpoints: {
                480: {
                  slidesPerView: e.attr("data-xs-slides") ? parseInt(e.attr("data-xs-slides")) : 1,
                },
                767: {
                    slidesPerView: e.attr("data-sm-slides") ? parseInt(e.attr("data-sm-slides")) : parseInt(e.attr("data-slides-per-view")),
                },
                991: {
                  slidesPerView: e.attr("data-md-slides") ? parseInt(e.attr("data-md-slides")) : parseInt(e.attr("data-slides-per-view")),
                }
            },
            loop: e.is("[data-loop]")?parseInt(e.attr("data-loop")):0,
            effect: e.attr("data-slides-effect") ? e.attr("data-slides-effect") : 'slide'
        }
        ), $(document).ready(function() {
            $(".fadeIn-slide").each(function() {
                $(this).addClass("fadedIn-slide"), setTimeout(function() {
                    $(".fadeIn-slide").removeClass("fadedIn-slide").removeClass("fadeIn-slide")
                }
                , 700)
            }
            )
        }
        ), swiperArr["swiper-"+id].update(), step++
    });
    };

    window.Swiper_skin = {
        init: function() {
            swiper_initalize();
        }
    };
});
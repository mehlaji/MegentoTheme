/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'mage/smart-keyboard-handler',
    'mage/mage',
    'mage/ie-class-fixer',
    'domReady!'
], function ($, keyboardHandler) {
    'use strict';

    if ($('body').hasClass('checkout-cart-index')) {
        if ($('#co-shipping-method-form .fieldset.rates').length > 0 &&
            $('#co-shipping-method-form .fieldset.rates :checked').length === 0
        ) {
            $('#block-shipping').on('collapsiblecreate', function () {
                $('#block-shipping').collapsible('forceActivate');
            });
        }
    }

    $('.cart-summary').mage('sticky', {
        container: '#maincontent'
    });

    $('.page-header div:not(.customer-menu) > .header.links').clone().appendTo('#store\\.links');

    $('.page-header .search-area > a').off("click").on("click", function(){
        if(!$(this).parent().hasClass("active")) {
            $(this).parent().addClass("active")
        } else {
            $(this).parent().removeClass("active")
        }
    });

    $('.page-header .search-area .block-search > .block-title').off("click").on("click", function(){
        $('.page-header .search-area').removeClass("active")
    });
    $('.top-panel-closer').off('click').on('click', function(){
        $('body').removeClass('top-panel-opened');
    });
    $('.top-panel-opener').off('click').on('click', function(){
        $('body').addClass('top-panel-opened');
    });
    $('.qty-changer > .qty-inc').off('click').on('click', function(e) {
        var qty = parseInt($(this).parent().parent().find('input').val());
        qty ++;
        $(this).parent().parent().find('input').val(qty);
    });

    $('.qty-changer > .qty-dec').off('click').on('click', function(e) {
        var qty = parseInt($(this).parent().parent().find('input').val());
        if (qty == 1)
            return ;
        qty --;
        $(this).parent().parent().find('input').val(qty);
    });

    $('.product-item-info .qty-changer > .qty-inc').off('click').on('click', function(e) {
        var qty = parseInt($(this).parent().parent().find('input').val());
        qty ++;
        $(this).parent().parent().find('input').val(qty);

        var cart_item_id = $(this).parent().parent().parent().attr("data-product-sku");
        if(cart_item_id) {
            $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').val($(this).parent().parent().find('input').val());
            $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').parent().parent().children("button").trigger("click");
            var field_qty = $(this).parent().parent().parent();
            $(field_qty).addClass("loading");
        }
    });

    $('.product-item-info .qty-changer > .qty-dec').off('click').on('click', function(e) {
        var qty = parseInt($(this).parent().parent().find('input').val());
        var cart_item_id = $(this).parent().parent().parent().attr("data-product-sku");
        var field_qty = $(this).parent().parent().parent();
        if (qty <= 1) {
            $('.minicart-items .action.delete[data-cart-item-id="'+cart_item_id+'"]').trigger("click");
            $(field_qty).addClass("loading");
        } else {
            qty --;
            $(this).parent().parent().find('input').val(qty);

            if(cart_item_id) {
                $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').val($(this).parent().parent().find('input').val());
                $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').parent().parent().children("button").trigger("click");
                $(field_qty).addClass("loading");
            }
        }
    });
    
    $('.product-item-info .qty-manual-changer > .qty-update').off('click').on('click', function(e) {
        var qty = parseInt($(this).parent().parent().find('input').val());
        
        if(!qty || qty < 1) {
            qty = 1;
        }
        $(this).parent().parent().find('input').val(qty);
        $(this).parent().removeClass('show');
        var cart_item_id = $(this).parent().parent().parent().attr("data-product-sku");
        if(cart_item_id) {
            $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').val($(this).parent().parent().find('input').val());
            $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').parent().parent().children("button").trigger("click");
            var field_qty = $(this).parent().parent().parent();
            $(field_qty).addClass("loading");
        }
    });
    
    $('.product-item-info .qty-manual-changer > .qty-cancel').off('click').on('click', function(e) {
        $(this).parent().removeClass("show");
    });
    
    $('.product-item-info .field.qty .input-text.qty').off('focus').on('focus', function(e) {
        $(this).parent().children('.qty-manual-changer').addClass("show");
    });
    
    // $('.quick-cart-wrapper input.input-text.qty').off('click').on('click', function () {
    //     $(this).on("mouseup.a keyup.a", function(e){  
    //         $(this).off("mouseup.a keyup.a").select();
    //     });
    // });

    keyboardHandler.apply();

    $.fn.extend({
        scrollToMe: function(){
            if($(this).length){
                var top = $(this).offset().top - 100;
                $('html,body').animate({scrollTop: top}, 600);
            }
        },
        scrollToJustMe: function(){
            if($(this).length){
                var top = $(this).offset().top;
                $('html,body').animate({scrollTop: top}, 600);
            }
        }
    });

    $(document).ready(function() {
        $('.toggle-wrapper:not(.initialized)').each(function() {
            $(this).addClass('initialized');
            $(this).find('.toggle-title').off('click').on('click', function() {
                $(this).toggleClass('clicked');
            });
        });

        $('.gallery-nav > .gallery-prev').off("click").on("click", function(){
            $(this).parent().parent().find('img.active').each(function(){
                if($(this).prev('img').length > 0) {
                    $(this).prev('img').addClass('active');
                    $(this).removeClass('active');
                }
            });
        });
        $('.gallery-nav > .gallery-next').off("click").on("click", function(){
            $(this).parent().parent().find('img.active').each(function(){
                if($(this).next('img').length > 0) {
                    $(this).next('img').addClass('active');
                    $(this).removeClass('active');
                }
            });
        });
    });

    $(document).ready(function(){
        var windowScroll_t;
        $(window).scroll(function(){
            clearTimeout(windowScroll_t);
            windowScroll_t = setTimeout(function(){
                if(jQuery(this).scrollTop() > 100){
                    $('#totop').addClass("backIn");
                }else{
                    $('#totop').removeClass("backIn");
                }
            }, 500);
        });
        
        $('#totop').off("click").on("click",function(){
            $('html, body').animate({scrollTop: 0}, 600);
        });

        $(".navigation li > a[href*='#']").click(function(){
            if($($(this).attr("href")).length)
                $($(this).attr("href")).scrollToMe();
            else
                window.location.href=store_base_url + $(this).attr("href");
        });
    });
});

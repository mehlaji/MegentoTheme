/**
 */

define(
    [
        'jquery',
        'mage/storage',
        'Redgiant_LayeredNavigation/js/model/loader',
        'mage/apply/main',
        "jquery-bridget","imagesloaded","packery"
    ],
    function ($, storage, loader, mage) {
        'use strict';

        var productContainer = $('#layer-product-list'),
            layerContainer = $('.layered-filter-block-container');

        return function (submitUrl, isChangeUrl) {
            /** save active state */
            var actives = [];
            $('.filter-options-item').each(function (index) {
                if ($(this).hasClass('active')) {
                    actives.push($(this).attr('attribute'));
                }
            });
            window.layerActiveTabs = actives;

            /** start loader */
            loader.startLoader();

            /** change browser url */
            if (typeof window.history.pushState === 'function' && (typeof isChangeUrl === 'undefined')) {
                window.history.pushState({url: submitUrl}, '', submitUrl);
            }

            return storage.post(submitUrl, {}).done(
                function (response) {
                    if (response.backUrl) {
                        window.location = response.backUrl;
                        return;
                    }
                    if (response.navigation) {
                        layerContainer.html(response.navigation);
                    }
                    if (response.products) {
                        productContainer.html(response.products);
                    }
                    if(response.grid_layout == 'isotope') {
                        var packery_grid = $('.products.grid .products.list').packery({
                            itemSelector: ".product-item",
                            percentPosition: false
                        });
                        packery_grid.imagesLoaded( function() {
                            packery_grid.packery('layout');
                        });
                    }
                    var next_page = "";
                    $('.toolbar-products' + ' .pages a.next').each(function(){
                        next_page = $(this).attr("href");
                    });
                    if(next_page) {
                        $('.infinite-loader .btn-load-more').show();
                    }else{
                        $('.infinite-loader .btn-load-more').hide();
                    }
                    requirejs(['jquery', 'weltpixel_quickview' ], function ($, quickview) {
                        $('.weltpixel-quickview').bind('click', function() {
                            var prodUrl = $(this).attr('data-quickview-url');
                            if (prodUrl.length) {
                                quickview.displayContent(prodUrl);
                            }
                        });
                    });
                    if($("body").hasClass("xstore-quick-cart")) {
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
                                return;
                            }
                            qty --;
                            $(this).parent().parent().find('input').val(qty);

                            if(cart_item_id) {
                                $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').val($(this).parent().parent().find('input').val());
                                $('.minicart-items .item-qty[data-cart-item-id="'+cart_item_id+'"]').parent().parent().children("button").trigger("click");
                                $(field_qty).addClass("loading");
                            }
                        });
                        $("#mini-cart li.product-item").each(function(){
                            var product_sku = $(this).find("input.cart-item-qty").attr("data-cart-item-id");
                            var qty = $(this).find("input.cart-item-qty").val();
                            $('.product-item-details .field.qty[data-product-sku="'+product_sku+'"]').find("input.qty").val(qty);
                            $('.product-item-details .field.qty[data-product-sku="'+product_sku+'"]').removeClass("hide");
                            $('.product-item-details .action.tocart[data-product-sku="'+product_sku+'"]').addClass("hide");
                        });
                    }
                    if (mage) {
                        mage.apply();
                    }
                }
            ).fail(
                function () {
                    window.location.reload();
                }
            ).always(
                function () {
                    loader.stopLoader();
                }
            );
        };
    }
);

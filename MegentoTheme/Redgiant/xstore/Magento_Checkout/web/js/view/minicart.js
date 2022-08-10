/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'jquery',
    'ko',
    'underscore',
    'sidebar',
    'mage/translate',
    'mage/dropdown'
], function (Component, customerData, $, ko, _) {
    'use strict';

    var sidebarInitialized = false,
        addToCartCalls = 0,
        miniCart;

    miniCart = $('[data-block=\'minicart\']');

    if($("body").hasClass("xstore-quick-cart")) {
        $('.product-item-info .field.qty').removeClass("loading");
        require([
            'jquery',
            'Magento_Catalog/js/catalog-add-to-cart'
        ], function ($) {
            setTimeout(function(){
                $("form[data-role=tocart-form]").catalogAddToCart();
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
            },1000);
        });
    }

    /**
     * @return {Boolean}
     */
    function initSidebar() {
        if (miniCart.data('mageSidebar')) {
            miniCart.sidebar('update');
        }

        if (!$('[data-role=product-item]').length) {
            return false;
        }
        miniCart.trigger('contentUpdated');

        if (sidebarInitialized) {
            return false;
        }
        sidebarInitialized = true;
        miniCart.sidebar({
            'targetElement': 'div.block.block-minicart',
            'url': {
                'checkout': window.checkout.checkoutUrl,
                'update': window.checkout.updateItemQtyUrl,
                'remove': window.checkout.removeItemUrl,
                'loginUrl': window.checkout.customerLoginUrl,
                'isRedirectRequired': window.checkout.isRedirectRequired
            },
            'button': {
                'checkout': '#top-cart-btn-checkout',
                'remove': '#mini-cart a.action.delete',
                'close': '#btn-minicart-close'
            },
            'showcart': {
                'parent': 'span.counter',
                'qty': 'span.counter-number',
                'label': 'span.counter-label'
            },
            'minicart': {
                'list': '#mini-cart',
                'content': '#minicart-content-wrapper',
                'qty': 'div.items-total',
                'subtotal': 'div.subtotal span.price',
                'maxItemsVisible': window.checkout.minicartMaxItemsVisible
            },
            'item': {
                'qty': ':input.cart-item-qty',
                'button': ':button.update-cart-item'
            },
            'confirmMessage': $.mage.__('Are you sure you would like to remove this item from the shopping cart?')
        });
        if($("body").hasClass("xstore-quick-cart")) {
            $('.product-item-info .field.qty').removeClass("loading");
            $('.minicart-items .product-item-details .details-qty .qty-changer > .qty-inc').off('click').on('click', function(e) {
                var qty = parseInt($(this).parent().parent().find('input').val());
                qty ++;
                $(this).parent().parent().find('input').val(qty);
                $(this).parent().parent().parent().find('button').trigger("click");
                var field_qty = $(this).parent().parent();
                $(field_qty).addClass("loading");
            });

            $('.minicart-items .product-item-details .details-qty .qty-changer > .qty-dec').off('click').on('click', function(e) {
                var qty = parseInt($(this).parent().parent().find('input').val());
                var field_qty = $(this).parent().parent();
                if (qty <= 1) {
                    $(this).parent().parent().parent().find('.action.delete').trigger("click");
                    $(field_qty).addClass("loading");
                    return;
                }
                qty --;
                $(this).parent().parent().find('input').val(qty);
                $(this).parent().parent().parent().find('button').trigger("click");
                $(field_qty).addClass("loading");
            });
            setTimeout(function(){
                $('.minicart-items .product-item-details .details-qty .qty-changer > .qty-inc').off('click').on('click', function(e) {
                    var qty = parseInt($(this).parent().parent().find('input').val());
                    qty ++;
                    $(this).parent().parent().find('input').val(qty);
                    $(this).parent().parent().parent().find('button').trigger("click");
                    var field_qty = $(this).parent().parent();
                    $(field_qty).addClass("loading");
                });

                $('.minicart-items .product-item-details .details-qty .qty-changer > .qty-dec').off('click').on('click', function(e) {
                    var qty = parseInt($(this).parent().parent().find('input').val());
                    var field_qty = $(this).parent().parent();
                    if (qty <= 1) {
                        $(this).parent().parent().parent().find('.action.delete').trigger("click");
                        $(field_qty).addClass("loading");
                        return;
                    }
                    qty --;
                    $(this).parent().parent().find('input').val(qty);
                    $(this).parent().parent().parent().find('button').trigger("click");
                    $(field_qty).addClass("loading");
                });
                require([
                    'jquery',
                    'Magento_Catalog/js/catalog-add-to-cart'
                ], function ($) {
                    $("form[data-role=tocart-form]").catalogAddToCart();
                });
            },1000);
        }
    }

    miniCart.on('dropdowndialogopen', function () {
        initSidebar();
    });

    return Component.extend({
        shoppingCartUrl: window.checkout.shoppingCartUrl,
        maxItemsToDisplay: window.checkout.maxItemsToDisplay,
        cart: {},

        /**
         * @override
         */
        initialize: function () {
            var self = this,
                cartData = customerData.get('cart');

            this.update(cartData());
            cartData.subscribe(function (updatedCart) {
                addToCartCalls--;
                this.isLoading(addToCartCalls > 0);
                sidebarInitialized = false;
                this.update(updatedCart);
                initSidebar();
            }, this);
            $('[data-block="minicart"]').on('contentLoading', function () {
                addToCartCalls++;
                self.isLoading(true);
            });

            if (cartData()['website_id'] !== window.checkout.websiteId) {
                customerData.reload(['cart'], false);
            }

            return this._super();
        },
        isLoading: ko.observable(false),
        initSidebar: initSidebar,

        /**
         * Close mini shopping cart.
         */
        closeMinicart: function () {
            $('[data-block="minicart"]').find('[data-role="dropdownDialog"]').dropdownDialog('close');
        },

        /**
         * @return {Boolean}
         */
        closeSidebar: function () {
            var minicart = $('[data-block="minicart"]');

            minicart.on('click', '[data-action="close"]', function (event) {
                event.stopPropagation();
                minicart.find('[data-role="dropdownDialog"]').dropdownDialog('close');
            });

            return true;
        },

        /**
         * @param {String} productType
         * @return {*|String}
         */
        getItemRenderer: function (productType) {
            return this.itemRenderer[productType] || 'defaultRenderer';
        },

        /**
         * Update mini shopping cart content.
         *
         * @param {Object} updatedCart
         * @returns void
         */
        update: function (updatedCart) {
            _.each(updatedCart, function (value, key) {
                if (!this.cart.hasOwnProperty(key)) {
                    this.cart[key] = ko.observable();
                }
                this.cart[key](value);
            }, this);
        },

        /**
         * Get cart param by name.
         * @param {String} name
         * @returns {*}
         */
        getCartParam: function (name) {
            if (!_.isUndefined(name)) {
                if (!this.cart.hasOwnProperty(name)) {
                    this.cart[name] = ko.observable();
                }
            }

            return this.cart[name]();
        },

        /**
         * Returns array of cart items, limited by 'maxItemsToDisplay' setting
         * @returns []
         */
        getCartItems: function () {
            var items = this.getCartParam('items') || [];
            
            if($("body").hasClass("xstore-quick-cart")){
                $.each(items, function(index, item){
                    $('.product-item-details .field.qty[data-product-id="'+item["product_id"]+'"]').find("input.qty").val(item["qty"]);
                    $('.product-item-details .field.qty[data-product-id="'+item["product_id"]+'"]').removeClass("hide");
                    $('.product-item-details .action.tocart[data-product-id="'+item["product_id"]+'"]').addClass("hide");
                });
            }

            items = items.slice(parseInt(-this.maxItemsToDisplay, 10));

            return items;
        },

        /**
         * Returns count of cart line items
         * @returns {Number}
         */
        getCartLineItemsCount: function () {
            var items = this.getCartParam('items') || [];

            return parseInt(items.length, 10);
        }
    });
});

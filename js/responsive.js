var r_width = $(window).width();

var r_xs = 768;
var r_sm = 992;
var r_md = 1200;

var $r_nav = $('.responsive-navigation');
var $r_menu = $('.responsive-menu-button');

var $r_stats = $('.responsive-stats-container');
var $r_stats_tab = $('#stats-tab');

var $r_delivery = $('.responsive-delivery-container');
var $r_delivery_btn = $('.responsive-delivery-switch');

var $r_comms = $('.responsive-comms-container');
var $r_comms_btn = $('.responsive-comms-switch');

var $r_inv = $('.responsive-inventory-container');
var $r_inv_cats_btn = $('.responsive-inventory-cats-switch');
var $r_inv_item_btn = $('.responsive-inventory-item-switch');
var $r_inv_shop_btn = $('.responsive-inventory-shop-switch');

$(function()
{
    handle_responsive()

    $(window).resize(function()
    {
        handle_responsive()
    });

    $r_menu.click(function(e)
    {
        e.preventDefault();

        $r_nav.toggleClass('active');
    });

    $r_nav.find('li a').not('.responsive-menu-button').click(function()
    {
        if(r_width < r_md)
        {
            $r_nav.removeClass('active');
        }
    });

    $r_delivery_btn.click(function()
    {
        $r_delivery.toggleClass('responsive-delivery-active');
    });

    $r_comms_btn.click(function()
    {
        $r_comms.removeClass('responsive-comms-active');
    });

    $r_inv_cats_btn.click(function()
    {
        $r_inv.removeClass('responsive-inventory-shop-active').removeClass('responsive-inventory-item-active');
    });

    $r_inv_item_btn.click(function()
    {
        $r_inv.removeClass('responsive-inventory-shop-active').addClass('responsive-inventory-item-active');
    });

    $r_inv_shop_btn.click(function()
    {
        if($(this).hasClass('show-all'))
        {
            $s_show_all.click();
        }

        $r_inv.addClass('responsive-inventory-shop-active').removeClass('responsive-inventory-item-active');
    });

    $('[href="#delivery-tab"]').on('show.bs.tab', function()
    {
        if(r_width < r_md)
        {
            if(Delivery.check_station_turnable_deliveries(Map.get_next_station_id()) || !Map.check_if_landed())
            {
                $r_delivery.removeClass('responsive-delivery-active');
            }
            else if(client.session.ext.delivery.length > 0)
            {
                $r_delivery.addClass('responsive-delivery-active');
            }
        }
    });
});

function handle_responsive()
{
    r_width = $(window).width();

    if(r_width < r_sm)
    {
        $r_stats.appendTo($r_stats_tab);
    }
    else
    {
        $r_stats.prependTo('.container-fluid');
    }
}

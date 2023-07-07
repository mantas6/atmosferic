$f_tab = $('[href="#fluid-tab"]');
$f_modal = $('#fluid_modal');
$f_cat_select = $('#fluid-cat-select');
$f_amount = $('#fluid-amount-input');
$f_cost = $('#fluid-cost-label');
$f_cost_amount = $('#fluid-cost-amount-label');
$f_cost_amount_btn = $('#fluid-cost-amount-button-label');
$f_amount_fill = $('#fluid-amount-fill-label');
$f_flow = $('#fluid-flow-button');

$(function()
{
    $f_tab.click(function(e)
    {
        e.preventDefault();

        if(Map.check_if_landed())
        {
            if(Fluid.is_available())
            {
                if(Svc.check_tax_limit())
                {
                    $f_modal.modal('show');

                    Fluid.list_shop_fluids();
                }
                else
                {
                    show_popup($(this), lang('services.taxes.over_limit'), 'tooltip-danger');
                }
            }
            else
            {
                show_popup($(this), lang('fluid.not_available_landed'), 'tooltip-danger');
            }
        }
        else
        {
            show_popup($(this), lang('fluid.not_available'), 'tooltip-danger');
        }
    });

    $f_modal.on('shown.bs.modal', function()
    {
        if(!$f_amount.hasClass('has-initialized'))
        {
            $f_amount.slider({
                min: 0,
                max: 100,
                step: 1,
                value: 0,
                ticks: [0, 100],
                ticks_positions: [0, 100],
                ticks_labels: ['0%', '100%'],
            });

            $f_amount.addClass('has-initialized');
        }

        var max_fill = Math.floor(Fluid.get_shop_fluid_max_buy_prec() * 100);

        $f_amount.slider('setValue', max_fill);
        Fluid.calculate_fluid_cost();

        Indicator.clear_pin_indicator('fluid');
    });

    $f_cat_select.select2({
        minimumResultsForSearch: Infinity,
    });

    $f_amount.change(function()
    {
        Fluid.calculate_fluid_cost();
    });

    $f_cat_select.change(function()
    {
        Fluid.calculate_fluid_cost();
    });

    $f_flow.click(function()
    {
        var result = Fluid.buy_shop_fluid($f_cat_select.val(), Fluid.get_amount_to_fill());

        if(result['success'])
        {
            $f_modal.modal('hide');
        }
        else
        {
            show_popup($(this), lang('fluid.fill_info.' + result['info']), 'tooltip-danger');
        }
    });
});

var Fluid = {

    calculate_fluid_cost: function()
    {
        var cat_name = $f_cat_select.val();

        if(client.session.ext.fluid[cat_name])
        {
            var cost = this.get_shop_fluid_attr(cat_name, 'cost');

            var amount = this.get_amount_to_fill();

            $f_cost.text(write(cost));
            $f_cost_amount.text(write(cost * amount));

            if(cost * amount > 1 || cost * amount == 0)
            {
                $f_cost_amount_btn.text(write(cost * amount));
            }
            else
            {
                $f_cost_amount_btn.text('< 1');
            }

            $f_amount_fill.text(write(amount));
        }
    },

    get_amount_to_fill: function()
    {
        var cat_name = $f_cat_select.val();

        var amount_prec = $f_amount.val() / 100;

        var target_amount = this.get_fluid_capacity(cat_name) * amount_prec;

        var amount = Math.max(target_amount - this.get_fluid_left(cat_name), 0);

        return amount;
    },

    list_shop_fluids: function()
    {
        $f_cat_select.empty();

        var items = client.session.ext.fluid;

        $.each(items, function(name, data)
        {
            if(g[name].fluid != undefined)
            {
                var label = lang(`fluid.types.${name}.title`);
                var cost = write(data.cost);

                $('<option>').text(`${label}`).val(name).appendTo($f_cat_select);
            }
        });

        $f_cat_select.val('tank').trigger('change');
    },

    is_available: function()
    {
        return Object.keys(client.session.ext.fluid).length > 0;
    },

    get_fluid_left: function(cat_name)
    {
        return client.session.variables[cat_name].fluid;
    },

    get_fluid_capacity: function(cat_name)
    {
        return client.session.variables[cat_name].size;
    },

    take_fluid: function(cat_name, amount)
    {
        var item = client.session.variables[cat_name]

        if(item.fluid - amount >= 0)
        {
            item.fluid -= amount;

            return true;
        }

        return false;
    },

    add_fluid: function(cat_name, amount)
    {
        var item = client.session.variables[cat_name];

        if(item.fluid + amount <= item.size)
        {
            item.fluid += amount;

            return true;
        }

        return false;
    },

    get_fluid_level: function(cat_name)
    {
        return this.get_fluid_left(cat_name) / this.get_fluid_capacity(cat_name);
    },

    get_shop_fluid_attr: function(cat_name, name)
    {
        var item = client.session.ext.fluid[cat_name];

        return item[name];
    },

    buy_shop_fluid: function(cat_name, amount)
    {
        if(!Map.check_if_landed())
        {
            return {success: false, info: 'in_space'};
        }

        var item = client.session.ext.fluid[cat_name];

        var cost = item.cost * amount;

        if(client.session.money >= cost)
        {
            if(this.add_fluid(cat_name, amount))
            {
                client.session.money -= cost;

                Game.write_last_cost(lang(`fluid.types.${cat_name}.title`), cost, false);

                return {success: true};
            }

            return {success: false, info : 'overflow'};
        }

        return {success: false, info : 'cost'};
    },

    get_shop_fluid_max_buy_prec: function()
    {
        var cat_name = $f_cat_select.val();

        return this.get_shop_fluid_max_buy_prec_by_cat(cat_name);
    },

    get_shop_fluid_max_buy_prec_by_cat: function(cat_name)
    {
        var item = client.session.ext.fluid[cat_name];

        var target_amount = this.get_fluid_capacity(cat_name);

        var amount = Math.max(target_amount - this.get_fluid_left(cat_name), 0);

        return (this.get_fluid_left(cat_name) + Math.min(amount, client.session.money / item.cost)) / target_amount;
    },

    generate_station_fluids: function()
    {
        return {
            tank: {
                cost: 6e-5,
            },
            cooling_water: {
                cost: 1e-8,
            },
        };
    },
};

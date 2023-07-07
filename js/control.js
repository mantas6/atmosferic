var $c_throttle = $('#control-throttle-input');
var $c_thrust = $('#control-thrust-input');
var $c_fuel = $('#control-fuel-input');
var $c_starter = $('#control-starter-input');
var $c_brake = $('#control-brake-input');

var $c_auto = $('#control-auto-input');
var $c_afterburner = $('#control-afterburner-input');

var $c_idle = $('.throttle-idle-button');

var $m_scale = $('#map-scale-input');

var $c_modes = $('.ship-control-modes');

$(function()
{
    $c_throttle.slider({
        min: 0,
        max: 100,
        step: 1,
        value: 0,
        //orientation: 'vertical',
        //reversed: true,
    });

    $m_scale.slider({
        min: 1,
        max: 10,
        step: 1,
        value: 1,
        //orientation: 'vertical',
        //reversed: true,
    });

    $m_scale.on('slide', function()
    {
        Indicator.draw_scale_label($(this).val());
    });

    $c_fuel.bootstrapToggle({
        on: '<i class="gi gl gi-lightning-arc"></i>' + lang('control.fuel'),
        off: '<i class="gi gl gi-lightning-arc"></i>' + lang('control.fuel'),
        onstyle: 'primary',
        offstyle: 'default',
        width: '100%',
    });

    $c_starter.bootstrapToggle({
        on: '<i class="gi gl gi-spinning-top"></i>' + lang('control.starter'),
        off: '<i class="gi gl gi-spinning-top"></i>' + lang('control.starter'),
        onstyle: 'primary',
        offstyle: 'default',
        width: '100%',
    });

    $c_thrust.bootstrapToggle({
        on: '<i class="gi gl gi-thrust"></i>' + lang('control.thrust'),
        off: '<i class="gi gl gi-thrust"></i>' + lang('control.thrust'),
        onstyle: 'primary',
        offstyle: 'default',
        width: '100%',
    });

    $c_brake.bootstrapToggle({
        on: '<i class="gi gl gi-halt"></i>' + lang('control.brake'),
        off: '<i class="gi gl gi-halt"></i>' + lang('control.brake'),
        onstyle: 'primary',
        offstyle: 'default',
        width: '100%',
    });

    $c_auto.bootstrapToggle({
        on: '<i class="gi gl gi-space-shuttle"></i>' + lang('control.auto_on'),
        off: '<i class="gi gl gi-space-shuttle"></i>' + lang('control.auto_off'),
        onstyle: 'primary',
        offstyle: 'default',
        width: '100%',
    });

    $c_afterburner.bootstrapToggle({
        on: '<i class="gi gl gi-jet-pack"></i>' + lang('control.afterburner_on'),
        off: '<i class="gi gl gi-jet-pack"></i>' + lang('control.afterburner_off'),
        onstyle: 'primary',
        offstyle: 'default',
        width: '100%',
    });

    $('[href="#control-tab"]').on('show.bs.tab', function()
    {
        Ctl.draw_controls();
    });

    $('.throttle-none-button').click(function()
    {
        $c_throttle.slider('setValue', 0);
    });

    $('.throttle-full-button').click(function()
    {
        $c_throttle.slider('setValue', 100);
    });

    $('.throttle-minus-button').click(function()
    {
        $c_throttle.slider('setValue', parseInt($c_throttle.val()) - 1);
    });

    $('.throttle-plus-button').click(function()
    {
        $c_throttle.slider('setValue', parseInt($c_throttle.val()) + 1);
    });

    $c_idle.click(function()
    {
        $(this).toggleClass('active');
    });

    $('.ship-control-autoland').find('button').click(function()
    {
        Ph.set_setting('autoland_station', 0);
        Ctl.set_lever('throttle', 0);
    });
});

var Ctl = {
    get_control: function(name)
    {
        var controls = client.session.control;

        return controls[name];
    },

    set_control: function(name, value)
    {
        client.session.control[name] = value;
    },

    get_lever: function(name)
    {
        switch(name)
        {
            case 'throttle':
                return $c_throttle.val() / 100;
            case 'scale':
                return $m_scale.val();
            case 'auto':
                return $c_auto.is(':checked');
            case 'afterburner':
                return $c_afterburner.is(':checked');
            case 'idle':
                return $c_idle.hasClass('active') ? 1 : 0;
        }
    },

    set_lever: function(name, value)
    {
        switch(name)
        {
            case 'throttle':
                return $c_throttle.slider('setValue', Math.round(value * 100));
            case 'scale':
                return $m_scale.slider('setValue', Math.round(value));
            case 'auto':
                return $c_auto.bootstrapToggle(value ? 'on' : 'off');
            case 'idle':
                if(value)
                    return $c_idle.addClass('active');
                else
                    return $c_idle.removeClass('active');
            case 'afterburner':
                return $c_afterburner.bootstrapToggle(value ? 'on' : 'off');
        }
    },

    is_lever: function(name)
    {
        var value = this.get_lever(name);

        if(value != undefined)
        {
            return true;
        }

        return false;
    },

    load_controls: function()
    {
        var controls = client.session.control;

        $.each(controls, function(name, value)
        {
            if ( Ctl.is_lever(name) )
            {
                Ctl.set_lever(name, value);
            }
        });
    },

    calc_braking_distance: function(speed, braking_thrust)
    {
        if(braking_thrust > 0)
        {
            var distance = 0;

            while(speed > 0)
            {
                distance += speed;
                
                speed -= braking_thrust;
            }

            return distance;
        }

        return Infinity;
    },

    manage_controls: function(no_draw)
    {
        var controls = client.session.control;

        if(!no_draw)
        {
            $.each(controls, function(name, value)
            {
                if ( Ctl.is_lever(name) )
                {
                    controls[name] = Ctl.get_lever(name);
                }
            });
        }


        Indicator.set_indicator('autoland', 0);
        Indicator.set_indicator('autoland_warn', 0);

        var target_id = Ph.get_setting('autoland_station');

        var autolanding_control = false;

        if(Map.get_station_by_id(target_id) && Map.get_distance_to_station(target_id) > 0)
        {
            var distance_to_station = Map.get_distance_to_station(target_id);
            var distance = distance_to_station - Map.get_landing_range();

            var max_airflow_est = Ph.is_opt('compressor') ? Math.max(g.blades.max_airflow, g.compressor.max_boosted_airflow) : g.blades.max_airflow;

            var max_thust_est = Math.min(g.injection.max_fuelflow * Ph.af_ratio, g.exhaust.max_thrust, max_airflow_est) * g.injection.eff * g.exhaust.eff;

            var braking_thrust = Ph.get_braking_thrust(max_thust_est) / Ph.get_totals().weight;

            var speed = client.session.speed;

            var distance_to_brake = this.calc_braking_distance(speed, braking_thrust);

            if(distance_to_brake > distance)
            {
                autolanding_control = true;

                this.set_control('auto', 0);

                if(distance_to_brake > distance + Map.get_landing_range())
                {
                    Indicator.set_indicator('autoland_warn', 1);
                }
                else
                {
                    Indicator.set_indicator('autoland', 1);
                }

                var throttle_ctl = 1;

                if(distance > 0)
                {
                    throttle_ctl = clamp(distance_to_brake / distance, 0, 1);
                }

                this.set_control('throttle', throttle_ctl);
            }
            else
            {
                var throttle_by_temp = range_array(p.temp, {
                    200: 0.1,
                    400: 0.25,
                    500: 0.75,
                    600: 1,
                });

                this.set_control('throttle', throttle_by_temp);

                this.set_control('auto', 1);
                Indicator.set_indicator('autoland', 1);
            }

            if(Map.check_if_landed() && Map.get_next_station_id() == target_id)
            {
                Ph.set_setting('autoland_station', 0);

                this.set_control('throttle', 0);
            }
        }

        if(this.get_control('auto') || client.session.speed <= 0)
        {
            this.set_control('brake', 0);
        }
        else
        {
            this.set_control('brake', 1);
        }

        if(this.get_control('throttle') > 0 && (this.get_control('auto') || client.session.speed > 0))
        {
            this.set_control('thrust', 1);
        }
        else
        {
            this.set_control('thrust', 0);
        }

        if(this.get_control('idle') || this.get_control('throttle') > 0 && (this.get_control('auto') || client.session.speed > 0))
        {
            this.set_control('fuel', 1);
        }
        else
        {
            this.set_control('fuel', 0);
        }

        if(!no_draw)
        {
            this.load_controls();
        }

        if (Ph.is_opt('processor'))
        {
            this.manage_autopilot();

            this.init_autopilot();
        }
    },

    is_autopilot_enabled: function()
    {
        return (Ph.get_setting('autopilot_autoland') && Ph.is_opt('processor'));
    },

    init_autopilot: function()
    {
        if(client.session.settings.autopilot_autoland === undefined)
        {
            Ph.set_setting('autopilot_autoland', 1);
            Ph.set_setting('autopilot_delivery', 1);
            Ph.set_setting('autopilot_repair', 1);
            Ph.set_setting('autopilot_taxes', 1);
            Ph.set_setting('autopilot_fluid', 1);
        }
    },

    manage_autopilot: function()
    {
        // Check fuel levels, if not enough land in the nearest station to fill up
        var nearest_delivery = Delivery.get_nearest_delivery();

        var distance_to_nearest_target = Map.get_distance_to_station(nearest_delivery.target);
        var fuel_economy_avg = client.session.stats['burned_fuel_distance'] / client.session.stats['burned_fuel'];
        var average_distance_left_with_tank = fuel_economy_avg * Ph.get_variable('tank', 'fluid');

        var need_service = Indicator.get_indicator('service_warning') || Indicator.get_indicator('service_danger');

        var insufficient_tank = distance_to_nearest_target > average_distance_left_with_tank;

        if(Ph.get_setting('autopilot_autoland'))
        {
            if(g.processor.max_distance >= distance_to_nearest_target)
            {
                if ((insufficient_tank && Fluid.get_fluid_level('tank') < 0.5) || need_service)
                {
                    // We need fuel before delivery
                    var nearest_station = Map.get_next_station_id();
    
                    Ph.set_setting('autoland_station', nearest_station);
                    client.tmp.autopilot_station = nearest_station;
                }
                else
                {
                    Ph.set_setting('autoland_station', nearest_delivery.target);
                    client.tmp.autopilot_station = nearest_delivery.target;
                }
            }
        }
        
        // Take deliveries
        if(Ph.get_setting('autopilot_delivery') && Map.check_if_landed())
        {
            if(Delivery.check_station_turnable_deliveries(Map.get_next_station_id()))
            {
                for (var delivery_id in client.session.delivery)
                {
                    Delivery.turn_in_delivery(delivery_id);
                }
            }

            if (client.session.ext.delivery.length)
            {
                for (var delivery_id in client.session.ext.delivery)
                {
                    Delivery.take_delivery(delivery_id);
                }
            }
        }


        // Once landed anywhere top off fluid, repair if needed
        if (Ph.get_setting('autopilot_repair') && Map.check_if_landed() && Inv.is_repair_available())
        {
            Inv.repair_all_items();
        }

        // Refuel
        if (Ph.get_setting('autopilot_fluid') && Map.check_if_landed() && Svc.check_tax_limit() && Fluid.is_available())
        {
            for (var fluid_name of ['tank', 'cooling_water'])
            {
                if (Fluid.get_fluid_level(fluid_name) < 0.9)
                {
                    var amount_needed = Fluid.get_fluid_capacity(fluid_name) - Fluid.get_fluid_left(fluid_name);

                    var fluid_cost = client.session.ext.fluid[fluid_name].cost;

                    var can_afford_max = Fluid.get_fluid_capacity(fluid_name) * Fluid.get_shop_fluid_max_buy_prec_by_cat(fluid_name);

                    Fluid.buy_shop_fluid(fluid_name, Math.min(amount_needed, can_afford_max));
                }
            }
        }

        // Pay taxes if limit is reached
        if (Ph.get_setting('autopilot_taxes') && !Svc.check_tax_limit())
        {
            var amount_to_pay = Math.min(Svc.get_taxes_amount(), client.session.money);

            Svc.pay_taxes(amount_to_pay);
        }
    },

    get_idle_offset: function()
    {
        if(!this.get_control('idle') && !this.get_control('thrust') && !this.get_control('throttle')) return 0;

        var min_af = g.blades.min_airflow;
        var max_af = g.blades.min_airflow * 2;

        var est_throttle = 1 - range(p.airflow, min_af, max_af);

        est_throttle = est_throttle * max_af / g.injection.max_fuelflow;

        return est_throttle;
    },

    draw_controls: function()
    {
        if(Ph.is_opt('afterburner'))
        {
            $c_modes.addClass('has-afterburner')
        }
        else
        {
            $c_modes.removeClass('has-afterburner');
        }
    },
};

var $g_container = $('.game-container');

var $g_speed = $('.game-speed-label');
var $g_distance = $('#game-distance-label');
var $g_money = $('.game-money-label');

var $m_next = $('#map-next-station-label');
var $m_landing_range = $('#map-landing-range-label');
var $m_station_name = $('#map-station-name-label');
var $m_travel_state = $('#map-travel-state-label');

var $m_scale_label = $('#map-scale-label');
var $m_next_delivery = $('#game-next-delivery-label');
var $m_next_autoland = $('#game-next-autoland-label');
var $m_next_comm = $('#game-next-comm-label');

var $g_fuel_left = $('#game-fuel-left-label');
var $g_fuel_left_distance = $('#game-fuel-distance-label');
var $g_fuel_left_distance_current = $('#game-fuel-distance-current-label');

var $g_speed_diff = $('#speed-diff-progress');

var $g_weight = $('#ship-weight-label');
var $g_drag = $('#ship-drag-label');

var $p_stats = $('#physics-stats');

var $pin_indicator = $('.pin-indicator');


var $map = $('#map-container');
var $map_landing = $('.map-landing-mark');

var $map_template = $('#map-container').find('.map-station-mark.template');

$(function()
{
    $g_distance.tooltip({
        title: lang('game.travelled'),
        placement: 'bottom',
    });

    $m_next_delivery.tooltip({
        title: lang('delivery.next_in'),
        placement: 'bottom',
    });

    $m_next_comm.tooltip({
        title: lang('comms.next_in'),
        placement: 'bottom',
    });

    $m_next_autoland.tooltip({
        title: lang('map.next_in'),
        placement: 'bottom',
    });

    $m_landing_range.tooltip({
        title: lang('map.landing_range'),
        placement: 'bottom',
    });

    $g_weight.parent().tooltip({
        title: lang('game.total_weight'),
        placement: 'top',
    });

    $g_drag.parent().tooltip({
        title: lang('game.total_drag'),
        placement: 'top',
    });

    $('#temp-gauge').popover({
        title: lang('indicator.gauges.temp.title'),
        content: lang('indicator.gauges.temp.info'),
        placement: 'top',
        container: 'body',
        trigger: 'hover',
    });

    $('#airflow-gauge').popover({
        title: lang('indicator.gauges.airflow.title'),
        content: lang('indicator.gauges.airflow.info'),
        placement: 'top',
        container: 'body',
        trigger: 'hover',
    });

    $('#fuel-gauge').popover({
        title: lang('indicator.gauges.fuel.title'),
        content: lang('indicator.gauges.fuel.info'),
        placement: 'top',
        container: 'body',
        trigger: 'hover',
    });
});

var Indicator = {

    init_gauges: function()
    {
        var operating_temp = g.blades.max_temp - Ph.get_setting('cooling_operating_offset');
        var min_temp = operating_temp - (g.blades.max_temp - operating_temp);

        var gauge_properties = {
            width: 150,
            height: 150,

            value: 0,
            minValue: 0,

            startAngle: 45,
            ticksAngle: 270,

            valueBox: false,
            minorTicks: 2,
            strokeTicks: true,

            colorPlate: "#fff",
            borderShadowWidth: 0,
            borders: false,
            needleType: 'arrow',
            needleWidth: 2,
            needleCircleSize: 7,
            needleCircleOuter: true,
            needleCircleInner: false,
            animationDuration: 1500,
            animationRule: 'linear',

            fontNumbersSize: 24,
            fontUnitsSize: 24,
        };

        window.temp_gauge = new RadialGauge($.extend({}, gauge_properties, {
            renderTo: 'temp-gauge',
            units: lang('game.temp') + ', °K',
            minValue: min_temp,
            maxValue: g.blades.max_temp,
            value: p.temp,
            majorTicks: [
                min_temp,
                operating_temp,
                g.blades.max_temp,
            ],
            highlights: [
                {
                    "from": min_temp,
                    "to": min_temp * 1.01,
                    "color": "rgba(100, 200, 200, .50)",
                },
                {
                    "from": operating_temp * 0.99,
                    "to": operating_temp * 1.01,
                    "color": "rgba(100, 200, 50, .50)",
                },
                {
                    "from": operating_temp * 1.01,
                    "to": g.blades.max_temp * 0.99,
                    "color": "rgba(250, 200, 20, .25)",
                },
                {
                    "from": g.blades.max_temp * 0.99,
                    "to": g.blades.max_temp,
                    "color": "rgba(200, 50, 50, .75)"
                },
            ],
        })).draw();

        var max_airflow_formated = format_number(g.blades.max_airflow);
        var min_airflow = g.blades.min_airflow / max_airflow_formated.size;

        window.airflow_gauge = new RadialGauge($.extend({}, gauge_properties, {
            renderTo: 'airflow-gauge',
            units: lang('game.airflow') + ' * ' + (max_airflow_formated.sign != '' ? max_airflow_formated.sign : '1'),
            maxValue: max_airflow_formated.value,
            majorTicks: [
                '0',
                Math.round(max_airflow_formated.value * 0.25 * 10) / 10,
                Math.round(max_airflow_formated.value * 0.5 * 10) / 10,
                Math.round(max_airflow_formated.value * 0.75 * 10) / 10,
                Math.round(max_airflow_formated.value * 10) / 10,
            ],
            highlights: [
                {
                    "from": 0,
                    "to": min_airflow,
                    "color": "rgba(200, 50, 50, .75)"
                }
            ],
        })).draw();

        window.fuel_gauge = new RadialGauge($.extend({}, gauge_properties, {
            renderTo: 'fuel-gauge',
            units: lang('game.fuel') + ', %',
            maxValue: 100,
            majorTicks: [
                'R',
                '1 / 4',
                '1 / 2',
                '3 / 4',
                '1 / 1',
            ],
            highlights: [
                {
                    "from": 0,
                    "to": 10,
                    "color": "rgba(200, 50, 50, .75)"
                },
            ],
        })).draw();
    },

    update_game_stats_slow: function()
    {
        var fuel_left = clamp(Fluid.get_fluid_level('tank') * 100, 0, 100);

        fuel_gauge.update({value: fuel_left});
        $g_fuel_left.text(Math.round(fuel_left) + '%');

        if(fuel_left <= 10)
        {
            $g_fuel_left.addClass('text-danger').removeClass('text-warning');
        }
        else if(fuel_left <= 25)
        {
            $g_fuel_left.addClass('text-warning').removeClass('text-danger');
        }
        else
        {
            $g_fuel_left.removeClass('text-danger').removeClass('text-warning');
        }

        if(client.session.stats['burned_fuel'] > 0)
        {
            var fuel_economy_avg = client.session.stats['burned_fuel_distance'] / client.session.stats['burned_fuel'];

            $g_fuel_left_distance.text(write(fuel_economy_avg * Ph.get_variable('tank', 'fluid')));
        }
        else
        {
            $g_fuel_left_distance.text('-');
        }

        if(p.fuelflow > 0)
        {
            var fuel_economy = client.session.speed / p.fuelflow;

            $g_fuel_left_distance_current.text(write(fuel_economy * Ph.get_variable('tank', 'fluid')));
        }
        else
        {
            $g_fuel_left_distance_current.text('-');
        }

        $m_landing_range.text(write(Map.get_landing_range()));

        $m_station_name.text(Map.get_next_station_attr('name'));

        var totals = Ph.get_totals();

        $g_weight.text(write(totals.weight));
        $g_drag.text(write(totals.drag));

        if(this.get_indicator('autoland'))
        {
            $g_container.addClass('game-autoland')
        }
        else
        {
            $g_container.removeClass('game-autoland')
        }

        this.update_game_status();
    },

    update_game_stats: function()
    {
        $g_speed.text(write(client.session.speed * 10) + '/s');

        $g_distance.text(write(client.session.distance));
        $g_money.text(write(client.session.money));

        this.draw_speed_diff_label();

        /*  */
        this.draw_autolanding_indicator();

        this.draw_next_delivery_indicator();
        this.draw_next_comm_indicator();

        //temp_gauge.update({value: clamp(p.temp, g.blades.operating_temp - g.blades.max_temp, g.blades.max_temp)});
        //airflow_gauge.update({value: clamp(p.airflow, 0, g.blades.max_airflow)});
        temp_gauge.update({value: p.temp});

        var max_airflow_formated = format_number(g.blades.max_airflow);
        airflow_gauge.update({value: p.airflow / max_airflow_formated.size});

        $m_next.text(write(Map.get_next_station_distance()));

        this.set_indicator_values();
    },

    set_indicator_values: function()
    {
        Indicator.set_indicator('cold', p.temp < Ph.get_setting('cold_temp') && Ctl.get_control('fuel'));
        Indicator.set_indicator('unburnt', Math.round(p.fuelflow * Ph.af_ratio) > Math.round(p.airflow * p.air_density));
        Indicator.set_indicator('fuel', Fluid.get_fluid_level('tank') < 0.1);
        Indicator.set_indicator('exhaust', p.burned >= g.exhaust.max_thrust && Ctl.get_control('thrust'));
        Indicator.set_indicator('cooling_water', Ph.is_opt('cooling_water') && Fluid.get_fluid_level('cooling_water') < 0.1);

        var condition = Inv.check_items_condition();
        if(condition.danger > 0)
        {
            Indicator.set_indicator('service_danger', 1);
            Indicator.set_indicator('service_warning', 0);
        }
        else if(condition.warning > 0)
        {
            Indicator.set_indicator('service_danger', 0);
            Indicator.set_indicator('service_warning', 1);
        }
        else
        {
            Indicator.set_indicator('service_danger', 0);
            Indicator.set_indicator('service_warning', 0);
        }

        this.manage_external_force();
    },

    manage_external_force: function()
    {
        /* TODO: make a better implementation */
        if(chance(1/2))
        {
            Indicator.set_indicator('external_force', 0);
        }
    },

    trigger_external_force: function()
    {
        Indicator.set_indicator('external_force', 1);
    },

    draw_autolanding_indicator: function()
    {
        if(Map.get_station_by_id(Ph.get_setting('autoland_station')))
        {
            var station_name = Map.get_station_by_id(Ph.get_setting('autoland_station')).name;
            var distance = Map.get_distance_to_station(Ph.get_setting('autoland_station')) - Map.get_landing_range();

            $m_next_autoland.text(write(distance));
        }
        else
        {
            $m_next_autoland.text(lang('map.autoland_not_set'));
        }
    },

    draw_next_delivery_indicator: function()
    {
        var nearest = Delivery.get_nearest_delivery();

        var station = Map.get_station_by_id(nearest.target);

        if(station)
        {
            $m_next_delivery.text(write(Map.get_distance_to_station(nearest.target)));
        }
        else
        {
            $m_next_delivery.text(lang('delivery.no_deliveries'));
        }
    },

    draw_next_comm_indicator: function()
    {
        var targets = Comm.get_comm_targets();

        if(targets.length < 1)
        {
            $m_next_comm.text(lang('comms.no_targets'));
        }
        else
        {
            var target = Map.get_nearest_target(Object.keys(targets));

            if(target)
            {
                $m_next_comm.text(write(Map.get_distance_to_station(target)));
            }
            else
            {
                $m_next_comm.text(lang('comms.no_targets'));
            }
        }
    },

    draw_map_markers: function()
    {
        var markers = $.extend({}, client.session.map, this.get_map_static_markers());

        this.draw_map_markers_html(client.session.distance, markers, function($marker, station_id, station, init)
        {
            if(!station.static)
                var distance = write(Map.get_distance_to_station(station_id));
            else
                distance = write(station.distance - client.session.distance);

            var deliveries_count = Delivery.check_station_turnable_deliveries(station_id);

            var comms = Comm.get_station_comms(station_id);

            var icons = '';

            if(!station.static)
            {
                if(comms)
                {
                    $marker.addClass('text-warning');

                    icons += '<i class="gi gi-radar-dish"></i>';
                }
                else
                {
                    $marker.removeClass('text-warning');
                }

                if(deliveries_count > 0)
                {
                    $marker.removeClass('text-warning').addClass('text-primary');

                    icons += '<i class="gi gi-wooden-crate"></i>';
                }
                else
                {
                    $marker.removeClass('text-primary');
                }

                if(Ph.get_setting('autoland_station') == station_id)
                {
                    $marker.removeClass('text-primary').removeClass('text-warning').addClass('text-success');

                    icons += ' <i class="gi gi-rocket"></i>';
                }
                else
                {
                    $marker.removeClass('text-success');
                }

                var tooltip = $marker.data('bs.tooltip');

                if(!tooltip)
                {
                    //$marker.tooltip('destroy');

                    $marker.tooltip({
                        title: `${icons} ${station.name} (${distance})`,
                        container: 'body',
                        placement: r_width < r_sm ? 'bottom' : 'top',
                        trigger : 'hover',
                        html: 'true',
                    });
                }
                else
                {
                    tooltip.options.title = `${icons} ${station.name} (${distance})`;
                    tooltip.options.placement = r_width < r_sm ? 'bottom' : 'top';
                }

                if(init)
                {
                    $marker.click(function()
                    {
                        if(Ph.get_setting('autoland_station') == station_id)
                        {
                            Ph.set_setting('autoland_station', 0);
                        }
                        else
                        {
                            Ph.set_setting('autoland_station', station_id);
                        }

                        $map.find('.map-station-mark').removeClass('text-success');
                    });
                }
            }
            else
            {
                $marker.addClass('mark-static');

                if(station.status)
                {
                    $marker.addClass(`text-${station.status}`)
                }

                station.process($marker);
            }
        });
    },

    draw_map_markers_html: function(rel_distance, stations, marker_callback)
    {
        var highest = Ph.get_variable('radar', 'base_scale') / 10 * parseInt(Ctl.get_control('scale'));

        var landing_range = (Map.get_landing_range() / highest) * 100;

        $map_landing.css('padding-left', `${landing_range}%`);

        var markers_store = client.tmp.map_markers;

        var markers_drawn = {};

        $.each(stations, function(station_id, station)
        {
            var init = false;

            var rel_prec = (station.distance - rel_distance) / highest;

            if(rel_prec <= 0)
            {
                var $marker = $map.find(`[data-station-id=${station_id}]`);

                delete markers_store[station_id];

                $marker.remove();
            }
            else if(rel_prec <= 1)
            {
                var $marker = $map.find(`[data-station-id=${station_id}]`);

                markers_drawn[station_id] = true;

                if($marker.length <= 0)
                {
                    markers_store[station_id] = true;

                    $marker = $map_template.clone().appendTo($map);

                    $marker.removeClass('hidden').removeClass('template').attr('data-station-id', station_id);

                    $marker.find('i').addClass(`gi-${station.icon}`);

                    init = true;
                }

                var max_scale = ($map.width() - $marker.width()) / $(window).width();

                var value = (rel_prec * max_scale) * 100;

                $marker.css('margin-left', `${value}%`);

                marker_callback($marker, station_id, station, init);
            }
        });

        $.each(markers_store, function(station_id)
        {
            if(!markers_drawn[station_id])
            {
                delete markers_store[station_id];

                $map.find(`[data-station-id=${station_id}]`).remove();
            }
        });
    },

    draw_scale_label: function(value)
    {
        var scale = Ph.get_variable('radar', 'base_scale') * (value / 10) / 5;

        $m_scale_label.text(write(scale));
    },

    clear_map_markers: function()
    {
        client.tmp.map_markers = {};

        $map.find('.map-station-mark').not('.template').remove();
    },

    get_map_static_markers: function()
    {
        var markers = {};

        $.each(Game.get_config('static_markers'), function(name, m)
        {
            var marker = m();

            if(!marker) return;

            marker.static = true;

            markers[name] = marker;
        });

        return markers;
    },

    get_indicator: function(name)
    {
        return client.session.indicator[name];
    },

    set_indicator: function(name, value)
    {
        client.session.indicator[name] = value;
    },

    init_indicators: function()
    {
        $(`.indicator-light`).addClass('hidden');
    },

    draw_indicators: function()
    {
        var to_show = Game.get_config('indicators_show');

        $.each(client.session.indicator, function(name, value)
        {
            var $indicator = $(`.indicator-ns-${name}`);

            if(to_show[name] && !to_show[name]())
            {
                $indicator.addClass('hidden');

                return;
            }

            $indicator.removeClass('hidden');

            if(value)
            {
                $indicator.addClass('active');
            }
            else
            {
                $indicator.removeClass('active');
            }

            if(!$indicator.attr('title'))
            {
                $(`.indicator-ns-${name}`).popover({
                    title: lang(`indicator.types.${name}.name`),
                    content: lang(`indicator.types.${name}.desc`),
                    container: 'body',
                    placement: 'top',
                    trigger: 'hover',
                });
            }
        });
    },

    draw_physics_stats: function()
    {
        var stats = Game.get_config('physics_stats');

        //$p_stats.find('.stats-block').not('.template').remove();

        $template = $p_stats.find('.stats-block.template');

        $.each(stats, function(name, format)
        {
            var value = p[name];

            var stat = format(value);

            if(!stat) return;

            var $item = $p_stats.find(`.stats-block[data-name="${name}"]`);

            if(!$item.length)
            {
                $item = $template.clone()
                .appendTo($p_stats)
                .removeClass('template')
                .removeClass('hidden')
                .attr('data-name', name);

                $item.find('.icon').addClass(`gi-${stat.icon}`);

                $item.popover({
                    title: lang(`indicator.physics.${name}.title`),
                    content: lang(`indicator.physics.${name}.info`),
                    placement: 'top',
                    container: 'body',
                    trigger: 'hover',
                });
            }

            $item.removeClass('text-danger')
                .removeClass('text-warning')
                .removeClass('text-primary')
                .removeClass('text-muted')
                .removeClass('text-info');

            if(stat.status)
            {
                $item.addClass(`text-${stat.status}`);
            }

            $item.find('.text').text(stat.text);

        });
    },

    check_pin_indicators: function()
    {
        if(Map.check_if_landed())
        {
            if(Delivery.check_station_turnable_deliveries(Map.get_next_station_id()))
            {
                this.show_pin_indicator('delivery');
            }
            else if(Delivery.check_delivery_uniques())
            {
                this.show_pin_indicator('delivery', 'warning');
            }

            if(Inv.is_repair_available() && this.get_indicator('service_warning'))
            {
                this.show_pin_indicator('inventory');
            }
            else if(Inv.check_shop_uniques())
            {
                this.show_pin_indicator('inventory', 'warning');
            }

            if(Fluid.is_available() && Fluid.get_fluid_level('tank') < 0.1)
            {
                this.show_pin_indicator('fluid');
            }
        }
    },

    show_pin_indicator: function(name, status)
    {
        setTimeout(function()
        {
            switch(name)
            {
                case 'delivery':
                    if($('#delivery-tab').hasClass('active'))
                    {
                        return;
                    }
                case 'inventory':
                    if($('#inventory-tab').hasClass('active'))
                    {
                        return;
                    }
                case 'comms':
                    if($('#comms-tab').hasClass('active'))
                    {
                        return;
                    }
            }

            var $marker = $pin_indicator.filter(`[data-name="${name}"]`);

            $marker.removeClass('text-danger').removeClass('text-success').removeClass('text-primary').removeClass('text-warning');

            if(status)
            {
                $marker.addClass(`text-${status}`);
            }
            else
            {
                $marker.addClass(`text-danger`);
            }

            $marker.removeClass('hidden');

        }, 1000);
    },

    clear_pin_indicator: function(name)
    {
        setTimeout(function()
        {
            $pin_indicator.filter(`[data-name="${name}"]`).addClass('hidden');
        }, 1000);
    },

    draw_speed_diff_label: function()
    {
        var max_speed_diff = g.exhaust.max_thrust / Ph.get_totals().weight;

        if(p.speed_diff > 0)
        {
            $g_speed_diff.removeClass('progress-bar-danger').addClass('progress-bar-success');
        }
        else
        {
            $g_speed_diff.removeClass('progress-bar-success').addClass('progress-bar-danger');

            if(Ph.is_opt('air_brake'))
            {
                max_speed_diff *= g.air_brake.eff;
            }
        }

        var width = Math.abs(p.speed_diff) / max_speed_diff;

        $g_speed_diff.css('width', `${width * 100}%`);
    },

    update_game_status: function()
    {
        $g_container.removeClass('game-landed')
            .removeClass('game-landing')
            .removeClass('game-passing')
            .removeClass('game-space');

        if(Map.check_if_landed())
        {
            $g_container.addClass('game-landed');

            $m_travel_state.text(lang('map.state.landed'));
        }
        else if(Map.check_if_passing_by() && p.speed_diff < 0)
        {
            $g_container.addClass('game-landing');

            $m_travel_state.text(lang('map.state.landing'));
        }
        else if(Map.check_if_passing_by())
        {
            $g_container.addClass('game-passing');

            $m_travel_state.text(lang('map.state.passing_by'));
        }
        else
        {
            $g_container.addClass('game-space');

            $m_travel_state.text(lang('map.state.in_space'));
        }
    },

    draw_physics_debug: function()
    {
        var str = '';

        $.each(client.session.physics, function(name, value)
        {
            str += name + ' = ' + write(value) + '<br>';
        });

        $('#game-physics-debug').html(str);
    },
};

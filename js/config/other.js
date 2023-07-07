$.extend(client.config, {
    stats_icons: {
        burned_fuel: 'burning-dot',
        used_fuel: 'oil-drum',
        burned_eff: 'diagram',
        deliveries_count: 'wooden-crate',
        deliveries_income: 'take-my-money',
        deliveries_avg_wage: 'money-stack',
        time_in_game: 'backward-time',
        time_in_game_real: 'backward-time',
        max_speed: 'rocket',
    },
    settings_types: {
        thermal_control: 'check',
        cooling_water_ondemand: 'check',
        autopilot_autoland: 'check',
        autopilot_delivery: 'check',
        autopilot_repair: 'check',
        autopilot_taxes: 'check',
        autopilot_fluid: 'check',
    },
    settings_defaults: {
        thermal_control: 1,
        cooling_range: 10,
        cooling_offset: 0,
        throttle_offset: 0,
        cooling_operating_offset: 100,
        thermal_control_offset: 10,
        cooling_water_ondemand: 1,
    },
    fluid_weight: {
        tank: 1e-5,
        cooling_water: 1e-6,
    },
    stats: {
        burned_fuel: function(stats)
        {
            return write(stats.burned_fuel_real_total);
        },
        used_fuel: function(stats)
        {
            return write(stats.burned_fuel_total);
        },
        burned_eff: function(stats)
        {
            if(!stats.burned_fuel_total)
            {
                return '-';
            }

            return Math.round(stats.burned_fuel_real_total / stats.burned_fuel_total * 1000) / 10 + '%';
        },
        deliveries_count: function(stats)
        {
            return write(stats.deliveries_count);
        },
        deliveries_income: function(stats)
        {
            return write(stats.deliveries_income);
        },
        deliveries_avg_wage: function(stats)
        {
            return write(Delivery.estimate_average_wage());
        },
        time_in_game: function(stats)
        {
            return write_time(stats.time_in_game);
        },
        time_in_game_real: function(stats)
        {
            return write_time(stats.time_in_game_real);
        },
        max_speed: function(stats)
        {
            return write(stats.max_speed * 10) + '/s';
        },
    },

    physics_stats: {
        burned: function(value)
        {
            return {
                icon: 'burning-dot',
                text: value ? write(value) : '-',
            };
        },
        temp: function(value)
        {
            var status;
            if(value < 400)
            {
                status = 'primary';
            }
            else if(value < g.blades.max_temp && value > g.blades.max_temp - Ph.get_setting('cooling_operating_offset') + Ph.get_setting('thermal_control_offset'))
            {
                status = 'warning';
            }
            else if(value >= g.blades.max_temp)
            {
                status = 'danger';
            }

            return {
                status: status,
                icon: 'thermometer-hot',
                text: Math.round(value) + ' °K',
            };
        },
        ambient_temp: function()
        {
            var temp = Region.get_prop('ambient_temp');

            return {
                status: temp < 250 || temp > 600 ? 'danger' : false,
                icon: 'thermometer-scale',
                text: Math.round(temp) + ' °K',
            };
        },
        cooling_ctl: function(value)
        {
            var status;

            if(value == 1)
                status = 'danger';

            return {
                status: status,
                icon: 'computer-fan',
                text: Math.round(value * 100) + ' %',
            };
        },
        max_cooling_eff: function(value)
        {
            var status;

            var jet_burned = p.burned - p.afterburner_burned;

            if(p.max_cooling_eff < jet_burned && p.cooling_ctl == 1)
                status = 'danger';
            else if(p.max_cooling_eff < jet_burned && p.cooling_ctl)
                status = 'warning';

            return {
                status: status,
                icon: 'computer-fan',
                text: write(value),
            };
        },
        air_density: function(value)
        {
            var air_density = Region.get_prop('air_density');

            return {
                icon: 'wind-turbine',
                text: value > air_density ? Math.round((1 + value - air_density) * 100) + ' %' : '-',
            };
        },
        cooling_water: function(value)
        {
            if(Ph.is_opt('cooling_water'))
            {
                var status;

                if(Fluid.get_fluid_level('cooling_water') < 0.1)
                    status = 'danger';

                return {
                    icon: 'scuba-tanks',
                    text: Math.round(Fluid.get_fluid_level('cooling_water') * 100) + '%',
                    status: status,
                };
            }
            else
            {
                return {
                    icon: 'scuba-tanks',
                    text: '-',
                };
            }
        },
    },

    indicators_show: {
        heater: function()
        {
            return Ph.is_opt('heater');
        },
        cooling_water: function()
        {
            return Ph.is_opt('cooling_water');
        },
        cooling_fan: function()
        {
            return Ph.is_opt('cooling_fan');
        },
        filter_fuel: function()
        {
            return Ph.is_opt('filter_fuel');
        },
        filter_intake: function()
        {
            return Ph.is_opt('filter_intake');
        },
    },

    static_markers: {
        region_next: function()
        {
            var distance = Region.get_prop('end');

            var region = client.session.region_next;

            return {
                distance: distance,
                icon: 'position-marker',
                status: 'danger',
                process: function($marker)
                {
                    var popover = $marker.data('bs.popover');

                    var items = [
                        {
                            icon: 'thermometer-hot',
                            name: lang('map.region.ambient'),
                            value: region.ambient_temp + ' °K',
                        },
                        {
                            icon: 'position-marker',
                            name: lang('map.region.entering_in'),
                            value: write(distance - client.session.distance),
                        },
                        {
                            icon: 'exit-door',
                            name: lang('map.region.ends_in'),
                            value: region.end ? write(region.end - client.session.distance) : lang('map.region.endless'),
                        },
                        {
                            icon: 'defense-satellite',
                            name: lang('map.region.stations_title'),
                            value: lang(`map.region.stations.${region.stations}`),
                        },
                    ];

                    var $content = $('<div class="map-region-info">');

                    $('<span class="title">').text(lang(`map.region.names.${region.name}`)).appendTo($content);

                    $.each(items, function(i, block)
                    {
                        var $block = $('<div>').appendTo($content);

                        $('<i class="gi gl">').addClass(`gi-${block.icon}`).appendTo($block);
                        $('<span class="name">').text(block.name).appendTo($block);
                        $('<span class="value">').text(block.value).appendTo($block);
                    });

                    if(!popover)
                    {
                        //$marker.tooltip('destroy');

                        $marker.popover({
                            title: lang('map.region.region'),
                            content: $content,
                            container: 'body',
                            placement: 'bottom',//r_width < r_sm ? 'bottom' : 'auto',
                            trigger : 'hover',
                            html: 'true',
                        });
                    }
                    else
                    {
                        popover.options.content = $content;
                        popover.options.placement = 'bottom';//r_width < r_sm ? 'bottom' : 'top';
                    }
                },
            };
        },
    },
});

var $b_reset = $('.game-reset-button');
var $b_pause = $('.game-pause-button');

var $l_cost_title = $('#game-last-cost-title');
var $l_cost = $('#game-last-cost');
var $l_cost_container = $('.last-cost-container');

var $adv = $('#advanced-settings');
var $adv_reset = $('#advanced-settings-reset');

var $s_btn = $('#sleep-button');

var $g_version = $('#game-version-label');

var $e_container = $('.game-error-container');

$(function()
{
    $.fn.modal.Constructor.prototype.enforceFocus = function () {};

    $b_reset.click(function()
    {
        show_dialog(lang('game.reset.title'), lang('game.reset.info'), function()
        {
            Game.reset();
        });
    });

    $('[href="#advanced-tab"]').on('show.bs.tab', function()
    {
        Game.draw_advanced_settings();
    });

    $adv_reset.click(function()
    {
        show_dialog(lang('advanced_settings.reset_action.title'), lang('advanced_settings.reset_action.info'), function()
        {
            Ph.reset_settings_defaults();
            Game.draw_advanced_settings();
        });
    });

    $s_btn.click(function()
    {
        if(!client.tmp.sleep_interactive)
        {
            Game.start_sleep_interactive();
        }
        else
        {
            Game.stop_sleep_interactive();
        }
    });

    $b_pause.click(function(e)
    {
        e.preventDefault();

        Game.toggle_pause();
    });

    $g_version.text(`${client.version.major}.${client.version.minor}`);
});

var Game = {

    init: function()
    {
        initialize();

        this.set_start_variables();

        this.link();
    },

    reset: function()
    {
        Game.hide_critical_error();
        $l_cost_container.addClass('hidden');
        Game.init();
        Indicator.clear_map_markers();
        Indicator.init_gauges();
        Indicator.init_indicators();
        Ctl.load_controls();
        Game.draw_pause_state();
        Comm.clear_last_comm_indicators();
        Svc.draw_tab();

        Saving.do_autosave('auto');
        Saving.do_autosave('land');
    },

    load_enviroment: function(slot)
    {
        this.init();

        Region.update_regions();
        Map.generate();
        Ph.reset_physics();

        Saving.load(slot);

        this.check_upgrades();

        Inv.list_categories();

        Ctl.load_controls();
        Ctl.draw_controls();

        Indicator.draw_scale_label(Ctl.get_control('scale'));
        Indicator.clear_map_markers();

        Indicator.init_gauges();
        Indicator.init_indicators();
        Indicator.update_game_stats_slow();

        this.draw_pause_state();
        Saving.draw_save_slots();
        Svc.draw_tab(true);
    },

    check_upgrades: function()
    {
        var system = client.version.major;
        var save = client.session.stats.version.major;

        if(save < system)
        {
            var upgrades = this.get_config('client_upgrades');

            for(var version = save + 1; version <= system; version++ )
            {
                if(upgrades[version])
                {
                    upgrades[version]();
                }
            }
        }
    },

    clock_core: function()
    {
        Region.update_regions();
        Map.generate();

        Map.delete_old_stations();
        Map.update_shop_station();

        Ph.physics_run();

        Comm.execute();

        Game.incr_time_in_game();

        Indicator.set_indicator_values();
    },

    clock_ui: function(sleep)
    {
        Indicator.draw_map_markers();
        Indicator.update_game_stats();
        Indicator.draw_indicators();
        Indicator.draw_physics_stats();

        if(!sleep)
        {
            Ctl.manage_controls();
            Tutorial.run_tutorial();
        }
    },

    start_sleep_interactive: function()
    {
        $s_btn.find('span').text(lang('sleep.wait'));
        $s_btn.removeClass('btn-default').addClass('btn-danger');

        client.tmp.sleep_interactive = true;

        this.prepare_wakeup();

        this.sleep_interactive();

        $g_container.addClass('state-sleep');

        this.draw_game_overlay();
    },

    stop_sleep_interactive: function()
    {
        $s_btn.find('span').text(lang('sleep.sleep'));
        $s_btn.removeClass('btn-danger').addClass('btn-default');

        this.after_sleep();

        delete client.tmp.sleep_interactive;

        $g_container.removeClass('state-sleep');

        this.draw_game_overlay();
    },

    wakeup_sleep: function(info)
    {
        if(client.tmp.sleep_interactive)
        {
            this.stop_sleep_interactive();

            if(info)
            {
                show_popup($s_btn, lang(`sleep.wakeup_info.${info}`), 'tooltip-success');
            }

            this.lock_sleep_btn();
        }
    },

    lock_sleep_btn: function()
    {
        $s_btn.prop('disabled', true);

        clearTimeout(client.tmp.sleep_disable_int);

        client.tmp.sleep_disable_int = setTimeout(function()
        {
            $s_btn.prop('disabled', false);
        }, 500);
    },

    sleep_interactive: function()
    {
        if(client.tmp.sleep_interactive)
        {
            var result = this.sleep(1);

            if(result.info)
            {
                show_popup($s_btn, lang(`sleep.wakeup_info.${result.info}`), 'tooltip-success');

                Game.stop_sleep_interactive();

                return;
            }

            setTimeout(function()
            {
                Game.sleep_interactive();
            }, 10);
        }
    },

    sleep: function(minutes)
    {
        for(var a = 0; a < minutes * 60 * 10; a++)
        {
            this.clock_wrapper('sleep', function()
            {
                Game.clock_core();
            });

            Ctl.manage_controls(true);

            var check = this.check_wakeup();

            if(check.wakeup)
            {
                this.lock_sleep_btn();

                return {success: true, info: check.info};
            }
        }

        return {success: true, info: ''};
    },

    after_sleep: function()
    {
        Game.mark_clock_run();

        Ctl.load_controls();
    },

    link: function()
    {
        window.p = client.session.physics;
        window.g = client.session.variables;
    },

    cash_transfer: function(title, cost, income)
    {
        if(income)
        {
            client.session.money += cost;
        }
        else
        {
            if(client.session.money < cost)
            {
                return false;
            }

            client.session.money -= cost;
        }

        this.write_last_cost(title, cost, income);

        return true;
    },

    write_last_cost: function(title, cost, income)
    {
        $l_cost.removeClass('text-warning').removeClass('text-danger');

        if(income)
        {
            $l_cost.addClass('text-success');
        }
        else
        {
            $l_cost.addClass('text-warning');
        }

        var text = (income ? '+ ' : '- ') + write(cost);

        $l_cost_title.text(title);
        $l_cost.text(text);

        $l_cost_container.removeClass('hidden');

        Doorbell.call('cost', {
            info: title,
            cost: Math.round(income ? cost : (cost * -1)),
            money: Math.round(client.session.money),
            distance: Math.round(client.session.distance),
        });
    },

    get_config: function(name)
    {
        return client.config[name];
    },

    set_start_variables: function()
    {
        client.session.variables = Inv.make_start_variables();

        client.session.stats.version_init = clone(client.version);

        $.each(client.config.categories_types, function(i, cat_name)
        {
            if(!client.session.variables[cat_name])
            {
                client.session.variables[cat_name] = {};
            }
        });
    },

    draw_advanced_settings: function()
    {
        var types = this.get_config('settings_types');

        $template = $adv.find('.advanced-settings-block.template');

        $adv.find('.advanced-settings-block').not('.template').remove();

        $.each(client.session.settings, function(name, value)
        {
            if(name == 'autoland_station' || name == 'cooling_range' || name == 'cooling_offset' || name == 'throttle_offset' || name == 'cooling_operating_offset' || name == 'thermal_control_offset')
            {
                return;
            }

            var $cloned = $template.clone().appendTo($adv);

            $cloned.find('.name').text(lang(`advanced_settings.types.${name}.title`));
            $cloned.find('.description').text(lang(`advanced_settings.types.${name}.desc`));

            var $input = $('<input>')
                .attr('name', name)
                .appendTo($cloned.find('.input-container'));

            if(!types[name])
            {
                $input.attr('type', 'number')
                    .addClass('form-control')
                    .val(value);
            }
            else if(types[name] == 'check')
            {
                $input.attr('type', 'checkbox')
                    .prop('checked', value ? true : false)

                $input.bootstrapToggle({
                    on: '<i class="gi gl gi-lever"></i>' + lang('game.on'),
                    off: '<i class="gi gl gi-lever"></i>' + lang('game.off'),
                    onstyle: 'primary',
                    offstyle: 'default',
                    width: '100%',
                });
            }

            $input.addClass(`advanced-setting-${name}`);

            $cloned.removeClass('template').removeClass('hidden');

            $input.change(function()
            {
                if(types[name] == 'check')
                {
                    Ph.set_setting($(this).attr('name'), $(this).is(':checked'));
                }
                else
                {
                    var parsed = parseInt($(this).val());

                    if(!isNaN(parsed)) {
                        Ph.set_setting($(this).attr('name'), parsed);
                    }

                }

                Indicator.init_gauges();
            });
        });
    },

    draw_pause_state: function()
    {
        var pause = client.session.pause;

        $b_pause.find('span').text(pause ? lang('settings.paused') : lang('settings.pause'));

        if(pause)
        {
            $b_pause.addClass('text-danger').removeClass('text-muted');

            $g_container.addClass('state-paused');
        }
        else
        {
            $b_pause.removeClass('text-danger').addClass('text-muted');

            $g_container.removeClass('state-paused');
        }

        this.draw_game_overlay();
    },

    toggle_pause: function(paused)
    {
        if(paused != undefined)
        {
            client.session.pause = paused;
        }
        else
        {
            client.session.pause = ! client.session.pause;
        }

        this.mark_clock_run();

        this.draw_pause_state();
    },

    prepare_wakeup: function()
    {
        var wakeup = client.session.wakeup;

        wakeup.conditions.autoland = !Indicator.get_indicator('autoland');
        wakeup.conditions.fuel = !Indicator.get_indicator('fuel');
        wakeup.conditions.service = !Indicator.get_indicator('service_warning');
        wakeup.conditions.service_danger = !Indicator.get_indicator('service_danger');
        wakeup.conditions.stall = p.burned != 0;
        wakeup.conditions.autoland_warn = !Indicator.get_indicator('autoland_warn');
    },

    check_wakeup: function()
    {
        var wakeup = client.session.wakeup;

        if(Ctl.is_autopilot_enabled())
        {
            return {wakeup: false, info: ''};
        }

        //wakeup.conditions
        if(wakeup.conditions.autoland && Indicator.get_indicator('autoland'))
        {
            return {wakeup: true, info: 'autoland'};
        }

        if(wakeup.conditions.fuel && Indicator.get_indicator('fuel'))
        {
            return {wakeup: true, info: 'fuel'};
        }

        if(wakeup.conditions.service && Indicator.get_indicator('service_warning'))
        {
            return {wakeup: true, info: 'service'};
        }

        if(wakeup.conditions.service_danger && Indicator.get_indicator('service_danger'))
        {
            return {wakeup: true, info: 'service_critical'};
        }

        if(wakeup.conditions.autoland_warn && Indicator.get_indicator('autoland_warn'))
        {
            return {wakeup: true, info: 'autoland_warn'};
        }

        if(wakeup.conditions.stall && p.burned == 0)
        {
            return {wakeup: true, info: 'stall'};
        }

        return {wakeup: false, info: ''};
    },

    incr_time_in_game: function(real)
    {
        if(real)
        {
            Stats.add('time_in_game_real');
        }
        else
        {
            Stats.add('time_in_game', 0.1);
        }

        client.session.stats.last_time = time();

        client.session.stats.version = clone(client.version);
    },

    mark_clock_run: function()
    {
        client.tmp.clock_last = new Date().getTime();
    },

    get_clock_diff: function()
    {
        return new Date().getTime() - client.tmp.clock_last;
    },

    get_debug(name)
    {
        return client.session.debug[name];
    },

    debug(name, value)
    {
        switch(name)
        {
            case 'debug_mode':
                if(value)
                {
                    localStorage.setItem('debug', 1);
                }
                else
                {
                    localStorage.setItem('debug', 0);
                }
                return;
            case 'tp':
                client.session.distance = Map.get_station_by_name(value).distance - (Map.get_landing_range() / 2);
                return;
            default:
                return client.session.debug[name] = value;
        }
    },

    get_scalable_cost: function()
    {
        return Math.max(client.session.distance * 5e-5, 1000);
    },

    draw_tab_contents: function()
    {
        var on_land = client.tmp.landed;

        if($('#comms-tab').hasClass('active'))
        {
            if(!Map.check_if_landed())
            {
                Delivery.update_deliveries_distance_labels();
            }
        }

        if($('#delivery-tab').hasClass('active'))
        {
            if(!Map.check_if_landed())
            {
                Delivery.update_deliveries_distance_labels();
            }

            if(on_land)
            {
                Delivery.draw_tab();
            }
        }

        if($('#inventory-tab').hasClass('active'))
        {
            Inv.update_health_indicators();

            if(on_land)
            {
                Inv.draw_tab();
            }
        }

        if($('#services-tab').hasClass('active'))
        {
            Svc.draw_recovery_cost();
        }

        if(on_land)
        {
            Indicator.check_pin_indicators();
        }

        client.tmp.landed = false;
    },

    clock_wrapper: function(name, callback)
    {
        var start_time = new Date().getTime();

        if(this.is_debug_mode())
        {
            callback();
        }
        else
        {
            try
            {
                callback();
            }
            catch(error)
            {
                console.error(error);

                Doorbell.call('error', error.toString() + "\n" + error.stack.toString());

                this.display_critical_error(error);
            }
        }

        client.tmp.compute_duration[name] = (new Date().getTime() - start_time) / 1000;
    },

    display_critical_error: function(error)
    {
        $g_container.addClass('hidden');
        $e_container.removeClass('hidden');

        $e_container.find('.message').text(error.toString());

        Game.toggle_pause(true);

        client.tmp.game_critical_error = true;
    },

    hide_critical_error: function()
    {
        $g_container.removeClass('hidden');
        $e_container.addClass('hidden');

        client.tmp.game_critical_error = false;
    },

    is_debug_mode: function()
    {
        if(client.tmp.debug_mode == undefined)
        {
            if(Saving.check_saving())
            {
                client.tmp.debug_mode = Number(localStorage.getItem('debug'));
            }
            else
            {
                client.tmp.debug_mode = false;
            }
        }

        return client.tmp.debug_mode;
    },

    draw_game_overlay: function()
    {
        if(client.tmp.sleep_interactive || client.session.pause)
        {
            $g_container.addClass('state-inactive');
        }
        else
        {
            $g_container.removeClass('state-inactive');
        }
    },
};

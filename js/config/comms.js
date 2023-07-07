$.extend(client.config, {
    comms_icons: {
        tutorial: 'candle-holder',
        encrypted: 'computing',
        insecurities: 'paranoia',
        journey: 'raise-zombie',
        discounts: 'price-tag',
        sealed: 'sell-card',
        limits: 'sunrise',
        powerless: 'despair',
        coating: 'spray',
        deposit: 'coins',
        border: 'lock-spy',
        inspection: 'mass-driver',
        invest: 'briefcase',
        licence: 'up-card',
        core: 'reactor',
        encounters: 'rolling-dice',
        ceiling: 'tower-flag',
        cold: 'cold-heart',
        zero: 'frozen-orb',
        exam: 'read',
    },
    comms: {
        /* Task group */
        tutorial: {
            /* Exectued with clock (if not started) to check if it's time to start this task */
            trigger: function(args)
            {
                Comm.mark_as_active(args.group, 'skip_tutorial');
            },
            skip_tutorial: {
                start: function(args)
                {
                    Comm.activate_choose(args.group, args.name);
                },
                choose: function(args)
                {
                    return {
                        items: {
                            no_skip: {status: 'success'},
                            skip: {status: 'danger'},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose == 'skip')
                    {
                        Tutorial.terminate_tutorial();
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }
                    if(progress.choose == 'no_skip')
                    {
                        if(!Comm.is_open(args.group, 'first_start') && !Comm.is_closed(args.group, 'first_start'))
                        {
                            Comm.mark_as_active(args.group, 'first_start');
                        }
                    }
                },
            },
            first_start: {
                start: function(args)
                {
                    Tutorial.show_popover_safe('[href="#control-tab"]', {text: 'start'});
                    Tutorial.show_popover_safe('.tutorial-throttle-preview', {text: 'throttle'});
                    Tutorial.show_popover_safe('.tutorial-control-preview', {text: 'control'});
                    Tutorial.show_popover_safe('[href="#comms-tab"]', {text: 'comms'});

                    Tutorial.set_variable('comms', true);
                },
                progress: function(args, progress)
                {
                    if(Indicator.get_indicator('starter') && Comm.do_once(args, 'starter'))
                    {
                        Tutorial.set_variable('indicators', true);
                        Tutorial.show_popover_safe('.tutorial-indicators', {text: 'indicators'});
                    }

                    if(p.burned)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'first_takeoff');
                    }
                },
            },
            first_takeoff: {
                start: function(args)
                {
                    Tutorial.show_popover_safe('.tutorial-speed-preview', {text: 'speed'});

                    Tutorial.set_variable('stats', true);
                },
                progress: function(args)
                {
                    if(client.session.speed * 10 > 500)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'first_landing');
                    }

                    if(Ctl.get_control('throttle') < 0.25)
                    {
                        if(Comm.do_after(args, 'low_throttle', 20))
                        {
                            Tutorial.show_popover_safe('.tutorial-throttle-preview', {text: 'low_throttle'});
                        }
                    }
                },
            },
            first_landing: {
                start: function(args)
                {
                    Tutorial.show_popover_safe('.tutorial-stats-travel-preview', {text: 'travel'});

                    Tutorial.set_variable('stats-travel', true);
                },
                progress: function(args, progress)
                {
                    if(Map.get_next_station_distance() < Map.get_landing_range() && Comm.do_once(args, 'braking'))
                    {
                        Tutorial.show_popover_safe('.tutorial-control-preview', {text: 'land'});
                    }

                    if(Map.get_next_station_id() != args.item.target)
                    {
                        args.item.target = Map.get_next_station_id();
                    }

                    if(progress.station && Object.keys(client.session.ext.delivery).length > 0)
                    {
                        Comm.mark_as_closed(args.group, args.name);

                        Comm.mark_as_active(args.group, 'take_delivery');
                    }
                },
            },
            take_delivery: {
                start: function(args)
                {
                    Tutorial.set_variable('delivery', true);

                    Tutorial.show_popover_safe('a[href="#delivery-tab"]', {text: 'delivery'});
                    Tutorial.show_popover_safe('.tutorial-delivery-station-preview', {text: 'delivery_station'});

                    // Current station for the case of not picking up delivery
                    args.item.delivery_pickup = Map.get_next_station_id();

                    var target = Map.get_next_station_id(true);

                    var delivery = Delivery.generate_delivery({name: 'personal', station: target});

                    delivery.comm = {group: args.group, name: 'first_delivery'};

                    delivery.wage = Math.min(delivery.wage, 1e4);

                    client.session.ext.delivery = [delivery];
                },
                progress: function(args, progress)
                {
                    if(Comm.get_item_target(args.group, 'first_delivery'))
                    {
                        Tutorial.show_popover_safe('.tutorial-delivery-capacity-preview', {text: 'taken'});

                        /* Point player to the autolanding use */
                        var target_id = Comm.get_item_target(args.group, 'first_delivery');

                        Tutorial.show_popover_safe(`.map-station-mark[data-station-id="${target_id}"]`, {text: 'autoland_click'});


                        Comm.mark_as_closed(args.group, args.name);

                        Comm.mark_as_active(args.group, 'first_delivery');
                    }

                    // If station with delivery in it was left untouched
                    if(Map.get_distance_to_station(args.item.delivery_pickup) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);

                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
            first_delivery: {
                start: function(args)
                {
                    Tutorial.set_variable('map', true);
                    Tutorial.set_variable('legend', true);

                    Tutorial.show_popover_safe('.map-container', {text: 'map'});
                    Tutorial.show_popover_safe('.map-container', {text: 'autolanding'});
                    Tutorial.show_popover_safe('.map-scale-container', {text: 'scale'});
                },
                progress: function(args, progress)
                {
                    if(Ph.get_setting('autoland_station') && Comm.do_once(args, 'set_autoland'))
                    {
                        Tutorial.show_popover_safe('.tutorial-autolanding-preview', {text: 'set_autoland'});
                        //Tutorial.show_popover_safe('[href="#control-tab"]', {text: 'takeoff_control'});
                        //Tutorial.show_popover_safe('.tutorial-control-preview', {text: 'takeoff'});
                        //Tutorial.show_popover_safe('.tutorial-throttle-preview', {text: 'takeoff_throttle'});
                    }

                    if(!Map.check_if_landed() && Comm.do_once(args, 'sleep'))
                    {
                        Tutorial.show_popover_safe('#sleep-button', {text: 'sleep'});
                    }

                    if(Indicator.get_indicator('autoland') && Comm.do_once(args, 'autolanding'))
                    {
                        Tutorial.show_popover_safe('.tutorial-indicators', {text: 'autolanding_now'});
                    }

                    if(Map.get_next_station_id() == Comm.get_item_target(args.group, args.name) && Map.check_if_landed() && Comm.do_once(args, 'turn_in'))
                    {
                        Tutorial.show_popover_safe('a[href="#delivery-tab"]', {text: 'turn_in'});
                    }

                    if(progress.delivery && progress.delivery.info == 'turn')
                    {
                        if(progress.delivery.success)
                        {
                            Comm.mark_as_closed(args.group, args.name);
                        }
                        else
                        {
                            Comm.mark_as_closed(args.group, args.name, true);
                        }

                        Tutorial.set_variable('stats-money', true);
                        Tutorial.show_popover_safe('.tutorial-stats-money-preview', {text: 'money'});

                        Comm.mark_as_active(args.group, 'first_refuel');
                    }
                },
            },
            first_refuel: {
                start: function(args)
                {
                    Tutorial.set_variable('stats-fuel', true);
                    Tutorial.set_variable('fluid', true);

                    Tutorial.show_popover_safe('.tutorial-stats-fuel-preview', {text: 'fueling'});
                    Tutorial.show_popover_safe('a[href="#fluid-tab"]', {text: 'refuel'});
                    Tutorial.show_popover_safe('#fluid-flow-button', {text: 'refuel_action'});
                },
                progress: function(args)
                {
                    if(Map.get_next_station_id() != args.item.target)
                    {
                        args.item.target = Map.get_next_station_id();
                    }

                    if(Fluid.get_fluid_level('tank') == 1)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'first_upgrade');
                    }
                },
            },
            first_upgrade: {
                start: function(args)
                {
                    Tutorial.set_variable('inventory', true);

                    Tutorial.show_popover_safe('a[href="#inventory-tab"]', {text: 'inventory'});

                    var item = Inv.generate_variable_by_name('cargo', 'cargo_standard', 2);

                    client.session.ext.shop.cargo = [item];
                },
                progress: function(args)
                {
                    if(g.cargo.bin == 2)
                    {
                        Tutorial.show_popover_safe('a[href="#inventory-tab"]', {text: 'upgraded'});
                        Tutorial.show_popover_safe('a[href="#inventory-tab"]', {text: 'upgrades'});

                        //Comm.mark_as_closed(args.group, args.name);
                        Tutorial.terminate_tutorial();
                        Comm.mark_as_closed_group(args.group);

                        Doorbell.call('tutorial', {info: 'finish'});
                    }
                },
            },
        },
        encrypted: {
            trigger: function(args)
            {
                /*
                if(Comm.is_closed_group('tutorial'))
                {
                    Comm.mark_as_active(args.group, 'clue');
                }
                */
            },
            clue: {
                start: function(args)
                {
                    Comm.activate_info(args, 'receive');
                },
                progress: function(args, progress)
                {
                    if(Map.get_next_station_id() != args.item.target)
                    {
                        args.item.target = Map.get_next_station_id();
                    }

                    if(progress.station)
                    {
                        Comm.mark_as_closed(args.group, args.name);

                        Comm.mark_as_replaced(args.group, 'ask');
                    }
                },
            },
            ask: {
                progress: function(args, progress)
                {
                    if(Map.check_if_landed() && progress.choose == 'ask')
                    {
                        if(chance(1/4))
                        {
                            Comm.activate_info(args, 'clue');
                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_active(args.group, 'first_clue');
                        }
                        else
                        {
                            Comm.activate_info(args, 'unknown');
                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_replaced(args.group, 'ask_again');
                        }
                    }
                },
                choose: function(args)
                {
                    return {
                        items: {
                            ask: {status: 'success'},
                        },
                    };
                },
            },
            ask_again: {
                start: function(args)
                {
                    args.item.target = Map.get_next_station_id(true);
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);

                        Comm.mark_as_replaced(args.group, 'ask');
                    }

                    if(!Map.get_station_by_id(args.item.target))
                    {
                        args.item.target = Map.get_next_station_id();
                    }
                },
            },
            first_clue: {
                start: function(args)
                {
                    var station = {
                        name: `Transmissions Research Co.`,
                        distance: Map.get_allowed_station_distance_region(client.session.distance + rand(1e8, 2e8)),
                        icon: 'block-house',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {

                    }

                    if(!Map.get_station_by_id(args.item.target))
                    {

                    }
                },
            },
        },
        insecurities: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'beacon');
            },
            beacon: {
                start: function(args)
                {
                    /**/
                    if(!args.storage.words)
                    {
                        args.storage.words = {};
                        args.storage.count = 0;
                    }
                    else
                    {
                        args.storage.count++;
                    }

                    /**/
                    var dst_base = Math.max(client.session.distance, pow(10, 6));

                    var station = {
                        name: `Beacon ${romanize(args.storage.count + 1)}`,
                        distance: Map.get_allowed_station_distance_region(dst_base * 2),
                        icon: 'mars-pathfinder',
                        ext: {},
                    };

                    var station_id = Map.append_station(station);

                    args.item.target = station_id;
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'phrase');
                    }
                    else if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        args.storage.words[args.storage.count] = false;

                        Comm.mark_as_closed(args.group, args.name, true);

                        if(args.storage.count > 3)
                        {
                            Comm.mark_as_active(args.group, 'reward');
                        }
                        else
                        {
                            Comm.mark_as_active(args.group, args.name);
                        }
                    }
                },
            },
            phrase: {
                choose: function(args)
                {
                    var words = [
                        {
                            a: {text: 'A1'},
                            b: {text: 'B1'},
                            c: {text: 'C1'},
                        },
                        {
                            a: {text: 'A2'},
                            b: {text: 'B2'},
                            c: {text: 'C2'},
                        },
                        {
                            a: {text: 'A3'},
                            b: {text: 'B3'},
                            c: {text: 'C3'},
                        },
                        {
                            a: {text: 'A4'},
                            b: {text: 'B4'},
                            c: {text: 'C4'},
                        },
                        {
                            a: {text: 'A5'},
                            b: {text: 'B5'},
                            c: {text: 'C5'},
                        },
                    ];

                    var words_array = [];

                    $.each(args.storage.words, function(i, word)
                    {
                        if(word)
                        {
                            words_array.push(words[i][word].text);
                        }
                        else
                        {
                            words_array.push('---');
                        }
                    });

                    return {
                        params: {
                            body: {
                                words: words_array.join(' '),
                            },
                        },
                        items: words[args.storage.count],
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        args.storage.words[args.storage.count] = progress.choose;

                        Comm.mark_as_closed(args.group, args.name);

                        if(args.storage.count > 3)
                        {
                            Comm.mark_as_active(args.group, 'reward');
                        }
                        else
                        {
                            Comm.mark_as_active(args.group, 'beacon');
                        }

                    }
                },
            },
            reward: {

            },
        },
        journey: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'darkness');
            },
            darkness: {
                start: function(args)
                {
                    client.session.region_next = Region.generate_region({name: 'darkness'});

                    args.item.distance = Map.get_station_last_distance();
                },
                progress: function(args, progress)
                {
                    if(client.session.distance > args.item.distance)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'through');
                    }
                },
            },
            through: {
                start: function(args)
                {
                    args.item.distance = client.session.distance * 2;
                },
                progress: function(args, progress)
                {
                    if(client.session.distance > args.item.distance)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'beacon');
                    }
                },
            },
            beacon: {
                start: function(args)
                {
                    var dst_base = client.session.distance * 1.1;

                    var station = {
                        name: `Stormy Beacon`,
                        distance: Map.get_allowed_station_distance_region(dst_base * 2),
                        icon: 'nested-eclipses',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'brighter');
                    }

                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_active(args.group, 'brighter');
                    }
                },
            },
            brighter: {
                start: function(args)
                {
                    args.item.distance = client.session.distance * 1.2;
                },
                progress: function(args, progress)
                {
                    if(client.session.distance > args.item.distance)
                    {
                        client.session.region = Region.generate_region();

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
        },
        discounts: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e7, 1e8)))
                {
                    Comm.mark_as_active(args.group, 'shop');
                }
            },
            shop: {
                start: function(args)
                {
                    args.storage.rival_pay = Game.get_scalable_cost();
                    args.storage.discount = 0.8;
                },
                progress: function(args, progress)
                {
                    if(!args.item.target && !Region.get_stations_gen().no_stations && !args.storage.exploded)
                    {
                        var dst_base = client.session.distance * 1.1;

                        var station = {
                            name: `Joe's Discount Station`,
                            distance: Map.get_allowed_station_distance_region(dst_base * 2),
                            icon: 'defense-satellite',
                            ext: {
                                shop: {
                                    params: {
                                        buy_price: args.storage.discount,
                                        sell_price: 0,
                                    },
                                },
                            },
                        };

                        args.item.target = Map.append_station(station);
                        args.storage.station = args.item.target;
                    }
                    else if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        args.item.target = false;
                    }

                    if(!Comm.is_open(args.group, 'rival') && !Comm.is_closed(args.group, 'rival') && chance(1/100000))
                    {
                        Comm.mark_as_active(args.group, 'rival');
                    }
                },
            },
            rival: {
                choose: function(args)
                {
                    return {
                        params: {
                            body: {
                                pay: write(args.storage.rival_pay),
                            },
                        },
                        items: {
                            accept: {status: 'primary'},
                            decline: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose == 'accept')
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'explosives');
                    }
                    else if(progress.choose == 'decline')
                    {
                        Comm.mark_as_closed(args.group, args.name);
                    }
                },
            },
            explosives: {
                start: function(args)
                {
                    args.item.target = Map.get_next_station_id(true);
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'pickup');
                    }

                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                    }
                },
            },
            pickup: {
                choose: function()
                {
                    return {
                        items: {
                            pickup: {status: 'primary'},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose == 'pickup')
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'bring');
                    }

                    if(!Map.check_if_landed())
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                    }
                },
            },
            bring: {
                progress: function(args, progress)
                {
                    args.item.target = args.storage.station;

                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'explode');
                    }
                },
            },
            explode: {
                choose: function()
                {
                    return {
                        items: {
                            setup: {status: 'danger'},
                            inform: {status: 'success'},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(Map.get_next_station_id() == args.storage.station)
                    {
                        if(progress.choose == 'setup')
                        {
                            args.storage.exploded = true;

                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_active(args.group, 'leave');
                        }
                        else if(progress.choose == 'inform')
                        {
                            args.storage.discount = 0.7;

                            client.session.ext.shop.params.buy_price = args.storage.discount;

                            Comm.activate_info(args, 'inform', {discount: 100 - args.storage.discount * 100});

                            Comm.mark_as_closed(args.group, args.name, true);
                        }
                    }

                    if(Map.get_distance_to_station(args.storage.station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_active(args.group, 'bring');
                    }
                },
            },
            leave: {
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.storage.station) <= 0)
                    {
                        Game.cash_transfer('', args.storage.rival_pay, true);

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);

                        Comm.mark_as_active('sealed', 'plan');
                    }
                },
            },
        },
        sealed: {
            plan: {
                choose: function(args)
                {
                    return {
                        items: {
                            accept: {status: 'primary'},
                            decline: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose == 'accept')
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'aquire');
                    }
                    else if(progress.choose == 'decline')
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
            aquire: {
                progress: function(args, progress)
                {
                    Comm.mark_as_closed(args.group, args.name);
                    Comm.mark_as_closed_group(args.group);

                    Comm.activate_info(args, 'aquire');
                },
            },
        },
        transcendence: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'first_touch');
            },
            first_touch: {
                start: function(args)
                {
                    var station = {
                        name: `Cloud of Manifestation`,
                        distance: Map.get_allowed_station_distance_region(Math.max(client.session.distance * 2, 1)),
                        icon: 'abstract-013',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        Comm.activate_info(args, 'vision');
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'grounded');
                    }
                    else if(!Map.get_station_by_id(args.item.target))
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_active(args.group, 'grounded');
                    }
                },
            },
            grounded: {
                start: function(args)
                {
                    //client.session.region = Region.generate_region({name: 'pre_darkness'});
                },
                progress: function(args, progress)
                {

                },
            },
        },

        limits: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e7, 1e8)))
                {
                    Comm.mark_as_active(args.group, 'research');
                }
            },
            method: {
                get_cost: function(args, params)
                {
                    switch(params.name)
                    {
                        case 'speed':
                            return 4 * client.session.stats.max_speed;
                        case 'distance':
                            return 1e-5 * client.session.distance;
                        case 'thrust':
                            return 4 * g.exhaust.max_thrust;
                    }
                },
            },
            research: {
                start: function(args)
                {
                    if(!args.storage.reward)
                    {
                        args.storage.reward = 0;
                    }

                    var station = {
                        name: `Physics Research Facility ` + rand(100, 999),
                        distance: Map.get_allowed_station_distance_region(client.session.distance * 3),
                        icon: 'habitat-dome',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                    args.storage.upgrade_station = args.item.target;
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        if(args.storage.reward > 0)
                        {
                            Comm.activate_info(args, 'reward', {reward: write(args.storage.reward)});

                            Game.cash_transfer('Research results', args.storage.reward, true);

                            args.storage.reward = 0;
                        }

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'upgrade');
                    }

                    if(Map.get_distance_to_station(args.storage.upgrade_station) <= 0)
                    {
                        Comm.mark_as_replaced(args.group, args.name);
                    }
                },
                params: function(args, params)
                {
                    if(params.type == 'info')
                    {
                        return {reward: write(args.storage.reward)};
                    }
                },
            },
            upgrade: {
                start: function(args)
                {
                    args.item.prices = {
                        speed: Comm.call_group_method(args, 'get_cost', {name: 'speed'}) * 2,
                        distance: Comm.call_group_method(args, 'get_cost', {name: 'distance'}) * 3,
                        thrust: Comm.call_group_method(args, 'get_cost', {name: 'thrust'}) * 2.5,
                    };
                },
                choose: function(args)
                {
                    var items = {};

                    $.each(args.item.prices, function(name, price)
                    {
                        if(!Comm.is_open(args.group, name) && !Comm.is_closed(args.group, name))
                        {
                            items[name] = {
                                params: {
                                    price: write(price),
                                },
                                disabled: price > client.session.money,
                            };
                        }
                    });

                    return {
                        items: items,
                    };
                },
                progress: function(args, progress)
                {
                    if(Map.check_if_landed() && Map.get_next_station_id() == args.storage.upgrade_station && progress.choose)
                    {
                        var cost = args.item.prices[progress.choose];

                        if(client.session.money < cost)
                        {
                            Comm.activate_info(args, 'money');

                            return;
                        }

                        Game.cash_transfer('Research equipment', cost, false);

                        Comm.mark_as_active(args.group, progress.choose);
                    }
                    else if(Map.get_distance_to_station(args.storage.upgrade_station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'research');
                    }
                },
            },
            speed: {
                start: function(args)
                {
                    if(!args.storage.speed)
                    {
                        args.storage.speed = Math.max(client.session.stats.max_speed, 500);
                    }

                    args.storage.speed *= 2;
                },
                params: function(args, params)
                {
                    if(params.type == 'info')
                    {
                        return {speed: write(args.storage.speed * 10)};
                    }
                },
                progress: function(args, progress)
                {
                    if(client.session.speed >= args.storage.speed)
                    {
                        args.storage.reward += Comm.call_group_method(args, 'get_cost', {name: 'speed'});

                        Comm.mark_as_replaced(args.group, args.name);
                    }
                },
            },
            distance: {
                start: function(args)
                {
                    if(!args.storage.distance)
                    {
                        args.storage.distance = Math.max(client.session.distance, 1e6);
                    }

                    args.storage.distance *= 2;
                },
                params: function(args, params)
                {
                    if(params.type == 'info')
                    {
                        return {distance: write(args.storage.distance)};
                    }
                },
                progress: function(args, progress)
                {
                    if(client.session.distance >= args.storage.distance)
                    {
                        args.storage.reward += Comm.call_group_method(args, 'get_cost', {name: 'distance'});

                        Comm.mark_as_replaced(args.group, args.name);
                    }
                },
            },
            thrust: {
                start: function(args)
                {
                    if(!args.storage.thrust)
                    {
                        args.storage.thrust = g.exhaust.max_thrust;
                    }

                    args.storage.thrust *= 2;
                },
                params: function(args, params)
                {
                    if(params.type == 'info')
                    {
                        return {thrust: write(args.storage.thrust)};
                    }
                },
                progress: function(args, progress)
                {
                    if(p.thrust >= args.storage.thrust)
                    {
                        args.storage.reward += Comm.call_group_method(args, 'get_cost', {name: 'thrust'});

                        Comm.mark_as_replaced(args.group, args.name);
                    }
                },
            },
        },

        powerless: {
            trigger: function(args)
            {
                if(Delivery.estimate_deliveries_value() < Game.get_scalable_cost() && client.session.money < Game.get_scalable_cost() && !Map.check_if_landed())
                {
                    Comm.mark_as_active(args.group, 'offer');
                }
            },
            offer: {
                choose: function(args)
                {
                    return {
                        params: {
                            body: {
                                pay: write(args.storage.rival_pay),
                            },
                        },
                        items: {
                            accept: {status: 'primary'},
                            decline: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose == 'accept')
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'package');
                    }
                    else if(progress.choose == 'decline')
                    {
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
            package: {
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        args.item.target = Map.get_random_station_id({delivery: true, exclude_current: true, upcoming: true});
                    }

                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'pickup');
                    }
                },
            },
            pickup: {
                start: function(args)
                {
                    args.item.pickup_station = Map.get_next_station_id();

                    var delivery_target = Map.get_random_station_id({delivery: true, exclude_current: true, upcoming: true});

                    client.session.ext.delivery.push({
                        name: 'package',
                        target: delivery_target,
                        unique: true,
                        weight: 1,
                        wage: client.session.loans.debt ? client.session.loans.debt * 2.5 : Game.get_scalable_cost(),
                        cost: 0,
                    });
                },
                progress: function(args, progress)
                {
                    var delivery = Delivery.get_delivery_by_name('package');

                    if(delivery)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'loan');
                    }

                    if(Map.get_distance_to_station(args.item.pickup_station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_replaced(args.group, 'package');
                    }
                },
            },
            loan: {
                start: function(args)
                {
                    args.item.debt = client.session.loans.debt;
                },
                progress: function(args, progress)
                {
                    var delivery = Delivery.get_delivery_by_name('package');

                    if(client.session.loans.debt > args.item.debt)
                    {
                        delivery.target = 0;

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'release');
                    }

                    if(progress.station == delivery.target)
                    {
                        delivery.target = 0;

                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_replaced(args.group, 'package');
                    }
                },
            },
            release: {
                progress: function(args, progress)
                {
                    if(!Delivery.get_delivery_by_name('package'))
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'package');
                    }
                },
            },
        },

        coating: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e7, 1e9)))
                {
                    Comm.mark_as_active(args.group, 'station');
                }
            },
            station: {
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        args.item.target = Map.get_random_station_id({shop: true, exclude_current: true, upcoming: true});
                    }

                    if(progress.station == args.item.target)
                    {
                        args.storage.station = args.item.target;

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'coat');
                    }
                },
            },
            coat: {
                choose: function(args)
                {
                    args.item.prices = {
                        blades: g.blades.cost * 0.5,
                        exhaust: g.exhaust.cost * 0.5,
                    };
                    return {
                        items: {
                            blades: {
                                params: {cost: write(args.item.prices.blades)},
                                disabled: args.item.prices.blades > client.session.money,
                            },
                            exhaust: {
                                params: {cost: write(args.item.prices.exhaust)},
                                disabled: args.item.prices.exhaust > client.session.money,
                            },
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose && Map.check_if_landed())
                    {
                        var cat_name = progress.choose;

                        var item = g[cat_name];

                        var cost = args.item.prices[cat_name];

                        if(client.session.money < cost)
                        {
                            Comm.activate_info(args, 'money');

                            return;
                        }

                        if(item.storage.coated)
                        {
                            Comm.activate_info(args, 'already_coated');

                            return;
                        }

                        //Checking if item was not repaired before

                        if(Ph.get_variable_health(cat_name) < 0.8 && Ph.get_variable_health_age(cat_name) < 0.8)
                        {
                            Comm.activate_info(args, 'repaired');

                            return;
                        }

                        Game.cash_transfer('Part coating', cost, false);

                        item.h *= 1.25;
                        item.h_max *= 1.25;
                        item.h_age *= 1.25;

                        item.storage.coated = true;

                        Ph.reset_physics();

                        Comm.activate_info(args, 'coated');
                    }

                    if(Map.get_next_station_id() != args.storage.station)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'station');
                    }
                },
            },
        },

        deposit: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(5e7, 5e9)))
                {
                    Comm.mark_as_active(args.group, 'amount');
                }
            },
            amount: {
                choose: function(args)
                {
                    var money = client.session.money
                    args.storage.money = money;

                    args.item.amounts = {
                        '1/10': money * 0.1,
                        '2/10': money * 0.2,
                        '3/10': money * 0.3,
                        '4/10': money * 0.4,
                        '5/10': money * 0.5,
                        '6/10': money * 0.6,
                        '7/10': money * 0.7,
                        '8/10': money * 0.8,
                        '9/10': money * 0.9,
                        '10/10': money * 1,
                    };

                    var items = {};

                    $.each(args.item.amounts, function(name, amount)
                    {
                        items[name] = {text: lang('comms.groups.deposit.items.amount.choises.amount', {amount: write(amount)})};
                    });
                    return {items: items};
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        args.storage.deposit = args.item.amounts[progress.choose];

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'time');
                        Comm.activate_choose(args.group, 'time');
                    }
                },
            },
            time: {
                choose: function(args)
                {
                    args.item.money = client.session.money;

                    args.storage.termination_prec = 0.5;
                    args.item.hours = {
                        196: {hours: 196,   prec: 0.0014},
                        96: {hours: 96,     prec: 0.0013},
                        48: {hours: 48,     prec: 0.0012},
                        24: {hours: 24,     prec: 0.0011},
                        12: {hours: 12,     prec: 0.001},
                    };

                    var items = {};

                    $.each(args.item.hours, function(name, option)
                    {
                        var wage = args.storage.deposit * option.prec * option.hours;

                        items[name] = {text: lang('comms.groups.deposit.items.time.choises.wage', {hours: option.hours, wage: write(wage)})};
                    })

                    items['back'] = {status: 'warning'};

                    return {items: items};
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        if(progress.choose == 'back')
                        {
                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_replaced(args.group, 'amount');
                            Comm.activate_choose(args.group, 'amount');
                        }
                        else
                        {
                            args.storage.hours = args.item.hours[progress.choose].hours;
                            args.storage.wage = args.storage.deposit + args.storage.hours * args.storage.deposit * args.item.hours[progress.choose].prec;

                            if(client.session.money >= args.storage.deposit)
                            {
                                Game.cash_transfer('Deposit', args.storage.deposit, false);

                                Comm.mark_as_closed(args.group, args.name);
                                Comm.mark_as_replaced(args.group, 'wait');
                            }
                            else
                            {
                                Comm.activate_info(args, 'money');

                                Comm.mark_as_closed(args.group, args.name);
                                Comm.mark_as_replaced(args.group, 'amount');
                            }
                        }
                    }
                },
            },
            wait: {
                start: function(args)
                {
                    args.item.time_start = client.session.stats.time_in_game;

                    args.storage.deliveries_stops = client.session.stats.deliveries_stops + 1;
                },
                params: function(args, params)
                {
                    if(params.type == 'info')
                    {
                        var now = (client.session.stats.time_in_game - args.item.time_start) / 60 / 60;
                        return {hours: args.storage.hours, now: Math.floor(now)};
                    }
                },
                choose: function(args)
                {
                    return {
                        params: {
                            body: {deposited: write(args.storage.deposit)},
                        },
                        items: {
                            terminate: {
                                status: 'danger',
                                params: {amount: write(args.storage.deposit * args.storage.termination_prec)},
                            },
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        Game.cash_transfer('Deposit return', args.storage.deposit * args.storage.termination_prec, true);

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'amount');
                    }
                    else
                    {
                        var time_now = client.session.stats.time_in_game;

                        var time_after = args.storage.hours * 60 * 60;

                        if(time_now > args.item.time_start + time_after)
                        {
                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_replaced(args.group, 'cash');
                        }
                    }
                },
            },
            cash: {
                choose: function(args)
                {
                    return {
                        items: {
                            cash: {
                                params: {amount: write(args.storage.wage)},
                            },
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        Game.cash_transfer('Deposit income', args.storage.wage, true);

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'delay');
                    }
                },
            },
            delay: {
                progress: function(args, progress)
                {
                    if(client.session.stats.deliveries_stops >= args.storage.deliveries_stops)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'amount');
                    }
                },
            },
        },

        border: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'news');
                //Comm.mark_as_active(args.group, 'questions');
            },
            news: {
                start: function(args)
                {
                    var station = {
                        name: `The Great Border`,
                        distance: Map.get_allowed_station_distance_region(client.session.distance * 3),
                        icon: 'triple-lock',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);

                    args.storage.border = args.item.target;
                },
                progress: function(args, progress)
                {
                    if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'border');
                    }
                    else if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_active(args.group, 'melting');
                    }
                },
            },
            questions: {
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        args.item.target = Map.get_next_station_id(false, true);
                    }
                    else if(progress.station == args.item.target)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'informant');
                    }
                },
            },
            informant: {
                choose: function(args)
                {
                    return {
                        items: {
                            ask: {status: 'success'},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        if(chance(1/2) && Comm.do_once(args, 'informant_group', true))
                            Comm.activate_info(args, 'informant_group');
                        else if(chance(1/4) && Comm.do_once(args, 'informant_radiation', true))
                            Comm.activate_info(args, 'informant_radiation');
                        else if(chance(1/4) && Comm.do_once(args, 'informant_delivery', true))
                            Comm.activate_info(args, 'informant_delivery');
                        else if(chance(1/4) && Comm.do_once(args, 'informant_bribe', true))
                            Comm.activate_info(args, 'informant_bribe');
                        else if(chance(1/5) && Comm.do_once(args, 'informant_certificate', true))
                        {
                            Comm.activate_info(args, 'informant_certificate');

                            // Where to find certificate?
                        }
                        else
                            Comm.activate_info(args, 'informant_none');

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'questions');
                    }
                },
            },
            border: {
                start: function(args)
                {
                    args.item.actions = {};
                },
                choose: function(args)
                {
                    args.item.bribe_amount = Game.get_scalable_cost() * 3;

                    return {
                        items: {
                            bribe: {
                                status: 'danger',
                                disabled: args.item.actions['bribe'],
                                params: {amount: write(args.item.bribe_amount)},
                            },
                            certificate: {
                                status: 'primary',
                                disabled: args.item.actions['certificate'],
                            },
                            delivery: {
                                status: 'primary',
                                disabled: args.item.actions['delivery'],
                            },
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        args.item.actions[progress.choose] = true;

                        var granted = false;

                        switch(progress.choose)
                        {
                            case 'bribe':
                                if(client.session.money >= args.item.bribe_amount && chance(1/3))
                                {
                                    Game.cash_transfer('Bribe', args.item.bribe_amount, false);

                                    Comm.activate_info(args, 'bribe_ok');

                                    granted = true;
                                }
                                else
                                {
                                    Comm.activate_info(args, 'bribe_fail');
                                }
                                break;
                            case 'certificate':
                                break;
                            case 'delivery':
                                if(chance(1/3))
                                {
                                    Comm.activate_info(args, 'delivery_ok');

                                    granted = true;
                                }
                                else
                                {
                                    Comm.activate_info(args, 'delivery_fail');
                                }
                                break;
                        }

                        if(granted)
                        {
                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_active(args.group, 'granted');
                        }
                    }
                    else if(Map.get_distance_to_station(args.storage.border) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_active(args.group, 'melting');
                    }
                },
            },
            granted: {
                start: function(args, progress)
                {
                    Comm.activate_info(args, 'pass');
                },
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.storage.border) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
            melting: {
                start: function(args)
                {
                    args.item.radiation_end = client.session.distance * 1.1;

                    Comm.activate_info(args, 'radiation');
                },
                progress: function(args, progress)
                {
                    if(client.session.distance > args.item.radiation_end)
                    {
                        Comm.activate_info(args, 'escape');
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }
                    else if(p.temp < 2000 && client.session.speed > 50)
                    {
                        p.temp += g.injection.max_fuelflow * 3 / Ph.get_thermal_inertia();
                    }
                },
            },
        },

        judith: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'chase');
            },

            chase: {
                start: function(args)
                {
                    var station = {
                        name: `Judith`,
                        distance: Map.get_allowed_station_distance_region(0),
                        icon: 'moebius-star',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                },
                progress: function(args, progress)
                {
                    var ship = Map.get_station_by_id(args.item.target);

                    var distance = Map.get_distance_to_station(args.item.target);

                    ship.distance += 1e8 / distance;

                    if(args.item.target == progress.station)
                    {
                        // Close
                    }
                },
            },
        },

        inspection: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e7, 1e8)))
                {
                    Comm.mark_as_active(args.group, 'station');
                }
            },
            method: {
                check_emissions: function(args, cat_name)
                {
                    return Ph.is_opt(cat_name) && g[cat_name].bin >= g.injection.bin && (Ph.get_variable_health_prec(cat_name) > 0.5 || !Ph.has_health(cat_name));
                },
            },
            station: {
                start: function(args)
                {
                    var station = {
                        name: `Ship Inspection Co.`,
                        distance: Map.get_allowed_station_distance_region(client.session.distance * 3),
                        icon: 'tv-tower',
                        ext: {
                            fluid: {},
                            shop: {
                                params: {
                                    buy_price: 1.25,
                                    sell_price: 1,
                                }
                            },
                            repair: {
                                cost_per_value: 0.75,
                            },
                        },
                    };

                    args.item.target = Map.append_station(station);
                    args.storage.station = args.item.target;
                },
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_replaced(args.group, 'probe');
                        Comm.mark_as_replaced(args.group, 'station');
                    }
                },
            },
            probe: {
                progress: function(args, progress)
                {
                    // Rate
                    var base_cost = g.injection.max_fuelflow * 0.2;

                    // Efficiency
                    var eff = p.burned / p.fuelflow;

                    if(eff < 0.5)
                    {
                        base_cost *= 4;
                    }

                    if(g.exhaust.max_thrust < g.injection.max_fuelflow)
                    {
                        base_cost *= 4;
                    }

                    /* Cost multipliers */
                    base_cost *= 2 - eff;
                    if(Ph.is_opt('afterburner')) base_cost *= 2;

                    var egr = Comm.call_group_method(args, 'check_emissions', 'egr');
                    var heater = Comm.call_group_method(args, 'check_emissions', 'heater');
                    var burn_sensor = Comm.call_group_method(args, 'check_emissions', 'burn_sensor');

                    if(!egr && !heater && !burn_sensor)
                    {
                        base_cost *= 2;
                    }

                    Svc.add_tax('inspection', base_cost);

                    Comm.mark_as_closed(args.group, args.name);
                },
            },
        },

        invest: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e6, 1e7)))
                {
                    Comm.mark_as_active(args.group, 'list');
                }
            },
            method: {
                has: function(args, name)
                {
                    if(Comm.is_open_group('invest') && args.global.invested && args.global.invested[name])
                    {
                        return true;
                    }

                    return false;
                },
                get_available_random: function(args, params)
                {
                    if(!params.available) return true;

                    if(!args.storage.skip_random) args.storage.skip_random = {};

                    if(!args.storage.skip_random[params.name])
                    {
                        args.storage.skip_random[params.name] = rand(params.available.min, params.available.max);
                    }

                    if(client.session.distance > args.storage.skip_random[params.name])
                    {
                        return true;
                    }

                    return false;
                },
                unlockables: function(args)
                {
                    return [
                        //cooling_water
                        {
                            name: 'cooling_water_standard',
                            //available: {min: 2e8, max: 4e8},
                        },
                        {
                            name: 'cooling_water_capacity',
                            skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_water_standard'),
                            //available: {min: 3e11, max: 6e11},
                        },
                        //filter_fuel
                        {
                            name: 'filter_fuel_standard',
                            //available: {min: 3e10, max: 4e10},
                        },
                        //filter_intake
                        {
                            name: 'filter_intake_standard',
                            //available: {min: 3e10, max: 4e10},
                        },
                        //heater
                        {
                            name: 'heater_standard',
                            //available: {min: 1e9, max: 3e9},
                        },
                        {
                            name: 'heater_heat',
                            skip: !Comm.call_group_method({group: 'invest'}, 'has', 'heater_standard'),
                            //available: {min: 1e10, max: 3e10},
                        },
                        //lander
                        {
                            name: 'lander_standard',
                            //available: {min: 3e10, max: 5e10},
                        },
                        //egr
                        {
                            name: 'egr_standard',
                            //available: {min: 3e9, max: 3e10},
                        },
                        //burn_sensor
                        {
                            name: 'burn_sensor_standard',
                            //available: {min: 3e9, max: 6e9},
                        },
                        //afterburner
                        {
                            name: 'afterburner_standard',
                            //available: {min: 1e10, max: 3e10},
                        },
                        //compressor
                        {
                            name: 'compressor_standard',
                            //available: {min: 1e9, max: 6e9},
                        },
                        {
                            name: 'compressor_induction',
                            skip: !Comm.call_group_method({group: 'invest'}, 'has', 'compressor_standard'),
                            //available: {min: 1e10, max: 6e10},
                        },
                        //cooling_fan
                        {
                            name: 'cooling_fan_standard',
                            //available: {min: 2e8, max: 6e8},
                        },
                        {
                            name: 'cooling_fan_h',
                            skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_fan_standard'),
                            //available: {min: 2e10, max: 6e10},
                        },
                        //radar
                        {
                            name: 'radar_low_profile',
                            //available: {min: 1e8, max: 3e8},
                        },
                        //blades
                        {
                            name: 'blades_eff',
                            //available: {min: 2e10, max: 6e10},
                        },
                        //injection
                        {
                            name: 'injection_electronic',
                            //available: {min: 3e10, max: 9e10},
                        },
                        {
                            name: 'injection_piezoelectric',
                            skip: !Comm.call_group_method({group: 'invest'}, 'has', 'injection_electronic'),
                            //available: {min: 3e11, max: 9e11},
                        },
                        //cooling
                        {
                            name: 'cooling_eff',
                            //available: {min: 1e10, max: 5e10},
                        },
                        //exhaust
                        {
                            name: 'exhaust_eff',
                            //available: {min: 2e10, max: 6e10},
                        },
                        //starter
                        {
                            name: 'starter_h',
                            //available: {min: 3e10, max: 9e10},
                        },
                        //airbrake
                        {
                            name: 'air_brake_eff',
                            //available: {min: 2e10, max: 8e10},
                        },
                    ];
                },
                get_available: function(args)
                {
                    if(!args.global.invested) args.global.invested = {};

                    var unlockables = Comm.call_group_method(args, 'unlockables');

                    var available = [];

                    $.each(unlockables, function(i, unlockable)
                    {
                        if(!unlockable.skip && !args.global.invested[unlockable.name] && Comm.call_group_method(args, 'get_available_random', unlockable))
                        {
                            available.push(unlockable);
                        }
                    });

                    return available;
                },
                generate: function(args, params)
                {
                    var cat_name = Inv.search_cat_by_name(params.name);

                    var bin = Inv.get_recommended_bin(cat_name);

                    if(!bin) bin = 1;

                    var item = Inv.generate_variable_by_name(cat_name, params.name, bin);

                    args.storage.cat_name = cat_name;
                    args.storage.name = params.name;
                    args.storage.cost = item.cost * 5;
                    args.storage.distance = client.session.distance * 1.25;
                },
            },
            list: {
                choose: function(args)
                {
                    var unlockables = Comm.call_group_method(args, 'get_available');

                    var items = {};

                    $.each(unlockables, function(i, unlockable)
                    {
                        items[unlockable.name] = {text: lang(`inventory.items.${unlockable.name}.title`)};
                    });

                    return {
                        items: items,
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        args.storage.selected = progress.choose;

                        Comm.mark_as_replaced(args.group, 'offer');
                        Comm.activate_choose(args.group, 'offer');
                    }
                },
            },
            offer: {
                start: function(args)
                {
                    Comm.call_group_method(args, 'generate', {name: args.storage.selected});
                },
                choose: function(args)
                {
                    return {
                        params: {
                            body: {
                                name: lang(`inventory.items.${args.storage.name}.title`),
                                desc: lang(`inventory.items.${args.storage.name}.desc`),
                                info: lang(`inventory.types_desc.${args.storage.cat_name}`),
                                cost: write(args.storage.cost),
                            },
                        },
                        items: {
                            accept: {
                                status: 'success',
                                params: {cost: write(args.storage.cost)},
                                disabled: args.storage.cost > client.session.money,
                            },
                            list: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        if(progress.choose == 'accept')
                        {
                            if(!Game.cash_transfer('Investment', args.storage.cost, false))
                            {
                                return;
                            }

                            Doorbell.call('invest', {info: args.storage.name});

                            args.global.invested[args.storage.name] = true;

                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_closed(args.group, 'list');
                            Comm.mark_as_replaced(args.group, 'wait');
                        }
                        else if(progress.choose == 'list')
                        {
                            Comm.activate_choose(args.group, 'list');
                        }
                    }
                },
            },
            wait: {
                progress: function(args, progress)
                {
                    if(client.session.distance > args.storage.distance)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_replaced(args.group, 'list');
                    }
                },
            },
        },

        licence: {
            trigger: function(args)
            {
                Comm.mark_as_active(args.group, 'upgrade');
            },
            upgrade: {
                start: function(args)
                {
                    args.storage.tax = 0;
                    args.item.time_start = client.session.stats.time_in_game;
                },
                progress: function(args, progress)
                {
                    args.storage.tax = g.cargo.bin > 1 ? pow(g.cargo.bin - 1, 1.5) * 100 : 0;

                    var time_now = client.session.stats.time_in_game;
                    var time_after = 4 * 60 * 60;

                    if(time_now > args.item.time_start + time_after)
                    {
                        if(args.storage.tax)
                        {
                            Svc.add_tax('licence', args.storage.tax);
                        }

                        args.item.time_start = time_now;
                    }
                },
                params: function(args, params)
                {
                    if(params.type == 'info')
                    {
                        return {tax: write(args.storage.tax)};
                    }
                },
            },
        },

        core: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'wreck');
                /* Maybe start later or randomize? */
                //Comm.mark_as_active(args.group, 'help');
            },

            wreck: {
                start: function(args)
                {
                    var station = {
                        name: `Flying Debris`,
                        distance: Map.get_allowed_station_distance_region(client.session.distance * 3),
                        icon: 'asteroid',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                    args.storage.station = args.item.target;
                },
                progress: function(args, progress)
                {
                    if(args.item.target == progress.station)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'inspect');
                    }
                    else if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_closed_group(args.group);
                    }
                },

            },

            help: {
                start: function(args)
                {
                    args.item.target = Map.get_random_station_id({countable: true, exclude_current: true, upcoming: true});
                    args.storage.card_station = args.item.target;
                },
                progress: function(args, progress)
                {
                    if(args.item.target == progress.station)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'card');
                    }
                    else if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                    }
                },
            },

            card: {
                start: function(args)
                {
                    args.item.cost = Game.get_scalable_cost() * rand(1, 2, 2);
                },
                choose: function(args)
                {
                    return {
                        items: {
                            buy: {status: 'success', params: {cost: write(args.item.cost)}},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose && Map.check_if_landed())
                    {
                        if(Game.cash_transfer('Authentication card', args.item.cost, false))
                        {
                            Comm.mark_as_closed(args.group, args.name);

                            Comm.activate_info(args, 'card_added');
                        }
                    }
                    else if(Map.get_distance_to_station(args.storage.card_station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                    }
                },
            },

            inspect: {
                choose: function(args)
                {
                    var has_card = Comm.is_closed_successful(args.group, 'card');

                    return {
                        items: {
                            card: has_card ? {status: 'success'} : false,
                            hack: {status: 'warning'},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose && Map.check_if_landed())
                    {
                        if(progress.choose == 'hack')
                        {
                            if(!chance(1/2))
                            {
                                Comm.mark_as_closed(args.group, args.name, true);
                                Comm.mark_as_closed_group(args.group);

                                return Comm.activate_info(args, 'hack_failed');
                            }
                        }

                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'maintain');
                        Comm.activate_info(args, 'card_added');
                    }
                    else if(Map.get_distance_to_station(args.storage.station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },

            maintain: {
                start: function(args)
                {
                    args.storage.core_active = false;
                    args.storage.cells = 0;

                    args.storage.energy_limit = 1000;
                    args.storage.energy = 500;

                    args.storage.profile = {};
                },
                choose: function(args)
                {
                    var prec_filled = Math.round(args.storage.energy / args.storage.energy_limit * 100);

                    return {
                        params: {
                            body: {
                                state: args.storage.profile.winter ? 'Falling' : 'Rising',
                                status: args.storage.energy_limit > 0 ? 'Active' : 'Failed',
                                prec: args.storage.energy_limit > 0 ? prec_filled + '%' : '-',
                                cells: args.storage.cells,
                            },
                        },
                        items: {
                            add_cell: {disabled: args.storage.energy_limit <= 0 || args.storage.cells <= 0},
                            charge_cell: {disabled: args.storage.energy < 100},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    var prec_filled = args.storage.energy / args.storage.energy_limit;

                    if(progress.choose)
                    {
                        if(progress.choose == 'add_cell')
                        {
                            args.storage.cells--;
                            args.storage.energy += 100;
                        }
                        else if(progress.choose == 'charge_cell')
                        {
                            args.storage.cells++;
                            args.storage.energy -= 100;
                        }
                    }

                    if(args.storage.energy_limit > 0)
                    {
                        if(prec_filled >= 1 || prec_filled <= 0)
                        {
                            args.storage.energy_limit -= 1;
                        }
                        else if(prec_filled > 0.8 || prec_filled < 0.2)
                        {
                            args.storage.energy_limit -= 0.01;
                        }
                        else
                        {
                            args.storage.energy_limit -= 0.0001;
                        }

                        if(!args.storage.profile.step || args.storage.profile.step <= 0)
                        {
                            args.storage.profile = {
                                winter: chance(2/5),
                                step: rand(5e3, 5e4),
                            };
                        }

                        var profile = args.storage.profile;

                        if(profile.winter)
                        {
                            args.storage.energy += rand(-1, 0.97, 2);
                        }
                        else
                        {
                            args.storage.energy += rand(-0.97, 1, 2);
                        }

                        profile.step--;

                        args.storage.energy = clamp(args.storage.energy, 0, args.storage.energy_limit);
                    }

                },
                params: function(args, params)
                {
                    var prec_filled = Math.round(args.storage.energy / args.storage.energy_limit * 100);

                    if(params.type == 'info')
                    {
                        return {
                            state: args.storage.profile.winter ? 'Falling' : 'Rising',
                            prec: args.storage.energy_limit > 0 ? prec_filled + '%' : '-',
                        };
                    }
                },
            },
        },

        encounters: {
            trigger: function(args)
            {
                /*
                if(Comm.group_distance_start(args, rand(1e4, 1e5)))
                {
                    Comm.mark_as_active(args.group, 'stories');
                }
                */
            },
            method: {
                list: function(args, params)
                {
                    var list = [
                        {
                            name: 'fog',
                            title: 'Mystic Asteroid Fog',
                            icon: 'star-swirl',
                            items: chance(1/2) ? ['blades_eff', 'injection_electronic'] : false,
                            distance: rand(1.5, 2, 2),
                            skip: chance(9/10),
                        },
                        {
                            name: 'saucer',
                            title: 'Hovering Saucer',
                            icon: 'ufo',
                            skip: chance(9/10),
                        },
                        {
                            name: 'portal',
                            title: 'Locked Portal',
                            icon: 'interstellar-path',
                            skip: chance(9/10),
                        },
                        {
                            name: 'venamous',
                            title: 'Abandoned Spaceship',
                            icon: 'spaceship',
                            skip: chance(9/10),
                        },
                        {
                            name: 'lost_cargo',
                            title: 'Lost Cargo Containers',
                            icon: 'jigsaw-box',
                            repeat: true,
                            items: ['blades_standard', 'exhaust_standard', 'injection_mechanical'],
                            h_min: 0.5,
                            skip: chance(7/10),
                        },
                        {
                            name: 'mil_cargo',
                            title: 'Sealed Military Containers',
                            icon: 'stone-block',
                            repeat: true,
                            items: chance(1/4) ? ['exhaust_mil', 'cooling_mil', 'injection_mil', 'blades_mil', 'air_brake_mil', 'heater_mil'] : [],
                            skip: chance(9/10),
                            h_min: 0.8,
                        },
                    ];

                    return list;
                },
                get_by_name: function(args, name)
                {
                    var list = Comm.call_group_method(args, 'list');

                    var match = false;

                    $.each(list, function(i, item)
                    {
                        if(item.name == name)
                        {
                            match = item;

                            return false;
                        }
                    });

                    return match;
                },
                get_unseen: function(args)
                {
                    var list = Comm.call_group_method(args, 'list');

                    var unseen = [];

                    $.each(list, function(i, item)
                    {
                        if(!args.storage.seen[item.name])
                        {
                            if(!item.skip)
                            {
                                unseen.push(item);
                            }
                        }
                    });

                    return unseen;
                },
                generate: function(args, params)
                {
                    var list = Comm.call_group_method(args, 'get_unseen');

                    shuffle_array(list);

                    var item = list[0];

                    if(item)
                    {
                        if(!item.repeat)
                        {
                            args.storage.seen[item.name] = true;
                        }

                        return item;
                    }

                    return false;
                },
                append: function(args, params)
                {
                    var generated = Comm.call_group_method(args, 'generate');

                    if(generated)
                    {
                        var min_dist = generated.distance ? generated.distance : rand(2, 3);

                        var station = {
                            name: generated.title,
                            distance: Map.get_allowed_station_distance_region(client.session.distance * min_dist),
                            icon: generated.icon,
                            ext: {},
                        };

                        var station_id = Map.append_station(station);

                        args.storage.encounters[station_id] = generated;
                    }

                    return false;
                },
                generate_item: function(args, params)
                {
                    var cat_name = Inv.search_cat_by_name(params.name);

                    var bin = Inv.get_recommended_bin(cat_name);

                    if(!bin) bin = 1;

                    var item = Inv.generate_variable_by_name(cat_name, params.name, bin);

                    if(params.h_min && item.h)
                    {
                        item.h *= rand(params.h_min, 1, 3);
                        item.h_age *= rand(params.h_min, 1, 3);
                    }

                    delete item.skip;

                    client.session.ext.shop[cat_name] = [item];
                },
            },
            stories: {
                start: function(args)
                {
                    args.storage.seen = {};
                    args.storage.encounters = {};
                    args.storage.hidden = true;
                },
                progress: function(args, progress)
                {
                    if(Object.keys(args.storage.encounters).length < 3)
                    {
                        Comm.call_group_method(args, 'append');
                    }

                    if(args.storage.encounters[progress.station])
                    {
                        var encounter = args.storage.encounters[progress.station];

                        Comm.activate_info(args, encounter.name);

                        if(encounter.items)
                        {
                            Comm.call_group_method(args, 'generate_item', {name: pick_rand(encounter.items), h_min: encounter.h_min ? encounter.h_min : false});
                        }

                        delete args.storage.encounters[progress.station];
                    }

                    $.each(args.storage.encounters, function(station_id)
                    {
                        if(!Map.get_station_by_id(station_id))
                        {
                            delete args.storage.encounters[station_id];
                        }
                    });
                },
            },

        },

        ceiling: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e4, 1e5)))
                {
                    //Comm.mark_as_active(args.group, 'station');
                }
            },
            station: {
                start: function(args)
                {
                    client.session.region_next = Region.generate_region({name: 'darkness_unknown'});

                    var station = {
                        name: `End of the Universe`,
                        distance: Map.get_allowed_station_distance_region(client.session.distance * 1.1),
                        icon: 'tower-flag',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                    args.storage.station = args.item.target;
                },
                progress: function(args, progress)
                {
                    if(args.item.target == progress.station)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'outsider');
                    }
                    else if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_active(args.group, 'unbound');
                    }
                },
            },
            outsider: {
                start: function(args)
                {
                    args.storage.asked = [];

                    Comm.activate_info(args, 'greeting');
                },
                choose: function(args)
                {
                    var questions = ['place', 'you', 'past_this', 'origins', 'universe', 'program', 'clues'];

                    $.each(args.storage.asked, function(i, name)
                    {
                        questions.splice(questions.indexOf(name), 1);
                    });

                    var items = {};

                    if(questions[0])
                        items[questions[0]] = {};

                    if(questions[1])
                        items[questions[1]] = {};

                    return {
                        items: items,
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        args.storage.asked.push(progress.choose);

                        Comm.activate_info(args, progress.choose);
                    }

                    if(Map.get_distance_to_station(args.storage.station) <= 0 || args.storage.asked.length >= 7)
                    {
                        if(args.storage.asked.length)
                        {
                            Comm.mark_as_closed(args.group, args.name);
                        }
                        else
                        {
                            Comm.mark_as_closed(args.group, args.name, true);
                        }

                        Comm.mark_as_active(args.group, 'unbound');
                    }
                },
            },
            unbound: {
                start: function(args)
                {
                    var distance = client.session.distance + g.radar.base_scale * 2;

                    var station = {
                        name: `The Switch`,
                        distance: Map.get_allowed_station_distance_region(distance),
                        icon: 'abstract-039',
                        ext: {},
                    };

                    args.storage.switch_station = Map.append_station(station);
                },
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.storage.switch_station) < g.radar.base_scale && !args.item.target)
                    {
                        args.item.target = args.storage.switch_station;
                    }

                    if(progress.station == args.storage.switch_station)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'the_switch');
                    }

                    if(Map.get_distance_to_station(args.storage.switch_station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
            the_switch: {
                choose: function(args)
                {
                    return {
                        items: {
                            toggle: {status: 'danger'},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }

                    if(Map.get_distance_to_station(args.storage.switch_station) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_closed_group(args.group);
                    }
                }
            },
        },

        cold: {
            trigger: function(args)
            {
                if(Comm.group_distance_start(args, rand(1e9, 1e10)))
                {
                    Comm.mark_as_active(args.group, 'broadcast');
                }
            },
            method: {
                spawn: function(args)
                {
                    return Comm.is_open_group(args.group) || Comm.is_closed_group(args.group);
                },
            },
            broadcast: {
                start: function(args)
                {
                    Comm.activate_info(args, 'message');
                },
                choose: function(args)
                {
                    return {
                        items: {
                            ok: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_closed_group(args.group);
                    }
                },
            },
        },

        zero: {
            trigger: function(args)
            {
                if(client.session.ext.shop.heater && client.session.ext.shop.heater.length)
                {
                    Comm.mark_as_active(args.group, 'theory');
                }
            },
            theory: {
                choose: function(args)
                {
                    return {
                        items: {
                            agree: {},
                            disagree: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        if(progress.choose == 'agree')
                        {
                            Comm.mark_as_closed(args.group, args.name);
                            Comm.mark_as_active(args.group, 'fridge');

                            Comm.activate_info(args, 'instructions');
                        }
                        else if(progress.choose == 'disagree')
                        {
                            Comm.mark_as_closed_group(args.group);
                        }
                    }
                },
            },
            fridge: {
                start: function(args)
                {
                    client.session.region_next = Region.generate_region({name: 'fridge'});
                },
                progress: function(args)
                {
                    var region = client.session.region;

                    if(region.name == 'fridge' && Math.round(p.temp) == region.ambient_temp)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'escape');
                    }
                    else if(region.name != 'fridge' && client.session.region_next.name != 'fridge')
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_closed_group(args.group);
                    }
                }
            },
            escape: {
                start: function(args)
                {
                    var station = {
                        name: `Thermodynamics Research University`,
                        distance: Map.get_allowed_station_distance_region(client.session.distance * 1.25),
                        icon: 'block-house',
                        ext: {},
                    };

                    args.item.target = Map.append_station(station);
                },
                progress: function(args, progress)
                {
                    if(Map.get_distance_to_station(args.item.target) <= 0)
                    {
                        Comm.mark_as_closed(args.group, args.name, true);
                        Comm.mark_as_closed_group(args.group);
                    }
                    else if(progress.station == args.item.target)
                    {
                        var reward = Game.get_scalable_cost() * 10;

                        Comm.activate_info(args, 'complete');

                        Game.cash_transfer('Reward for research', reward, true);
                    }
                }
            },
        },

        exam: {
            trigger: function(args)
            {
                //Comm.mark_as_active(args.group, 'wait');
            },
            wait: {
                start: function(args)
                {
                    args.item.distance = client.session.distance * 10;

                    Comm.mark_as_active(args.group, 'man');
                },
                progress: function(args)
                {
                    if(client.session.distance > args.item.distance)
                    {
                        Comm.mark_as_closed(args.group, args.name);
                        Comm.mark_as_active(args.group, 'course');
                    }
                },
            },
            man: {
                choose: function(args)
                {
                    return {
                        items: {
                            temperature: {},
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        Comm.activate_info(args, progress.choose);
                    }
                },
            },
            course: {
                start: function(args)
                {
                    args.item.completed = 0;
                    args.item.success = 0;

                    args.item.questions = [
                        {
                            name: 'process',
                            answer: 'tank_injection_jet_exhaust',
                            choises: [
                                'tank_injection_jet_exhaust',
                                'injection_jet_tank_exhaust',
                                'tank_jet_injection_exhaust',
                                'injection_tank_jet_exhaust',
                            ],
                        },
                    ];

                    shuffle_array(args.item.questions);
                },
                choose: function(args)
                {
                    var question = args.item.questions[0];

                    var items = {};

                    shuffle_array(question.choises);

                    $.each(question.choises, function(i, name)
                    {
                        items[name] = {};
                    })

                    return {
                        items: items,
                        params: {
                            body: {
                                question: lang(`comms.groups.exam.items.course.choises.${question.name}`),
                            },
                        },
                    };
                },
                progress: function(args, progress)
                {
                    if(progress.choose)
                    {
                        var question = args.item.questions[0];

                        if(question.answer == progress.choose)
                        {
                            args.item.success++;
                            args.item.completed++;
                        }

                        if(args.item.completed >= 5)
                        {
                            Svc.add_tax('exam_course', 200);

                            if(args.item.completed == args.item.success)
                            {
                                Comm.activate_info(args, 'passed');

                                Comm.mark_as_closed_group(args.group);
                            }
                            else
                            {
                                Comm.activate_info(args, 'failed', {completed: args.item.completed, success: args.item.success});
                            }
                        }
                        else
                        {
                            args.item.questions.shift();

                            shuffle_array(args.item.questions);
                        }
                    }
                },
            },
        },
    },
});

var $d_player_table = $('#player-delivery-table');
var $d_station_table = $('#station-delivery-table');
var $d_capacity = $('.delivery-capacity-label');

var $d_c = $('.player-delivery-container');
var $d_c_empty = $('.player-delivery-empty');

$(function(){
    var delivery_table_params = {
        data: [],
        dom: '<t>',
        bPaginate: false,
        language: {
            emptyTable: lang('delivery.no_deliveries'),
        },
        columns: [
            {
                data: 'name',
                title: lang('delivery.name'),
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    var $title = $('<span>').text(lang(`delivery.items.${rowData.name}.title`)).appendTo(td);

                    var $info_icon = $('<i class="gi gi-info pull-right text-primary">')

                    $info_icon.popover({
                        content: lang(`delivery.items.${rowData.name}.desc`),
                        container: 'body',
                        placement: 'auto',
                        trigger: 'hover',
                    });

                    $info_icon.appendTo(td);

                    if(rowData.unique)
                    {
                        var $unique_icon = $('<i class="gi gl gi-round-star pull-right text-warning">').appendTo(td);

                        $unique_icon.tooltip({
                            title: lang('delivery.unique.info'),
                        });

                        $title.addClass('text-warning');
                    }
                },
            },
            {
                data: 'weight',
                title: lang('delivery.weight'),
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    $('<span>').text(write(rowData.weight)).appendTo(td);

                    $('<i class="gi gr gi-weight">').appendTo(td);

                    if(!rowData.data.player)
                    {
                        if(Delivery.get_total_delivery_weight() + rowData.weight <= g.cargo.size)
                        {
                            $(td).addClass('text-success');
                        }
                        else
                        {
                            $(td).addClass('text-danger');
                        }
                    }
                },
            },
            {
                data: 'wage',
                title: lang('delivery.wage'),
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    $('<span>').text(write(rowData.data.wage)).appendTo(td);
                    $('<i class="gi gr gi-money-stack">').appendTo(td);

                    if(rowData.data.cost > 0)
                    {
                        var $cost_info = $('<span class="text-danger pull-right">');

                        $cost_info.tooltip({
                            title: lang('delivery.has_cost'),
                        });

                        $('<span>').text(write('-' + rowData.data.cost)).appendTo($cost_info);

                        $('<i class="gi gr gi-money-stack">').appendTo($cost_info);

                        $cost_info.appendTo(td);
                    }
                },
            },
            {
                data: 'target',
                title: lang('delivery.target'),
                createdCell: function(td, cellData, rowData, row, col)
                {
                    var item = rowData.data;

                    $(td).empty();

                    var $label = $('<span class="label">').appendTo(td);

                    /* Target is now */
                    if(Map.get_next_station_id() == item.target && Map.check_if_passing_by())
                    {
                        if(Map.check_if_landed())
                        {
                            $label.addClass('label-success').text('Arrived');
                        }
                        else
                        {
                            $label.addClass('label-warning').text('Passing by');
                        }
                    }
                    else
                    {
                        if(Map.get_station_by_id(item.target))
                        {
                            var distance_left = Map.get_distance_to_station(item.target);

                            if(distance_left >= 0)
                            {
                                $label.addClass('label-primary').text(Map.get_station_attr(item.target, 'name'));

                                $('<small class="table-separator">').text(lang('delivery.in')).appendTo(td);

                                $('<span class="text-primary delivery-distance-left-label">')
                                    .attr('data-station-id', item.target)
                                    .text(write(distance_left)).appendTo(td);
                            }
                            else
                            {
                                $label.addClass('label-danger').text('Missed');
                            }
                        }
                        else
                        {
                            $label.addClass('label-danger').text('Missed');
                        }
                    }

                    if(rowData.data.target == Map.get_next_station_id() && Map.check_if_landed())
                    {
                        $turn_in_button = $('<span class="choose-button-alt pull-right text-success">').appendTo(td);

                        $('<span class="gi gl gi-pin">').appendTo($turn_in_button);

                        $('<span>').text(lang('delivery.turn_in')).appendTo($turn_in_button);

                        $turn_in_button.click(function()
                        {
                            Delivery.turn_in_delivery(rowData.data.id);

                            Delivery.list_player_deliveries();

                            Delivery.list_station_deliveries();
                        });
                    }
                    else if(rowData.data.player)
                    {
                        $drop_button = $('<span class="choose-button-alt pull-right text-danger">').appendTo(td);

                        $('<i class="gl gi gi-plain-arrow">').appendTo($drop_button);

                        $('<span>').text(lang('delivery.drop')).appendTo($drop_button);

                        $drop_button.click(function()
                        {
                            if(Map.get_station_by_id(item.target) && Map.get_distance_to_station(item.target) > 0)
                            {
                                show_dialog(lang('delivery.drop_action.title'), lang('delivery.drop_action.info'), function()
                                {
                                    Delivery.cancel_delivery(rowData.data.id);

                                    Delivery.list_player_deliveries();
                                    Delivery.list_station_deliveries();
                                });
                            }
                            else
                            {
                                Delivery.cancel_delivery(rowData.data.id);

                                Delivery.list_player_deliveries();
                                Delivery.list_station_deliveries();
                            }
                        });
                    }
                    else
                    {
                        var $take_button = $('<span class="pull-right choose-button-alt">').appendTo(td);

                        if(Delivery.get_total_delivery_weight() + rowData.weight <= g.cargo.size && (!rowData.data.cost || rowData.data.cost <= client.session.money))
                        {
                            $take_button.addClass('text-success');
                        }
                        else
                        {
                            $take_button.addClass('text-muted');
                        }

                        $('<i class="gi gl gi-cargo-crane">').appendTo($take_button);

                        $('<span>').text(lang('delivery.take')).appendTo($take_button);

                        $take_button.click(function()
                        {
                            var result = Delivery.take_delivery(rowData.data.id);

                            if(result['success'])
                            {
                                Delivery.list_player_deliveries();
                                Delivery.list_station_deliveries();
                            }
                            else
                            {
                                show_popup($(this), lang('delivery.take_info.' + result['info']), 'tooltip-danger');
                            }
                        });
                    }
                },
            },
        ],
    };

    $d_player_table.DataTable(delivery_table_params);
    $d_station_table.DataTable(delivery_table_params);

    $('[href="#delivery-tab"]').on('show.bs.tab', function()
    {
        Delivery.draw_tab();
    });

    $d_capacity.tooltip({
        title: lang('delivery.capacity'),
        container: 'body',
        placement: 'top',
    });
});

var Delivery = {

    draw_delivery_capacity_label: function()
    {
        var used = this.get_delivery_slots_used();
        var count = this.get_delivery_slots_size();

        $d_capacity.removeClass('label-success').removeClass('label-danger').removeClass('label-warning');

        if(used / count > 0.8)
        {
            $d_capacity.addClass('label-danger');
        }
        else if(used > 0.5)
        {
            $d_capacity.addClass('label-warning');
        }
        else
        {
            $d_capacity.addClass('label-success');
        }

        var left = count - used;

        $d_capacity.text(`${write(used)} / ${write(count)} [${write(left)}]`);
    },

    list_player_deliveries: function()
    {
        var items = client.session.delivery;

        var dT = $d_player_table.DataTable();

        dT.clear();

        $.each(items, function(i, item)
        {
            dT.rows.add([{
                name: item.name,
                weight: item.weight,
                wage: item.wage,
                target: item.target,
                data: $.extend({}, item, {id: i, player: true}),
            }]);
        });

        dT.draw();

        this.draw_delivery_capacity_label();

        if(items.length > 0)
        {
            $d_c.removeClass('hidden');
            $d_c_empty.addClass('hidden');
        }
        else
        {
            $d_c.addClass('hidden');
            $d_c_empty.removeClass('hidden');
        }
    },

    list_station_deliveries: function()
    {
        var items = client.session.ext.delivery;

        var dT = $d_station_table.DataTable();

        dT.clear();

        if(Map.check_if_landed())
        {
            $.each(items, function(i, item)
            {
                dT.rows.add([{
                    name: item.name,
                    weight: item.weight,
                    wage: item.wage,
                    target: item.target,
                    unique: item.unique,
                    data: $.extend({}, item, {id: i, player: false}),
                }]);
            });
        }

        dT.draw();
    },

    get_delivery_slots_size: function()
    {
        return client.session.variables['cargo'].size;
    },

    get_delivery_slots_used: function()
    {
        var used = 0;

        $.each(client.session.delivery, function(i, delivery)
        {
            used += delivery.weight;
        });

        return used;
    },

    take_delivery: function(id)
    {
        if(!Map.check_if_landed())
        {
            return {success: false, info: 'in_space'};
        }

        var delivery = clone(client.session.ext.delivery[id]);

        if(delivery.cost <= client.session.money)
        {
            if(this.get_delivery_slots_used() + delivery.weight <= this.get_delivery_slots_size())
            {
                client.session.money -= delivery.cost;

                client.session.delivery.push(delivery);

                client.session.ext.delivery.splice(id, 1);

                //Ph.reset_physics();

                if(delivery.cost)
                {
                    Game.write_last_cost(lang(`delivery.items.${delivery.name}.title`), delivery.cost, false);
                }

                Comm.report_delivery(delivery, {success: true, info: 'take'});

                return {success: true};
            }

            return {success: false, info: 'slots'};
        }

        return {success: false, info: 'cost'};
    },

    cancel_delivery: function(id)
    {
        var delivery = client.session.delivery[id];

        Comm.report_delivery(delivery, {success: false, info: 'turn'});

        Doorbell.call('delivery', {info: 'cancel'});

        client.session.delivery.splice(id, 1);
    },

    turn_in_delivery: function(id)
    {
        if(!Map.check_if_landed())
        {
            return {success: false, info: 'in_space'};
        }

        var delivery = client.session.delivery[id];

        var station_id = Map.get_next_station_id();

        if(station_id == delivery.target)
        {
            client.session.money += delivery.wage;

            if(Svc.has_loan())
            {
                var amount_to_return = Svc.get_loan_return_amount(delivery.wage);

                Svc.return_loan_by_income(delivery.wage);

                Svc.draw_loan_info();

                Game.write_last_cost(lang(`delivery.items.${delivery.name}.title`), delivery.wage - amount_to_return, true);
            }
            else
            {
                Game.write_last_cost(lang(`delivery.items.${delivery.name}.title`), delivery.wage, true);
            }

            this.register_delivery_stat(delivery);

            Comm.report_delivery(delivery, {success: true, info: 'turn'});

            client.session.delivery.splice(id, 1);

            //Ph.reset_physics();

            return {success: true};
        }

        return {success: false, info: 'target'};
    },

    register_delivery_stat: function(delivery)
    {
        if(client.tmp.last_delivery_station != Map.get_next_station_id())
        {
            client.tmp.last_delivery_station = Map.get_next_station_id();

            Stats.add('deliveries_stops');
        }

        Stats.add('deliveries_income', delivery.wage - delivery.cost);
        Stats.add('deliveries_count');
    },

    generate_station_deliveries: function()
    {
        var amount = rand(1, 5);

        var deliveries = [];

        for(var i = 0; i < amount; i++)
        {
            var delivery = this.generate_delivery();

            if(delivery)
            {
                deliveries.push(delivery);
            }
        }

        return deliveries;
    },

    /*
    */
    generate_delivery: function(force)
    {
        var target_station = Map.get_random_station_id({exclude_current: true, delivery: true, upcoming: true});

        if(force && force.station)
        {
            target_station = force.station;
        }

        if(!target_station)
        {
            return false;
        }


        var distance = Map.get_distance_to_station(target_station);

        var deliveries = Game.get_config('deliveries');

        shuffle_array(deliveries);

        var delivery = false;

        $.each(deliveries, function(i, delivery_function)
        {
            var base_delivery = delivery_function(1, distance);

            if(force && force.name && base_delivery.name != force.name)
            {
                return;
            }

            var player_deliveries_weight = Delivery.get_total_delivery_weight() - Delivery.get_total_delivery_weight({next_station: true});

            var bin = Math.floor((g.cargo.size - player_deliveries_weight) / base_delivery.weight);

            var delivery_bin = (force && force.bin) ? force.bin : rand(1, bin);

            var target_delivery = delivery_function(delivery_bin, distance);

            if((target_delivery.skip || !bin) && !force)
            {
                return;
            }

            delivery = {
                name: target_delivery.name,
                cost: target_delivery.cost * target_delivery.wage,
                unique: target_delivery.unique,
                wage: target_delivery.wage,
                weight: target_delivery.weight,
                target: target_station,
            };

            return false;
        });

        return delivery;
    },

    estimate_deliveries_value: function(filter)
    {
        var deliveries = client.session.delivery;

        var value = 0;

        $.each(deliveries, function(i, delivery)
        {
            if(filter && filter.next_station && Map.get_next_station_id() != delivery.target)
            {
                return;
            }

            if(!Map.get_station_by_id(delivery.target) || Map.get_distance_to_station(delivery.target) < 0)
            {
                return;
            }

            value += delivery.wage;
        });

        return value;
    },

    estimate_average_wage: function()
    {
        if(!client.session.stats.deliveries_stops)
        {
            return 0;
        }

        return client.session.stats.deliveries_income / client.session.stats.deliveries_stops;
    },

    check_station_turnable_deliveries: function(station_id)
    {
        var count = 0;

        $.each(client.session.delivery, function()
        {
            if(this.target == station_id)
            {
                count++;
            }
        });

        return count;
    },

    get_nearest_delivery: function()
    {
        var deliveries = client.session.delivery;

        var nearest = {};
        var nearest_distance;

        $.each(deliveries, function(i, delivery)
        {
            if(Map.get_station_by_id(delivery.target))
            {
                var distance = Map.get_distance_to_station(delivery.target);

                if(distance > 0 && (distance < nearest_distance || !nearest_distance))
                {
                    nearest_distance = distance;
                    nearest = delivery;
                }
            }
        });

        return nearest;
    },

    update_deliveries_distance_labels: function()
    {
        var labels = $('.delivery-distance-left-label');

        $.each(labels, function()
        {
            var station_id = $(this).attr('data-station-id');

            if(Map.get_station_by_id(station_id))
            {
                var distance = Map.get_distance_to_station(station_id);

                $(this).text(write(distance));
            }
        });
    },

    get_delivery_station_id: function(delivery_id)
    {
        var delivery = client.session.delivery[delivery_id];

        return delivery.target;
    },

    get_delivery_station: function(delivery_id)
    {
        var target = this.get_delivery_station_id(delivery_id);

        return Map.get_station_by_id(target);
    },

    get_delivery_distance: function(delivery_id)
    {
        var station = this.get_delivery_station(delivery_id);

        if(station)
        {
            return station.distance;
        }

        return false;
    },

    get_total_delivery_weight: function(filter)
    {
        var weight = 0;

        $.each(client.session.delivery, function(i, delivery)
        {
            if(filter && filter.next_station && Map.get_next_station_id() != delivery.target)
            {
                return;
            }

            weight += delivery.weight;
        });

        return weight;
    },

    check_delivery_uniques: function()
    {
        var has_unique = false;

        $.each(client.session.ext.delivery, function(id, delivery)
        {
            if(delivery.unique)
            {
                has_unique = true;

                return false;
            }
        });

        return has_unique;
    },

    get_delivery_by_name: function(name)
    {
        var delivery_match = false;

        $.each(client.session.delivery, function(id, delivery)
        {
            if(delivery.name == name)
            {
                delivery_match = delivery;
            }
        });

        return delivery_match;
    },

    draw_tab: function()
    {
        Delivery.list_player_deliveries();
        Delivery.list_station_deliveries();

        Indicator.clear_pin_indicator('delivery');
    },
};

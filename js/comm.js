var $comms = $('#comms-table');
var $comm = $('#comms-item-table');
var $comm_info = $('.comm-info-container');

var $comm_info_name = $comm_info.find('.comm-name');
var $comm_info_desc = $comm_info.find('.comm-description');
var $comm_info_icon = $comm_info.find('.comm-icon');

var $cm_completed = $('#comms-completed-button');

var $ch_container = $('.comms-indicator-container');

var $ch_status = $('#comms-status-label');
var $ch_title = $('#comms-title-label');
var $ch_item = $('#comms-item-label');
var $ch_icon = $('#comms-title-icon');
var $ch_button = $('#comms-show-button');

$(function()
{
    var comms_table_params = {
        data: [],
        dom: '<t>',
        bPaginate: false,
        language: {
            emptyTable: lang('comms.no_groups'),
        },
        columns: [
            {
                data: 'name',
                title: lang('comms.group_name'),
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    var icon = Game.get_config('comms_icons')[rowData.name];

                    $('<i class="gi gl">').addClass(`gi-${icon}`).appendTo(td);

                    $('<span class="responsive-comms-clickable">').text(lang(`comms.groups.${rowData.name}.title`)).appendTo(td);

                    if(rowData.done)
                    {
                        $(td).addClass('text-success');
                    }

                    if(Comm.is_notify_group(rowData.name))
                    {
                        $(td).addClass('warning');
                    }

                    $(td).click(function()
                    {
                        $r_comms.addClass('responsive-comms-active');
                    });

                    $(td).hover(function()
                    {
                        Comm.draw_group_info(rowData.name);
                        Comm.list_group_items(rowData.name);

                        if(Comm.is_notify_group(rowData.name))
                        {
                            $(td).removeClass('warning');

                            setTimeout(function()
                            {
                                Comm.clear_notify(rowData.name);
                            }, 5000)
                        }
                    });
                },
            },
        ],
    };

    $comms.DataTable(comms_table_params);

    var comms_items_table_params = {
        data: [],
        dom: '<t>',
        order: [[1, 'desc']],
        bPaginate: false,
        language: {
            emptyTable: lang('comms.no_objectives'),
        },
        columns: [
            {
                data: 'name',
                title: lang('comms.item_title'),
                orderable: false,
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    var params = Comm.get_lang_params(rowData.group, rowData.name, 'title');

                    var $label = $('<span>').text(lang(`comms.groups.${rowData.group}.items.${rowData.name}.title`, params)).appendTo(td);

                    if(rowData.target && Map.get_station_by_id(rowData.target))
                    {
                        var distance_left = Map.get_distance_to_station(rowData.target);

                        var $target_div = $('<div>').addClass('pull-right').appendTo(td);

                        var $target_label = $('<span class="label">').appendTo($target_div);

                        if(distance_left >= 0)
                        {
                            $target_label.addClass('label-primary').text(Map.get_station_attr(rowData.target, 'name'));

                            $('<small class="table-separator">').text(lang('comms.in')).appendTo($target_div);

                            $('<span class="text-primary delivery-distance-left-label">')
                                .attr('data-station-id', rowData.target)
                                .text(write(distance_left)).appendTo($target_div);
                        }
                        else
                        {
                            $target_label.addClass('label-danger').text('Missed');
                        }
                    }

                    if(rowData.choose)
                    {
                        $choose = $('<span class="choose-button text-primary pull-right">').appendTo(td);

                        $('<i class="gl gr gi gi-radar-dish">').appendTo($choose)
                            .tooltip({
                                title: lang('comms.choose'),
                            });

                        $('<span>').text(lang('comms.choose')).appendTo($choose);

                        $choose.click(function()
                        {
                            Comm.activate_choose(rowData.group, rowData.name);
                        });
                    }

                    if(rowData.done)
                    {
                        $label.addClass('line-through');

                        if(rowData.failed)
                        {
                            $label.addClass('text-danger');
                        }
                        else
                        {
                            $label.addClass('text-success');
                        }
                    }

                    var info_lang = `comms.groups.${rowData.group}.items.${rowData.name}.desc`;

                    if(is_lang(info_lang) && !rowData.done)
                    {
                        var params = Comm.get_lang_params(rowData.group, rowData.name, 'info');

                        $('<small class="sm-label">').text(lang(info_lang, params)).appendTo(td);
                    }

                    if(Comm.is_notify_item(rowData.group, rowData.name))
                    {
                        $(td).addClass('warning');
                    }

                    $(td).hover(function()
                    {

                    });
                },
            },
            {
                data: 'order',
                visible: false,
            },
        ],
    };

    $comm.DataTable(comms_items_table_params);

    $('[href="#comms-tab"]').on('show.bs.tab', function()
    {
        Comm.clear_last_comm_indicators();

        Comm.list_groups();

        Comm.list_group_items_selected();

        $cm_completed.attr('data-enabled', false);
        $cm_completed.text(lang('comms.show_completed'));
    });

    $cm_completed.click(function()
    {
        if($(this).attr('data-enabled') == 'true')
        {
            Comm.list_groups();

            $(this).attr('data-enabled', false);
            $cm_completed.text(lang('comms.show_completed'));
        }
        else
        {
            Comm.list_groups_done();

            $(this).attr('data-enabled', true);
            $cm_completed.text(lang('comms.show_open'));
        }
    });

    $ch_button.click(function()
    {
        var group = $(this).attr('data-group');

        $('[href="#comms-tab"]').click();

        Comm.draw_group_info(group);
        Comm.list_group_items(group);
    });
});

var Comm = {
    comm_draw_interval: 5,

    list_groups: function()
    {
        var comms = client.session.comms.now;

        var groups = this.group_items(comms);

        var dT = $comms.DataTable();

        dT.clear();

        $.each(groups, function(group_name, items)
        {
            var storage = Comm.get_group_storage(group_name);

            if(storage.hidden) return;

            dT.rows.add([{
                name: group_name,
            }]);
        });

        dT.draw();
    },

    list_groups_done: function()
    {
        var done_groups = client.session.comms.done_groups;

        var dT = $comms.DataTable();

        dT.clear();

        $.each(done_groups, function(i, group_name)
        {
            dT.rows.add([{
                name: group_name,
                done: true,
            }]);
        });

        dT.draw();
    },

    list_group_items_selected: function()
    {
        var selected_group = $comm_info.attr('data-group');

        if(selected_group)
        {
            Comm.list_group_items(selected_group);
        }
    },

    list_group_items: function(group_name)
    {
        var open_items = this.get_open_group_items(group_name);

        var closed_items = this.get_closed_group_items(group_name);

        $comm_info.attr('data-group', group_name);

        var dT = $comm.DataTable();

        dT.clear();

        $.each(open_items, function(i, name)
        {
            var is_choose = Comm.check_item_choose(group_name, name);

            dT.rows.add([{
                name: name,
                order: `${i}`,
                group: group_name,
                index: i,
                choose: is_choose,
                target: Comm.get_item_target(group_name, name),
            }]);
        });

        $.each(closed_items, function(i, name)
        {
            var is_failed = Comm.is_closed_failed(group_name, name);

            dT.rows.add([{
                name: name,
                order: `/${i}`,
                group: group_name,
                index: i,
                done: true,
                failed: is_failed,
            }]);
        });

        dT.draw();
    },

    get_station_comms: function(station_id)
    {
        var targets = this.get_comm_targets();

        return targets[station_id];
    },

    get_comm_targets: function()
    {
        var comms = client.session.comms.now;

        var targets = {};

        $.each(comms, function(i, comm)
        {
            if(comm.target)
            {
                targets[comm.target] = comm;
            }
        });

        var deliveries = client.session.delivery;

        $.each(deliveries, function(i, delivery)
        {
            if(delivery.comm)
            {
                targets[delivery.target] = Comm.get_comm_item(delivery.comm.group, delivery.comm.name);
            }
        });

        return targets;
    },

    draw_group_info: function(group_name)
    {
        $comm_info_name.text(lang(`comms.groups.${group_name}.title`));

        $comm_info_desc.text(lang(`comms.groups.${group_name}.desc`));

        format_html($comm_info_desc);

        var icon = Game.get_config('comms_icons')[group_name];

        $comm_info_icon.removeClass()
            .addClass('item-icon')
            .addClass('gi')
            .addClass('gl')
            .addClass(`gi-${icon}`);
    },

    draw_last_comm_indicators: function(status, group_name, item)
    {
        // Do not notify about hidden comm
        if(Comm.get_group_storage(group_name).hidden) return;

        if(!Ph.is_opt('processor'))
        {
            Game.wakeup_sleep('comm');
        }

        if(status == 'open')
        {
            this.add_notify(group_name, item);
        }

        var int = setTimeout(function()
        {
            $ch_status.text(lang(`comms.indicator.${status}`));

            $ch_status.removeClass();

            $ch_container.removeClass('hidden');

            switch(status)
            {
                case 'close_group':
                    $ch_status.addClass('text-success');
                    break;
                case 'open':
                    $ch_status.addClass('text-primary');
                    break;
                case 'close':
                    $ch_status.addClass('text-success');
                    break;
                case 'close_fail':
                    $ch_status.addClass('text-danger');
                    break;
            }

            $ch_button.attr('data-group', group_name);

            $ch_title.text(lang(`comms.groups.${group_name}.title`));

            var icon = Game.get_config('comms_icons')[group_name];

            $ch_icon.removeClass()
                .addClass('gi')
                .addClass('gl')
                .addClass(`gi-${icon}`)

            if(item)
            {
                $ch_item.text(lang(`comms.groups.${group_name}.items.${item}.title`));
            }
            else
            {
                $ch_item.text('');
            }

            if($('#comms-tab').hasClass('active'))
            {
                Comm.list_groups();

                Comm.list_group_items_selected();
            }

            client.tmp.comm_buffer -= Comm.comm_draw_interval;
        }, Math.max(client.tmp.comm_buffer, 1) * 1000);

        client.tmp.comm_intervals.push(int);

        client.tmp.comm_buffer += this.comm_draw_interval;

        /* Additional */
        Indicator.show_pin_indicator('comms');
    },

    clear_last_comm_indicators: function()
    {
        $ch_status.text(lang(`comms.indicator.no_new`)).removeClass();

        $ch_container.addClass('hidden');

        client.tmp.comm_buffer = 0;

        $.each(client.tmp.comm_intervals, function()
        {
            clearTimeout(this);
        });

        client.tmp.comm_intervals = [];

        Indicator.clear_pin_indicator('comms');
    },

    activate_choose: function(group, name)
    {
        var comm = this.get_comm_item(group, name);

        var args = this.get_comms_args(group, name);

        var choose = comm.choose(args);

        $.each(choose.items, function(choise_name, choise)
        {
            if(!choise)
            {
                delete choose.items[choise_name];

                return;
            }

            if(!choise.text)
            {
                choise.text = lang(`comms.groups.${group}.items.${name}.choises.${choise_name}`, choise.params);
            }
        });

        var args = this.get_comms_args(group, name);

        if(choose.params && choose.params.body)
        {
            var body_params = choose.params.body;
        }
        else
        {
            var body_params = {};
        }

        show_choose_safe({
            title: is_lang(`comms.groups.${group}.items.${name}.choose_title`) ? lang(`comms.groups.${group}.items.${name}.choose_title`) : lang(`comms.groups.${group}.title`),
            body: lang(`comms.groups.${group}.items.${name}.choose_desc`, body_params),
            items: choose.items,
            callback: function(choise)
            {
                comm.progress(args, {choose: choise});

                setTimeout(function()
                {
                    Comm.list_group_items_selected();
                    Comm.list_groups();
                }, 100);
            },
        });
    },

    activate_info: function(args, info, params, preview)
    {
        Game.wakeup_sleep();

        setTimeout(function()
        {
            show_choose_safe({
                title: lang(`comms.groups.${args.group}.title`),
                body: lang(`comms.groups.${args.group}.items.${args.name}.infos.${info}`, params || {}),
                items: {},
                preview: preview,
            });
        }, 100);
    },

    get_open_group_items: function(group_name)
    {
        var now = client.session.comms.now;

        var groups = this.group_items(now);

        var items = groups[group_name];

        if(!items)
        {
            return [];
        }

        return items;
    },

    get_closed_group_items: function(group_name)
    {
        var done = client.session.comms.done;

        var groups = this.group_items(done);

        var items = groups[group_name];

        if(!items)
        {
            return [];
        }

        return items;
    },

    get_open_item: function(group, name)
    {
        var now = client.session.comms.now;

        var match = {};

        $.each(now, function(i, item)
        {
            if(item.group == group && item.name == name)
            {
                match = item;
            }
        });

        return match;
    },

    group_items: function(items)
    {
        var groups = {};

        $.each(items, function(i, item)
        {
            if(!groups[item.group])
            {
                groups[item.group] = [];
            }

            groups[item.group].push(item.name);
        });

        return groups;
    },

    check_item_choose: function(group_name, name)
    {
        var comm = this.get_comm_item(group_name, name);

        if(comm.choose)
        {
            return true;
        }

        return false;
    },

    get_item_target: function(group_name, name)
    {
        var item = this.get_open_item(group_name, name);

        if(item.target)
        {
            return item.target;
        }

        var delivery_target = false

        $.each(client.session.delivery, function(i, delivery)
        {
            if(delivery.comm && delivery.comm.group == group_name && delivery.comm.name == name)
            {
                delivery_target = delivery.target;
            }
        });

        return delivery_target;
    },

    get_comm_item: function(group, name)
    {
        var comms = Game.get_config('comms');

        return comms[group][name];
    },

    get_comm_group: function(group)
    {
        var comms = Game.get_config('comms');

        return comms[group];
    },

    execute: function()
    {
        /* Checks if new tasks might be opened */
        this.run_triggers();

        /* Progress active tasks (groups globs) */
        this.run_group_progresses();

        /* Progress active tasks */
        this.run_progresses();

    },

    run_triggers: function()
    {
        var comms = Game.get_config('comms');

        $.each(comms, function(group_name, group)
        {
            if(Comm.is_closed_group(group_name) || Comm.is_open_group(group_name))
            {
                return;
            }

            if(!group.trigger)
            {
                return;
            }

            var args = Comm.get_comms_args(group_name);

            group.trigger(args);
        });
    },

    list_open: function(i, comm)
    {
        var open = [];

        $.each(client.session.comms.now, function(i, comm)
        {
            open.push({group: comm.group, name: comm.name});
        });

        return open;
    },

    run_progresses: function()
    {
        var now = this.list_open();

        $.each(now, function(i, comm)
        {
            if(comm)
            {
                var item = Comm.get_comm_item(comm.group, comm.name);

                var args = Comm.get_comms_args(comm.group, comm.name);

                if(item.progress)
                {
                    item.progress(args, {});
                }
            }
        });
    },

    run_group_progresses: function()
    {
        var groups = this.get_open_groups();

        $.each(groups, function(i, group_name)
        {
            var group = Comm.get_comm_group(group_name);

            var args = Comm.get_comms_args(group_name);

            if(group.progress)
            {
                group.progress(args, {});
            }
        });
    },

    get_open_groups: function()
    {
        var now = this.list_open();

        var groups = [];

        $.each(now, function(i, comm)
        {
            if(groups.indexOf(comm.group) == -1)
            {
                groups.push(comm.group);
            }
        });

        return groups;
    },

    run_on_land: function()
    {
        var now = this.list_open();

        var target_id = Map.get_next_station_id();

        $.each(now, function(i, comm)
        {
            if(comm)
            {
                var item = Comm.get_comm_item(comm.group, comm.name);

                var args = Comm.get_comms_args(comm.group, comm.name);

                if(item.progress)
                {
                    item.progress(args, {station: target_id});
                }
            }
        });
    },

    mark_as_active: function(group, name)
    {
        var now = client.session.comms.now;

        var comm = this.get_comm_item(group, name);

        var item = {group: group, name: name};

        now.push(item);

        var args = this.get_comms_args(group, name);

        if(comm.start)
        {
            comm.start(args);
        }

        this.draw_last_comm_indicators('open', group, name);
    },

    mark_as_closed: function(group, name, failed)
    {
        var done = client.session.comms.done;
        var now = client.session.comms.now;

        var comm = this.get_comm_item(group, name);

        var args = this.get_comms_args(group, name);

        if(comm.complete)
        {
            comm.complete(args);
        }

        this.remove_open_item(group, name);

        done.push({group: group, name: name, failed: failed});

        if(failed)
        {
            this.draw_last_comm_indicators('close_fail', group, name);
        }
        else
        {
            this.draw_last_comm_indicators('close', group, name);
        }
    },

    remove_open_item: function(group, name)
    {
        var now = client.session.comms.now;

        $.each(now, function(i, item)
        {
            if(item.group == group && item.name == name)
            {
                now.splice(i, 1);

                return false;
            }
        });
    },

    remove_closed_item: function(group, name)
    {
        var done = client.session.comms.done;

        $.each(done, function(i, item)
        {
            if(item.group == group && item.name == name)
            {
                done.splice(i, 1);

                return false;
            }
        });
    },

    mark_as_replaced: function(group, name)
    {
        if(this.is_open(group, name))
        {
            this.mark_as_closed(group, name);
        }

        this.mark_as_active(group, name);

        this.remove_closed_item(group, name);
    },

    remove_open_items_group: function(group)
    {
        var now = client.session.comms.now;

        client.session.comms.now = $.grep(now, function(item)
        {
            if(item.group != group)
            {
                return true;
            }
        });
    },

    mark_as_closed_group: function(group)
    {
        var done_groups = client.session.comms.done_groups;

        this.remove_open_items_group(group);

        done_groups.push(group);

        delete client.session.comms.storage[group];

        this.draw_last_comm_indicators('close_group', group);
    },

    is_closed: function(group, name)
    {
        var done = client.session.comms.done;

        var is_closed = false;

        $.each(done, function(i, item)
        {
            if(item.group == group && item.name == name)
            {
                is_closed = true;

                return false;
            }
        });

        return is_closed;
    },

    is_closed_failed: function(group, name)
    {
        var done = client.session.comms.done;

        var is_failed = false;

        $.each(done, function(i, item)
        {
            if(item.group == group && item.name == name && item.failed)
            {
                is_failed = true;

                return false;
            }
        });

        return is_failed;
    },

    is_closed_successful: function(group, name)
    {
        return Comm.is_closed(group, name) && !Comm.is_closed_failed(group, name);
    },

    is_closed_group: function(group)
    {
        var done_groups = client.session.comms.done_groups;

        var is_closed = false;

        $.each(done_groups, function()
        {
            if(this == group)
            {
                is_closed = true;

                return false;
            }
        });

        return is_closed;
    },

    is_open: function(group, name)
    {
        var now = client.session.comms.now;

        var is_open = false;

        $.each(now, function(i, item)
        {
            if(item.group == group && item.name == name)
            {
                is_open = true;
            }
        });

        return is_open;
    },

    is_open_group: function(group)
    {
        var now = client.session.comms.now;

        var is_open = false;

        $.each(now, function(i, item)
        {
            if(item.group == group)
            {
                is_open = true;

                return false;
            }
        });

        return is_open;
    },

    get_comms_args: function(group, name)
    {
        var args = {group: group, name: name};

        if(group)
        {
            args.storage = this.get_group_storage(group);
        }

        if(name)
        {
            args.item = this.get_open_item(group, name);
        }

        args.global = this.get_group_storage('global');

        return args;
    },

    get_group_storage: function(group)
    {
        if(!client.session.comms.storage[group])
        {
            client.session.comms.storage[group] = {};
        }

        return client.session.comms.storage[group];
    },

    report_delivery: function(delivery, params)
    {
        if(delivery.comm && this.get_group_storage(delivery.comm.group))
        {
            var comm = Comm.get_comm_item(delivery.comm.group, delivery.comm.name);

            var args = this.get_comms_args(delivery.comm.group, delivery.comm.name);

            comm.progress(args, {delivery: {success: params.success, info: params.info}});
        }
    },

    get_lang_params: function(group, name, type)
    {
        var comm = this.get_comm_item(group, name);

        var args = this.get_comms_args(group, name);

        if(comm.params)
        {
            var params = comm.params(args, {type: type});

            return params;
        }

        return {};
    },

    do_once: function(args, name, use_storage)
    {
        var container = use_storage ? args.storage : args.item;

        if(!container.once)
        {
            container.once = {};
        }

        if(container.once[name])
        {
            return false;
        }
        else
        {
            container.once[name] = true;

            return true;
        }
    },

    do_after: function(args, name, seconds)
    {
        var container = args.item;
        var now = client.session.stats.time_in_game;

        if(!container.after)
        {
            container.after = {};
        }

        if(!container.after[name])
        {
            container.after[name] = now;
        }

        if(container.after[name] == Infinity)
        {
            return false;
        }

        if(now - container.after[name] > seconds)
        {
            container.after[name] = Infinity;

            return true;
        }
        else
        {
            return false;
        }
    },

    add_notify: function(group, name)
    {
        if(!this.is_notify_item(group, name))
        {
            client.session.comms.notify.push({name: name, group: group});
        }
    },

    clear_notify: function(group)
    {
        var notify = client.session.comms.notify;

        client.session.comms.notify = $.grep(notify, function(comm)
        {
            if(comm.group != group)
            {
                return true;
            }
        });
    },

    is_notify_group: function(group)
    {
        var notify = client.session.comms.notify;

        var is_notify = false;

        $.each(notify, function(i, comm)
        {
            if(comm.group == group)
            {
                is_notify = true;

                return false;
            }
        });

        return is_notify;
    },

    is_notify_item: function(group, name)
    {
        var notify = client.session.comms.notify;

        var is_notify = false;

        $.each(notify, function(i, comm)
        {
            if(comm.group == group && comm.name == name)
            {
                is_notify = true;

                return false;
            }
        });

        return is_notify;
    },

    call_group_method: function(args, method, params)
    {
        var group = this.get_comm_group(args.group);

        var args = this.get_comms_args(args.group, args.name);

        return group.method[method](args, params);
    },

    group_distance_start: function(args, distance)
    {
        if(!args.global.distance)
        {
            args.global.distance = {};
        }

        if(!args.global.distance[args.group])
        {
            args.global.distance[args.group] = distance;
        }

        if(client.session.distance >= args.global.distance[args.group])
        {
            return true;
        }

        return false;
    },
};

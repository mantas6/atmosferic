var $categories = $('#categories-table');
var $shop = $('#shop-table');
var $info = $('#item-info-container');

var $info_name = $info.find('.item-name');
var $info_desc = $info.find('.item-description');
var $info_cat_desc = $info.find('.category-description');
var $info_icon = $info.find('.item-icon');
var $info_cat_info = $info.find('.cat-info');
var $info_unique = $info.find('.item-unique');

var $s_show_all = $('#shop-show-all-button');
var $s_show_unique = $('#shop-show-unique-button');
var $shop_categories = $('#shop-categories-list');
var $ship_categories = $('#ship-categories-list');

var $s_buy_btn = $('.item-buy-buttom');

var $inv_repair_all = $('#inventory-repair-all-button');

$(function()
{
    var categories_table_params = {
        data: [],
        dom: '<t>',
        bPaginate: false,
        order: [[0, 'asc']],
        columns: [
            {
                data: 'name',
                title: lang('inventory.category'),
                orderable: false,
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    $icon = $('<i class="gi gl list-row-icon">');
                    $icon.addClass('gi-' + Game.get_config('categories_icons')[rowData.name]);
                    $(td).append($icon);

                    var $label = $('<span class="responsive-comms-clickable">').text(lang('inventory.types.' + rowData.name))
                    $(td).append($label);


                    var $info_icon = $('<i class="gi gi-info table-separator text-primary">').appendTo(td);

                    $info_icon.popover({
                        content: lang(`inventory.types_desc.${rowData.name}`),
                        container: 'body',
                        placement: 'auto',
                        trigger: 'hover',
                    });

                    if(Ph.is_opt(rowData.name))
                    {
                        var $remove_button = $('<i class="gi gi-plug choose-button-alt text-danger">').appendTo(td);


                        if(Map.get_next_station_id() && Map.check_if_landed() && Inv.is_shop_available())
                        {
                            var opt_value = Inv.get_sell_value(rowData.name);

                            $remove_button.tooltip({
                                title: `${lang('inventory.opt.sell')} ${write(opt_value)} <i class="gr gi gi-money-stack"></i></span>`,
                                html: true,
                                placement: 'top',
                            });

                            $remove_button.click(function()
                            {
                                show_dialog(lang('inventory.opt.remove_title'), lang('inventory.opt.remove_sell_info', {value: write(opt_value)}), function()
                                {
                                    Inv.remove_opt_item(rowData.name);
                                });
                            });
                        }
                        else
                        {
                            $remove_button.tooltip({
                                title: `${lang('inventory.opt.remove')}`,
                                placement: 'top',
                            });

                            $remove_button.click(function()
                            {
                                show_dialog(lang('inventory.opt.remove_title'), lang('inventory.opt.remove_discard_info'), function()
                                {
                                    Inv.remove_opt_item(rowData.name);
                                });
                            });
                        }
                    }

                    if(Map.get_next_station_id() && Map.check_if_landed() && Inv.is_repair_available() && Inv.get_repair_cost(rowData.name) > 0 && Inv.check_repairable_start(rowData.name))
                    {
                        var $repair_button = $('<i class="gr gi gi-tinker choose-button-alt text-success">').appendTo(td);

                        var repair_cost = Inv.get_repair_cost(rowData.name);

                        if(Inv.check_repairable(rowData.name))
                        {
                            $repair_button.tooltip({
                                title: `${lang('inventory.repair.repair')} ${write(repair_cost)} <i class="gr gi gi-money-stack"></i></span>`,
                                html: true,
                                placement: 'top',
                            });

                            $repair_button.click(function()
                            {
                                show_dialog(lang('inventory.repair.repair_title'), lang('inventory.repair.repair_info', {cost: write(repair_cost)}), function()
                                {
                                    var result = Inv.repair_item(rowData.name);

                                    if(result['success'])
                                    {
                                        setTimeout(function()
                                        {
                                            Inv.list_categories();
                                            Inv.draw_repair_all();
                                        }, 100);

                                        show_popup($(td), lang('inventory.repair.repaired'), 'tooltip-success');
                                    }
                                    else
                                    {
                                        show_popup($(td), lang('inventory.repair.repair_action_info.' + result['info']), 'tooltip-danger');
                                    }
                                });
                            });
                        }
                        else
                        {
                            $repair_button.removeClass('text-success').addClass('text-danger');

                            $repair_button.tooltip({
                                title: lang('inventory.repair.min_repair'),
                                placement: 'top',
                            });
                        }
                    }

                    if(Ph.has_health(rowData.name))
                    {
                        var $health_indicator = $('<span class="label pull-right category-health-indicator">')
                            .attr('data-variable', rowData.name);

                        Inv.draw_health_indicator($health_indicator, rowData.name);

                        $(td).append($health_indicator);
                    }

                    $warning_icon = Inv.draw_warning_icon(rowData.name, td);

                    $label.click(function()
                    {
                        $r_inv.addClass('responsive-inventory-item-active');

                        $s_buy_btn.addClass('hidden');
                    });

                    $(td).hover(function()
                    {
                        Inv.draw_info_inventory(rowData.name);

                        if(Map.check_if_landed())
                        {
                            Inv.list_shop(rowData.name);
                        }
                        else
                        {
                            $shop.DataTable().clear().draw();
                        }
                    });
                },
            },
        ],
    };

    $categories.DataTable(categories_table_params);

    var shop_table_params = {
        data: [],
        dom: '<tp>',
        order: [[0, 'asc']],
        deferRender: true,
        language: {
            emptyTable: lang('inventory.no_shop_items'),
        },
        columns: [
            {
                data: 'bin',
                visible: false,
            },
            {
                data: 'name',
                title: lang('inventory.name'),
                orderable: false,
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    var $icon = $('<i class="gi gl list-row-icon">');
                    $icon.addClass('gi-' + Game.get_config('categories_icons')[rowData.data.cat_name]);
                    $(td).append($icon);

                    var $label = $('<span class="responsive-comms-clickable">').text(lang('inventory.items.' + rowData.name + '.title'))
                    $(td).append($label);

                    if(rowData.data.unique)
                    {
                        var $unique_label = $('<i class="gi gr gi-round-star text-warning">').appendTo(td);

                        $unique_label.tooltip({
                            title: lang(`inventory.unique.info`),
                            placement: 'top',
                            container: 'body',
                        });

                        $label.addClass('text-warning');
                        $icon.addClass('text-warning');
                    }

                    if(rowData.data.opt)
                    {
                        var $opt_label = $('<i class="gi gr gi-plug text-warning">').appendTo(td);

                        $opt_label.tooltip({
                            title: lang(`inventory.opt.info`),
                            placement: 'top',
                        });
                    }

                    if(Inv.check_recommended_part(rowData.data))
                    {
                        var $opt_label = $('<i class="gi gr gi-thumb-up text-success">').appendTo(td);

                        $opt_label.tooltip({
                            title: lang(`inventory.recommended.info`),
                            placement: 'top',
                            container: 'body',
                        });
                    }

                    $label.click(function()
                    {
                        $r_inv.removeClass('responsive-inventory-shop-active').addClass('responsive-inventory-item-active');

                        $s_buy_btn.removeClass('hidden');
                    });

                    var sell_value = Inv.get_sell_value(rowData.data.cat_name);
                    var item_cost = rowData.cost * Inv.get_shop_param('buy_price');
                    var cost = item_cost - sell_value;

                    $(td).hover(function()
                    {
                        Inv.draw_info_shop(rowData.data.cat_name, rowData.data.id);

                        $s_buy_btn.find('.price').text(write(cost));

                        $s_buy_btn.unbind('click').click(function()
                        {
                            $(td).closest('tr').find('.choose-button').click();
                        });
                    });
                },
            },
            {
                data: 'cost',
                title: lang('inventory.buy'),
                orderable: false,
                createdCell: function(td, cellData, rowData, row, col)
                {
                    var sell_value = Inv.get_sell_value(rowData.data.cat_name);
                    var item_cost = rowData.cost * Inv.get_shop_param('buy_price');
                    var cost = item_cost - sell_value;

                    $(td).empty();

                    var $buy = $(`<span class="choose-button"><span>${cost >= 0 ? write(cost) : '+ ' + write(Math.abs(cost))}</span><i class="gr gi gi-money-stack"></i></span>`).appendTo(td);

                    if(client.session.money < cost)
                    {
                        $buy.addClass('text-muted');
                    }
                    else
                    {
                        $buy.addClass('text-primary');
                    }

                    $buy.tooltip({
                        title: `<span>${lang('inventory.full_cost')}: ${write(item_cost)} <i class="gr gi gi-money-stack"></i></span>`,
                        html: true,
                        placement: 'top',
                    });

                    $(td).hover(function()
                    {
                        Inv.draw_info_shop(rowData.data.cat_name, rowData.data.id);
                    });

                    $buy.click(function()
                    {
                        show_dialog(lang(cost ? 'inventory.buy_dialog.title' : 'inventory.take_dialog.title'), lang(cost ? 'inventory.buy_dialog.info' : 'inventory.take_dialog.info', {cost: write(cost), name: lang('inventory.items.' + rowData.name + '.title')}), function()
                        {
                            var result = Inv.buy_item(rowData.data.cat_name, rowData.data.id);

                            if(result['success'])
                            {
                                Inv.list_categories();
                                Inv.draw_ship_categories();
                                Inv.draw_repair_all();

                                show_popup($(td), lang('inventory.bought'), 'tooltip-success');
                            }
                            else
                            {
                                show_popup($(td), lang('inventory.buy_info.' + result['info']), 'tooltip-danger');
                            }
                        });
                    });
                },
            },
        ],
    };

    $shop.DataTable(shop_table_params);

    $info_unique.tooltip({
        title: lang(`inventory.unique.info`),
        placement: 'top',
        container: 'body',
    });

    $('[href="#inventory-tab"]').on('show.bs.tab', function()
    {
        Inv.draw_tab();
    });

    $inv_repair_all.click(function()
    {
        var $button = $(this);

        var cost = Inv.get_repair_all_cost();

        show_dialog(lang('inventory.repair.repair_all.title'), lang('inventory.repair.repair_all.info', {cost: write(cost)}), function()
        {
            var result = Inv.repair_all_items();

            if(result['success'])
            {
                Inv.list_categories();
                Inv.draw_repair_all();

                show_popup($button, lang('inventory.repair.repaired'), 'tooltip-success');
            }
            else
            {
                show_popup($button, lang('inventory.repair.repair_action_info.' + result['info']), 'tooltip-danger');
            }
        });
    });

    $s_show_all.click(function()
    {
        if(Map.check_if_landed())
        {
            Inv.list_shop_all();
        }
        else
        {
            $shop.DataTable().clear().draw();
        }
    });

    $s_show_unique.click(function()
    {
        if(Map.check_if_landed())
        {
            Inv.list_shop_unique();
        }
        else
        {
            $shop.DataTable().clear().draw();
        }
    });

    $shop_categories.on('click', '.shop-category-show', function()
    {
        var cat_name = $(this).attr('data-cat');

        Inv.list_shop(cat_name);
    });

    $ship_categories.on('click', '.ship-category-show', function()
    {
        var cat_group = $(this).attr('data-cat');

        Inv.list_categories_group(cat_group);

        $categories.attr('data-cat', cat_group);
    });
});

var Inv = {
    condition_critical: 0.2,
    condition_service: 0.5,

    list_categories: function(reset)
    {
        var cat_group = $categories.attr('data-cat');

        if(reset)
        {
            $categories.removeAttr('data-cat');
        }

        if(cat_group && !reset)
        {
            this.list_categories_group(cat_group);
        }
        else
        {
            this.list_categories_all();
        }
    },

    list_categories_all: function()
    {
        var items = client.session.variables;

        var dT = $categories.DataTable();

        dT.clear();

        $.each(items, function(name, item)
        {
            if(Object.keys(item).length)
            {
                dT.rows.add([{
                    name: name,
                    data: item,
                }]);
            }
        });

        dT.draw();
    },

    list_categories_group: function(cat_group)
    {
        var cat_names = this.get_cat_groups()[cat_group];

        var dT = $categories.DataTable();

        dT.clear();

        $.each(cat_names, function(i, name)
        {
            var item = client.session.variables[name];

            if(Object.keys(item).length)
            {
                dT.rows.add([{
                    name: name,
                    data: item,
                }]);
            }
        });

        dT.draw();
    },

    list_shop: function(cat_name, append)
    {
        var items = client.session.ext.shop[cat_name];

        this.list_shop_items(append, function()
        {
            $.each(items, function(id, item)
            {
                Inv.list_shop_item(id, cat_name, item);
            });
        });
    },

    list_shop_items: function(append, callback)
    {
        var dT = $shop.DataTable();

        if(!append)
        {
            dT.clear();
        }

        callback();

        dT.draw();
    },

    list_shop_item: function(id, cat_name, item)
    {
        var dT = $shop.DataTable();

        dT.rows.add([{
            name: item.name,
            cost: item.cost,
            bin: item.bin,
            data: $.extend({}, item, {id: id, cat_name: cat_name}),
        }]);
    },

    list_shop_all: function()
    {
        var categories = Game.get_config('categories_types');

        $shop.DataTable().clear();

        $.each(categories, function(i, cat_name)
        {
            Inv.list_shop(cat_name, true);
        });
    },

    list_shop_unique: function()
    {
        var uniques = this.get_shop_unique_items();

        this.list_shop_items(false, function()
        {
            $.each(uniques, function(cat_name, cat_items)
            {
                $.each(cat_items, function(id, item)
                {
                    Inv.list_shop_item(id, cat_name, item);
                });
            });
        });
    },

    buy_item: function(cat_name, id)
    {
        if(!Map.check_if_landed())
        {
            return {success: false, info: 'in_space'};
        }

        var item = clone(client.session.ext.shop[cat_name][id]);

        if(JSON.stringify(client.session.variables[cat_name]) == JSON.stringify(item))
        {
            return {success: false, info: 'match'};
        }

        var sell_value = this.get_sell_value(cat_name);
        var cost = item.cost * this.get_shop_param('buy_price') - sell_value;

        if(client.session.money >= cost)
        {
            /* Transfering fluid */
            if(item.fluid != undefined && client.session.variables[cat_name].fluid != undefined)
            {
                item.fluid = Math.min(client.session.variables[cat_name].fluid, item.size);
            }

            /* Checking cargo size */
            if(cat_name == 'cargo' && client.session.delivery.length > item.size)
            {
                return {success: false, info: 'cargo_size'};
            }

            client.session.money -= cost;

            client.session.variables[cat_name] = item;

            if(cost > 0)
            {
                Game.write_last_cost(lang(`inventory.items.${item.name}.title`), cost, false);
            }
            else
            {
                Game.write_last_cost(lang(`inventory.items.${item.name}.title`), Math.abs(cost), true);
            }

            Ph.handle_reset_physics(cat_name);
            Indicator.init_gauges();

            return {success: true};
        }

        return {success: false, info: 'cost'};
    },

    draw_info_inventory: function(cat_name)
    {
        var items = client.session.variables[cat_name];

        this.draw_info_head(items, cat_name, cat_name);

        this.draw_info_blocks(items, cat_name);
    },

    draw_info_shop: function(cat_name, id)
    {
        var items = client.session.ext.shop[cat_name][id];

        this.draw_info_head(items, cat_name);

        this.draw_info_blocks(items, cat_name, true);
    },

    draw_info_head: function(items, cat_name)
    {
        $info_name.text(lang(`inventory.items.${items.name}.title`));
        $info_desc.text(lang(`inventory.items.${items.name}.desc`));

        $info_cat_desc.text(lang(`inventory.types_desc.${cat_name}`));

        $info_cat_info
            .removeClass('hidden')
            .popover('destroy')
            .popover({
                content: lang(`inventory.types_desc.${cat_name}`),
                container: 'body',
                placement: 'auto',
                trigger: 'hover',
            });

        $info_icon.removeClass()
            .addClass('item-icon')
            .addClass('gi')
            .addClass('gl')
            .addClass('gi-' + Game.get_config('categories_icons')[cat_name]);

        if(items.unique)
        {
            $info_unique.removeClass('hidden');
        }
        else
        {
            $info_unique.addClass('hidden');
        }
    },

    draw_info_blocks: function(items, cat_name, compare)
    {
        $info.find('.item-info-block').not('.template').remove();

        $template = $info.find('.item-info-block.template');

        $.each(items, function(i, value)
        {
            if(i == 'name' || i == 'bin' || i == 'h' || i == 'unique' || i == 'storage' || i == 'h_age')
            {
                return;
            }

            var $cloned = $template.clone().appendTo($info);

            $cloned.find('.icon').addClass('gi-' + Game.get_config('properties_icons')[i]);

            if(is_lang(`inventory.properties.${i}.${cat_name}.title`))
            {
                $cloned.find('.title').text(lang(`inventory.properties.${i}.${cat_name}.title`));
            }
            else
            {
                $cloned.find('.title').text(lang(`inventory.properties.${i}.title`));
            }

            if(is_lang(`inventory.properties.${i}.${cat_name}.desc`))
            {
                $cloned.find('.description').text(lang(`inventory.properties.${i}.${cat_name}.desc`));
            }
            else
            {
                $cloned.find('.description').text(lang(`inventory.properties.${i}.desc`));
            }

            if(i == 'max_airflow' || i == 'max_fuelflow' || i == 'max_cooling' || i == 'max_thrust' || i == 'max_boosted_airflow')
            {
                $cloned.find('.title').addClass('bold').addClass('text-success');
            }

            if(i == 'eff')
            {
                $cloned.find('.value').text(Math.round(value * 100) + '%');
            }
            else if(i == 'h_max')
            {
                var h_rating = Inv.get_health_rating(items);

                $cloned.find('.value').text(`${write(value)} (${h_rating}%)`);
            }
            else
            {
                $cloned.find('.value').text(write(value));
            }

            if(i == 'opt')
            {
                $cloned.find('.value').text('');
            }

            if(compare)
            {
                var $rel_value = $cloned.find('.value-rel');

                var diff = value - client.session.variables[cat_name][i];

                if(diff != 0 && diff)
                {
                    if(diff > 0)
                    {
                        $rel_value.addClass('text-success');
                    }
                    else
                    {
                        $rel_value.addClass('text-danger');
                    }

                    if(i == 'eff')
                    {
                        $rel_value.text((diff > 0 ? '+' : '') + Math.round(diff * 100) + '%')
                    }
                    else
                    {
                        $rel_value.text((diff > 0 ? '+' : '') + write(diff))
                    }
                }
            }

            $cloned.removeClass('hidden').removeClass('template');
        });
    },

    generate_station_shop: function(override_shop)
    {
        var player_value = client.session.money + Delivery.estimate_deliveries_value({next_station: true});

        var shop = this.generate_variables(player_value);

        shop.params = {
            buy_price: 1,
            sell_price: 1,
        };

        if(override_shop)
        {
            $.extend(true, shop, override_shop);
        }

        return shop;
    },

    get_rand_categories_list: function()
    {
        var categories = Game.get_config('categories_types');

        shuffle_array(categories);

        var sliced_categories = categories.slice();

        return sliced_categories;
    },

    get_rand_categories_list_with_amounts: function()
    {
        var categories = this.get_rand_categories_list();

        var with_amounts = {};

        $.each(categories, function(i, cat_name)
        {
            with_amounts[cat_name] = rand(50, 150);
        });

        if(with_amounts.blades)
        {
            with_amounts.starter = Math.max(with_amounts.starter, with_amounts.blades);
        }

        return with_amounts;
    },

    generate_variables: function(max_price)
    {
        var categories = this.get_rand_categories_list_with_amounts();

        var shop = {};

        $.each(categories, function(cat_name, cat_amount)
        {
            if(!shop[cat_name])
            {
                shop[cat_name] = [];
            }

            if(!client.config.categories_raw(cat_name))
            {
                return;
            }

            // Minimum bin
            var bin_min = Inv.get_recommended_bin(cat_name);

            if(!bin_min)
            {
                bin_min = 1;
            }

            var player_bin = g[cat_name].bin;

            // If player has the part use it's bin + 1 if not use minimum recommended
            if(!player_bin)
                player_bin = bin_min;

            // Gettings names for generated variables
            var names = {};

            for(var a = 1; a <= cat_amount; a++)
            {
                var name = Inv.generate_variable_name(cat_name, player_bin);

                if(!names[name])
                    names[name] = 1;
                else
                    names[name]++;
            }

            // Iterating though names
            $.each(names, function(name, amount)
            {
                var generated_bins = [];

                for(var a = 1; a <= amount; a++)
                {
                    // Calculating bin by percentage
                    var prec_bin = 1 + 0.05 * a;

                    var bin = Math.round(player_bin * prec_bin);

                    bin = Math.max(bin, a);

                    var item = Inv.generate_variable_by_name(cat_name, name, bin);

                    if(!item.skip)
                    {
                        delete item.skip;

                        // If bin with same part is already generated
                        if(generated_bins.indexOf(bin) != -1)
                        {
                            amount++;
                        }
                        else if(item)
                        {
                            generated_bins.push(bin);

                            shop[cat_name].push(item);
                        }
                    }
                }
            });
        });

        return shop;
    },

    generate_variable_name: function(cat_name, min_bin)
    {
        var items = client.config.categories_raw(cat_name);

        shuffle_array(items);

        var generated_name = false;

        $.each(items, function(i, item)
        {
            generated = item(min_bin);

            if(!generated || generated.skip)
            {
                generated_name = false;

                return;
            }

            generated_name = generated.name;

            return false;
        });

        return generated_name;
    },

    generate_variable_by_name: function(cat_name, name, bin)
    {
        var items = client.config.categories_raw(cat_name);

        var generated = false;

        $.each(items, function(i, item)
        {
            generated = item(bin);

            if(generated.name == name)
            {
                //delete generated['skip'];

                if(generated.h_max)
                {
                    generated.h = generated.h_max;
                    generated.h_age = generated.h_max;
                }

                generated.bin = bin;
                generated.storage = {};

                return false;
            }
            else
            {
                generated = false;
            }
        });

        return generated;
    },

    /* Search all items to get category by name */
    search_cat_by_name: function(search_name)
    {
        var types = Game.get_config('categories_types');

        var cat_found = false;

        $.each(types, function(i, cat_name)
        {
            var items = client.config.categories_raw(cat_name);

            $.each(items, function(i, item)
            {
                var generated = item(1);

                if(generated.name == search_name)
                {
                    cat_found = cat_name;

                    return false;
                }
            });
        });

        return cat_found;
    },

    generate_station_repairs: function(override)
    {
        var repair = {
            cost_per_value: 0.5,
            min_repair: this.condition_critical,
            min_start_repair: 0.99,
        };

        if(override)
        {
            $.extend(true, repair, override);
        }

        return repair;
    },

    get_repair: function()
    {
        return client.session.ext.repair;
    },

    check_repairable_start: function(cat_name)
    {
        var repair = this.get_repair();

        var item = g[cat_name];

        if(item.h / item.h_max > repair.min_start_repair)
        {
            return false;
        }

        return true;
    },

    check_repairable_min: function(cat_name)
    {
        var repair = this.get_repair();

        var item = g[cat_name];

        if((item.h / item.h_max + item.h_age / item.h_max) / 2 < repair.min_repair)
        {
            return false;
        }

        return true;
    },

    check_repairable: function(cat_name)
    {
        if(!this.check_repairable_min(cat_name) || !this.check_repairable_start(cat_name) || !Ph.has_health(cat_name))
        {
            return false;
        }

        return true;
    },

    get_repair_cost: function(cat_name)
    {
        var repair = this.get_repair();

        var item = g[cat_name];

        var repair_h = Math.max(item.h_max - item.h, 0);

        var cost = repair_h / item.h_max * (item.cost * repair.cost_per_value);

        return cost;
    },

    get_repair_all_cost: function()
    {
        if(!Inv.is_repair_available() || !Map.check_if_landed())
        {
            return 0;
        }

        var cost = 0;

        $.each(client.session.variables, function(cat_name, item)
        {
            if(Object.keys(item).length && Inv.check_repairable(cat_name))
            {
                cost += Inv.get_repair_cost(cat_name);
            }
        });

        return cost;
    },

    repair_all_items: function()
    {
        var cost = this.get_repair_all_cost();

        if(client.session.money < cost)
        {
            return {success: false, info: 'cost'};
        }

        $.each(client.session.variables, function(cat_name, item)
        {
            if(Object.keys(item).length && Inv.check_repairable(cat_name))
            {
                Inv.repair_item(cat_name);
            }
        });

        return {success: true, info: ''};
    },

    repair_item: function(cat_name)
    {
        if(!Map.check_if_landed())
        {
            return {success: false, info: 'in_space'};
        }

        var repair = this.get_repair();

        var item = g[cat_name];

        if(!this.check_repairable(cat_name))
        {
            return {success: false, info: 'too_damaged'};
        }

        var cost = this.get_repair_cost(cat_name);

        if(client.session.money >= cost)
        {
            item.h = item.h_max;

            client.session.money -= cost;

            Game.write_last_cost(lang(`inventory.repair.item_repair`), cost, false);

            Ph.handle_reset_physics(cat_name);

            return {success: true, info: ''};
        }

        return {success: false, info: 'cost'};
    },

    get_max_bin_raw: function(item, max_price)
    {
        var generated = item(1, max_price);

        var max_bin = Math.floor(generated.bin);

        return max_bin;
    },

    draw_health_indicator: function($indicator, cat_name)
    {
        var health_prec = Ph.get_variable_health_prec(cat_name);

        $indicator.removeClass('label-success')
            .removeClass('label-warning')
            .removeClass('label-danger')
            //.text(`${Math.round(health * 100)} / ${Math.round(age * 100)}`)

        if(health_prec < this.condition_critical)
        {
            $indicator.addClass('label-danger');

            var state = 'critical';
        }
        else if(health_prec < this.condition_service)
        {
            $indicator.addClass('label-warning');

            var state = 'warning';
        }
        else
        {
            $indicator.addClass('label-success');

            var state = 'ok';
        }

        $indicator.text(this.get_health_rating(g[cat_name]) + '%');

        $indicator.tooltip({
            title: lang(`inventory.condition_states.${state}`),
            placement: 'auto',
            container: 'body',
        });
    },

    get_health_rating: function(item)
    {
        var h = (item.h / item.h_max + item.h_age / item.h_max) / 2;

        return Math.round(h * 100);
    },

    update_health_indicators: function()
    {
        var $indicators = $('.category-health-indicator');

        $.each($indicators, function()
        {
            Inv.draw_health_indicator($(this), $(this).attr('data-variable'));
        });
    },

    check_items_condition: function()
    {
        var items = client.session.variables;

        var conditions = {warning: 0, danger: 0, success: 0};

        $.each(items, function(cat_name)
        {
            if(Ph.has_health(cat_name))
            {
                if(Ph.get_variable_health_prec(cat_name) < Inv.condition_critical)
                {
                    conditions.danger++;
                }
                else if(Ph.get_variable_health_prec(cat_name) < Inv.condition_service)
                {
                    conditions.warning++;
                }
                else
                {
                    conditions.success++;
                }
            }
        });

        return conditions;
    },

    draw_warning_icon: function(cat_name, parent)
    {
        var item = g[cat_name];
        var warnings = [];

        var max_flow = Ph.is_opt('compressor') ? Math.max(g.compressor.max_boosted_airflow, g.blades.max_airflow) : g.blades.max_airflow;

        var max_burned = Math.min(max_flow, g.injection.max_fuelflow) * g.injection.eff;

        var max_thrust = Math.min(max_burned, g.exhaust.max_thrust) * g.exhaust.eff;

        var critical = false;

        if(cat_name == 'exhaust')
        {
            if(max_burned > item.max_thrust)
            {
                warnings.push({name: 'restrict', params: {
                    max_burned: write(max_burned),
                    max_thrust: write(item.max_thrust),
                }});

                critical = true;
            }
        }
        else if(cat_name == 'blades')
        {
            if(max_flow < g.injection.max_fuelflow * Ph.af_ratio)
            {
                warnings.push({name: 'unburnt', params: {
                    max_fuelflow: write(g.injection.max_fuelflow * Ph.af_ratio),
                    max_flow: write(max_flow),
                }});

                critical = true;
            }
        }
        else if(cat_name == 'cooling')
        {
            var max_cooling = g.cooling.max_cooling;

            if(Ph.is_opt('cooling_water'))
            {
                max_cooling += g.cooling_water.max_cooling;
            }

            if(max_burned > max_cooling)
            {
                warnings.push({name: 'overheat', params: {
                    max_cooling: write(max_cooling),
                    max_burned: write(max_burned),
                }});

                critical = true;
            }
        }
        else if(cat_name == 'compressor')
        {
            if(max_burned > g.compressor.max_boosted_airflow * Ph.af_ratio)
            {
                warnings.push({name: 'max_boosted', params: {
                    max_boosted_airflow: write(g.compressor.max_boosted_airflow),
                    max_burned: write(max_burned),
                }});
            }
        }
        else if(cat_name == 'air_brake')
        {
            if(max_thrust > g.air_brake.max_thrust)
            {
                warnings.push({name: 'max_thrust', params: {
                    item_thrust: write(g.air_brake.max_thrust),
                    max_thrust: write(max_thrust),
                }});
            }
        }
        else if(cat_name == 'egr')
        {
            if(max_burned > g.egr.max_burned)
            {
                warnings.push({name: 'max_thrust', params: {
                    item: write(g.egr.max_burned),
                    max: write(max_burned),
                }});
            }
        }
        else if(cat_name == 'filter_fuel')
        {
            if(g.injection.max_fuelflow > g.filter_fuel.max_fuelflow)
            {
                warnings.push({name: 'max_fuelflow', params: {
                    item: write(g.filter_fuel.max_fuelflow),
                    max: write(g.injection.max_fuelflow),
                }});

                critical = true;
            }
        }
        else if(cat_name == 'filter_intake')
        {
            if(max_flow > g.filter_intake.max_airflow)
            {
                warnings.push({name: 'max_airflow', params: {
                    item: write(g.filter_intake.max_airflow),
                    max: write(max_flow),
                }});

                critical = true;
            }
        }
        else if(cat_name == 'burn_sensor')
        {
            if(max_thrust > g.burn_sensor.max_burned)
            {
                warnings.push({name: 'max_thrust', params: {
                    item_thrust: write(g.burn_sensor.max_burned),
                    max_thrust: write(max_thrust),
                }});
            }
        }
        else if(cat_name == 'starter')
        {
            if(g.starter.max_airflow < g.blades.min_airflow)
            {
                warnings.push({name: 'min_airflow', params: {
                    max_airflow_starter: write(g.starter.max_airflow),
                    min_airflow: write(g.blades.min_airflow),
                }});

                critical = true;
            }
        }

        if(warnings.length < 1)
        {
            return false;
        }

        var $content = $('<div>');

        $.each(warnings, function()
        {
            $('<div>').text(lang(`inventory.warnings.${cat_name}.${this.name}`, this.params)).appendTo($content);
        });

        var $warning_icon = $('<span class="label table-separator pull-right">').appendTo(parent);

        if(critical)
        {
            $warning_icon.addClass('label-warning');
        }
        else
        {
            $warning_icon.addClass('label-info');
        }

        $('<i class="gi gi-wrench">').appendTo($warning_icon);

        $warning_icon.popover({
            content: $content,
            container: 'body',
            trigger: 'hover',
            placement: 'auto',
            html: true,
        });

        return true;
    },

    get_sell_value: function(cat_name)
    {
        if(Ph.has_health(cat_name))
        {
            var health = Math.min(Ph.get_variable_health(cat_name), Ph.get_variable_health_age(cat_name));

            var condition = Math.round(health * 100) / 100;
        }
        else
        {
            var condition = 1;
        }

        var cost = Ph.get_variable(cat_name, 'cost') * this.get_shop_param('sell_price');

        if(cost)
        {
            return cost * range(condition, 0.5, 1);
        }

        return 0;
    },

    estimate_items_value: function()
    {
        var items = client.session.variables;

        var value = 0;

        $.each(items, function(cat_name, item)
        {
            value += Inv.get_sell_value(cat_name);
        });

        return value;
    },

    remove_opt_item: function(cat_name)
    {
        var item = client.session.variables[cat_name];

        if(Map.check_if_landed() && this.is_shop_available())
        {
            var sell_value = this.get_sell_value(cat_name);

            client.session.money += sell_value;

            Game.write_last_cost(lang(`inventory.items.${item.name}.title`), Math.abs(sell_value), true);
        }

        client.session.variables[cat_name] = {};

        Inv.list_categories();
        Inv.draw_ship_categories();
        Ph.reset_physics();
        Indicator.init_gauges();

        return {success: true, info: ''};
    },

    draw_shop_categories: function()
    {
        $shop_categories.find('.shop-category-show:not(.template)').remove();

        $template = $shop_categories.find('.shop-category-show.template');

        var items = client.session.ext.shop;

        $.each(items, function(cat_name, cat_items)
        {
            if(cat_items.length > 0)
            {
                $cloned = $template.clone().appendTo($shop_categories);

                var icon = Game.get_config('categories_icons')[cat_name];

                $cloned.find('.icon').addClass('gi').addClass(`gi-${icon}`);

                $cloned.find('.amount').text(cat_items.length);

                $cloned.tooltip({
                    title: lang(`inventory.types.${cat_name}`),
                    container: 'body',
                });

                $cloned.removeClass('hidden')
                    .removeClass('template')
                    .attr('data-cat', cat_name);
            }
        });
    },

    get_cat_groups: function()
    {
        var all = {all: Game.get_config('categories_types')};
        var groups = Game.get_config('categories_groups');

        return $.extend({}, all, groups);
    },

    draw_ship_categories: function()
    {
        $ship_categories.find('.ship-category-show:not(.template)').remove();

        $template = $ship_categories.find('.ship-category-show.template');

        var items = this.get_cat_groups();

        $.each(items, function(group_name)
        {
            $cloned = $template.clone().appendTo($ship_categories);

            var icon = Game.get_config('categories_groups_icons')[group_name];

            $cloned.find('.icon').addClass('gi').addClass(`gi-${icon}`);

            var count = Inv.count_cat_group(group_name);

            $cloned.find('.amount').text(count);

            $cloned.tooltip({
                title: lang(`inventory.groups.${group_name}`),
                container: 'body',
            });

            $cloned.removeClass('hidden')
                .removeClass('template')
                .attr('data-cat', group_name);
        });
    },

    count_cat_group: function(group_name)
    {
        var items = this.get_cat_groups()[group_name];

        var count = 0;

        $.each(items, function(i, cat_name)
        {
            if(Object.keys(g[cat_name]).length)
            {
                count++;
            }
        });

        return count;
    },

    get_shop_unique_items: function()
    {
        var items = client.session.ext.shop;

        var uniques = {};

        $.each(items, function(cat_name, cat_items)
        {
            $.each(cat_items, function(id, item)
            {
                if(item.unique)
                {
                    if(!uniques[cat_name])
                    {
                        uniques[cat_name] = [];
                    }

                    uniques[cat_name].push(item);
                }
            });
        });

        return uniques;
    },

    check_shop_uniques: function()
    {
        var unqiues = this.get_shop_unique_items();

        var has_unique = Object.keys(unqiues).length > 0;

        return has_unique;
    },

    draw_shop_actions: function()
    {
        if(this.check_shop_uniques())
        {
            $s_show_unique.removeClass('hidden');
        }
        else
        {
            $s_show_unique.addClass('hidden');
        }
    },

    is_shop_available: function()
    {
        return Object.keys(client.session.ext.shop).length > 0;
    },

    is_repair_available: function()
    {
        return Object.keys(client.session.ext.repair).length > 0;
    },

    make_start_variables: function()
    {
        var categories_config = Game.get_config('categories_raw');
        var categories = Game.get_config('categories_init');

        var start_categories = {};

        $.each(categories, function(name, settings)
        {
            start_categories[name] = Inv.generate_variable_by_name(name, settings.name, settings.bin);

            delete start_categories[name].skip;
        });

        start_categories.tank.fluid = start_categories.tank.size;

        return start_categories;
    },

    check_recommended_part: function(variable)
    {
        return this.get_recommended_bin(variable.cat_name) == variable.bin;
    },

    get_recommended_bin: function(cat_name)
    {
        switch(cat_name)
        {
            case 'filter_fuel':
                return g.injection.bin + 1;
            case 'filter_intake':
                if(Ph.is_opt('compressor'))
                {
                    return g.compressor.bin + 1;
                }
                else
                {
                    return g.blades.bin + 1;
                }
            case 'blades':
            case 'compressor':
            case 'cooling':
            case 'air_brake':
            case 'exhaust':
            case 'egr':
            case 'heater':
            case 'cooling_fan':
            case 'cooling_water':
            case 'processor':
                return g.injection.bin;
            case 'starter':
                return g.blades.bin;
            case 'burn_sensor':
                return g.exhaust.bin;
            case 'injection':
                if(Ph.is_opt('compressor'))
                {
                    return g.compressor.bin;
                }
                else
                {
                    return g.blades.bin;
                }
        }
    },

    get_shop_param: function(name)
    {
        var params = client.session.ext.shop.params;

        if(params)
        {
            return params[name];
        }

        return false;
    },

    draw_tab: function()
    {
        Inv.list_categories(true);

        Inv.draw_shop_actions();

        Inv.draw_repair_all();

        Inv.draw_ship_categories();

        if(Map.check_if_landed())
        {
            Inv.draw_shop_categories();

            Inv.list_shop_all();
        }
        else
        {
            $shop_categories.find('.shop-category-show:not(.template)').remove();

            $shop.DataTable().clear().draw();
        }

        Indicator.clear_pin_indicator('inventory');
    },

    draw_repair_all: function()
    {
        if(this.get_repair_all_cost() > 0)
        {
            $inv_repair_all.removeClass('hidden');
        }
        else
        {
            $inv_repair_all.addClass('hidden');
        }
    },
};

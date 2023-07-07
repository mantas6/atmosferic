var $b_load = $('.game-load-button');

var $s_container = $('#save-slot-container');

$(function()
{
    if(!Saving.check_saving())
    {
        $('.slot-save').prop('disabled', true);

        $('.saving-unavailable-label').removeClass('hidden');
    }

    $b_load.click(function()
    {
        Game.hide_critical_error();

        client.session = false;
    });

    $s_container.on('click', '.slot-save', function()
    {
        var slot = $(this).closest('.save-slot-item').attr('data-slot');

        var button = $(this);

        if(Saving.get_save_content(slot))
        {
            show_dialog(lang('game.overwrite_slot_action.title'), lang('game.overwrite_slot_action.info'), function()
            {
                Saving.save(slot);

                show_alert({body: lang('game.saved'), status: 'success'});

                Saving.draw_save_slots();
            });
        }
        else
        {
            Saving.save(slot);

            show_alert({body: lang('game.saved'), status: 'success'});

            Saving.draw_save_slots();
        }
    });

    $s_container.on('click', '.slot-load', function()
    {
        var slot = $(this).closest('.save-slot-item').attr('data-slot');

        Game.load_enviroment(slot);

        show_popup($(this), lang('game.loading'), 'tooltip-success');
    });

    $s_container.on('click', '.slot-delete', function()
    {
        var slot = $(this).closest('.save-slot-item').attr('data-slot');

        show_dialog(lang('game.delete_slot_action.title'), lang('game.delete_slot_action.info'), function()
        {
            Saving.delete_save(slot);

            Saving.draw_save_slots();
        });
    });

    $('[href="#inventory-tab"]').on('show.bs.tab', function()
    {
        Saving.draw_save_slots();
    });
});

var Saving = {
    draw_save_slots: function()
    {
        $s_container.find('.save-slot-item').not('.template').remove();

        var $template = $s_container.find('.save-slot-item.template');

        var slots = this.get_save_slot_names();

        $.each(slots, function(slot_name, slot)
        {
            var save_content = Saving.get_save_content(slot_name);

            var $cloned = $template.clone().appendTo($s_container);

            $cloned.removeClass('template')
                .removeClass('hidden')
                .attr('data-slot', slot_name)

            $cloned.find('.title').text(lang(`game.slots.${slot_name}`));

            if(slot.info)
            {
                $cloned.find('.info').text(lang(`game.slots_info.${slot.info}`));
            }

            if(slot.auto)
            {
                $cloned.find('.slot-save').remove();

                $cloned.find('.slot-delete').remove();
            }

            if(save_content)
            {
                $cloned.find('.hidden-empty').removeClass('hidden');

                $cloned.find('.distance').text(write(save_content.distance));
                $cloned.find('.money').text(write(save_content.money));

                $cloned.find('.time').text(write_time(save_content.stats.time_in_game_real));

                $cloned.find('.empty-slot').addClass('hidden');
            }
            else
            {
                $cloned.find('.slot-load').prop('disabled', true);
            }
        });
    },

    load: function(slot)
    {
        var session = this.get_save_content(slot);

        if(session)
        {
            client.session = session;

            Game.link();
        }
    },

    do_autosave: function(name)
    {
        this.save(name);

        this.draw_save_slots();
    },

    get_save_slot_names: function()
    {
        var slots = {
            auto: {auto: true, info: 'auto'},
            land: {auto: true, info: 'land'},
        };

        var count = this.get_save_count();

        for(var a = 1; a <= count; a++)
        {
            slots[`slot_${a}`] = {};
        }

        return slots;
    },

    get_last_save_name: function()
    {
        var slots = this.get_save_slot_names();

        var highest_time = 0;
        var highest_name = 'auto';

        $.each(slots, function(slot_name, slot)
        {
            var save_content = Saving.get_save_content(slot_name);

            if(!save_content) return;

            var last_time = save_content.stats.last_time;

            if(last_time > highest_time)
            {
                highest_time = last_time;
                highest_name = slot_name;
            }
        });

        return highest_name;
    },

    check_saving: function()
    {
        try
        {
            localStorage.setItem('check_saving', 1);
            localStorage.removeItem('check_saving');

            return true;
        }
        catch(e)
        {
            return false;
        }
    },

    save: function(slot)
    {
        if(!this.check_saving())
        {
            return false;
        }

        var serialized = JSON.stringify(client.session);

        localStorage.setItem(this.get_save_path(slot), serialized);

        return true;
    },

    delete_save: function(slot)
    {
        if(!this.check_saving())
        {
            return false;
        }

        localStorage.removeItem(this.get_save_path(slot));

        return true;
    },

    get_save_content: function(slot)
    {
        if(!this.check_saving())
        {
            return false;
        }

        var serialized = localStorage.getItem(this.get_save_path(slot));

        if(serialized)
        {
            return JSON.parse(serialized);
        }

        return false;
    },

    get_save_path: function(slot)
    {
        if(slot)
        {
            return `${client.name}_save_${slot}`;
        }
        else
        {
            return `${client.name}_save`;
        }
    },

    get_save_count: function()
    {
        if(!this.check_saving())
        {
            return false;
        }

        var count = localStorage.getItem(this.get_save_path('count'));

        if(!count)
        {
            return 3;
        }

        return count;
    }
};

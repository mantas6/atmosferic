$(function()
{

});

var Tutorial = {
    run_tutorial: function()
    {
        if(Comm.is_closed_group('tutorial'))
        {
            return;
        }

        this.draw_tutorial();
    },

    get_containers: function()
    {
        return [
            'inventory',
            'delivery',
            'fluid',
            'services',
            'advanced',
            'comms',
            'map',
            'legend',
            'stats',
            'stats-travel',
            'stats-fuel',
            'stats-money',
            'gauges',
            'physics',
            'indicators',
        ];
    },

    terminate_tutorial: function()
    {
        var containers = this.get_containers();

        $.each(containers, function(i, name)
        {
            Tutorial.set_variable(name, true);
        });

        this.draw_tutorial();
    },

    draw_tutorial: function()
    {
        var containers = this.get_containers();

        $.each(containers, function(i, name)
        {
            if(!Tutorial.get_variable(name))
                $g_container.addClass(`tutorial-hide-${name}`);
            else
                $g_container.removeClass(`tutorial-hide-${name}`);
        });
    },

    get_variable: function(name)
    {
        return client.session.stats.tutorial[name];
    },

    set_variable: function(name, value)
    {
        client.session.stats.tutorial[name] = value;
    },

    show_popover_safe: function(selector, params)
    {
        if(client.tmp.tutorial_popup_open || !$(selector).is(':visible'))
        {
            setTimeout(function(){
                Tutorial.show_popover_safe(selector, params);
            }, 1000);
        }
        else
        {
            Tutorial.show_popover(selector, params);
        }
    },

    show_popover: function(selector, params)
    {
        client.tmp.tutorial_popup_open = true;

        var popover = $(selector).popover({
            trigger: 'manual',
            placement: 'auto',
            container: 'body',
            title: params.title ? lang(`tutorial.baloons.${params.title}.title`) : undefined,
            content: params.text ? lang(`tutorial.baloons.${params.text}.text`) : false,
            template: '<div class="popover popover-tutorial" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div><button class="btn btn-primary popover-close"><i class="gi gi-cancel"></i></button></div>',
        })
        .popover('show');

        var $tip = popover.data('bs.popover').$tip;

        $tip.find('.popover-close').click(function()
        {
            $(selector).popover('hide').popover('destroy');

            client.tmp.tutorial_popup_open = false;
        });
    },
};

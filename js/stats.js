var $g_stats_table = $('#stats-table');
var $g_stats_modal = $('#stats-modal');
var $g_stats_button = $('#stats-show-button');

$(function()
{
    var stats_table_params = {
        data: [],
        dom: '<tp>',
        ordering: false,
        bPaginate: false,
        columns: [
            {
                data: 'name',
                title: lang('stats.name'),
                createdCell: function(td, cellData, rowData, row, col)
                {
                    $(td).empty();

                    var icon = Game.get_config('stats_icons')[rowData.name];

                    var $icon = $(`<i class="gi gl gi-${icon}">`).appendTo(td);

                    var $label = $('<span>').text(lang(`stats.types.${rowData.name}.name`)).appendTo(td);

                    var $info_icon = $('<i class="gi gi-info table-separator text-primary">').appendTo(td);

                    $info_icon.popover({
                        content: lang(`stats.types.${rowData.name}.desc`),
                        container: 'body',
                        placement: 'auto',
                        trigger: 'hover',
                    });
                },
            },
            {
                data: 'value',
                title: lang('stats.value'),
            },
        ],
    };

    $g_stats_table.DataTable(stats_table_params);

    $g_stats_button.click(function()
    {
        Stats.list_stats();

        $g_stats_modal.modal('show');
    });
});

var Stats = {
    list_stats: function()
    {
        var dT = $g_stats_table.DataTable();

        dT.clear();

        $.each(this.get_stats(), function(name, value)
        {
            dT.rows.add([{
                name: name,
                value: value,
            }]);
        });

        dT.draw();
    },

    get_stats: function()
    {
        var stats = {};

        $.each(Game.get_config('stats'), function(name, stat)
        {
            stats[name] = stat(client.session.stats);
        });

        return stats;
    },

    add: function(name, diff)
    {
        if(!client.session.stats[name])
        {
            client.session.stats[name] = 0;
        }

        if(diff != undefined)
        {
            client.session.stats[name] += diff;
        }
        else
        {
            client.session.stats[name]++;
        }
    },
};

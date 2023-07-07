var $g_branch = $('#game-branch-select');

$(function()
{
    var branches = {
        stable: 'https://atm.7777.lt/',
        unstable: 'https://unstable.atm.7777.lt/',
    };

    var has_branch = false;

    $.each(branches, function(name, url)
    {
        if(location.href == url)
        {
            $g_branch.val(name);

            has_branch = true;
        }
    });

    if(!has_branch)
    {
        $g_branch.find('option').remove();
        $g_branch.append('<option>-</option>')
        $g_branch.prop('disabled', true);
    }

    $g_branch.change(function()
    {
        location.replace(branches[$(this).val()]);
    });

    a_sites_auto_collection('Atmosferic');
});

var Doorbell = {

    call: function(name, info)
    {
        var nameOfItem = info.info;
        
        var params = {
            name: name,
            titles: { name: nameOfItem },
            attachments: {},
            values: {
                cost: { value: info.cost },
                money: { value: Math.round(client.session.money) },
                distance: { value: Math.round(client.session.distance) },
            },
        };

        if(name == 'error')
        {
            params.attachments.save = JSON.stringify(client.session);
            params.attachments.trace = JSON.stringify(info);
        }

        a_sites_request('Atmosferic', params);
    },

};

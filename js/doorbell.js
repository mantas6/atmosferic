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
});

var Doorbell = {

    call: function(name, info)
    {
        
    },

};

$(function() {
    var elements_to_translate = $('[data-lang]');

    $.each(elements_to_translate, function()
    {
        var label = $(this);

        var trans = label.attr('data-lang');

        var string = lang(trans);

        label.text(string);
    });
});

function lang(trans, params)
{
    var arr = trans.split('.');

    if ( arr[6] != undefined && arr[5] != undefined && arr[4] != undefined && arr[3] != undefined && client.lang[arr[0]] != undefined && client.lang[arr[0]][arr[1]] != undefined && client.lang[arr[0]][arr[1]][arr[2]] != undefined && client.lang[arr[0]][arr[1]][arr[2]][arr[3]] != undefined && client.lang[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] != undefined && client.lang[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]][arr[5]] != undefined )
    {
        var string = client.lang[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]][arr[5]][arr[6]];
    }
    else if ( arr[5] != undefined && arr[4] != undefined && arr[3] != undefined && client.lang[arr[0]] != undefined && client.lang[arr[0]][arr[1]] != undefined && client.lang[arr[0]][arr[1]][arr[2]] != undefined && client.lang[arr[0]][arr[1]][arr[2]][arr[3]] != undefined && client.lang[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] != undefined )
    {
        var string = client.lang[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]][arr[5]];
    }
    else if ( arr[4] != undefined && arr[3] != undefined && client.lang[arr[0]] != undefined && client.lang[arr[0]][arr[1]] != undefined && client.lang[arr[0]][arr[1]][arr[2]] != undefined && client.lang[arr[0]][arr[1]][arr[2]][arr[3]] != undefined )
    {
        var string = client.lang[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]];
    }
    else if ( arr[3] != undefined && client.lang[arr[0]] != undefined && client.lang[arr[0]][arr[1]] != undefined && client.lang[arr[0]][arr[1]][arr[2]] != undefined )
    {
        var string = client.lang[arr[0]][arr[1]][arr[2]][arr[3]];
    }
    else if ( arr[2] != undefined && client.lang[arr[0]] != undefined && client.lang[arr[0]][arr[1]] != undefined )
    {
        var string = client.lang[arr[0]][arr[1]][arr[2]];
    }
    else if ( arr[1] != undefined && client.lang[arr[0]] != undefined )
    {
        var string = client.lang[arr[0]][arr[1]];
    }
    else
    {
        var string = client.lang[arr[0]];
    }

    if ( string != undefined )
    {
        if(params)
        {
            $.each(params, function(name, replace)
            {
                string = string.split(`{${name}}`).join(replace);
            });
        }

        return string;
    }
    else
    {
        return trans;
    }
}

function is_lang(trans)
{
    var text = lang(trans);

    return !(trans == text);
}

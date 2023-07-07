var choose_modal_open = false;

$(function()
{
    $('#choose-modal').on('hidden.bs.modal', function()
    {
        Game.toggle_pause(false);

        setTimeout(function()
        {
            choose_modal_open = false;
        }, 200);
    });
});

function time()
{
    return Math.floor(Date.now() / 1000);
}

function root(x, n)
{
    try
    {
        var negate = n % 2 == 1 && x < 0;

        if(negate)
            x = -x;

        var possible = Math.pow(x, 1 / n);

        n = Math.pow(possible, n);

        if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
            return negate ? -possible : possible;
    }
    catch(e){}
}

function write(value, precision)
{
    if(precision == undefined)
    {
        precision = 2;
    }

    var x = Math.pow(10, precision);

    var negative = value < 0 ? true : false;

    value = Math.abs(value);

    var formatted = format_number(value);

    return (negative ? '-' : '') + (Math.round(formatted.value * x) / x).toFixed(precision) + formatted.sign;
}

function format_number_list()
{
    var formats = [
        { size: 1e-12,  sign: 'pico'},
        { size: 1e-9,   sign: 'nano'},
        { size: 1e-6,   sign: 'micro'},
        { size: 1e-3,   sign: 'milli'},
        { size: 1,      sign: ''},
        { size: 1e3,    sign: 'K'},
        { size: 1e6,    sign: 'M'},
        { size: 1e9,    sign: 'B'},
        { size: 1e12,   sign: 'T'},
        { size: 1e15,   sign: 'Qa'},
        { size: 1e18,   sign: 'Qi'},
        { size: 1e21,   sign: 'Sx'},
        { size: 1e24,   sign: 'Sp'},
        { size: 1e27,   sign: 'Oc'},
        { size: 1e30,   sign: 'No'},
        { size: 1e33,   sign: 'Dc'},
    ];

    return formats;
}

function format_number(value)
{
    var formats = format_number_list();

    var format_prev = {size: 1, sign: ''};

    var formatted = {};

    formats.forEach(function(format)
    {
        if(value < format.size)
        {
            formatted.value = (value / format_prev.size);

            formatted.sign = format_prev.sign;

            formatted.size = format_prev.size;

            return;
        }

        format_prev = format;
    });

    if(formatted.value == undefined)
    {
        var size = Math.floor(Math.log10(value));

        formatted.value = value / Math.pow(10, size);

        formatted.sign = `e+${size}`;
    }

    return formatted;
}

function write_time(value)
{
    return moment.duration(1000 * value).format('y[y] M[M] d[d] H[h] m[m] s[s]');
}

function romanize(num)
{
    var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
        roman = '',
        i;

    for(i in lookup)
    {
        while(num >= lookup[i])
        {
            roman += i;
            num -= lookup[i];
        }
    }

    return roman;
}

function avg(values)
{
    var total = 0;

    $.each(values, function(){
        total += this;
    });

    return total / values.length;
}

function range(value, min, max)
{
    value = Math.max(value - min, 0);

    return Math.min(value / (max - min), 1);
}

function range_r(value, min, max)
{
    return range_array(value, {0: min, 1: max});
}

function pow(a, b)
{
    return Math.pow(a, b);
}

function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function flow(flow, min, max)
{
    flow *= range(flow, 0, min);

    return Math.min(max, flow);
}

/*
    200: 10,
    1000: 20,
*/

function range_array(value, array)
{
    var prev_i = 0;
    var prev_v = 0;

    var result = null;

    $.each(array, function(i, val)
    {
        if(result != null)
        {
            return;
        }

        if(value < i)
        {
            var v = range(value, prev_i, i);

            result = prev_v + ((val - prev_v) * v);
        }

        prev_v = val;
        prev_i = i;
    });

    if(result == null)
    {
        return prev_v;
    }

    return result;
}

function merge()
{
    var result_obj = {};

    $.each(arguments, function(i, obj)
    {
        $.each(obj, function(name, variable)
        {
            result_obj[name] = variable;
        });
    });

    return result_obj;
}

function clone(object)
{
    var clone = JSON.parse(JSON.stringify(object));

    return clone;
}

//body, status, callback, timeout
function show_alert(args)
{
    var $alert = $('<div class="fixed-alert alert alert-dismissible">');

    if(args.status)
    {
        $alert.addClass(`alert-${args.status}`);
    }
    else
    {
        $alert.addClass(`alert-info`);
    }

    $('<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>')
        .appendTo($alert)
        .click(function()
        {
            if(args.callback)
            {
                args.callback();
            }
        });

    var $text = $('<span>').text(args.body).appendTo($alert);

    format_html($text, get_formatter());

    setTimeout(function()
    {
        $alert.remove();
    }, args.timeout ? args.timeout : 3000);

    $('.game-container').prepend($alert);
}

function show_dialog(title, body, callback)
{
    $('#dialog-title-label').text(title);
    $('#dialog-body-text').text(body);

    $('#dialog-confirm-button').unbind('click').click(callback);

    $('#dialog-modal').modal('show');
}

function show_choose_safe(args)
{
    if(choose_modal_open)
    {
        setTimeout(function(){
            show_choose_safe(args);
        }, 1000);
    }
    else
    {
        show_choose(args);
    }
}

//title, body, items, callback, preview
function show_choose(args)
{
    $('#choose-title-label').text(args.title);
    $('#choose-body-text').text(args.body);

    format_html($('#choose-body-text'));

    var $item_c = $('#choose-items-container');

    $item_c.find('.choose-item').not('.template').remove();

    $template = $item_c.find('.choose-item.template');

    $.each(args.items, function(name, params)
    {
        var $cloned = $template.clone().appendTo($item_c);

        $cloned.removeClass('template')
            .removeClass('hidden');

        var $btn = $cloned.find('.choose-dialog-button');


        $btn.attr('data-choose', name)
            .text(params.text);

        if(params.status)
        {
            $btn.removeClass('btn-default')
                .addClass(`btn-${params.status}`);
        }

        if(params.disabled)
        {
            $btn.prop('disabled', true);
        }

        $cloned.click(function()
        {
            args.callback(name);

            $('#choose-modal').modal('hide');
        });
    });

    var $preview = $('#choose-preview-container');

    $preview.empty();

    if(args.preview)
    {
        var $content = $(args.preview).clone().appendTo($preview);

        $content.removeAttr('id').find('[id]').removeAttr('id');
    }

    choose_modal_open = true;

    Game.toggle_pause(true);

    $('#choose-modal').modal('show');
}

function format_html($element, rules)
{
    var formatted = $element.html();

    if(!rules)
    {
        rules = get_formatter();
    }

    $.each(rules, function(split, join)
    {
        formatted = formatted.split(split).join(join);
    });

    $element.html(formatted);
}

function get_formatter()
{
    return {
        '{tr}': '<p class="text-transmission">',
        '{/tr}': '</p>',
        '{p}': '<p>',
        '{p:warning}': '<p class="text-warning">',
        '{p:danger}': '<p class="text-danger">',
        '{/p}': '</p>',
        '{n}': '<br/>',
        '{@': '<i class="gi gl gr gi-',
        '@}': '"></i>',
        '{b}': '<b>',
        '{/b}': '</b>',
        '{ul}': '<ul>',
        '{/ul}': '</ul>',
        '{ol}': '<ol>',
        '{/ol}': '</ol>',
        '{li}': '<li>',
        '{/li}': '</li>',
    };
}

function show_popup(button, title, color)
{
    var button = $(button);

    if(!button.is(':visible'))
    {
        return show_alert({body: title, status: color.split('tooltip-').join('')})
    }

    var tooltip_element = button;

    var tooltip_parent_name = button.attr('data-tooltip-parent-name');

    if(tooltip_parent_name != undefined)
    {
        tooltip_element = button.closest('[data-tooltip-parent="' + tooltip_parent_name + '"]');
    }

    window.clearTimeout(tooltip_element.data('timeout'));

    var tooltip = button.data('bs.tooltip');

    if(!tooltip)
    {
        tooltip_element.tooltip({
            placement: 'bottom',
            trigger: 'manual',
            title: title,
            container: 'body',
            template: '<div class="tooltip ' + color + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        });
    }
    else
    {
        tooltip.options.title = title;
        tooltip.options.template = '<div class="tooltip ' + color + '" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
    }

    var timeout = window.setTimeout(function()
    {
        if(button.data('bs.tooltip'))
        {
            tooltip_element.tooltip('destroy');
        }
    }, 3000);

    tooltip_element.data('timeout', timeout);

    tooltip_element.tooltip('show');
}

function chance(chance)
{
    return Math.random() < chance;
}

function rand(min, max, precision)
{
    if(!precision)
    {
        precision = 0;
    }

    return parseFloat((Math.random() * (min - max) + max).toFixed(precision));
}

function rand_letters(count, template)
{
    var templates = {
        uc: 'QWERTYUIOASDFGHJKLZXCVBNM',
        lc: 'qwertyuioasdfghjklzxcvbnm',
    };

    var arr = templates[template || 'uc'].split('');

    shuffle_array(arr);

    return arr.join('').substring(0, count || 1);
}

function shuffle_array(a)
{
    var j, x, i;
    for (i = a.length; i; i--)
    {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function pick_rand(input)
{
    var array = clone(input);

    shuffle_array(array);

    return array[0];
}

$(function()
{
    $.ajax({
        method: 'POST',
        url: 'https://m.7777.lt/atm_visits/register',
        data: {
            origin: location.href,
        },
    });
});

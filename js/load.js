$(function()
{
    $(window).load(function()
    {
        $('.game-container').fadeTo(500, 1);

        $('.game-load-container').fadeTo(500, 0, function()
        {
            $(this).css('display', 'none');
        });
    });
});

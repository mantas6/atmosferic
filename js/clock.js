$(function()
{
    window.setInterval(function()
    {
        Game.clock_wrapper('aux', function()
        {
            if(client.tmp.sleep_interactive)
            {
                //Indicator.clear_map_markers();
                Game.clock_ui(true);
            }

            if(client.session.pause || !client.session)
            {
                return;
            }

            Game.draw_tab_contents();

            Indicator.update_game_stats_slow();

            Game.incr_time_in_game(true);
        });
    }, 1000);


    window.clock_int = window.setInterval(function()
    {
        Game.clock_wrapper('main', function()
        {
            if(client.session.pause || client.tmp.sleep_interactive)
            {
                return;
            }

            if(!client.session)
            {
                Game.load_enviroment(Saving.get_last_save_name());
            }

            var clock_diff = Game.get_clock_diff();

            while(clock_diff > 0 && clock_diff < 2 * 60 * 100)
            {
                Game.clock_core();

                clock_diff -= 100;
            }

            Game.clock_ui();

            Game.mark_clock_run();

            if(Game.is_debug_mode())
            {
                Indicator.draw_physics_debug();
            }
        });
    }, 100);

    window.setInterval(function()
    {
        if(!choose_modal_open && !client.tmp.game_critical_error)
        {
            Saving.do_autosave('auto');
        }
    }, 60000);
});

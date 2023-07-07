$.extend(client.config, {
    client_upgrades: {
        2: function()
        {
            g.processor = {};
            /*
            console.log('migrate to 2');

            if(Comm.is_open_group('inspection'))
            {
                Comm.mark_as_closed_group('inspection');
                Comm.mark_as_active('inspection', 'station');
            }

            if(Comm.is_open_group('invest'))
            {
                Comm.mark_as_closed_group('invest');
                Comm.mark_as_active('invest', 'list');
            }
            */
        },
    },
});

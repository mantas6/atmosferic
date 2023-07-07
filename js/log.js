var Log = {
    /* levels: info, warn, err  */
    add: function(channel, level, message)
    {
        var channels = this.channels();

        if(channels[`${channel}.${level}`])
        {
            switch(level)
            {
                case 'info':
                    return console.log(`${channel}: ${message}`);
                case 'warn':
                    return console.warn(`${channel}: ${message}`);
                case 'err':
                    return console.err(`${channel}: ${message}`);
            }
        }
    },

    subscribe: function(channel, level)
    {
        var channels = this.channels();

        if(level)
        {
            channels[`${channel}.${level}`] = true;
        }
        else
        {
            $.each(this.levels(), function(i, level)
            {
                channels[`${channel}.${level}`] = true;
            });
        }
    },

    unsubscribe: function(channel, level)
    {
        var channels = this.channels();

        if(level)
        {
            delete channels[`${channel}.${level}`];
        }
        else
        {
            $.each(this.levels(), function(i, level)
            {
                delete channels[`${channel}.${level}`];
            });
        }
    },

    unsubscribe_all: function()
    {
        client.session.debug.channels = {};
    },

    levels: function()
    {
        return ['info', 'warn', 'err'];
    },

    channels: function()
    {
        return client.session.debug.channels;
    },
};

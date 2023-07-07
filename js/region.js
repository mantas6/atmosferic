var Region = {

    update_regions: function()
    {
        var region = client.session.region;
        var region_next = client.session.region_next;

        // Region init (with a fresh session)
        if(!region.name)
        {
            client.session.region = this.generate_region({name: 'home'});
        }

        // Region next init (with a fresh session)
        if(!region_next.name && Map.get_next_station_id())
        {
            client.session.region_next = this.generate_region();
        }

        if(region.end && client.session.distance > region.end)
        {
            client.session.region = client.session.region_next;

            client.session.region_next = this.generate_region();
        }
    },

    generate_region: function(force)
    {
        var regions = this.get_regions_config_raw();

        shuffle_array(regions);

        var generated = false;

        $.each(regions, function(i, region)
        {
            generated = region();

            if((force && force.name != generated.name) || (!force && generated.skip))
            {
                generated = false;

                return;
            }

            delete generated['skip'];

            return false;
        });

        return $.extend(true, this.get_region_defaults(), generated);
    },

    get_regions_config_raw: function()
    {
        var regions = Game.get_config('regions');

        return regions;
    },

    get_prop: function(name, next)
    {
        if(next)
        {
            return client.session.region_next[name];
        }

        return client.session.region[name];
    },

    get_station_min_distance: function(min_distance)
    {
        if(min_distance < this.get_prop('end'))
        {
            if(this.get_stations_gen().no_stations && !this.get_stations_gen(true).no_stations)
            {
                return this.get_prop('end');
            }
        }
        else if(min_distance < this.get_prop('end', true))
        {
            if(this.get_stations_gen(true).no_stations && this.get_prop('end', true))
            {
                return this.get_prop('end', true);
            }
        }

        return min_distance;
    },

    get_stations_gen: function(next)
    {
        var gen_name = this.get_prop('stations', next);

        var stations_gen = Game.get_config('stations_gen');

        if(stations_gen[gen_name])
        {
            return stations_gen[gen_name]();
        }

        return false;
    },

    get_region_defaults: function()
    {
        return {
            air_density: 1,
            ambient_temp: 300,
            air_friction: 1,
            end: this.get_prop('end') + Map.get_station_last_distance(),
            stations: 'normal',
            recovery: {
                cost_per_distance: 0.002,
                cost_per_weight: 0.1,
            },
            loans: {
                interest: 0.2,
            },
        };
    },

    log: function(level, message)
    {
        Log.add('region', level, message);
    },
};

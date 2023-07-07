var Map = {
    map_size: 20,

    check_if_landed: function()
    {
        if(this.check_if_passing_by() && client.session.speed == 0)
        {
            return true;
        }

        return false;
    },

    check_if_passing_by: function()
    {
        var distance = this.get_next_station_distance();

        if(distance < this.get_landing_range())
        {
            return true;
        }

        return false;
    },

    check_if_created_ext: function()
    {
        var station = this.get_next_station();

        return station.created ? true : false;
    },

    get_next_station_distance: function(skip_one)
    {
        var player_distance = client.session.distance;

        return this.get_next_station_attr('distance', skip_one) - player_distance;
    },

    get_next_station_attr: function(name, skip_one)
    {
        var station = this.get_next_station(skip_one);

        if(!station)
        {
            return false;
        }

        return station[name];
    },

    get_station_attr: function(id, name)
    {
        var station = this.get_station_by_id(id);

        if(!station)
        {
            return false;
        }

        return station[name];
    },

    get_next_station: function(skip_one)
    {
        var id = this.get_next_station_id(skip_one);

        return client.session.map[id];
    },

    get_next_station_id: function(skip_one, countable)
    {
        var player_distance = client.session.distance;

        var last_id = false;
        var last_station = false;

        $.each(client.session.map, function(id, station)
        {
            if(skip_one && Map.get_next_station_id() == id)
                return;

            if(countable && !station.countable)
                return;

            if(station.distance > player_distance && (!last_station || station.distance < last_station.distance))
            {
                last_station = station;
                last_id = id;
            }
        });

        return last_id;
    },

    get_station_by_name: function(name)
    {
        var stations = client.session.map;

        var station_match = {};

        $.each(stations, function(i, station)
        {
            if(station.name == name)
            {
                station_match = station;

                return false;
            }
        });

        return station_match;
    },

    get_station_by_id: function(id)
    {
        return client.session.map[id];
    },

    update_shop_station: function()
    {
        var station = this.get_next_station();

        if ( station && this.check_if_landed() )
        {
            if(!station.created)
            {
                var ext = client.session.ext;

                if(station.ext.shop)
                {
                    ext.shop = Inv.generate_station_shop(station.ext.shop);
                }
                else
                {
                    ext.shop = {};
                }

                if(station.ext.fluid)
                {
                    ext.fluid = Fluid.generate_station_fluids();
                }
                else
                {
                    ext.fluid = {};
                }

                if(station.ext.delivery)
                {
                    ext.delivery = Delivery.generate_station_deliveries();
                }
                else
                {
                    ext.delivery = [];
                }

                if(station.ext.repair)
                {
                    ext.repair = Inv.generate_station_repairs(station.ext.repair);
                }
                else
                {
                    ext.repair = {};
                }

                station.created = true;

                this.on_land();
            }
        }
        else if(!this.check_if_passing_by())
        {
            client.session.ext.shop = {};
            client.session.ext.fluid = {};
            client.session.ext.delivery = {};
            client.session.ext.repair = {};
        }
    },

    get_stations_names: function(filter)
    {
        var names = [];

        $.each(client.session.map, function(i, station)
        {
            if(filter && filter.exclude_current && station.name == Map.get_next_station_attr('name'))
            {
                return;
            }

            if(filter && filter.upcoming && station.distance < client.session.distance)
            {
                return;
            }

            names.push(station.name);
        });

        return names;
    },

    get_stations_ids: function(filter)
    {
        var ids = [];

        $.each(client.session.map, function(id, station)
        {
            if(filter && filter.exclude_current && id == Map.get_next_station_id())
            {
                return;
            }

            if(filter && filter.upcoming && station.distance < client.session.distance)
            {
                return;
            }

            ids.push(id);
        });

        return ids;
    },

    get_distance_to_station: function(id)
    {
        var station = Map.get_station_by_id(id);

        if(!station)
        {
            return false;
        }

        var distance_left = station.distance - client.session.distance;

        return distance_left;
    },

    delete_old_stations: function()
    {
        var garbage = [];

        $.each(client.session.map, function(id, station)
        {
            if(Map.get_distance_to_station(id) < -1 * Map.get_next_station_distance())
            {
                garbage.push(id);
            }
        });

        $.each(garbage, function()
        {
            delete client.session.map[this];
        })
    },

    generate_stations: function(amount)
    {
        this.log('info', `Generating ${amount} stations`);

        for(var i = 0; i < amount; i++)
        {
            var distance = this.generate_station_distance();

            var params = Region.get_stations_gen();

            if(params.no_stations) this.log('info', `No stations is set at current region.`);

            if(params.no_stations || Region.get_prop('end') && distance > Region.get_prop('end'))
            {
                var distance = this.generate_station_distance(true);
                var params = Region.get_stations_gen(true);

                this.log('info', `Placing station in next region.`);
            }

            this.log('info', `Generated distance of station ${write(distance)}`);

            if(params.no_stations || !params)
            {
                this.log('info', `No stations is set. Returning.`);

                return;
            }

            var station = this.create_station(distance, params);

            this.append_station(station);
        }
    },

    generate_station_distance: function(region_next)
    {
        var last_station = this.get_station_last_distance({countable: true});

        var stations_gen = Region.get_stations_gen(region_next);

        last_station += 2e5;

        var distance = last_station + (last_station * stations_gen.distance);

        return this.get_allowed_station_distance(distance);
    },

    create_station: function(distance, params)
    {
        var station = {
            name: this.get_random_station_name(),
            distance: distance,
            icon: 'defense-satellite',
            countable: true,
            ext: {
                shop: {},
                delivery: {},
                fluid: {},
                repair: {},
            },
        };

        return station;
    },

    count_stations: function()
    {
        var count = 0;

        $.each(client.session.map, function(id, station)
        {
            if(station.countable)
            {
                count++;
            }
        });

        return count;
    },

    generate: function()
    {
        var amount = Map.map_size - this.count_stations();

        if(amount > 0)
        {
            Map.generate_stations(amount);
        }
    },

    append_station: function(station)
    {
        var id = this.get_last_station_id() + 1;

        client.session.map[id] = station;

        this.increment_last_station_id();

        this.log('info', `Appended station of id ${id}`);

        return id;
    },

    get_random_station_name: function()
    {
        var names = Game.get_config('station_names')();

        shuffle_array(names);

        var random_name = names[0];

        $.each(names, function(i, name)
        {
            var exists = false;

            $.each(client.session.map, function(station_id, station)
            {
                if(station.name == name)
                {
                    exists = true;

                    return false;
                }
            });

            if(!exists)
            {
                random_name = name;

                return false;
            }
        });

        return random_name;
    },

    get_last_station_id: function()
    {
        return client.session.station_id;
    },

    increment_last_station_id: function()
    {
        client.session.station_id++;
    },

    get_stations_distances: function()
    {
        var distances = [];

        $.each(client.session.map, function(id, station)
        {
            distances.push(station.distance);
        });

        return distances.sort(function(a, b)
        {
            return a - b;
        });
    },

    get_allowed_station_distance_region: function(min_distance)
    {
        min_distance = Region.get_station_min_distance(min_distance);

        return this.get_allowed_station_distance(min_distance);
    },

    get_allowed_station_distance: function(min_distance)
    {
        var distances = this.get_stations_distances();

        var allowed_distance = this.get_station_last_distance() + this.get_landing_range();

        $.each(distances, function(i, distance)
        {
            var low_limit = distance + Map.get_landing_range();
            var high_limit = distances[i+1] ? distances[i+1] - Map.get_landing_range() : Infinity;

            if(min_distance > low_limit && min_distance < high_limit)
            {
                allowed_distance = distance + Map.get_landing_range();
            }
        });

        if(min_distance > allowed_distance)
        {
            return min_distance;
        }
        else
        {
            return allowed_distance;
        }
    },

    get_station_last_distance: function(filter)
    {
        var distance = client.session.distance;

        $.each(client.session.map, function(id, station)
        {
            if(filter && filter.countable && !station.countable)
            {
                return;
            }

            distance = Math.max(distance, station.distance);
        });

        return distance;
    },

    get_nearest_target: function(targets)
    {
        var nearest_distance;
        var nearest_target;

        $.each(targets, function(i, target)
        {
            if(Map.get_station_by_id(target))
            {
                var target_distance = Map.get_distance_to_station(target);

                if(target_distance < nearest_distance || !nearest_target)
                {
                    nearest_target = target;
                    nearest_distance = target_distance;
                }
            }
        });

        return nearest_target;
    },

    on_land: function()
    {
        if(this.get_station_attr(this.get_next_station_id(), 'countable'))
        {
            Svc.manage_taxes('land');
        }

        Comm.run_on_land();
        Saving.do_autosave('land');

        client.tmp.landed = true;
    },

    get_landing_range: function()
    {
        if(Ph.is_opt('lander'))
        {
            return g.lander.range;
        }
        else
        {
            return 2e5;
        }
    },

    get_random_station_id: function(filter)
    {
        if(!filter)
            filter = {};

        var stations_ids = this.get_stations_ids();

        shuffle_array(stations_ids);

        var match_id = false;

        $.each(stations_ids, function(i, id)
        {
            var station = Map.get_station_by_id(id);

            if(filter.upcoming && station.distance < client.session.distance) return;
            if(filter.exclude_current && id == Map.get_next_station_id()) return;
            if(filter.countable && !station.countable) return;
            if(filter.delivery && !station.ext.delivery) return;
            if(filter.fluid && !station.ext.fluid) return;
            if(filter.shop && !station.ext.shop) return;
            if(filter.repair && !station.ext.repair) return;
            if(filter.max_distance && station.distance > filter.max_distance) return;

            match_id = id;

            return false;
        });

        return match_id;
    },

    log: function(level, message)
    {
        Log.add('map', level, message);
    },
};

var Ph = {
    af_ratio: 1,
    af_afterburner_ratio: 1,
    thermal_inertia: 10,
    airflow_inertia: 40,

    blades_airflow_per_burned: 0.1,

    h_age_multiplier: 0.5,

    set_setting: function(name, value)
    {
        client.session.settings[name] = value;
    },

    get_setting: function(name)
    {
        return client.session.settings[name];
    },

    get_variable: function(cat_name, name)
    {
        return client.session.variables[cat_name][name];
    },

    get_variable_health: function(cat_name)
    {
        return this.get_variable(cat_name, 'h') / this.get_variable(cat_name, 'h_max');
    },

    get_variable_health_age: function(cat_name)
    {
        return this.get_variable(cat_name, 'h_age') / this.get_variable(cat_name, 'h_max');
    },

    get_variable_health_prec: function(cat_name)
    {
        var h = this.get_variable(cat_name, 'h');
        var h_max = this.get_variable(cat_name, 'h_max');
        var h_age = this.get_variable(cat_name, 'h_age');

        var prec = ((h / h_max + h_age / h_max) / 2);

        return prec;
    },

    get_condition: function(cat_name)
    {
        var prec = this.get_variable_health_prec(cat_name) * 100;

        var condition = range_array(prec, {
            0: 0,
            20: 0.75,
            50: 0.95,
            100: 1,
        });

        return condition;
    },

    has_health: function(cat_name)
    {
        var item = client.session.variables[cat_name];

        return item.h != undefined;
    },

    drain_health: function(cat_name, amount)
    {
        var item = client.session.variables[cat_name];

        item.h -= amount;
        item.h_age -= amount * this.h_age_multiplier;

        if(item.h < 0) item.h = 0;
        if(item.h_age < 0) item.h_age = 0;
        if(item.cost < 0) item.cost = 0;
    },

    get_setting_overridable: function(cat_name, name)
    {
        var setting = get_setting(name);

        if(setting != null)
        {
            return setting;
        }

        return get_variable(cat_name, name);
    },

    get_totals: function()
    {
        var total = {
            weight: 0,
            drag: 0,
        };

        $.each(client.session.variables, function(cat_name, variable)
        {
            $.each(total, function(name)
            {
                if(variable[name])
                {
                    total[name] += variable[name];
                }
            });
        });

        if(p.cooling_ctl)
        {
            var cooling_eff = g.cooling.cooling_per_speed * client.session.speed;

            total.drag += g.cooling.max_drag * p.cooling_ctl * (cooling_eff / g.cooling.max_cooling);
        }

        total.weight += Delivery.get_total_delivery_weight();

        var fluid_weights = Game.get_config('fluid_weight');

        $.each(fluid_weights, function(name, weight)
        {
            if(client.session.variables[name].fluid)
            {
                // Disable for now
                // total.weight += client.session.variables[name].fluid * weight;
            }
        });

        return total;
    },

    is_opt: function(cat_name)
    {
        return this.get_variable(cat_name, 'opt');
    },

    handle_reset_physics: function(cat_name)
    {
        switch(cat_name)
        {
            case 'cargo':
            case 'tank':
            case 'radar':
            case 'burn_sensor':
            case 'filter_fuel':
            case 'filter_intake':
                return;
        }

        this.reset_physics();
        this.reset_avg_counters();
    },

    reset_physics: function()
    {
        p.temp = Region.get_prop('ambient_temp');
        p.airflow = 0;
        p.fuelflow = 0;
        p.burned = 0;
    },

    reset_avg_counters: function()
    {
        /* Resets avg counters */
        client.session.stats['burned_fuel_distance'] = 0;
        client.session.stats['burned_fuel'] = 0;
    },

    reset_settings_defaults: function()
    {
        var defaults = Game.get_config('settings_defaults');

        $.each(defaults, function(name, value)
        {
            Ph.set_setting(name, value);
        });
    },

    append_combustion_quality_by_temp: function(temp)
    {
        var quality = range_array(temp, {
            0: 0,
            200: 0.3,
            300: 0.5,
            400: 0.7,
            800: 0.8,
            1100: 0.9,
            2000: 1,
        });

        //quality = Math.min(0.5 + p.temp / 2000, 1);

        return quality;
    },

    get_wear_multiplier_by_temp: function(temp)
    {
        var multiplier = 1;

        if(this.is_opt('filter_intake'))
        {
            multiplier = 1 - g.filter_intake.eff;
        }

        var ranges = {
            0: 30,
            200: 15,
            400: 5,
            600: 1.1,
            800: 1.01 * multiplier,
        };

        ranges[g.blades.max_temp] = 1;
        ranges[g.blades.max_temp + g.blades.max_temp * 1.2] = 1000;

        return range_array(temp, ranges);
    },

    get_catastrofic_failure_rate_by_temp: function(temp)
    {
        return range_array(temp, {
            0: 1e3,
            300: 1e4,
            500: 1e6,
            700: 1e8,
            800: 1e15,
        });
    },

    get_braking_thrust: function(thrust, drain_health)
    {
        if(this.is_opt('air_brake'))
        {
            var braking_thrust = Math.min(g.air_brake.max_thrust, thrust);

            if(drain_health)
            {
                this.drain_health('air_brake', braking_thrust / g.air_brake.max_thrust);
            }

            braking_thrust = braking_thrust * g.air_brake.eff * this.get_condition('air_brake');

            return Math.max(braking_thrust, thrust);
        }
        else
        {
            return thrust;
        }
    },

    get_speed_loss: function()
    {
        var totals = this.get_totals();

        var drag = totals.drag * Region.get_prop('air_friction');

        return (client.session.speed * drag) / totals.weight;
    },

    get_thrust: function(thrust)
    {
        if(Ctl.get_control('brake'))
        {
            return -1 * this.get_braking_thrust(thrust, true);
        }
        else
        {
            return thrust;
        }
    },

    get_speed_increase: function(thrust)
    {
        var totals = this.get_totals();

        return this.get_thrust(thrust) / totals.weight;
    },

    is_burn_sensor: function()
    {
        return this.is_opt('burn_sensor') && g.burn_sensor.max_burned >= p.burned;
    },

    get_thermal_inertia: function()
    {
        return g.blades.max_airflow * this.thermal_inertia;
    },

    physics_run: function()
    {
        var airflow_gain = 0;

        var totals = this.get_totals();

        /* Starter */
        var starter_required = Ctl.get_control('fuel') && Ctl.get_control('throttle') + Ctl.get_idle_offset() > 0;

        var starter_req_assist = p.airflow * p.air_density < p.fuelflow * this.af_ratio && p.airflow < g.blades.max_airflow;

        var starter_max_allow = p.airflow < g.starter.max_airflow * 2

        if(starter_required && starter_max_allow && (starter_req_assist || p.airflow < g.blades.min_airflow) && p.fuelflow)
        {
            var starter_gain = (g.starter.max_airflow / 20) * this.get_condition('starter');

            if(p.airflow > g.starter.max_airflow)
            {
                starter_gain *= 1 - range(p.airflow, g.starter.max_airflow, g.starter.max_airflow * 2)
            }

            airflow_gain += starter_gain;

            this.drain_health('starter', 1);

            Indicator.set_indicator('starter', 1);
        }
        else
        {
            Indicator.set_indicator('starter', 0);
        }

        /* Fuelflow */
        var max_fuelflow = g.injection.max_fuelflow * Ctl.get_control('fuel');

        if(this.is_burn_sensor())
        {
            if(Ctl.get_control('thrust'))
            {
                max_fuelflow = Math.min(max_fuelflow, g.exhaust.max_thrust);
            }

            if(this.is_opt('compressor'))
            {
                max_fuelflow = Math.min(max_fuelflow, g.compressor.max_boosted_airflow);
            }
            else
            {
                max_fuelflow = Math.min(max_fuelflow, g.blades.max_airflow * Region.get_prop('air_density'));
            }
        }

        var fuelflow = max_fuelflow * Math.min(Ctl.get_control('throttle') + Ctl.get_idle_offset(), 1);

        /* Burn sensor */
        if(this.is_burn_sensor())
        {
            fuelflow = Math.min(fuelflow, Math.max(p.airflow * p.air_density, g.blades.min_airflow * this.af_ratio));
        }

        /* Thermal control */
        if(Ph.get_setting('thermal_control'))
        {
            var max_throttled_fuelflow = max_fuelflow * (1 - range(p.temp, g.blades.max_temp - this.get_setting('cooling_operating_offset') + this.get_setting('thermal_control_offset'), g.blades.max_temp));

            Indicator.set_indicator('thermal', fuelflow > max_throttled_fuelflow);

            fuelflow = Math.min(fuelflow, max_throttled_fuelflow);
        }

        var injection_wear = fuelflow / g.injection.max_fuelflow;

        if(this.is_opt('filter_fuel'))
        {
            var filter_fuel_limit = g.filter_fuel.max_fuelflow * this.get_condition('filter_fuel');

            if(filter_fuel_limit < fuelflow)
            {
                Indicator.set_indicator('filter_fuel', 1);
            }
            else
            {
                Indicator.set_indicator('filter_fuel', 0);
            }

            fuelflow = Math.min(fuelflow, filter_fuel_limit);

            this.drain_health('filter_fuel', max_fuelflow / g.filter_fuel.max_fuelflow);

            injection_wear *= 1 - g.filter_fuel.eff;
        }

        fuelflow = Math.min(g.tank.fluid, fuelflow);
        this.drain_health('injection', injection_wear);

        if(!Game.get_debug('fuel'))
        {
            g.tank.fluid -= fuelflow;
        }

        var air_density = Region.get_prop('air_density');

        /* Compressor */
        if(this.is_opt('compressor') && p.airflow)
        {
            // Experimental
            var boost = Math.min((p.burned - p.afterburner_burned) * g.compressor.boosted_airflow_per_burned * air_density, g.compressor.max_boosted_airflow);

            this.drain_health('compressor', boost / g.compressor.max_boosted_airflow);

            boost *= this.get_condition('compressor');

            var compressor_density = boost / p.airflow;

            if(compressor_density > air_density)
            {
                air_density = compressor_density;
            }
        }

        /* Combustion */
        var intake_temp = p.temp;

        Indicator.set_indicator('heater', 0);

        if(this.is_opt('heater') && p.burned)
        {
            var heater_amount = Math.min(Region.get_prop('ambient_temp') + g.heater.max_heat - p.temp, g.heater.max_heat);

            heater_amount *= Math.min(g.heater.max_airflow / (p.airflow * p.air_density) * this.get_condition('heater'), 1);

            if(heater_amount > 0)
            {
                intake_temp += heater_amount;

                this.drain_health('heater', 1);

                Indicator.set_indicator('heater', 1);
            }
        }

        var combustion_quality = g.injection.eff * this.get_condition('injection');
        combustion_quality *= this.append_combustion_quality_by_temp(intake_temp);

        if(this.is_opt('filter_intake'))
        {
            var filter_intake_limit = g.filter_intake.max_airflow * this.get_condition('filter_intake');

            this.drain_health('filter_intake', p.airflow * air_density / g.filter_intake.max_airflow);

            var filter_max_air_density = filter_intake_limit / p.airflow * air_density;

            if(filter_max_air_density < air_density)
            {
                Indicator.set_indicator('filter_intake', 1);
            }
            else
            {
                Indicator.set_indicator('filter_intake', 0);
            }

            air_density = Math.min(air_density, filter_max_air_density);
        }

        var burned = Math.min(p.airflow * air_density, fuelflow * this.af_ratio) * combustion_quality * this.get_condition('blades');

        if(p.airflow < g.blades.min_airflow)
        {
            burned = 0;
        }

        if(Ctl.get_control('thrust'))
        {
            burned = Math.min(burned, g.exhaust.max_thrust);
        }

        var blades_load = fuelflow * this.af_ratio / g.blades.max_airflow;

        var catastrofic_chance = this.get_catastrofic_failure_rate_by_temp(intake_temp) / blades_load;

        if(chance(1/catastrofic_chance))
        {
            g.blades.h /= 2;
            g.blades.h_age /= 2;
        }

        var blades_wear = blades_load * this.get_wear_multiplier_by_temp(intake_temp);

        this.drain_health('blades', blades_wear);

        if(p.temp > g.blades.max_temp)
        {
            this.drain_health('blades', (p.temp - g.blades.max_temp) / 100000 * (fuelflow * this.af_ratio / g.blades.max_airflow) * g.blades.h_max);
        }

        /* Combustion gas spinning turbine */
        airflow_gain += burned * this.blades_airflow_per_burned;

        airflow_gain -= p.airflow / this.airflow_inertia;

        /* Combustion to heat */
        var thermal_inertia = this.get_thermal_inertia();
        var temp_increase = burned / thermal_inertia;

        if(temp_increase > 0)
        {
            p.temp += temp_increase;
        }
        else if(p.temp > Region.get_prop('ambient_temp'))
        {
            p.temp -= 0.01;
        }

        /* Cooling */
        var max_cooling_eff = Math.min(g.cooling.max_cooling, g.cooling.cooling_per_speed * client.session.speed) * this.get_condition('cooling');

        var run_temp = g.blades.max_temp - this.get_setting('cooling_operating_offset') + this.get_setting('cooling_offset');
        var run_temp_lo = run_temp - (this.get_setting('cooling_range') / 2);
        var run_temp_hi = run_temp + (this.get_setting('cooling_range') / 2);

        var cooling_ctl = range(p.temp, run_temp_lo, run_temp_hi);

        /* Exhaust energy used on other things than thrust */
        var burned_losses = 0;

        if(this.is_opt('egr') && p.burned && p.temp < run_temp_lo * 0.9 )
        {
            var egr_eff = (Math.min(burned, g.egr.max_burned) / thermal_inertia) * this.get_condition('egr');

            this.drain_health('egr', burned / g.egr.max_burned);

            p.temp += egr_eff;
        }

        /**/
        if(this.is_opt('cooling_fan') && max_cooling_eff < g.cooling_fan.max_cooling && cooling_ctl > 0 && fuelflow)
        {
            var cooling_fan_eff = g.cooling_fan.max_cooling;

            this.drain_health('cooling_fan', cooling_fan_eff / g.cooling_fan.max_cooling);

            cooling_fan_eff *= this.get_condition('cooling_fan');

            max_cooling_eff = Math.max(max_cooling_eff, cooling_fan_eff);

            /*
                Since cooling fan technically blows through existing cooling system. It would make no sense to not include its condition
            */
            max_cooling_eff = Math.min(max_cooling_eff, g.cooling.max_cooling * this.get_condition('cooling'));

            if(cooling_fan_eff)
            {
                Indicator.set_indicator('cooling_fan', 1);
            }
            else
            {
                Indicator.set_indicator('cooling_fan', 0);
            }
        }
        else
        {
            Indicator.set_indicator('cooling_fan', 0);
        }

        var cooling_eff = max_cooling_eff * cooling_ctl;
        this.drain_health('cooling', cooling_eff / g.cooling.max_cooling);


        if(p.temp > Region.get_prop('ambient_temp'))
        {
            p.temp -= cooling_eff / thermal_inertia;
        }

        /* Water Injection */
        var cooling_water_use = false;
        if(this.is_opt('cooling_water'))
        {
            var max_cooling_air = max_cooling_eff;

            max_cooling_eff += Math.min(g.cooling_water.max_cooling * this.get_condition('cooling_water'), g.cooling_water.fluid);

            var cooling_water_eff = g.cooling_water.max_cooling * cooling_ctl;

            if(p.burned && cooling_ctl && (!this.get_setting('cooling_water_ondemand') || max_cooling_air < p.burned))
            {
                cooling_water_eff = Math.min(cooling_water_eff, g.cooling_water.fluid);

                g.cooling_water.fluid -= cooling_water_eff;

                this.drain_health('cooling_water', cooling_water_eff / g.cooling_water.max_cooling);

                cooling_water_eff *= this.get_condition('cooling_water');

                p.temp -= cooling_water_eff / thermal_inertia;

                cooling_water_use = true;
            }
        }

        Indicator.set_indicator('cooling_water_use', cooling_water_use);

        /* Afterburner */
        if(this.is_opt('afterburner') && Ctl.get_control('thrust') && Ctl.get_control('afterburner') && Ctl.get_control('throttle'))
        {
            //var remaining_air = Math.max(p.airflow * air_density - fuelflow * this.af_ratio, 0);
            var remaining_air = Math.max(p.airflow * air_density - (p.burned - p.afterburner_burned), 0);

            if(this.is_burn_sensor())
            {
                var afterburner_fuelflow = Math.min(remaining_air / this.af_afterburner_ratio, g.afterburner.max_fuelflow, g.tank.fluid);
            }
            else
            {
                var afterburner_fuelflow = Math.min(g.afterburner.max_fuelflow, g.tank.fluid);
            }

            this.drain_health('afterburner', afterburner_fuelflow / g.afterburner.max_fuelflow);

            g.tank.fluid -= afterburner_fuelflow;

            var afterburner_burnable = Math.min(afterburner_fuelflow, remaining_air);

            var afterburner_burned = afterburner_burnable * g.afterburner.eff * this.get_condition('afterburner');

            burned += afterburner_burned;

            burned = Math.min(burned, g.exhaust.max_thrust);
        }
        else
        {
            var afterburner_fuelflow = 0;
            var afterburner_burned = 0;
        }

        /* Combustion to thrust */
        var thrust = Math.max(burned - burned_losses, 0) * g.exhaust.eff * this.get_condition('exhaust');
        this.drain_health('exhaust', burned / g.exhaust.max_thrust * Ctl.get_control('thrust'));

        thrust *= Ctl.get_control('thrust');

        var speed_prev = client.session.speed;

        client.session.speed += this.get_speed_increase(thrust);

        client.session.speed -= this.get_speed_loss();

        p.speed_diff = client.session.speed - speed_prev;

        p.airflow += airflow_gain;

        /* Airflow */
        p.airflow = Math.min(p.airflow, g.blades.max_airflow);

        if(p.airflow < 0)
        {
            p.airflow = 0;
        }

        if(client.session.speed < 0)
        {
            client.session.speed = 0;
        }

        client.session.distance += client.session.speed;

        Stats.add('burned_fuel_distance', client.session.speed);
        Stats.add('burned_fuel', p.fuelflow);
        Stats.add('burned_fuel_total', p.fuelflow);
        Stats.add('burned_fuel_real_total', p.burned);

        if(client.session.stats.max_speed < client.session.speed)
        {
            client.session.stats.max_speed = client.session.speed;
        }

        //p.rpm_gain = rpm_gain;
        //p.airflow = airflow;
        p.fuelflow = fuelflow;
        p.burned = burned;
        p.thrust = thrust;
        p.max_cooling_eff = max_cooling_eff;
        p.cooling_ctl = cooling_ctl;
        p.air_density = air_density;
        p.afterburner_fuelflow = afterburner_fuelflow;
        p.afterburner_burned = afterburner_burned;
        p.burned_losses = burned_losses;
        p.catastrofic_chance = catastrofic_chance;
        p.blades_wear = blades_wear;
    },
};

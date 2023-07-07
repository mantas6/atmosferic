$.extend(client.config, {
    categories_types: [
        'exhaust',
        'cooling',
        'injection',
        'blades',
        'tank',
        'cargo',
        'starter',
        'radar',
        /* opt */
        'air_brake',
        'processor',
        'cooling_fan',
        'compressor',
        'afterburner',
        'burn_sensor',
        'egr',
        'lander',
        'heater',
        'cooling_water',
        'filter_fuel',
        'filter_intake',
    ],
    categories_init: {
        exhaust: {
            name: 'exhaust_standard',
            bin: 1,
        },
        cooling: {
            name: 'cooling_standard',
            bin: 1,
        },
        injection: {
            name: 'injection_mechanical',
            bin: 1,
        },
        blades: {
            name: 'blades_standard',
            bin: 1,
        },
        tank: {
            name: 'tank_standard',
            bin: 1,
        },
        cargo: {
            name: 'cargo_standard',
            bin: 1,
        },
        starter: {
            name: 'starter_standard',
            bin: 1,
        },
        radar: {
            name: 'radar_standard',
            bin: 1,
        },
        air_brake: {
            name: 'air_brake_standard',
            bin: 1,
        },
    },
    properties_icons: {
        weight: 'weight',
        cost: 'money-stack',
        h: 'tinker',
        h_max: 'tinker',
        size: 'covered-jar',
        max_fuelflow: 'water-fountain',
        max_thrust: 'thrust',
        max_airflow: 'tornado',
        max_boosted_airflow: 'tornado',
        min_airflow: 'tornado',
        max_burned: 'burning-dot',
        drag: 'wind-slap',
        max_drag: 'wind-slap',
        base_scale: 'radar-sweep',
        max_temp: 'thermometer-hot',
        eff: 'diagram',
        max_cooling: 'computer-fan',
        cooling_per_speed: 'computer-fan',
        opt: 'plug',
        range: 'rocket',
        fluid: 'speedometer',
        max_distance: 'radar-sweep',
    },
    categories_icons: {
        blades: 'gears',
        injection: 'syringe',
        tank: 'oil-drum',
        cooling: 'computer-fan',
        exhaust: 'jetpack',
        starter: 'spinning-top',
        cargo: 'wooden-crate',
        radar: 'radar-dish',
        air_brake: 'parachute',
        cooling_fan: 'twirly-flower',
        compressor: 'wind-turbine',
        afterburner: 'jet-pack',
        burn_sensor: 'stick-grenade',
        egr: 'test-tubes',
        lander: 'bubble-field',
        heater: 'light-bulb',
        cooling_water: 'scuba-tanks',
        filter_fuel: 'chemical-tank',
        filter_intake: 'virtual-marker',
        processor: 'processor',
    },
    categories_groups_icons: {
        all: 'backpack',
        standard: 'gears',
        opt: 'plug',
    },
    categories_groups: {
        standard: ['exhaust', 'cooling', 'injection', 'blades', 'tank', 'cargo', 'starter', 'radar'],
        opt: ['air_brake' ,'cooling_fan' ,'compressor' ,'afterburner' ,'burn_sensor' ,'egr' ,'lander' ,'heater' ,'cooling_water' ,'filter_fuel' ,'filter_intake', 'processor'],
    },
    categories_raw: function(cat_name)
    {
        var categories = {
            exhaust: [
                function(bin, cost)
                {
                    return {
                        name: 'exhaust_standard',
                        bin: cost / 1000,
                        cost: bin * 1000,
                        weight: 25,
                        eff: 0.6,
                        max_thrust: bin * 400,
                        h_max: 1.25e6,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'exhaust_eff',
                        bin: cost / 2000,
                        cost: bin * 2000,
                        weight: 50,
                        eff: 0.9,
                        max_thrust: bin * 400,
                        h_max: 1.25e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'exhaust_eff'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'exhaust_mil',
                        bin: cost / 5000,
                        cost: bin * 5000,
                        weight: 60,
                        eff: 0.95,
                        max_thrust: bin * 400,
                        h_max: 2e6,
                        unique: true,
                        skip: true,
                    };
                },
            ],
            cooling: [
                function(bin, cost)
                {
                    return {
                        name: 'cooling_standard',
                        bin: cost / 1500,
                        cost: bin * 1500,
                        weight: 10,
                        max_drag: 0.01,
                        max_cooling: bin * 400,
                        cooling_per_speed: 1 + 0.004 * bin,
                        h_max: 1.25e6,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'cooling_eff',
                        bin: cost / 3000,
                        cost: bin * 3000,
                        weight: 10,
                        max_drag: 0.02,
                        max_cooling: bin * 400,
                        cooling_per_speed: 1 + 0.04 * bin,
                        h_max: 1.25e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_eff'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'cooling_mil',
                        bin: cost / 3000,
                        cost: bin * 3000,
                        weight: 10,
                        max_drag: 0.015,
                        max_cooling: bin * 400,
                        cooling_per_speed: 1 + 0.016 * bin,
                        h_max: 2e6,
                        unique: true,
                        skip: true,
                    };
                },
            ],
            injection: [
                function(bin, cost)
                {
                    return {
                        name: 'injection_mechanical',
                        bin: cost / 3000,
                        cost: bin * 3000,
                        weight: 5,
                        max_fuelflow: bin * 400,
                        eff: 0.65,
                        h_max: 1.25e6,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'injection_electronic',
                        bin: cost / 6000,
                        cost: bin * 6000,
                        weight: 4,
                        max_fuelflow: bin * 400,
                        eff: 0.85,
                        h_max: 1.2e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'injection_electronic'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'injection_piezoelectric',
                        bin: cost / 12000,
                        cost: bin * 12000,
                        weight: 4,
                        max_fuelflow: bin * 400,
                        eff: 0.9,
                        h_max: 1.15e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'injection_piezoelectric'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'injection_mil',
                        bin: cost / 50000,
                        cost: bin * 50000,
                        weight: 5,
                        max_fuelflow: bin * 400,
                        eff: 0.87,
                        h_max: 2e6,
                        unique: true,
                        skip: true,
                    };
                },
            ],
            blades: [
                function(bin, cost)
                {
                    return {
                        name: 'blades_standard',
                        bin: cost / 5000,
                        cost: bin * 5000,
                        weight: 200,
                        max_airflow: bin * 400,
                        min_airflow: bin * 50,
                        max_temp: 1000,
                        h_max: 1.25e6,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'blades_eff',
                        bin: cost / 7500,
                        cost: bin * 7500,
                        weight: 200,
                        max_airflow: bin * 400,
                        min_airflow: bin * 50,
                        max_temp: 1200,
                        h_max: 1.2e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'blades_eff'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'blades_mil',
                        bin: cost / 9500,
                        cost: bin * 9500,
                        weight: 180,
                        max_airflow: bin * 400,
                        min_airflow: bin * 50,
                        max_temp: 1100,
                        h_max: 2e6,
                        unique: true,
                        skip: true,
                    };
                },
            ],
            tank: [
                function(bin, cost)
                {
                    return {
                        name: 'tank_standard',
                        bin: cost / 1000,
                        cost: bin * 1000,
                        weight: 10,
                        drag: 0.1,
                        size: 2 * bin * 1e7,
                        fluid: 0,
                    };
                },
            ],
            cargo: [
                function(bin, cost)
                {
                    return {
                        name: 'cargo_standard',
                        bin: root(cost, 2) / 2000,
                        cost: 2000 * pow(bin, 1.5),
                        weight: 100,
                        drag: 0.04,
                        size: 2500 + 500 * bin,
                    };
                },
            ],
            starter: [
                function(bin, cost)
                {
                    return {
                        name: 'starter_standard',
                        bin: cost / 1100,
                        cost: bin * 1100,
                        weight: 5,
                        max_airflow: bin * 50,
                        h_max: 4000,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'starter_h',
                        bin: cost / 3000,
                        cost: bin * 3000,
                        weight: 8,
                        max_airflow: bin * 50,
                        h_max: 8000,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'starter_h'),
                    };
                },
            ],
            radar: [
                function(bin, cost)
                {
                    return {
                        name: 'radar_standard',
                        bin: cost / 1000,
                        cost: bin * 1000,
                        weight: 2,
                        drag: 0.1,
                        base_scale: bin * 1e7,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'radar_low_profile',
                        bin: cost / 2500,
                        cost: bin * 2500,
                        weight: 4,
                        drag: 0.01,
                        base_scale: bin * 1e7,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'radar_low_profile'),
                    };
                },
            ],
            air_brake: [
                function(bin, cost)
                {
                    return {
                        name: 'air_brake_standard',
                        opt: true,
                        bin: cost / 3000,
                        cost: bin * 3000,
                        weight: 10,
                        max_thrust: 400 * bin,
                        eff: 10,
                        h_max: 1e4,
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'air_brake_eff',
                        opt: true,
                        bin: cost / 8000,
                        cost: bin * 8000,
                        weight: 20,
                        max_thrust: 400 * bin,
                        eff: 20,
                        h_max: 1e4,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'air_brake_eff'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'air_brake_mil',
                        opt: true,
                        bin: cost / 12000,
                        cost: bin * 12000,
                        weight: 20,
                        max_thrust: 400 * bin,
                        eff: 30,
                        h_max: 2e4,
                        unique: true,
                        skip: true,
                    };
                },
            ],
            cooling_fan: [
                function(bin, cost)
                {
                    return {
                        name: 'cooling_fan_standard',
                        opt: true,
                        bin: cost / 1500,
                        cost: bin * 1500,
                        weight: 50,
                        max_cooling: 20 * bin,
                        h_max: 1.25e5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_fan_standard'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'cooling_fan_h',
                        opt: true,
                        bin: cost / 4000,
                        cost: bin * 4000,
                        weight: 60,
                        max_cooling: 20 * bin,
                        h_max: 2.5e5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_fan_h'),
                    };
                },
            ],
            compressor: [
                function(bin, cost)
                {
                    return {
                        name: 'compressor_standard',
                        opt: true,
                        bin: cost / 2000,
                        cost: bin * 2000,
                        weight: 20,
                        max_boosted_airflow: 400 * bin,
                        boosted_airflow_per_burned: 2,
                        h_max: 1.25e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'compressor_standard'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'compressor_induction',
                        opt: true,
                        bin: cost / 8000,
                        cost: bin * 8000,
                        weight: 100,
                        max_boosted_airflow: 400 * bin,
                        boosted_airflow_per_burned: 3,
                        h_max: 1.25e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'compressor_induction'),
                    };
                },
            ],
            afterburner: [
                function(bin, cost)
                {
                    return {
                        name: 'afterburner_standard',
                        opt: true,
                        bin: cost / 3500,
                        cost: bin * 3500,
                        weight: 25,
                        max_fuelflow: 200 * bin,
                        eff: 0.5,
                        h_max: 1.25e5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'afterburner_standard'),
                    };
                },
            ],
            burn_sensor: [
                function(bin, cost)
                {
                    return {
                        name: 'burn_sensor_standard',
                        opt: true,
                        bin: cost / 1500,
                        cost: bin * 1500,
                        weight: 1,
                        max_burned: 400 * bin,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'burn_sensor_standard'),
                    };
                },
            ],
            egr: [
                function(bin, cost)
                {
                    return {
                        name: 'egr_standard',
                        opt: true,
                        bin: cost / 2000,
                        cost: bin * 2000,
                        weight: 5,
                        max_burned: 400 * bin,
                        h_max: 1.25e5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'egr_standard'),
                    };
                },
            ],
            lander: [
                function(bin, cost)
                {
                    return {
                        name: 'lander_standard',
                        opt: true,
                        bin: cost / 8000,
                        cost: bin * 8000,
                        range: 2e5 + 2000 * bin,
                        weight: 5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'lander_standard'),
                    };
                },
            ],
            heater: [
                function(bin, cost)
                {
                    return {
                        name: 'heater_standard',
                        opt: true,
                        bin: cost / 1500,
                        cost: bin * 1500,
                        max_heat: 100,
                        max_airflow: bin * 100,
                        weight: 10,
                        h_max: 1e5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'heater_standard'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'heater_heat',
                        opt: true,
                        bin: cost / 5000,
                        cost: bin * 5000,
                        max_heat: 150,
                        max_airflow: bin * 80,
                        weight: 10,
                        h_max: 1e5,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'heater_heat'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'heater_mil',
                        opt: true,
                        bin: cost / 15000,
                        cost: bin * 15000,
                        max_heat: 175,
                        max_airflow: bin * 70,
                        weight: 10,
                        h_max: 1.5e5,
                        unique: true,
                        skip: true,
                    };
                },
            ],
            cooling_water: [
                function(bin, cost)
                {
                    return {
                        name: 'cooling_water_standard',
                        opt: true,
                        bin: cost / 3000,
                        cost: bin * 3000,
                        max_cooling: bin * 400,
                        weight: 50,
                        h_max: 1.25e6,
                        size: bin * 2e7,
                        fluid: bin * 2e7,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_water_standard'),
                    };
                },
                function(bin, cost)
                {
                    return {
                        name: 'cooling_water_capacity',
                        opt: true,
                        bin: cost / 5000,
                        cost: bin * 5000,
                        max_cooling: bin * 400,
                        weight: 50,
                        h_max: 1.25e6,
                        size: bin * 4e7,
                        fluid: bin * 4e7,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'cooling_water_capacity'),
                    };
                },
            ],
            filter_fuel: [
                function(bin, cost)
                {
                    return {
                        name: 'filter_fuel_standard',
                        opt: true,
                        bin: cost / 1000,
                        cost: bin * 1000,
                        max_fuelflow: bin * 400,
                        weight: 5,
                        eff: 0.5,
                        h_max: 1e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'filter_fuel_standard'),
                    };
                },
            ],
            filter_intake: [
                function(bin, cost)
                {
                    return {
                        name: 'filter_intake_standard',
                        opt: true,
                        bin: cost / 1000,
                        cost: bin * 1000,
                        max_airflow: bin * 400,
                        weight: 5,
                        eff: 0.5,
                        h_max: 1e6,
                        skip: !Comm.call_group_method({group: 'invest'}, 'has', 'filter_intake_standard'),
                    };
                },
            ],
            processor: [
                function(bin, cost)
                {
                    return {
                        name: 'processor_standard',
                        opt: true,
                        bin: cost / 10000,
                        cost: bin * 10000,
                        max_distance: bin * 100e6,
                    };
                },
            ],
        };

        return categories[cat_name];
    },
});

client.lang = {
    game: {
        settings: 'Settings',
        reset: {
            title: 'Game Reset',
            info: 'Reset your save game? Auto and landing saves will be deleted.',
        },
        distance: 'Distance',
        fuel_economy: 'Fuel economy',
        travelled: 'Total travelled',
        travelling: 'Travel',
        money: 'Money',
        finances: 'Finances',
        speed: 'Current speed',
        ok: 'OK',
        cancel: 'Cancel',
        saved: 'Saved',
        not_saved: 'Not saved',
        save_not_available: 'Saving not available',
        on: 'On',
        off: 'Off',
        fuel: 'Fuel',
        temp: 'Temp',
        fuel_left: 'Fuel left',
        fuel_left: 'Fuel left',
        fuel_left_distance_avg: 'Est. dist. avg.',
        fuel_left_distance: 'Est. distance',
        fuel_left_time: 'Est. time',
        speed_diff_label: 'Acceleration',
        airflow: 'Airflow',
        total_weight: 'Total ship weight',
        total_drag: 'Total ship aerodynamic drag',
        throttle_full: 'Full',
        throttle_none: 'None',
        throttle_idle: 'Idle',
        save_slot: 'Slot',
        empty_slot: 'Empty',
        loading: 'Loaded',
        yes: 'Yes',
        close: 'Close',
        menu: 'Menu',
        stats: 'Stats',
        delete_slot_action: {
            title: 'Delete savegame',
            info: 'Do you really want to delete this saved game?',
        },
        overwrite_slot_action: {
            title: 'Overwrite savegame',
            info: 'Old savegame will be overwritten. Do you really want to save to this slot?',
        },
        slots: {
            auto: 'Autosave',
            land: 'Landing',
            slot_1: 'Slot I',
            slot_2: 'Slot II',
            slot_3: 'Slot III',
        },
        slots_info: {
            auto: 'Autosaves every minute',
            land: 'Autosaves every landing',
        },
    },
    stats: {
        stats: 'Stats',
        show_stats: 'Show stats',
        name: 'Name',
        value: 'Value',
        types: {
            used_fuel: {
                name: 'Used fuel',
                desc: 'Total used fuel by the jet',
            },
            burned_fuel: {
                name: 'Burned fuel',
                desc: 'Total burned fuel by the jet',
            },
            burned_eff: {
                name: 'Fuel efficiency',
                desc: 'How efficiently fuel was burnt',
            },
            deliveries_count: {
                name: 'Total deliveries',
                desc: 'Total count of deliveries delivered',
            },
            deliveries_income: {
                name: 'Total deliveries income',
                desc: 'Total income of deliveries delivered',
            },
            deliveries_avg_wage: {
                name: 'Avg. delivery wage',
                desc: 'Average wage of deliveries per station stop',
            },
            time_in_game: {
                name: 'Game time passed',
                desc: 'Game time',
            },
            time_in_game_real: {
                name: 'Time passed in-game',
                desc: 'Real world time',
            },
            max_speed: {
                name: 'Maximum speed',
                desc: 'Maximum reached speed',
            },
        },
    },
    settings: {
        title: 'Title',
        game: 'Game',
        save: 'Save',
        reset: 'Reset',
        pause: 'Pause',
        paused: 'Unpause',
        save_slot: 'Save',
        load_slot: 'Load',
        delete_slot: 'Delete',
        version: 'Version',
        branch: 'Branch',
        created_by: 'Created by',
        critical_error: 'Ooops! Unrecoverable game error has occured. Save game might be permanently damaged.',
        critical_load: 'Load last save',
        critical_reset: 'Reset the game',
        branches: {
            stable: 'Stable',
            unstable: 'Unstable',
        },
    },
    services: {
        services: 'Services',
        loans: {
            loans: 'Loans',
            return_info: 'Loans are returned when turning in deliveries. You must carry at least one delivery to take loans.',
            pay_all: 'Pay all for',
            taken: 'Taken',
            debt: 'Debt',
            interest: 'Interest is',
            take_debt: 'Click to loan money',
            pay_info: 'Loan repay',
            income_info: 'Loan income',
            take_info: {
                not_enough_value: 'Not enough value in deliveries',
            },
        },
        taxes: {
            taxes: 'Taxes',
            info: 'All the taxes are summed here.',
            payed: 'Payed',
            pay: 'Pay the taxes',
            limit_info: 'Some services might not be available when limit is reached',
            over_limit: 'Taxes limit reached. Service disabled',
            new_tax: 'Tax added:',
            pay_info: {
                not_enough_money: 'Not enough money',
                amount_error: 'Amount error',
            },
            names: {
                land: 'Landing',
                inspection: 'Inspection',
                licence: 'Cargo Licence',
                inspection_miss: 'Inspection miss',
                exam_course: 'Exam',
            },
        },
        recovery: {
            title: 'Recovery',
            recover: 'Recover to nearest station',
            info: 'You will be recovered to the next nearest station for this cost. Cost will be higher if ship is not stationary',
            recovered: 'Recovered successfuly',
            recover_title: 'Ship recovery',
            recover_info: 'Recover your ship to the nearest station for {cost}?',
            recover_cost_info: 'Ship recovery',
            recover_speed_info: 'Recover your ship to the nearest station for {cost}? Recovery cost is increased to due ship not being stationary.',
        },
    },
    inventory: {
        inventory: 'Inventory',
        category: 'Category',
        buy: 'Buy',
        buy_for: 'Buy for',
        name: 'Name',
        value: 'Value',
        condition: 'Condition',
        fluid: 'Fluid',
        na: 'N/A',
        bought: 'Added to your inventory',
        shop: 'Station shop',
        ship: 'Your ship',
        info: 'Information',
        show_all: 'Show all',
        show_unique: 'Show unique',
        full_cost: 'Full cost',
        no_shop_items: 'No items available for sale',
        shop_show: 'Shop',
        shop_show_item: 'Shop for this',
        cats_show: 'Ship',
        cats_show_item: 'All parts',
        shop_explain: `Item shops are only available at stations. Upgrade your ship's speed, durability or cargo capacity. You have to land in the station that has shop. Then all the available parts will be listed here.`,
        unique: {
            info: 'Unique item',
        },
        buy_dialog: {
            title: 'Buy item',
            info: 'Buy {name} for {cost}?',
        },
        take_dialog: {
            title: 'Take item',
            info: 'Take {name} for free?',
        },
        repair: {
            repair: 'Repair for ',
            repair_all: {
                action: 'Repair all',
                title: 'Repair all',
                info: 'Do your really want to repair all the parts? This will cost {cost}.',
            },
            item_repair: 'Item repair',
            repair_title: 'Repair item',
            repair_info: 'Repair selected item for {cost}?',
            repaired: 'Repaired',
            min_repair: 'Too damaged',
            repair_action_info: {
                cost: 'Not enough money',
                too_damaged: 'Too damaged',
                in_space: 'Only when landed',
            },
        },
        opt: {
            info: 'Optional item',
            sell: 'Sell item for',
            remove: 'Remove',
            remove_title: 'Removing optional item',
            remove_discard_info: 'Item will be discarded. Removing this item might cause malfunction of certain systems. Continue?',
            remove_sell_info: 'Item will be removed and selled for {value}. Continue?',
        },
        order: {
            order_open: 'Order similar part',
        },
        recommended: {
            info: 'Recommended item',
        },
        condition_states: {
            critical: 'Service immediately',
            warning: 'Service needed soon',
            ok: 'Good condition',
        },
        condition_short: {
            critical: 'Critical',
            replace: 'Replace',
            service: 'Service',
            ok: 'Norminal',
        },
        buy_info: {
            match: 'Already bought',
            cost: 'Not enough money',
            cargo_size: 'Your cargo does not fit',
        },
        types: {
            cargo: 'Cargo Module',
            blades: 'Jet Assembly',
            cooling: 'Cooling System',
            exhaust: 'Propelling',
            injection: 'Injection',
            starter: 'Starter blower',
            tank: 'Fuel tank',
            radar: 'Space radar',
            air_brake: 'Air brake',
            cooling_fan: 'Cooling fan',
            compressor: 'Compressor',
            afterburner: 'Afterburner',
            burn_sensor: 'Combustion sensor',
            egr: 'EGR',
            lander: 'Landing system',
            heater: 'Intake heater',
            cooling_water: 'Water Injection',
            filter_fuel: 'Fuel purifier',
            filter_intake: 'Intake filter',
            processor: 'Autopilot Processor',
        },
        groups: {
            all: 'All',
            standard: 'Standard',
            opt: 'Optional',
        },
        types_desc: {
            cargo: 'Cargo storage for deliveries',
            cooling: 'Removes heat from the engine. Relies on ship speed to dissapate heat',
            blades: 'Main jet assembly. Defines power characteristics',
            exhaust: 'Used to convert burned gas pressure into thrust',
            injection: 'Defines how much fuel is injected into the combustion chamber',
            starter: 'Allows starting the jet',
            tank: 'Stores fuel',
            radar: 'Used to get coordinates of nearby space objects',
            air_brake: 'Uses thrust output to slow the ship down. Does it at a much higher rate than exhaust system alone',
            cooling_fan: 'Provides minumum cooling flow even if ship is stopped or flying slowly',
            compressor: 'Pressurizes intake air, allowing more volume to pass through.',
            afterburner: 'Injects fuel just before exhaust nozzle, uses unburnt air. Offers high thrust, while having no heat displaced into the chassis. Very higher fuel usage',
            burn_sensor: 'Measures amount of air left in the exhaust and automatically modulates injected amount to prevent unburned fuel. Works for afterburners as well',
            egr: `Exhaust gas recirculation system reuses exhaust gases to help jet reach it's operating temperature faster. Turns off once engine is warm`,
            lander: `Helps ship to approach landing farther from the target. Useful for big and fast ships`,
            heater: 'Preheats intake air. Aids to start the cold jet, mostly effective in low temperature enviroments',
            cooling_water: 'Injects water into the jet for additional heat dissapation',
            filter_fuel: 'Purifies and filters fuel before passing it to the injection system. Increases lifespan of injectors',
            filter_intake: 'Filters intake air before entering the engine. Increases engine lifespan',
            processor: 'Automatically executes all needed actions except ship part upgrades.',
        },
        warnings: {
            exhaust: {
                restrict: 'Engine can possiblity burn up to {max_burned} while exhaust maximum flow is {max_thrust}. Therefore exhaust could restrict jet airflow. Upgrade if necessary.',
            },
            blades: {
                unburnt: 'Injection system can burn up to {max_fuelflow}, while jet can only supply {max_flow}. This may result in unburnt fuel. Upgrade if necessary.',
            },
            cooling: {
                overheat: 'Engine can possiblity burn up to {max_burned} and cooling system can only dissapate up to {max_cooling}. Upgrade if necessary.',
            },
            compressor: {
                max_boosted: 'Engine can possiblity burn up to {max_burned}, but compressor can only boost up to {max_boosted_airflow}. This does not limit power in any way, only compressor has no advantage.',
            },
            air_brake: {
                max_thrust: `Ship can produce up to {max_thrust} thrust, while air brake only supports up to {item_thrust}. This does not limit braking in any way, but air brake can be upgraded to have better braking performance.`,
            },
            egr: {
                max_thrust: `Ship can burn up to {max} fuel, while EGR only supports up to {item}. This does not limit performance in any way, however EGR won't be as effective.`,
            },
            filter_fuel: {
                max_fuelflow: `Ship's injection system can require up to {max} fuelflow, but fuel purifier is only limited to {item}. Maximum engine's performance might be reduced.`,
            },
            filter_intake: {
                max_airflow: `Ship's engine can require up to {max} airflow, but intake filter is only limited to {item}. Maximum engine's performance might be reduced.`,
            },
            burn_sensor: {
                max_thrust: `Ship can produce up to {max_thrust} thrust, while combustion sensor only supports up to {item_thrust}. This does not limit performance in any way, but combustion sensor might take a wrong reading when operation outside the range.`,
            },
            starter: {
                min_airflow: `Engine requires at least {min_airflow} airflow to run. But starter can only produce up to {max_airflow_starter} airflow. Jet might not able to start. Upgrade if necessary.`,
            },
        },
        properties: {
            name: {
                title: 'Name',
                desc: '',
            },
            cost: {
                title: 'Cost',
                desc: 'Value of the item',
            },
            weight: {
                title: 'Weight',
                desc: 'Weight increases ships inertia',
            },
            drag: {
                title: 'Aerodynamic drag',
                desc: 'Airfriction speed loss',
            },
            max_drag: {
                title: 'Maximum aerodynamic drag',
                desc: 'Peak airfriction when system is utilized fully',
            },
            h_max: {
                title: 'Durability',
                desc: 'Overral burability',
            },
            h: {
                title: 'Condition',
                desc: 'Current condition of the item',
            },
            eff: {
                title: 'Effectiveness',
                desc: 'Defines resource efficiency of operation',
            },
            size: {
                title: 'Capacity',
                desc: 'Fluid capacity',
                cargo: {
                    desc: 'Amount of cargo weight that can be carried',
                },
            },
            fluid: {
                title: 'Fluid left',
                desc: 'Fluid that is in the tank',
            },
            max_fuelflow: {
                title: 'Maximum fuelflow',
                desc: 'Maximum fuel flow at the time',
            },
            max_airflow: {
                title: 'Maximum airflow',
                desc: 'Maximum airflow at the time',
            },
            min_airflow: {
                title: 'Minimum airflow',
                desc: 'Minimum airflow required to start fire',
            },
            max_boosted_airflow: {
                title: 'Maximum airflow',
                desc: 'Maximum airflow that compressor can induce',
            },
            boosted_airflow_per_burned: {
                title: 'Airflow induction capability',
                desc: 'Determines how much airflow is induced from the exhaust gases',
            },
            max_burned: {
                title: 'Maximum burned fuel',
                desc: 'Maximum burned fuel that sensor can correcly measure',
            },
            max_distance: {
                title: 'Maximum distance',
                desc: 'Maximum distance between stations that autopilot can pickup',
            },
            max_cooling: {
                title: 'Maximum cooling',
                desc: 'Maximum heat dissipation capability',
            },
            cooling_per_speed: {
                title: 'Cooling per speed',
                desc: 'Heat dissipation effectiveness per ship speed',
            },
            max_temp: {
                title: 'Maximum temperature',
                desc: 'Melting temperature of the component',
            },
            max_thrust: {
                title: 'Max thrust',
                desc: 'Maximum exhaust flow. Translates directly to airflow',
            },
            power: {
                title: 'Power',
                desc: 'Airflow induction capability',
            },
            base_scale: {
                title: 'Maximum range',
                desc: 'Maximum range that can be scanned',
            },
            opt: {
                title: 'Optional item',
                desc: `Item is not required of ship systems to function, but it may add some benefits to it's operation`,
            },
            range: {
                title: 'Landing range',
                desc: 'Determins how close to the station ship has to be in order to start landing procedure.',
            },
            max_heat: {
                title: 'Maximum heat',
                desc: 'Peak temperature difference from the ambient that can be increased.',
            },
        },
        items: {
            injection_mechanical: {
                title: 'Mechanical Injection',
                desc: 'Mechanical injectors are cheap to manufacture due to their low complexity. Simple design requires relatively small amount of maintenance',
            },
            injection_electronic: {
                title: 'Electronic Injection',
                desc: 'Electronic injection system operates at a higher fuel pressure. Therefore fuel efficiency is higher. However, due to higher complexity it requires more maintenance',
            },
            injection_piezoelectric: {
                title: 'Piezoelectric Injection',
                desc: `Piezoelectric injection system offers even higher fuel efficiency due to it's high precision. In return requires even more maintenance than standard electronic injection systems`,
            },
            injection_mil: {
                title: 'Military Grade Injection',
                desc: `Modern electronic military grade injection with very rare materials offers high efficiency and exceptional durablity`,
            },
            cooling_standard: {
                title: 'Standard Cooling Solution',
                desc: 'An cost effective cooling solution',
            },
            cooling_eff: {
                title: 'High Effectiveness Cooling Solution',
                desc: 'Cooling system with increased effictiveness per speed. Has higher drag',
            },
            cooling_mil: {
                title: 'Military Cooling Solution',
                desc: 'Military optimized cooling system with increased effictiveness per speed and durability',
            },
            exhaust_standard: {
                title: 'Standard Exhaust Nozzle',
                desc: 'A middle of the road thrust converter',
            },
            exhaust_eff: {
                title: 'Efficiency Exhaust Nozzle',
                desc: 'Exhaust system using premium materials. Has efficiency gains while maintaining same durability and weight',
            },
            exhaust_mil: {
                title: 'Military Exhaust Nozzle',
                desc: 'Exhaust system using military-grade materials. Significant efficiency and durability gains',
            },
            blades_standard: {
                title: 'Standard Jet Engine',
                desc: 'Jet engine for civil ships',
            },
            blades_eff: {
                title: 'Efficiency Jet Engine',
                desc: 'Jet with an increased operating temperature. Makes burning more efficient while sacrificing a slight downgrade in durability',
            },
            blades_mil: {
                title: 'Military Jet Engine',
                desc: 'Military oriented jet engine with slightly increased efficieny and exceptional durability',
            },
            tank_standard: {
                title: 'Standard fuel tank',
                desc: 'Fuel tank for spaceships',
            },
            cargo_standard: {
                title: 'Standard cargo module',
                desc: `Module for cargo. This module adds a considerable amount of weight to the ship. Make sure that your ship's engine is sufficient.`,
            },
            starter_standard: {
                title: 'Standard starter',
                desc: 'Induces airflow for jet starting',
            },
            starter_h: {
                title: 'High durability starter',
                desc: 'Has increased lifespan',
            },
            radar_standard: {
                title: 'Standard radar',
                desc: 'Offers high range scanning',
            },
            radar_low_profile: {
                title: 'Low profile radar',
                desc: 'Has reduced air friction while maintaining the same range',
            },
            cooling_fan_standard: {
                title: 'Standard Cooling Fan',
                desc: 'Cools engine at low speeds and prevents overheating. Automatic engagement',
            },
            cooling_fan_h: {
                title: 'Durability Cooling Fan',
                desc: 'Increased durablity. Built for prolonged operation periods',
            },
            air_brake_standard: {
                title: 'Standard Air Brake',
                desc: 'Standard quality',
            },
            air_brake_eff: {
                title: 'Efficiency Air Brake',
                desc: 'Increased effectiveness',
            },
            air_brake_mil: {
                title: 'Military Air Brake',
                desc: 'Exceptional effectiveness and durability',
            },
            compressor_standard: {
                title: 'Standard Compressor',
                desc: 'Standard quality',
            },
            compressor_induction: {
                title: 'High Induction Compressor',
                desc: 'Standard quality',
            },
            afterburner_standard: {
                title: 'Standard Afterburner',
                desc: 'Standard quality',
            },
            burn_sensor_standard: {
                title: 'Standard Combustion sensor',
                desc: 'Standard quality',
            },
            egr_standard: {
                title: 'Standard EGR',
                desc: 'Standard quality',
            },
            lander_standard: {
                title: 'Standard Landing System',
                desc: 'Increases landing distance. Makes landing easier',
            },
            heater_standard: {
                title: 'Standard Intake Heater',
                desc: 'Standard quality',
            },
            heater_heat: {
                title: 'High Power Intake Heater',
                desc: 'Increased heat output. Suitable for very cold enviroments',
            },
            heater_mil: {
                title: 'Military Intake Heater',
                desc: 'Exceptional heat output. Suitable for very cold enviroments',
            },
            cooling_water_standard: {
                title: 'Standard Water Injection',
                desc: 'Standard quality',
            },
            cooling_water_capacity: {
                title: 'Hi-Capacity Water Injection',
                desc: 'Increased capacity for longer distances, less fill-ups',
            },
            filter_fuel_standard: {
                title: 'Standard Fuel Purifier',
                desc: 'Standard quality',
            },
            filter_intake_standard: {
                title: 'Standard Intake Filter',
                desc: 'Standard quality',
            },
            processor_standard: {
                title: 'Standard Autopilot Processor',
                desc: 'Standard quality',
            },
        },
    },
    control: {
        control: 'Control',
        gauges: 'Gauges',
        advanced: 'Advanced',
        throttle: 'Throttle',
        fuel: 'Fuel',
        thrust: 'Thrust',
        starter: 'Starter',
        brake: 'Brake',
        auto_off: 'Stop',
        auto_on: 'Fly',
        afterburner_off: 'Afterburner Off',
        afterburner_on: 'Afterburner On',
    },
    indicator: {
        indicators: 'Indicators',
        explain: 'Explain',
        stats: 'Stats',
        types: {
            thermal: {
                name: 'Thermal control',
                desc: `Jets power is limited due to thermal dissipation constraints.`,
            },
            autoland: {
                name: 'Autolanding',
                desc: `Automatic landing control is engaged. Ship controls are overriden.`,
            },
            autoland_warn: {
                name: 'Autolanding warning',
                desc: `Braking power might be insufficient to land the ship on the target.`,
            },
            fuel: {
                name: 'Fuel low',
                desc: `Fuel level in the tank is low.`,
            },
            starter: {
                name: 'Starter',
                desc: `Starter blower is attempting to start the jet.`,
            },
            unburnt: {
                name: 'Unburnt fuel',
                desc: 'Injected fuel is not fully burned due to lack of oxygen.',
            },
            exhaust: {
                name: 'Exhaust restriction',
                desc: 'Exhaust system is limiting maximum amount of air that the jet can passthrough.',
            },
            service_warning: {
                name: 'Service soon',
                desc: `Some of the ship's part require service.`,
            },
            service_danger: {
                name: 'Service immediately',
                desc: `Some of the ship's parts are in dangerous condition.`,
            },
            cooling_fan: {
                name: 'Cooling fan',
                desc: 'When air cooling is inadequate cooling fan will engage.',
            },
            heater: {
                name: 'Intake heater',
                desc: 'When engine temperature is low, intake heat will turn on to preheat intake air, increasing engine efficiency.',
            },
            cooling_water: {
                name: 'Low water level',
                desc: 'Low water level in a water injection system tank. Once no water left, water injection system will not be able to provide any cooling.',
            },
            filter_fuel: {
                name: 'Restriction in fuel purifier system',
                desc: 'Fuel purifier limits maximum amount of fuel that can flow into the engine. Efficiency is not decreased, but maximum power might be limited.',
            },
            filter_intake: {
                name: 'Restriction in intake filtering system',
                desc: 'Intake filter limits maximum amount of air that can flow into the engine.',
            },
        },
        gauges: {
            temp: {
                title: 'Jet temperature',
                info: 'Shows current jet temperature',
            },
            fuel: {
                title: 'Fuel level',
                info: 'Shows fuel level in the tank',
            },
            airflow: {
                title: 'Jet air flow',
                info: 'Shows amount of air currently flowing through the jet',
            },
        },
        physics: {
            burned: {
                title: 'Burned air/fuel mixture',
                info: 'Amount of air/flow that is completely burned in the jet',
            },
            temp: {
                title: 'Jet temperature',
                info: 'Current temperature of the jet. At low temperatures jet efficiency is considerably lower. High engine load at low temperature can lead to a catastrofic engine failure.',
            },
            ambient_temp: {
                title: 'Ambient temperature',
                info: 'Ambient temperature in the current region. If very low, ship engine might have some issues starting (while being cold).',
            },
            cooling_ctl: {
                title: 'Cooling system duty',
                info: 'Usage of the cooling system. Indicates if performance is inadequate',
            },
            max_cooling_eff: {
                title: 'Maximum cooling capability',
                info: 'Shows how much cooling system can dissapate at the current moment. Upgrade the cooling system or install accessories to improve this stat.',
            },
            cooling_water: {
                title: 'Water injection fluid',
                info: 'If water injection system is installed, shows amount of water that is left. Use stations to refill.',
            },
            air_density: {
                title: 'Intake air density',
                info: 'Shows density of intake air. Higher the density, more fuel can be burned. Compressors help to increase the density.',
            },
        },
    },
    delivery: {
        delivery: 'Delivery',
        name: 'Name',
        weight: 'Weight',
        wage: 'Wage',
        target: 'Target',
        carrying: 'You are carrying',
        available: 'Available at the station',
        capacity: 'Ship cargo capacity',
        in: 'in',
        turn_in: 'Turn in',
        take: 'Take',
        drop: 'Drop',
        next_in: 'Delivery',
        no_deliveries: 'No deliveries',
        has_cost: 'Cost to take',
        ship: 'Ship',
        station: 'Station',
        delivery_explain: `You have no deliveries. Deliver packages for money. Visit nearest station ant pick one up!`,
        delivery_station_explain: `Deliveries are only available at stations. Land in the station that gives deliveries. All available deliveries will be listed here.`,
        unique: {
            info: 'Unique delivery',
        },
        drop_action: {
            title: 'Cancelling delivery',
            info: 'You will lose the wage. Continue?',
        },
        take_info: {
            cost: 'Not enough money',
            slots: 'No free slots',
        },
        items: {
            electronics: {
                title: 'Electronics',
                desc: 'Electronics parts',
            },
            processed_food: {
                title: 'Processed food',
                desc: 'Processed food packets',
            },
            steel: {
                title: 'Steel',
                desc: 'Steel',
            },
            aliuminum: {
                title: 'Aliuminum',
                desc: 'Aliuminum',
            },
            sealed: {
                title: 'Sealed Package',
                desc: 'Tightly sealed package. Rumours say that these contain dark matter.',
            },
            personal: {
                title: 'Personal delivery',
                desc: 'Delivery marked as a gift',
            },
            package: {
                title: 'Small package',
                desc: 'Mark for me to pickup only',
            },
        },
        names: {

        },
    },
    fluid: {
        fluid: 'Fluid',
        title: 'Refill fluids',
        cost: 'Cost per unit',
        cost_amount: 'Total cost',
        amount_fill: 'Amount to be filled',
        amount: 'Fill %',
        source: 'Category',
        flow: 'Fill',
        not_available: 'Not available in space',
        not_available_landed: 'Not available in this station',
        fill_info: {
            cost: 'Not enough money',
        },
        types: {
            tank: {
                title: 'Rocket fuel',
            },
            cooling_water: {
                title: 'Water',
            },
        },
    },
    advanced_settings: {
        reset_defaults: 'Reset defaults',
        reset_action: {
            title: 'Reset advanced settings',
            info: 'Reset advanced settings to fail-safe defaults?',
        },
        types: {
            thermal_control: {
                title: 'Thermal Control',
                desc: 'Controls engine maximum power to pervent overheating. Can be switched off, but not recommended',
            },
            cooling_range: {
                title: 'Cooling Range (°K)',
                desc: 'Range of temperature at which cooling system effectiveness is adjusted',
            },
            cooling_offset: {
                title: 'Cooling Offset (°K)',
                desc: 'Offset of temperature of engine when cooling system starts to engage. Temperature is engines operating temperature',
            },
            cooling_operating_offset: {
                title: 'Operating temp. offset (°K)',
                desc: 'Sets operating temperature of the jet. Value is subtracted from jets maximum temperature',
            },
            thermal_control_offset: {
                title: 'Thermal control offset (°K)',
                desc: 'Delays thermal control by a given value',
            },
            cooling_water_ondemand: {
                title: 'Use water injection only on-demand',
                desc: 'Only uses water injection when air cooling is not sufficient.',
            },
            autopilot_autoland: {
                title: 'Autopilot: autolanding',
                desc: 'Autopilot will attempt to autoland in the nearest relavant station',
            },
            autopilot_delivery: {
                title: 'Autopilot: delivery',
                desc: 'Autopilot will take and deliver deliveries',
            },
            autopilot_repair: {
                title: 'Autopilot: repair',
                desc: 'Autopilot will repair ship part when landed',
            },
            autopilot_taxes: {
                title: 'Autopilot: taxes',
                desc: 'Autopilot will pay taxes if limit is reached',
            },
            autopilot_fluid: {
                title: 'Autopilot: fluid',
                desc: 'Autopilot will refill fluids once landed',
            },
        },
    },
    sleep: {
        sleep: 'Sleep',
        title: 'Sleep',
        amount: 'Sleep for (minutes):',
        wait: 'Sleeping',
        sleep_info: {
            minutes_enter: 'Land on the station regain sleep time',
            minutes: 'Not enough sleep time',
        },
        wakeup_info: {
            autoland: 'Approaching autoland',
            autoland_warn: 'Autolanding warning',
            fuel: 'Low fuel',
            service: 'Need service',
            service_critical: 'Critical part(s) condition',
            stall: 'Engine stalled',
            comm: 'New communication',
        },
    },
    map: {
        next_station: 'Next station',
        landing_range: 'Landing range',
        station_name: 'Station name',
        travel_state: 'Travel state',
        player: 'Player',
        station: 'Station',
        has_delivery: 'Delivering to',
        autoland: 'Set to autoland',
        cancel_autoland: 'Cancel autolanding',
        click_to_autoland: 'Click on the station icon to set autolanding',
        scale: 'Scale',
        per_div: '/ div',
        approaching: 'approaching',
        approaching_in: 'in',
        autoland_not_set: 'Autolanding not set',
        next_in: 'Autolanding',
        region: {
            region: 'Region',
            ambient: 'Temperature',
            entering_in: 'Entering in',
            ends_in: 'Ends in',
            stations_title: 'Stations',
            endless: 'Endless',
            names: {
                space: 'Space',
                space_cold: 'Cold Space',
                space_very_cold: 'Very Cold Space',
                space_extreme_cold: 'Extreme Cold Space',
                space_hot: 'Hot Space',
                darkness_unknown: 'Unknown Darkness',
                darkness: 'Darkness',
            },
            stations: {
                normal: 'Normal',
                none: 'None',
            },
        },
        state: {
            in_space: 'In space',
            passing_by: 'Passing by',
            landing: 'Landing',
            landed: 'Landed',
        },
    },
    tutorial: {
        baloons: {
            start: {
                text: 'My first task is to get the ship going. Ship is controlled by two controls.',
            },
            throttle: {
                text: 'This lever controls amount of fuel injected into the jet.',
            },
            control: {
                text: 'This switch will set if ship will accelerate or deaccelerate. Engine will be started/stopped on demand.',
            },
            indicators: {
                text: `Jet will try to automatically start now. I can check ship statuses by looking at the indicator panel. Indicators can warn about various ship conditions. I can hover on each to get more information.`,
            },
            comms: {
                text: 'I can check or interact with my current objectives in communications tab. I can skip the tutorial if I want.',
            },

            speed: {
                text: `OK. Ship has started to fly. Now it's time to gain some speed. I need to get my speed up to 500/s. Speed is indicated here.`,
            },
            low_throttle: {
                text: `I can increase amount of fuel injected into the engine to fly faster`,
            },
            travel: {
                text: `So it's time to do my first landing. In this panel I can see an closest station or planet to me. Once I'm within the landing range (200K) I can start deaccelerating.`,
            },
            land: {
                text: `The station is now within the landing proximity. It's time to land. Set ship to stop using this toggle:`,
            },
            delivery: {
                text: `It's time to take my first delivery. I have to go to delivery tab and pickup Personal Delivery.`,
            },
            delivery_station: {
                text: `Here are all the available deliveries that are on this station`,
            },
            taken: {
                text: `Deliveries weigh differently and my ship has limited weight capacity, so can only take certain amount. However I can upgrade my cargo capacity later.`,
            },
            map: {
                text: `So I have the delivery. Now deliveries have target station to which they have to be delivered. To navigate these stations there's a map. Stations marked in blue indicate that I have deliveries to these stations.`,
            },
            autolanding: {
                text: `Automatic landing system is also available and is set by clicking on the station icon. Just click on the blue station icon:`,
            },
            autoland_click: {
                text: 'Click on this icon to enable autolanding',
            },
            scale: {
                text: `Once stations become more scarce. I might need to change scale of the map. I can do it with this:`,
            },
            set_autoland: {
                text: `Autolanding is now set. This indicator shows when ship will automatically start to deaccelerate.`,
            },
            takeoff_control: {
                text: `Now it's time to take off`,
            },
            takeoff: {
                text: `Set ship to flight mode`,
            },
            takeoff_throttle: {
                text: `Don't forget to set throttle also, otherwise ship won't start if throttle is set to 0`,
            },
            autolanding_now: {
                text: `Ship is now autolanding.`,
            },
            turn_in: {
                text: `It's time to turn in the delivery by going into deliveries tab.`,
            },
            money: {
                text: `Delivering each delivery will pay me money. I can see my current balance and also last income/outcome.`,
            },
            sleep: {
                text: `I can use sleep functionality to pass time quicker when I'm flying longer distances. I just have to press sleep button.`,
            },
            fueling: {
                text: 'Ship requires fuel. I can check fuel level and average usage in this panel.',
            },
            refuel: {
                text: `It's time to do my first refuel. Open fluid dialog and click Fill. Fill the tank to 100%.`,
            },
            refuel_action: {
                text: `Click this to refill the tank`,
            },
            inventory: {
                text: `Open inventory tab and purchase a cargo module upgrade.`,
            },
            upgraded: {
                text: `I have successfuly upgraded my cargo module. Now I can carry more deliveries.`,
            },
            upgrades: {
                text: `There is so much more for upgrades than a simple cargo upgrade. I can upgrade ship's performance, add difference features. Core parts are upgraded in batches because they have to be compatible with each other. From here I'm on my own though.`,
            },
        },
    },
    comms: {
        comms: 'Comms',
        communications: 'Communications',
        in: 'in',
        choose: 'Broadcast',
        choose_title: 'Broadcast',
        info_title: 'Information',
        groups_title: 'Groups',
        group_item_title: 'Information',
        group_name: 'Name',
        item_title: 'Objective',
        show_completed: 'Show completed',
        show_open: 'Show open',
        no_targets: 'No comms',
        next_in: 'Next comm target',
        list: 'All comms',
        no_groups: 'No groups available',
        no_objectives: 'No objectives',
        indicator: {
            no_new: 'No updates',
            open: 'New objective',
            close: 'Objective completed',
            close_fail: 'Objective failed',
            close_group: 'Task completed',
            show_indicated: 'More',
        },
        groups: {
            tutorial: {
                title: 'Humble Beginnings',
                desc: `{p}I have received a broadcast:{/p}
                {tr}HELLO FELLOW TRAVELLER,{n}
                WE HAVE RECEIVED A MESSAGE THAT YOU HAVED SIGNED OUT OF YOUR HOME STATION{n}
                WE LIKE TO HELP YOU TO GET STARTED{n}
                JUST FOLLOW OUR BROADCAST AND WE'LL TEACH YOU THE BASICS{n}
                GOOD LUCK{/tr}
                `,
                items: {
                    skip_tutorial: {
                        title: 'Skip the tutorial',
                        desc: 'I can skip the tutorial',
                        choose_desc: 'Do I want to skip the tutorial? (Not recommended to skip)',
                        choises: {
                            no_skip: 'Continue with the tutorial',
                            skip: 'Skip the tutorial',
                        },
                    },
                    first_start: {
                        title: 'Start the jet',
                        desc: `Time to learn flight and throttle controls`,
                    },
                    first_takeoff: {
                        title: 'Reach 500/s ship speed',
                        desc: `Good time to practice basic ship controls`,
                    },
                    first_landing: {
                        title: 'Land in the nearest station',
                    },
                    take_delivery: {
                        title: 'Pickup a personal delivery',
                        desc: `Deliveries are the main way to make money. I have to pickup them from stations and delivery them to the destination stations`,
                    },
                    first_delivery: {
                        title: 'Deliver the delivery',
                    },
                    first_refuel: {
                        title: `Fill ship's fuel tank to full`,
                        desc: `Fuel is only available at stations`,
                    },
                    first_upgrade: {
                        title: `Upgrade ship's cargo module`,
                    },
                },
            },
            encrypted: {
                title: 'Encrypted Promises',
                desc: `{p}I have received a mysterious transmission from the deep space. It carries a message and encrypted coordinates of the destination.{/p}
                {p}While I can't read the coordinates, I can read the message. It says:{/p}

                {tr}FOLLOW THE PATH AND UNLOCK THE SECRETS OF THE UNIVERSE{n}
                <Encrypted code>{/tr}

                {p}I have no clue what this could mean, but since I've decided to leave my home, it might be a good opportunity to explore places where I've never been.{/p}
                `,
                items: {
                    clue: {
                        title: 'Land in the nearest station',
                        desc: 'I should ask people at other stations, they might able to help',
                        infos: {
                            receive: 'I have received a new transmission.',
                        },
                    },
                    ask: {
                        title: 'Ask for information',
                        choose_desc: 'Ask for information',
                        choises: {
                            ask: '(Tell about the message)',
                        },
                        infos: {
                            clue: `Guy at the station mentioned something about a space lab where computer scientists analyze transmissions from space. They gave me location of this station, I should travel there immediately.`,
                            unknown: 'People at this station had no clue what that could be. I should try another station',
                        },
                    },
                    ask_again: {
                        title: 'Try another station',
                    },
                    first_clue: {
                        title: 'Travel farther into the space',
                    },
                },
            },
            insecurities: {
                title: 'Breaking the Insecurities',
                items: {
                    phrase: {
                        choose_desc: 'Phrase is {words}',
                    },
                },
            },
            journey: {
                title: `Journey's End`,
                desc: `Darkness shrouds everything`,
                items: {
                    darkness: {
                        title: 'Exit the current region',
                    },
                    through: {
                        title: 'Step into the void region',
                    },
                    beacon: {
                        title: 'Land in the beacon',
                        desc: 'Beacon radiates dim but warm light. Black fumes surround it',
                    },
                    brighter: {
                        title: 'Step out of the void region',
                    },
                },
            },
            discounts: {
                title: `Discounts for Me and You`,
                desc: `I have received a transmission:{n}
                {tr}
                    Hello,{n}
                    you have been invited to visited our shop!{n}
                    We offer 50% discount for all the parts!{n}
                    Come and visit us!{n}
                {/tr}
                `,
                items: {
                    shop: {
                        title: 'Visit the shop',
                    },
                    rival: {
                        title: `Reply to rival's offer`,
                        desc: `Looks like Joe's Discount Station has some serious rivals`,
                        choose_desc: `Broadcast Message: {tr}Look pal, we've got some competition that we don't like. We offer you a deal. You take care of our competitors and we reward you with some money. We offer you {pay} cash. What say you?{/tr}`,
                        choises: {
                            accept: 'Accept the offer',
                            decline: 'Decline the offer',
                        },
                    },
                    explosives: {
                        title: `Travel to the station with explosives`,
                        desc: `They have left me explosives in one of the stations`,
                    },
                    pickup: {
                        title: `Pickup the explosives`,
                        choose_desc: `Explosive are hidden in this station.`,
                        choises: {
                            pickup: 'Pickup explosives',
                        },
                    },
                    bring: {
                        title: `Travel to the nearest discount shop`,
                    },
                    explode: {
                        title: `Setup explosives`,
                        choose_desc: `I can now setup explosives.`,
                        choises: {
                            setup: 'Setup explosives',
                            inform: 'Inform staff about explosives',
                        },
                        infos: {
                            inform: `Staff was really glad that I informed and disclosed the rivals. From now they will offer me {discount}% discount!`,
                        },
                    },
                    leave: {
                        title: `Leave the station`,
                    },
                },
            },
            sealed: {
                title: 'Packages of Dark Matter',
                desc: `{p}I have received a new transmission:{/p}
                {tr}
                It was nice doing business with you. We have another offer for you.{n}
                Occasionally we need to transfer some packages from one place to another.{n}
                Since you know your job well, we offer you to help us.{n}
                If you accept we will inform delivery companies to give you our deliveries.{n}
                You answer?
                {/tr}`,
                items: {
                    plan: {
                        title: `Reply to the offer`,
                        choose_desc: `Do I accept or decline?`,
                        choises: {
                            accept: 'Accept the offer',
                            decline: 'Decline the offer',
                        },

                    },
                    aquire: {
                        title: 'Aquire delivery certificate',
                        infos: {
                            aquire: 'Sealed packages are now available at delivery stations!',
                        },
                    },
                },
            },
            limits: {
                title: 'Raising the Ceiling',
                desc: ``,
                items: {
                    research: {
                        title: 'Land in the facility station',
                        desc: '{reward} money is available to take',
                        infos: {
                            reward: `For completed tasks I have received {reward} money!`,
                        },
                    },
                    upgrade: {
                        title: 'Upgrade the tracking module',
                        desc: '',
                        choose_desc: `Hello. Here you can install various tracking modules that will save your data. For each completed task we will reward you with money. You just need to install at least one of those:`,
                        choises: {
                            speed: 'Install speed tracking module (Cost: {price})',
                            distance: 'Install distance tracking module (Cost: {price})',
                            thrust: 'Install thrust tracking module (Cost: {price})',
                        },
                        infos: {
                            money: 'Not enough money to purchase the module!',
                        },
                    },
                    speed: {
                        title: 'Tracking the speed',
                        desc: 'Reach the speed of {speed}/s',
                    },
                    distance: {
                        title: 'Tracking the distance',
                        desc: 'Reach the distance of {distance}',
                    },
                    thrust: {
                        title: 'Tracking the thrust',
                        desc: 'Make engine to produce {thrust} thrust',
                    },
                },
            },
            powerless: {
                title: 'Desperate and Powerless',
                desc: `I have received a broadcast:`,
                items: {
                    offer: {
                        title: 'Reply to the offer',
                        choose_desc: `Do you accept the offer?`,
                        choises: {
                            accept: 'Accept the offer',
                            decline: 'Decline the offer',
                        },
                    },
                    package: {
                        title: 'Land in the station',
                    },
                    pickup: {
                        title: 'Pickup the delivery',
                        desc: 'Small package',
                    },
                    loan: {
                        title: 'Take a loan',
                    },
                    release: {
                        title: 'Drop the delivery',
                    },
                },
            },

            coating: {
                title: 'Coating for the Masses',
                desc: `I have received a broadcast:
                {tr}
                Hello space traveller,{n}
                We'd like to offer you our services{n}
                Want to make your ship engine more durable?{n}
                We have done a lot of research and we have discovered a secret formula{n}
                Our coating spray will help to improve your engine's thermal resistance therefore increasing durablity{n}
                We have employees work all across the stations{n}
                Just land in one them!{n}
                We will be waiting for you{n}
                {/tr}
                `,
                items: {
                    station: {
                        title: 'Land in the station',
                    },
                    coat: {
                        title: 'Process the part(s)',
                        choose_desc: `Choose what parts you want to coat:`,
                        choises: {
                            blades: 'Jet Assembly (Cost: {cost})',
                            exhaust: 'Propelling (Cost: {cost})',
                        },
                        infos: {
                            money: 'Not enough money to purchase this coating job!',
                            coated: 'Item durability has been increased!',
                            already_coated: 'Item already has been coated before!',
                            repaired: 'Item must be in a good condition.',
                        },
                    },
                },
            },

            deposit: {
                title: 'Save for another day',
                desc: `
                    I have received a broadcast:
                    {tr}
                        Having trouble saving money?{n}
                        We're here to help you.{n}
                        Deposit your money into our bank for a fixed time period and get more money back!{n}
                        Yes, it is that simple!{n}
                        Start today.{n}
                    {/tr}
                `,
                items: {
                    amount: {
                        title: 'Choose amount to deposit',
                        choose_desc: 'How much to deposit?',
                        choises: {
                            amount: '{amount}',
                        },
                    },
                    time: {
                        title: 'Choose deposit time until withdrawal',
                        choose_desc: 'How long to deposit?',
                        infos: {
                            money: 'Not enough money.',
                        },
                        choises: {
                            wage: '{hours} hour(s) [Wage: +{wage}]',
                            back: 'Change amount',
                        },

                    },
                    wait: {
                        title: 'Wait until time for withdrawal',
                        desc: '{now} / {hours} hour(s) left',
                        choose_desc: 'You have deposited {deposited}. Terminate?',
                        choises: {
                            terminate: 'Terminate and take {amount}',
                        },
                    },
                    cash: {
                        title: 'Cash out the money',
                        choose_desc: 'Take',
                        choises: {
                            cash: 'Take {amount}',
                        },
                    },
                    delay: {
                        title: 'Wait for depositing delay',
                    },
                },
            },

            border: {
                title: 'Forces in the Background',
                desc: `
                Transmission says:{n}
                {tr}
                Access to the area past the Great Border is forbidden.{n}
                Special certificates are required to pass.{n}
                Unauthorized ships will be melted without warning.
                {/tr}
                `,
                items: {
                    news: {
                        title: 'Land at the border',
                    },
                    questions: {
                        title: 'Find nearby inhabitants',
                        desc: 'People living near the border might have some information.',
                    },
                    informant: {
                        title: 'Ask nearby inhabitants',
                        choose_desc: `I need to ask about the border... I need to know how to gain access...`,
                        choises: {
                            ask: '(Ask about the border)',
                        },
                        infos: {
                            informant_group: `
                            - They call themselves "Narrow Mind Federation".{n}
                            They seem to have a very high end technology. Some people believe that they rule this universe with their subtle techniques.{n}
                            We don't see them very often, though.
                            `,
                            informant_certificate: `- I've heared that they only allow people with a certain documents.`,
                            informant_radiation: `
                            - It's no secret that they use some sort of heat radation to shot down ship that try to trespass.{n}
                            Some people say that it's no that hard to pass.{n}
                            You just need the best cooling system you can get and gain a lot of speed before hitting it.{n}
                            Be careful if you attempt that{n}
                            `,
                            informant_delivery: `
                            - You should tell them that you deliver cargo. They might let you pass, although I can not guarantee.
                            `,
                            informant_bribe: `
                            - There's a rumor that they can be bribed.
                            `,
                            informant_none: `- Sorry, I haven't heard about it.`,
                        },
                    },
                    border: {
                        title: 'Aquire permission to pass',
                        choose_desc: `- Please issue the document.`,
                        choises: {
                            bribe: 'Attempt to bribe for {amount}',
                            certificate: 'Show the certificate',
                            delivery: 'Mention delivery jobs',
                        },
                        infos: {
                            bribe_fail: 'Failed to bribe.',
                            bribe_ok: 'Bribe has been successful!',
                            delivery_fail: `- We don't give a permission for non important deliveries`,
                            delivery_ok: '- Well, you seem to be a very productive deliverer. I think we can make an exception.',
                        },
                    },
                    granted: {
                        title: 'Pass the border',
                        infos: {
                            pass: '- Permission to pass the border has been granted. You may pass.',
                        },
                    },
                    melting: {
                        title: 'Survive the heat radiation wave',
                        infos: {
                            radiation: 'Ship systems have started to sense an increased intake temperature. Looking at all the data, this heat seems to be concentrated to my ship, since ambient temperature is nominal. Ship engine is very likely to start overheating.',
                            escape: 'Heat radiation has started to fade. I think I have managed to escape.',
                        },
                    },
                },
            },

            inspection: {
                title: 'No Black Smoke Allowed',
                desc: `
                Transmission says:
                {tr}
                    By the law you need to pass a mandatory ship inspection.{n}
                    Your ship will be scanned automatically once you pass our station.{n}
                    We send you a basic requirements and recommendations so you can prepare.{n}
                {/tr}
                {b}Rules:{/b}
                {ul}
                    {li}Clean burning engine{/li}
                    {li}No afterburner installed{/li}
                    {li}Non restrictive exhaust system{/li}
                    {li}Have emission control system installed (EGR, Intake Heater or Combustion Sensor){/li}
                {/ul}
                More rules you meet, lower the tax you will have to pay.
                `,
                items: {
                    station: {
                        title: 'Pass the inspection station',
                    },
                    probe: {
                        title: 'Wait until the ship is scanned',
                        desc: '',
                    },
                },
            },

            invest: {
                title: 'Investments',
                desc: `
                Transmission says:
                {tr}
                    Have you felt that your ship lacks something? Performance or an accessory?{n}
                    We have been working with the ship parts and accessories companies.{n}
                    And we like to help other travelers by expanding ship part market.{n}
                    Of course we need people to show that they need these parts.{n}
                    We offer you to invest and soon you will see these parts available in the market.{n}
                    Please check our offer.{n}
                    Thanks.
                {/tr}
                `,
                items: {
                    list: {
                        title: 'Choose item to invest',
                        choose_desc: 'Choose item to see available offer',
                        chioses: {},
                    },
                    offer: {
                        title: 'Reply to the offer',
                        choose_desc: `
                            {p}
                                {b}Item:{/b}{n}
                                {name}{n}
                            {/p}
                            {p}
                                {b}What item does:{/b}{n}
                                {info}{n}
                            {/p}
                            {p}
                                {b}What this version has to offer:{/b}{n}
                                {desc}{n}
                            {/p}
                            {p}
                                {b}Investment cost:{/b}{n}
                                {cost}{n}
                            {/p}
                            {p}
                                {b}Investment gain:{/b}{n}
                                Item available at stores{n}
                            {/p}
                        `,
                        choises: {
                            accept: 'Accept and Pay {cost}',
                            list: 'View all available',
                        },
                    },
                    wait: {
                        title: 'Wait for the next offer',
                    },
                },
            },

            licence: {
                title: 'Gaining the Weight',
                desc: `License tax will increase as soon as I upgrade my cargo module`,
                items: {
                    upgrade: {
                        title: 'Pay the bills',
                        desc: 'Currently paying {tax}',
                    },
                },
            },

            core: {
                title: 'Core',
                desc: ``,
                items: {
                    wreck: {
                        title: 'Explore the debris',
                    },
                    help: {
                        title: 'Aquire the authentication card',
                    },
                    card: {
                        title: 'Buy the authentication card',
                        desc: '',
                        choose_desc: `- I have one for sale. What say you?`,
                        choises: {
                            buy: 'Accept. Pay {cost}',
                        },
                        infos: {
                            card_added: 'I have aquire the authentication card.',
                        },
                    },
                    inspect: {
                        title: 'Aquire the fusion core',
                        choose_desc: `Container is sealed and locked. Lock is controlled through authentication system.`,
                        choises: {
                            card: 'Use authentication card',
                            hack: 'Attempt to hack the system',
                        },
                        infos: {
                            hack_failed: 'Hacking failed. System is under the lockdown.',
                            card_added: `Container has unlocked. I took the fusion core.`,
                        },
                    },
                    maintain: {
                        title: 'Maintain energy balance within the core',
                        desc: `Core energy level: {prec} Season: {state}`,
                        choose_desc: `
                            {p}
                                {b}Energy generation season:{/b}{n}
                                {state}{n}
                            {/p}
                            {p}
                                {b}Core status:{/b}{n}
                                {status}{n}
                            {/p}
                            {p}
                                {b}Energy in the core:{/b}{n}
                                {prec}{n}
                            {/p}
                            {p}
                                {b}Spare cells available:{/b}{n}
                                {cells}{n}
                            {/p}
                        `,
                        choises: {
                            add_cell: 'Add cell',
                            charge_cell: 'Charge cell',
                        },
                    },
                },
            },

            encounters: {
                title: 'Encounters',
                items: {
                    stories: {
                        infos: {
                            fog: `
                            As I stop near this space object, I see a very thick fog. In the middle I can see a few light dots.{n}
                            Nearby I can see a floating container marked as ship parts, it seems it might contain something.{n}
                            `,
                            saucer: `
                            Saucer look a like object shows no movement, no noise.{n}
                            However I can pick up some transmission.{n}
                            Oddly I doesn't seem come from the saucer, but rather from deeper space.{n}
                            Transmissions contains two subjects:{n}
                            {n}
                            {tr}
                                - What do the reports say?{n}
                                - No signs of expanded awareness. Suspend the program.{n}
                                - Confirmed. But we still have some leakage.{n}
                                - Leave it alone. It's very unlikely for subjects to channel it.{n}
                                - OK.{n}
                            {/tr}
                            `,
                            portal: `
                                It feels that the portal leads somewhere, however it looks like it's non functional.{n}
                                It seems that my ship is likely to be incompatible with this portal.{n}
                            `,
                            venamous: `
                                Spaceship seems abandoned a long time ago. Accessing ship's terminal I've found a single joural log entry:{n}
                                {tr}
                                    During the past few weeks I have started to feel very foggy, separating myself from others.{n}
                                    My head becomes more dizzy during evenings.{n}
                                    Also I feel very weird sensation in my brain.{n}
                                    Almost as if it's becoming damaged in some way...
                                {/tr}
                            `,
                            mil_cargo: `
                                Sealed military containers seem to be sealed and well protected. They might have some valuable gear inside.
                            `,
                        },
                    },
                },
            },

            ceiling: {
                title: 'Over the Edge',
                desc: `A strange galactic outpost has appeared on my radar. I should investigate.`,
                items: {
                    station: {
                        title: 'Investigate the post',
                    },
                    outsider: {
                        title: 'Gets information from the outsider',
                        desc: 'Some mysterious stranger has sent me message, starting a conversation.',
                        choose_desc: '',
                        choises: {
                            place: '- This place is the edge?',
                            you: '- Who are you?',
                            past_this: `- So there's nothing past this?`,
                            origins: '- So where are you from?',
                            universe: '- A different universe?',
                            program: '- What do you mean program?',
                            clues: '- What clues?',
                        },
                        infos: {
                            greeting: `{tr}- I welcome you to the edge of the universe. I didn't expect that anyone could ever make it here. But here it is...{/tr}`,
                            place: `{tr}- Well, you've heared it right. It is the egde.{/tr}`,
                            you: `{tr}- I'm an outsider. I don't live here, my origins are quite different than yours.{/tr}`,
                            past_this: `{tr}- This place and a little bit further is where the simulated world ends. If you go past it, you will simply disappear from existance.{/tr}`,
                            origins: `{tr}- I'm from a different universe.{/tr}`,
                            universe: `{tr}- Yes, your universe is just a simulated program. I expect that you have noticed that since you have made your way here.{/tr}`,
                            program: `{tr}- Well, it's all simulated. But somehow nobody notices that. But we have dropped some clues.{/tr}`,
                            clues: `{tr}- You still haven't realized? Everything you experencied, seen was programmed by us. A lot of encounters you've had were leaked on purpose from us.{/tr}`,
                        },
                    },
                    unbound: {
                        title: 'Reach an actual end',
                    },
                    the_switch: {
                        title: 'Shut down the simulation program',
                        choose_desc: `{b}Switch says:{/b} Active switch to shut down simulation permanently.`,
                        choises: {
                            toggle: 'Flip the switch',
                        },
                    },
                },
            },

            cold: {
                title: 'Cold Cold Heart',
                desc: `
                    Alert broadcast message says:
                    {tr}
                        From this point onward sudden chances in the ambient temperature are expected.{n}
                        This might result in your ship not working properly, so take any steps necessary in order to prepare.{n}
                        There are systems that assist ship's operation in low temperatures.
                    {/tr}
                `,
                items: {
                    broadcast: {
                        title: 'Confirm the message',
                        choose_desc: `- Please confirm that you have read the alert message`,
                        choises: {
                            ok: '(Confirm that I have read the message)',
                        },
                        infos: {
                            message: `I have received an automated alert message.`,
                        },
                    },
                },
            },

            zero: {
                title: 'Absolute Zero',
                desc: `
                    Broadcast says:
                    {tr}
                        Hello Space Traveller,{n}
                        We are doing experiments with thermaldynamics and we need your help.{n}
                        We need to test how ship handles and works at extremely low temperatures.{n}
                        We have found a way to induce this temperature and we would like if yuo would test it for us.{n}
                        Reward will be discussed afterwards.{n}
                        {n}
                        Thermodynamics Research University
                    {/tr}
                    {b}Recommended gear:{/b} (Ordered by importance){n}
                    {ol}
                        {li}Intake heater{/li}
                        {li}Durable starter{/li}
                        {li}High-end injection system{/li}
                        {li}EGR{/li}
                    {/ol}
                    {b}Instructions:{/b}
                    {ol}
                        {li}Reach 'fridge' region{/li}
                        {li}Stop the ship{/li}
                        {li}Wait unit ship's engine cools down to the ambient temperature{/li}
                        {li}Start and fly to our station{/li}
                    {/ol}
                    Make sure ship is in a good condition.
                `,
                items: {
                    theory: {
                        title: 'Reply to the message',
                        choose_desc: `- Broadcast covered pretty much everything. You ether say yes or no.`,
                        choises: {
                            agree: 'Agree',
                            disagree: 'Decline',
                        },
                        infos: {
                            instructions: `
                            {tr}
                                - Make sure you cover as much of recommended points as possible. Now you will have to land in the cold region once you reach it.{n}
                            {/tr}
                            `,
                        },
                    },
                    fridge: {
                        title: 'Land in the fridge region',
                        desc: 'Also I need to cool the engine to ambient temperature',
                    },
                    escape: {
                        title: 'Escape the cold enviroment',
                        infos: {
                            complete: `
                            {tr}
                                - Congratulations, you have succeeded. Here is your reward. Good luck in your journeys.
                            {/tr}
                            `,
                        },
                    },
                },
            },

            exam: {
                title: 'Knowing the Basics',
                desc: `
                Transmission:
                {tr}
                    Law states:{n}
                    Every cargo deliverer needs to pass the ship control and maintenance exam.{n}
                    You can read documentation now, we'll inform you when exam is ready.{n}
                {/tr}
                `,
                items: {
                    wait: {
                        title: 'Wait for exam availability',
                    },
                    man: {
                        title: 'Read the theory documentation',
                        choose_desc: '',
                        choises: {
                            temperature: `Engine thermaldynamics`,
                        },
                        infos: {
                            temperature: `
                                Temperature greatly affects engine's performance and fuel efficiency.
                            `,
                        },
                    },
                    course: {
                        title: 'Pass the exam',
                        choose_desc: '{question}',
                        choises: {
                            // Process
                            process: `Process of the thrust production. Correct sequence is:`,
                            tank_injection_jet_exhaust: 'Tank -> Injection -> Engine -> Exhaust',
                            injection_jet_tank_exhaust: 'Injection -> Engine -> Tank -> Exhaust',
                            tank_jet_injection_exhaust: 'Tank -> Jet -> Injection -> Exhaust',
                            injection_tank_jet_exhaust: 'Injection -> Tank -> Jet -> Exhaust',
                        },
                        infos: {
                            passed: `{tr} - Congratulations, all answers are correct. You have passed the exam. {/tr}`,
                            failed: `{tr} - You have not passed the exam. You've correcly answered {success} out of {completed}. {/tr}`,
                        },
                    },
                },
            },

        },
    },
};

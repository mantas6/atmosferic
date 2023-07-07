$.extend(client.config, {
    station_names: function()
    {
        var n1 = rand(1, 9),
            n2 = rand(10, 99),
            n3 = rand(100, 999),
            n4 = rand(1000, 9999),
            r1 = rand(1, 10),
            r2 = rand(1, 100),
            r3 = rand(1, 1000),
            l1 = rand_letters(),
            l2 = rand_letters(2);

        return [
            `B-${r2}`,
            `Sky-${r2}`,
            `Star ${n4}`,
            `E-SAT ${n2}`,
            `K-${n1}`,
            `Uni-E C-${n2}`,
            `WX${n1}`,
            `${n2}&${n1}`,
            `Atom ${r1} Core`,
            `MQ-${n1}`,
            `Borderline ${r1}`,
            `Spiral ${n2}`,
            `Starbase ${n1}`,
            `Star Ring ${r2}`,
            `Space-${n1}`,
            `Ion ${n3}`,
            `Thunder Crater ${l1}-${n4}`,
            `Ph-${r2}`,
            `Sp-${r1}`,
            `Di-${n1}`,
            `${l2} ${r3}`,
            `${l1}-${r3}`,
            `RG-${l1}`,
            /*
            'Trut',
            'Chap',
            'Jumbi',
            'Cho-His',
            'Urino',
            'Hag-M',
            'Narrow Mind Federation',
            'Mind-drill',
            'In-Between-Legs',
            'Third Eye',
            'Di-X',
            'Transistor',
            'Transistor E',
            'Atom',
            'Void-Space',
            'Reptile Co',
            'Human Hybrid Lab',
            'Bio Star',
            'Red Light',
            'Fading Light',
            'Venamous Voice',
            'False God',
            'RG-R',
            'E-Tab',
            'gZ7',
            'Nix Station',
            'Wet Rock',
            'Flourence',
            'Floating Shard',
            'Mothers Womb',
            'Cancer',
            'Universe Trade Center',
            'Space Church',
            'Fourth Dimension',
            'Grey Base',
            'Mantis Lake',
            'Floating Lake',
            'Wet-Pants-Station',
            'Deep Bottom',
            'Catatonic Star',
            'Discomforting Reflection',
            'Brain-Drip',
            'Cooked Brain Star',
            'Faded Consciousness',
            'Heavy Anchor',
            'Anchored Heart',
            'Loud-Buzz',
            'Ion',
            'Leaky Conductor',
            'Uncertain-Choise',
            'Space Casino',
            'Addict-o-Station',
            'Center of the Universe',
            'Dripping Vitality',
            */
        ];
    },
    stations_gen: {
        normal: function()
        {
            return {
                distance: rand(0.01, 0.1, 3),
            };
        },
        low: function()
        {
            return {
                distance: rand(0.1, 0.2, 2),
            };
        },
        none: function()
        {
            return {
                no_stations: true,
            };
        },
    },
    regions: [
        function()
        {
            return {
                name: 'home',
                end: rand(1e6, 1e7),
                skip: true,
            };
        },
        function()
        {
            return {
                name: 'space',
            };
        },
        function()
        {
            return {
                name: 'space_cold',
                ambient_temp: 250,
            };
        },
        function()
        {
            return {
                name: 'space_very_cold',
                ambient_temp: 200,
                skip: !Comm.call_group_method({group: 'cold'}, 'spawn'),
            };
        },
        function()
        {
            return {
                name: 'space_extreme_cold',
                ambient_temp: 150,
                skip: !Comm.call_group_method({group: 'cold'}, 'spawn'),
            };
        },
        function()
        {
            return {
                name: 'space_hot',
                ambient_temp: 350,
                skip: chance(2/3),
            };
        },
        function()
        {
            return {
                name: 'darkness_unknown',
                skip: true,
                ambient_temp: 200,
                end: false,
                stations: 'none',
            };
        },
        function()
        {
            return {
                name: 'fridge',
                skip: true,
                ambient_temp: 1,
                stations: 'none',
            };
        },
        function()
        {
            return {
                name: 'darkness',
                skip: !Comm.is_closed_group('journey'),
                ambient_temp: 200,
                stations: 'none',
            };
        },
    ],
});

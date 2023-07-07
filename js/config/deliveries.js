$.extend(client.config, {
    deliveries: [
        function(bin, distance)
        {
            return {
                name: 'electronics',
                weight: rand(1200, 1500) * bin,
                wage: distance * 2e-4 * (bin * 0.1 + 0.6),
                cost: (chance(2/3) ? rand(0, 0.1, 2) : 0),
            };
        },
        function(bin, distance)
        {
            return {
                name: 'processed_food',
                weight: rand(1050, 1500) * bin,
                wage: distance * 1e-4 * (bin * 0.1 + 0.6),
                cost: (chance(1/2) ? rand(0, 0.1, 2) : 0),
            };
        },
        function(bin, distance)
        {
            return {
                name: 'steel',
                weight: rand(750, 1050) * bin,
                wage: distance * 2e-4 * (bin * 0.1 + 0.6),
                cost: (chance(3/5) ? rand(0, 0.05, 2) : 0),
            };
        },
        function(bin, distance)
        {
            return {
                name: 'aliuminum',
                weight: rand(750, 1500) * bin,
                wage: distance * 3e-4 * (bin * 0.1 + 0.6),
                cost: (chance(3/5) ? rand(0, 0.07, 2) : 0),
                skip: chance(2/3),
            };
        },
        function(bin, distance)
        {
            return {
                name: 'sealed',
                weight: rand(1050, 1350) * bin,
                wage: distance * 4e-4 * (bin * 0.1 + 0.6),
                cost: (chance(3/5) ? rand(0, 0.1, 2) : 0),
                skip: !Comm.is_closed('sealed', 'aquire') || chance(3/4),
            };
        },
        function(bin, distance)
        {
            return {
                name: 'personal',
                weight: 100,
                wage: distance * 2e-2,
                cost: 0,
                skip: true,
                unique: true,
            };
        },
    ],
});

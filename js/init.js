var client = {
    name: 'ATM',
    version: {
        /* Includes fixes, new major features. Not backwards compatible */
        major: 2,
        /* Includes fixes, new features. Backwards compatible */
        minor: 0,
    },
    config: {},
    tmp: {
        comm_buffer: 0,
        comm_intervals: [],
        clock_last: new Date().getTime(),
        map_markers: {},
        compute_duration: {},
    },
    session: false,
};

function initialize()
{
    window.client.session = {
        variables: {},
        ext: {
            shop: {},
            fluid: {},
            delivery: {},
            repair: {},
            station_id: 0,
        },
        delivery: [],
        settings: {
            cooling_range: 10,
            cooling_offset: 0,
            cooling_operating_offset: 100,

            /* Assist */
            autoland_station: 0,
            thermal_control: 1,
            thermal_control_offset: 10,
            cooling_water_ondemand: 1,
        },
        /* Ctl */
        control: {
            throttle: 0,
            brake: 0,
            fuel: 1,
            thrust: 1,
            scale: 0,
            auto: 0,
            afterburner: 0,
            idle: 0,
        },
        indicator: {

        },
        physics: {
            temp: 300,
            airflow: 0,
            fuelflow: 0,
            burned: 0,
        },
        stats: {
            last_time: time(),
            version: {},
            version_init: {},
            tutorial: {},
            burned_fuel_total: 0,
            burned_fuel: 0,
            burned_fuel_distance: 0,
            time_in_game: 0,
            time_in_game_real: 0,
            deliveries_income: 0,
            deliveries_count: 0,
            deliveries_stops: 0,
            max_speed: 0,
        },
        wakeup: {
            conditions: {
                autoland: false,
                fuel: false,
                service: false,
                stall: false,
            },
        },
        comms: {
            now: [],
            done: [],
            done_groups: [],
            storage: {},
            notify: [],
        },
        loans: {
            /* Amount that will need to be returned */
            debt: 0,
        },
        taxes: {
            amount: 0,
            limit: 1e3,
        },
        debug: {
            fuel: false,
            channels: {},
        },
        map: {},
        region: {},
        region_next: {},
        station_id: 0,
        speed: 0,
        distance: 0,
        money: 5000,
        pause: false,
    };
}

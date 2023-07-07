var $l_debt = $('.debt-amount-label');
var $l_interest = $('#loan-interest-label');
var $c_loan = $('#loan-take-container');
var $b_take = $('.service-take-loan');
var $b_pay = $('#loan-pay-button');

var $l_tax = $('.taxes-amount-label');
var $l_tax_limit = $('.taxes-limit-label');
var $c_tax = $('#taxes-pay-container');
var $b_tax_pay = $('.service-pay-tax');

var $b_recover = $('#recovery-recover-button');

$(function()
{
    $b_take.click(function()
    {
        var prec = parseInt($(this).attr('data-amount')) / 100;

        var max_loan = Svc.get_maximum_loan();

        max_loan -= max_loan * Svc.get_interest();

        var amount = max_loan * prec;

        var result = Svc.take_loan(amount);

        if(result['success'])
        {
            show_popup($(this), lang('services.loans.taken'), 'tooltip-success');

            Svc.draw_tab();
        }
        else
        {
            show_popup($(this), lang('services.loans.take_info.' + result['info']), 'tooltip-danger');
        }
    });

    $b_tax_pay.click(function()
    {
        var prec = parseInt($(this).attr('data-amount')) / 100;

        var amount = Svc.get_taxes_amount() * prec;

        var result = Svc.pay_taxes(amount);

        if(result['success'])
        {
            show_popup($(this), lang('services.taxes.payed'), 'tooltip-success');

            Svc.draw_tab();
        }
        else
        {
            show_popup($(this), lang('services.taxes.pay_info.' + result['info']), 'tooltip-danger');
        }
    });

    $b_pay.click(function()
    {
        var result = Svc.return_all_debt();

        Svc.draw_tab();
    });

    $b_recover.click(function()
    {
        var button = $(this);

        var cost = Svc.get_recovery_cost_next();

        show_dialog(lang('services.recovery.recover_title'), lang(Svc.check_recovery_multiplier() ? 'services.recovery.recover_speed_info' : 'services.recovery.recover_info', {cost: write(cost)}), function()
        {
            var result = Svc.recovery_to_station();

            if(result['success'])
            {
                show_popup(button, lang('services.recovery.recovered'), 'tooltip-success');

                Svc.draw_tab();
            }
            else
            {
                show_popup(button, lang('services.recovery.recover_info.' + result['info']), 'tooltip-danger');
            }
        });
    });

    $('[href="#services-tab"]').on('show.bs.tab', function()
    {
        Svc.draw_tab();
    });

    $l_debt.tooltip({
        title: lang('services.loans.debt'),
    });

    $l_tax.tooltip({
        title: lang('services.taxes.taxes'),
    });

    $('.taxes-limit-info').tooltip({
        title: lang('services.taxes.limit_info'),
    });
});

var Svc = {
    draw_tab: function(skip_recovery)
    {
        Svc.draw_loan_info();
        Svc.draw_taxes_info();
        Svc.draw_recovery_cost();
    },

    get_loans: function()
    {
        return client.session.loans;
    },

    has_loan: function()
    {
        return this.get_debt() > 0;
    },

    get_debt: function()
    {
        var loans = this.get_loans();

        return loans.debt;
    },

    add_debt: function(amount)
    {
        var loans = this.get_loans();

        loans.debt += amount;

        return loans.debt;
    },

    remove_debt: function(amount)
    {
        var loans = this.get_loans();

        if(amount <= loans.debt)
        {
            loans.debt -= amount;
        }

        return loans.debt;
    },

    get_interest: function()
    {
        var loans = Region.get_prop('loans');

        if(loans)
        {
            return loans.interest;
        }

        return 0;
    },

    take_loan: function(amount)
    {
        var player_value = this.get_maximum_loan();

        var debt = amount + amount * this.get_interest();

        if(debt + this.get_debt() > player_value)
        {
            return {success: false, info: 'not_enough_value'};
        }

        this.add_debt(debt);

        client.session.money += amount;

        Game.write_last_cost(lang(`services.loans.income_info`), amount, true);

        return {success: true, info: ''};
    },

    get_loan_return_amount: function(income)
    {
        var player_value = this.get_maximum_loan();

        var return_prec = income / player_value;

        var return_amount = income * return_prec;

        return Math.min(return_amount, this.get_debt());
    },

    get_maximum_loan: function()
    {
        return Delivery.estimate_deliveries_value();
    },

    return_loan_by_income: function(income)
    {
        var return_amount = this.get_loan_return_amount(income);

        return this.return_loan(return_amount);
    },

    return_loan: function(amount)
    {
        if(amount <= client.session.money && amount <= this.get_debt())
        {
            this.remove_debt(amount);
            client.session.money -= amount;

            return {success: true};
        }

        return {success: false};
    },

    return_all_debt: function()
    {
        var debt = Svc.get_debt();

        var result = Svc.return_loan(debt);

        if(result.success)
        {
            Game.write_last_cost(lang(`services.loans.pay_info`), debt, false);

            return {success: true};
        }

        return {success: false};
    },

    draw_loan_info: function()
    {
        var loans = this.get_loans();

        $l_debt.text(write(loans.debt));

        $l_interest.text(Math.round(this.get_interest() * 100));

        var maximum_loan = this.get_maximum_loan();

        if(maximum_loan)
        {
            maximum_loan -= maximum_loan * this.get_interest();

            $c_loan.removeClass('hidden');

            $b_take.each(function()
            {
                var prec = parseInt($(this).attr('data-amount')) / 100;

                var amount = maximum_loan * prec;

                $(this).find('span').text(write(amount));

                if(amount * (1 + Svc.get_interest()) + loans.debt > maximum_loan + maximum_loan * Svc.get_interest())
                {
                    $(this).prop('disabled', true);
                }
                else
                {
                    $(this).prop('disabled', false);
                }
            });
        }
        else
        {
            $c_loan.addClass('hidden');
        }

        if(loans.debt)
        {
            $l_debt.parent().removeClass('hidden');

            $b_pay.removeClass('hidden');

            $b_pay.prop('disabled', loans.debt > client.session.money)

            $b_pay.find('span').text(write(loans.debt));
        }
        else
        {
            $l_debt.parent().addClass('hidden');

            $b_pay.addClass('hidden');
        }
    },

    get_recovery_cost_distance: function()
    {
        var recovery = Region.get_prop('recovery');

        if(recovery)
        {
            return recovery.cost_per_distance;
        }

        return false;
    },

    get_recovery_cost_weight: function()
    {
        var recovery = Region.get_prop('recovery');

        if(recovery)
        {
            return recovery.cost_per_weight;
        }

        return false;
    },

    get_recovery_distance_to_port: function()
    {
        if(Map.check_if_landed())
        {
            var distance = Map.get_next_station_distance(true) - (Map.get_landing_range() / 2);
        }
        else if(Map.check_if_passing_by())
        {
            var distance = Map.get_next_station_distance() - 1;
        }
        else
        {
            var distance = Map.get_next_station_distance() - (Map.get_landing_range() / 2);
        }

        return distance;
    },

    check_recovery_multiplier: function()
    {
        return client.session.speed > 100;
    },

    get_recovery_cost_next: function()
    {
        var distance = this.get_recovery_distance_to_port();

        var totals = Ph.get_totals();

        var multiplier = this.check_recovery_multiplier() ? 10 : 1;

        return (distance * this.get_recovery_cost_distance() + totals.weight * this.get_recovery_cost_weight()) * multiplier;
    },

    recovery_to_station: function()
    {
        var cost = this.get_recovery_cost_next();

        if(cost <= client.session.money)
        {
            client.session.money -= cost;

            Game.write_last_cost(lang(`services.recovery.recover_cost_info`), cost, false);

            var to_port = this.get_recovery_distance_to_port();

            Ph.reset_physics();

            client.session.distance += to_port;
            client.session.speed = 0;

            return {success: true, info: ''};
        }

        return {success: false, info: 'not_enough_money'};
    },

    get_taxes_amount: function()
    {
        return client.session.taxes.amount;
    },

    pay_taxes: function(amount)
    {
        if(this.get_taxes_amount() >= amount)
        {
            if(Game.cash_transfer(lang(`services.taxes.taxes`), amount, false))
            {
                client.session.taxes.amount -= amount;

                client.session.taxes.limit += amount * 0.01;

                return {success: true, info: ''};
            }
            else
            {
                return {success: false, info: 'not_enough_money'};
            }
        }

        return {success: false, info: 'amount_error'};
    },

    add_tax: function(name, amount)
    {
        client.session.taxes.amount += amount;

        if(!client.session.stats.highest_tax || amount > client.session.stats.highest_tax)
        {
            client.session.stats.highest_tax = amount;
        }

        this.draw_tab();

        show_alert({body: lang(`services.taxes.new_tax`) + ' ' + lang(`services.taxes.names.${name}`) + ` (${write(amount)})`, status: 'warning'});
    },

    get_tax_limit: function()
    {
        return client.session.taxes.limit;
    },

    check_tax_limit: function()
    {
        if(client.session.taxes.amount < this.get_tax_limit())
        {
            return true;
        }

        return false;
    },

    manage_taxes: function(action)
    {
        switch(action)
        {
            case 'land':
                this.add_tax('land', Game.get_scalable_cost() * 0.01);
                break;
        }
    },

    draw_recovery_cost: function()
    {
        var cost = this.get_recovery_cost_next();

        if(cost > 0)
        {
            $b_recover.find('span').text(write(cost));

            $b_recover.prop('disabled', cost > client.session.money);
        }
        else
        {
            $b_recover.find('span').text('-');

            $b_recover.prop('disabled', true);
        }
    },

    draw_taxes_info: function()
    {
        var taxes = Svc.get_taxes_amount();

        $l_tax.text(write(taxes));

        $l_tax.parent().removeClass('text-danger').removeClass('text-warning');

        if(Svc.get_taxes_amount() >= Svc.get_tax_limit())
        {
            $l_tax.parent().addClass('text-danger');
        }
        else if(Svc.get_taxes_amount() >= Svc.get_tax_limit() * 0.5)
        {
            $l_tax.parent().addClass('text-warning');
        }

        if(taxes)
        {
            $l_tax_limit.text(write(this.get_tax_limit()));

            $c_tax.removeClass('hidden');

            $b_tax_pay.each(function()
            {
                var prec = parseInt($(this).attr('data-amount')) / 100;

                var amount = taxes * prec;

                $(this).find('span').text(write(amount));

                if(client.session.money < amount)
                {
                    $(this).prop('disabled', true);
                }
                else
                {
                    $(this).prop('disabled', false);
                }
            });

            $l_tax.parent().removeClass('hidden');
        }
        else
        {
            $c_tax.addClass('hidden');

            $l_tax.parent().addClass('hidden');
        }
    },
};

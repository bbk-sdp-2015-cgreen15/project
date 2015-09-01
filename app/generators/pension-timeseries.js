

// TODO - TimeSeries Handler !!

var ONE_SECOND = 1000;
var ONE_DAY = ONE_SECOND * 60 * 60 * 24;
var ONE_YEAR = ONE_DAY * 365;
var DAYS_IN_YEAR = 365;

var PensionChartData = function PensionChartData() {

    function makeChartData(opts) {

        // opts should include the day of the month on which the payment is made

        var day = 0;

        // TODO - Get the Monthly Inputs from the Time Series
        var monthly = Number(opts.monthly);
        var balance = Number(opts.lump);

        // Calculate Daily Interest Rate
        var compoundAnnual = 1 + (opts.apr / 100);
        var compoundDaily = Math.pow(compoundAnnual, (1/365));
        var dailyFactor = compoundDaily - 1;

        var chartData = [];

        chartData.length = 0;

        var start = opts.startTime || 1216080000000;
        start = Number(start);
        var endTime = Number(opts.endTime) > start ? opts.endTime : start + ONE_DAY;
        endTime = Number(endTime);

        var epoch = start;
        var interval = ONE_DAY;

        while (epoch <= endTime) {

            var nowDay = new Date(epoch).getDate();

            // Work out the day of the month
            if (nowDay === Number(opts.startDay)) {
                balance += monthly; // Any extra input
            }

            balance += balance * dailyFactor;   // calculate daily interest !
            chartData.push([epoch, balance]);
            epoch += interval;

            day++;  // Not Used
        }
        return chartData;
    }

    function makeChartDataFromTable(opts) {


        var attributes = opts.attributes;
        console.log(' In makeChartDataFromTable opts is ');
        console.log(opts);

        // opts should include the day of the month on which the payment is made

        var day = 0;

        // TODO - Get the Monthly Inputs from the Time Series
        var monthly = Number(attributes.monthly);
        var balance = Number(attributes.lump);

        // Calculate Daily Interest Rate
        var compoundAnnual = 1 + (attributes.apr / 100);
        var compoundDaily = Math.pow(compoundAnnual, (1/365));
        var dailyFactor = compoundDaily - 1;

        var chartData = [];

        chartData.length = 0;

        var start = attributes.startTime || 1216080000000;
        start = Number(start);
        var endTime = Number(attributes.endTime) > start ? attributes.endTime : start + ONE_DAY;
        endTime = Number(endTime);

        var epoch = start;
        var interval = ONE_DAY;

        while (epoch <= endTime) {

            var nowDay = new Date(epoch).getDate();

            // Work out the day of the month
            if (nowDay === Number(attributes.startDay)) {
                balance += monthly; // Any extra input
            }

            balance += balance * dailyFactor;   // calculate daily interest !
            chartData.push([epoch, balance]);
            epoch += interval;

            day++;  // Not Used
        }
        return chartData;
    }






    return {
        ts: makeChartData,
        tst: makeChartDataFromTable
    };

};

module.exports = PensionChartData;
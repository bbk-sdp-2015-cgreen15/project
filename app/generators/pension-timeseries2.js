

// TODO - TimeSeries Handler !!

var ONE_SECOND = 1000;
var ONE_MINUTE = 60 * ONE_SECOND;
var ONE_DAY = ONE_MINUTE * 60 * 24;

var MONTHS_LOOKUP = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11
};


var PensionChartData2 = function PensionChartData2() {

    function tableEntryEpoch(tableEntries) {

        var i = 0;
        var dateParts;
        for(i =0 ; i < tableEntries.length; i++) {

            var tableEntry = tableEntries[i];
            dateParts = tableEntry.date.split('-');

            var monthVal = MONTHS_LOOKUP[dateParts[1]];
            var day = dateParts[0];
            var year = dateParts[2];

            var date = new Date(year,monthVal,day);
            var offsetMins =  date.getTimezoneOffset();
            tableEntry.epochOther = date.getTime(); // compensate for timezone / summertime etc
            tableEntry.epoch = date.getTime() - (offsetMins * ONE_MINUTE); // compensate for timezone / summertime etc

            tableEntry.offset = offsetMins;
        }
    }

    function tableEntriesToSparseTimeSeries(tableEntries) {

        var sparseTimeSeries = {};

        var i = 0;
        for(i = 0 ; i < tableEntries.length; i++) {

            var tableEntry = tableEntries[i];
            var epoch = tableEntry.epoch;
            var amount = Number(tableEntry.amount);

            sparseTimeSeries[epoch] = {
                amount: amount,
                epoch: epoch,
                balance: 0
            };

        }
        return sparseTimeSeries;
    }


    function makeChartData(data) {

        // calculate the epochs for the time entries

        var opts = data.attributes;
        var tableEntries = data.tableEntries;

        tableEntryEpoch(tableEntries);
        var sparseTimeSeries = tableEntriesToSparseTimeSeries(tableEntries);
        var balance = 0;

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

            balance += balance * dailyFactor;   // calculate daily interest !

            if (sparseTimeSeries[epoch]) {
                balance += Number(sparseTimeSeries[epoch].amount); // any monthly or other payment in
                sparseTimeSeries[epoch].balance = ((Math.round(balance * 100)) / 100);
            }

            chartData.push([epoch, balance]);
            epoch += interval;
        }
        return {
            chartData: chartData,
            sparseTimeSeries: sparseTimeSeries
        };
    }


    return {
        ts: makeChartData
    };

};

module.exports = PensionChartData2;

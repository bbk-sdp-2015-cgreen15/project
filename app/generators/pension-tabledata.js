

// TODO - TimeSeries Handler !!

var ONE_SECOND = 1000;
var ONE_DAY = ONE_SECOND * 60 * 60 * 24;
var ONE_YEAR = ONE_DAY * 365;
var DAYS_IN_YEAR = 365;

var MONTHS = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
};

var PensionTableData = function PensionTableData() {

    var DATE_FORMAT = "d MM yy";


    //***************************************************************************************************************
    // Helper Functions

    function makeStringDate(t) {
        var d = new Date(t);
        return d.getDate() + '-' + MONTHS[d.getMonth()] + '-' + d.getFullYear();
    }

    function makeEntry(entryId, sD, am, bal) {
        bal = bal || '';
        return {entryId: entryId, date: sD, amount: am, balance: bal};
    }


    //***************************************************************************************************************
    // Make Table Data

    function makeTableData(opts) {

        var tableData = [];
        var start = opts.startTime || 1216080000000;
        start = Number(start);
        var endTime = Number(opts.endTime) > start ? opts.endTime : start + ONE_DAY;
        var day = 0;
        var bal = 0;
        var entryId = 0;
        var monthly = Number(opts.monthly);
        var lump = Number(opts.lump);


        // Calculate the loop data
        var epoch = Number(opts.startTime);

        while (epoch <= endTime) {

            var nowDay = new Date(epoch).getDate();
            var sD = makeStringDate(epoch);

            // Work out the day of the month or first lump sum entry
            if (day === 0) {
                tableData.push(makeEntry(entryId, sD, lump, bal));
                entryId++;
            } else if (nowDay === Number(opts.startDay)) {
                tableData.push(makeEntry(entryId, sD, monthly, bal));
                entryId++;
            }
            epoch += ONE_DAY;
            day++;
        }
        return tableData;
    }

    return {
        td: makeTableData
    };

};

module.exports = PensionTableData;

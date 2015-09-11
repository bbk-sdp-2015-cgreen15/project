

var ONE_SECOND = 1000;
var ONE_DAY = ONE_SECOND * 60 * 60 * 24;

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

var MortgageTableData = function MortgageTableData() {

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
        var end = opts.endTime || 1216080000000;
        var endTime = Number(end);
        var day = 0;
        var bal = 0;
        var entryId = 0;
        var monthly = Number(opts.monthly);

        // Calculate the loop data
        var epoch = Number(opts.startTime);

        while (epoch <= endTime) {

            var nowDay = new Date(epoch).getDate();
            var sD = makeStringDate(epoch);

            if (nowDay === Number(opts.startDay)) {
                tableData.push(makeEntry(entryId, sD, monthly, bal));
            }
            entryId++;

            epoch += ONE_DAY;
            day++;
        }
        return tableData;
    }

    return {
        td: makeTableData
    };

};

module.exports = MortgageTableData;

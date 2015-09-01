
console.log('in time wrangling classes');


var TimeEntry = function TimeEntry(date, amount) {
    this.date = date;   // date object or integer
    this.amount = amount;
};

var TimeSeries = function TimeSeries(tsname) {
    this.name = tsname;
    this.timeSeries = [];

    // TODO - we'll end up with a array which is a version of a sparse array
    // need to perhaps index it ??
};


// TODO -

/*

Given a start date, and a duration, make a series of time entries with blank amounts
with dates on those calendar days


Adjust the dates for weekend and bank holiday avoidance ?  ( too much !! )

Assume no date > 28th





 */


// TODO - Convert Float to DeciInt


var TimeSeriesHelper = {

    /**
     *
     * @param myDate
     */

    clearHoursMinsSeconds: function (myDate) {



    },


    /**
     *
     * @param Int dayOfMonth
     * @param Date startDate
     * @param Date endDate
     * @param amount Float
     */
    makeTimeSeries: function (dayOfMonth, startDate, endDate, amount) {


        startDate = startDate || new Date();
        endDate = endDate || new Date();
        amount = amount || 0;

        if (Number(dayOfMonth) > 28) {
            dayOfMonth = 28;
        }

        // dayOfMonth could be the string 'lastDay'

        // get the timestamp from the endDate

        var endDateTS = endDate.getTime();







    }

};




// TODO -


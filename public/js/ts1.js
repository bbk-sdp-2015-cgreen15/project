console.log(' In TS 1');

var ts1 = [];
var ts2 = [];
var ts3 = [];

(function () {



    var start = 1296080000000;
    var dayNow = start;
    var ONEDAY = 1000 * 60 * 60 * 24;



    // Do a Monthly Thing



    // In

    var monthlies = [
        [1, -200], [2, -150], [3, -38], [14, -220], [25, 700]
    ];


    var bal = 650;
var todayEntry;
var todaySum;


    var monthlyCopy = [];

    // 12 months * 2 years


        // month loop
    for (var i=0; i < 24; i++) {


        monthlyCopy.length = 0;
        monthlyCopy = [];

        todaySum = 0;
        for(var k =0 ; k < monthlies.length; k++) {
            monthlyCopy.push(monthlies[k]);
        }

        var doShift = true;

            // day loop
        for (var j=1; j < 31; j++) {


            // TODO - fix it for multiple entries on one day !

            dayNow += ONEDAY;

            if (doShift) {
                // Is there an entry for this date
                todayEntry = monthlyCopy.shift();
            }

            if (todayEntry && todayEntry[0] === j) {
                // Do the bar entry,  sum the bal entry

                bal += todayEntry[1];
                doShift = true;

                ts2.push([dayNow, todayEntry[1]]);

            } else {
                doShift = false;
            }

            ts3.push([dayNow, bal]);
            // console.log(' j is ' + j + ' i is ' + i + ' dayNow is ' + dayNow);

        }


    }



})();


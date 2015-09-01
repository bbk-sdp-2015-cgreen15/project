

function makeTimeSeriesOLD(opts) {

    console.log(' this is the correct time-series code ');

    var timeSeries = [];

    timeSeries.length = 0;

    var start = opts.startTime || 1216080000000;
    start = Number(start);
    var endTime = Number(opts.endTime) > start ? opts.endTime : start + (1000 * 60 * 60 * 24 * 365);
    endTime = Number(endTime);

    var epoch = start;
    var interval = 1000 * 24 * 60 * 60;
    var val = 500;
    var seed = 5;

    while (epoch <= endTime) {
        val = val + Math.random();
        seed = ( seed + 17 ) % 5;
        timeSeries.push([epoch, val]);
        epoch = epoch + interval;
    }
    return timeSeries;
}



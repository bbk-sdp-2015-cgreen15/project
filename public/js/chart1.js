
console.log(" In Chart 1 ");

//$(function () {
//
//    $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
//        // Create the chart
//
//        console.log(data);
//
//        $('#chart').highcharts('StockChart', {
//
//            rangeSelector : {
//                selected : 1
//            },
//
//            title : {
//                text : 'AAPL Stock Price'
//            },
//
//            series : [{
//                name : 'AAPL',
//                data : data,
//                tooltip: {
//                    valueDecimals: 2
//                }
//            }]
//        });
//    });
//
//});

var start = 1216080000000;
var epoch = start;
var interval = 1000 * 24 * 60 * 60;
var data = [];
var data2 = [];
var val = 500;
var val2 = 500;
var seed = 5;
for (var i = 0; i < 1000; i++)
{

val = val + Math.random();
    seed = ( seed + 17 ) % 5;
    data.push([epoch, val]);

    val2 = val2 + seed / 2;
    data2.push([epoch, val2]);
epoch = epoch + interval;

}






$(function () {

        // Create the chart

        console.log(data);

    // $('#chart1').draggable();
   // $('#chart2').draggable();

        $('#chart1').highcharts('StockChart', {

            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'Uppy Thngie'
            },

            series : [{
                name : 'Uppy',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });

    $('#chart2').highcharts('StockChart', {

        chart: {
            type: 'column'
        },

        rangeSelector : {
            selected : 1
        },

        title : {
            text : 'Baary Thngie'
        },

        series : [{
            name : 'Baary',
            data : data2,
            tooltip: {
                valueDecimals: 2
            }
        },
            {
                type: 'spline',
                name : 'Klaargh',
                data : data,
                tooltip: {
                    valueDecimals: 2
                }
            }


        ]
    });


});
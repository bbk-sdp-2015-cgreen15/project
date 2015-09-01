
console.log(" In Chart 2 ");

var start = 1296080000000;
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
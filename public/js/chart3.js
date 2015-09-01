
console.log(" In Chart 3 ");



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
            data : ts1,
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
            text : 'Input and Total'
        },

        series : [{
            name : 'Baary',
            data : ts2,
            tooltip: {
                valueDecimals: 2
            }
        },
            {
                type: 'line',
                name : 'Klaargh',
                data : ts3,
                tooltip: {
                    valueDecimals: 2
                }
            }


        ]
    });


});
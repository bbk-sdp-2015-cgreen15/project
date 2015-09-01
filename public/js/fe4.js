(function () {

    'use strict';



    //*******************************************************************************
    // Constants + Pseudo Globals

    var RESIZABLE = false;




    var widgetList = {};    // Hash List !
    var widgetHelpers;


    //*******************************************************************************
    // Classes


    // Widget Class
    var Widget = function Widget(idx) {

        this.idx = idx;
        this.html = 'some html';
        this.z = idx + 1;
        this.domId = 'widgetId_' + idx.toString();
    };




    //*******************************************************************************
    // MAIN

    (function () {


        //*******************************************************************************
        // Private Functions

        function showOne(context, whichOne) {

            var widgetChart = $(context).find('.widget-chart');
            var widgetEdit = $(context).find('.widget-edit');
            var widgetTable = $(context).find('.widget-table');

            widgetChart.hide();
            widgetEdit.hide();
            widgetTable.hide();

            switch(whichOne) {
                case 'chart':
                    widgetChart.show();
                    break;
                case 'edit':
                    widgetEdit.show();
                    break;
                case 'table':
                    widgetTable.show();
                    break;
            }

        }

        function toggleMoving(context) {

            var moveIcon = $(context).find('.widget-mover');
            if ($(moveIcon).hasClass('widget-movable')) {
                console.log(' would toggle moving ');
                $(context).draggable({disabled: true});
                $(moveIcon).removeClass('widget-movable');
                $(moveIcon).addClass('widget-immovable');
            } else {
                console.log(' would toggle moving ');
                $(context).draggable({disabled: false});
                $(moveIcon).removeClass('widget-immovable');
                $(moveIcon).addClass('widget-movable');
            }
        }

        function showCharty(context) {
            showOne(context, 'chart');
        }

        function showTably(context) {
            showOne(context, 'table');
        }

        function showEdity(context) {
            showOne(context, 'edit');
        }



        //*******************************************************************************
        // Setup

        widgetHelpers = {

            widgetFactory: function widgetFactory() {

                // get the new index from the widgetList

                var idx = this.countWidgets();
                widgetList[idx] = new Widget(idx);
                return widgetList[idx];

            },

            countWidgets: function () {
                var keys = Object.keys(widgetList);
                console.log(' number if widgets is ' + keys.length);
                return keys.length;
            },

            initWidgets: function initWidgets() {

            },


            setZIndexes: function (wid) {
                var keys = Object.keys(widgetList);
                for(var i=0; i < keys.length; i++) {
                    var key = keys[i];
                    var $wc = $('#widgetId_' + key);
                    if ($wc) {
                        $wc.css('z-index', key);
                    }

                }
                $('#widgetId_' + wid).css('z-index', 32);
            },


            showWidgetKeys: function () {

                var keys = Object.keys(widgetList);
                console.log(" Widget Keys is ");
                console.log(keys);
            },


            widgetClickHandler: function (wid) {
                return function (e) {
                    console.log('widget id ' + wid + ' clicked');
                    console.log(e.target);

                    // find target element
                    var targetEle = '';
                    if ($(e.target).hasClass('widget-slayer')) targetEle = 'slayer';
                    if ($(e.target).hasClass('widget-mover')) targetEle = 'mover';
                    if ($(e.target).hasClass('widget-charter')) targetEle = 'charter';
                    if ($(e.target).hasClass('widget-tabler')) targetEle = 'tabler';
                    if ($(e.target).hasClass('widget-editer')) targetEle = 'editer';


                    switch (targetEle) {

                        case 'slayer':
                            this.remove();
                            break;
                        case 'charter':
                            showCharty(this);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'tabler':
                            showTably(this);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'editer':
                            showEdity(this);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'mover':
                            toggleMoving(this);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        default:
                            widgetHelpers.setZIndexes(wid);
                            break;
                    }
                }
            }
        };
    })();


    var $wc;

    function init() {

        $wc = $('#widgetsContainer');
        registerEventListeners();
        widgetHelpers.initWidgets();

    }

    function addWidget() {
        // Get the number of widgets so far

        var newWidget = widgetHelpers.widgetFactory();
        var idx = newWidget.idx;

        var widgetTemplateScript = $('#widget-template').html();
        var widgetTemplate = Handlebars.compile(widgetTemplateScript);
        var widgetData = {widgetDomId: newWidget.domId, widgetId: newWidget.idx};
        $wc.append(widgetTemplate(widgetData));

        var clickedFn = widgetHelpers.widgetClickHandler(newWidget.idx);

        setTimeout(function () {
            var $nwd = $('#' + newWidget.domId);
            $nwd.draggable();
            if (RESIZABLE) $nwd.resizable();

            // set z-index
            $nwd.css('z-index', newWidget.z);
            $nwd.css('left', 10 + newWidget.idx * 3);
            $nwd.css('top', 40 + newWidget.idx * 3);
            $nwd.on('click', clickedFn);
            widgetHelpers.setZIndexes(newWidget.idx);
        }, 0);

        setTimeout(function () {
            drawChart();
        }, 1000);

    }

    function registerEventListeners() {

        console.log(' in register event listeners ');

        // attach to add widget button
        var $addWidget = $('#add-widget');
        $addWidget.on('click', addWidget);

        $('#show-keys').on('click', function () {
            widgetHelpers.showWidgetKeys();
        })

    }
    // Register event listeners









    console.log(" In Chart 1 ");


    var start = 1216080000000;
    var epoch = start;
    var interval = 1000 * 24 * 60 * 60;
    var data = [];

    var val = 500;

    var seed = 5;
    for (var i = 0; i < 1000; i++)
    {

        val = val + Math.random();
        seed = ( seed + 17 ) % 5;
        data.push([epoch, val]);
        epoch = epoch + interval;

    }







    function drawChart() {

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




    }



















    $(function() {
        init();
    });



})();
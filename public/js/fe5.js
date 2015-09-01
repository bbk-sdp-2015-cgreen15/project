//*******************************************************************************
// Main Script for handling Widgets etc

(function () {

    'use strict';



    //*******************************************************************************
    // Constants + Pseudo Globals

    var RESIZABLE = false;
    var widgetList = {};    // Hash List !
    var widgetHelpers;

    // make some data

    var start = 1216080000000;
    var epoch = start;
    var interval = 1000 * 24 * 60 * 60;
    var data = [];
    var val = 500;
    var seed = 5;

    for (var i = 0; i < 1000; i++) {

        val = val + Math.random();
        seed = ( seed + 17 ) % 5;
        data.push([epoch, val]);
        epoch = epoch + interval;

    }




    //*******************************************************************************
    // Classes


    // Widget Class
    var Widget = function Widget(idx) {

        this.idx = idx;
        this.hasChart = false;
        this.type = null;
        this.instrument = null;
        this.html = '';
        this.z = idx + 1;
        this.domId = 'widgetId_' + idx.toString();
        this.chartId = 'widgetChartId_' + idx.toString();
        this.ko = {}; // Knockout Model !
        this.timeSeries = [[0,0]];
        return this;

    };




    //*******************************************************************************
    // MAIN

    (function () {


        //*******************************************************************************
        // Private Functions


        function makeTimeSeries(widget) {

            console.log(' make the timeseries for the widget, based on the table info ');


            widget.timeSeries = [];
            widget.timeSeries.length = 0;

            var start = 1216080000000;
            var epoch = start;
            var interval = 1000 * 24 * 60 * 60;
            var val = 500;
            var seed = 5;

            for (var i = 0; i < 100; i++) {

                val = val + Math.random();
                seed = ( seed + 17 ) % 5;
                widget.timeSeries.push([epoch, val]);
                epoch = epoch + interval;

            }
            console.log("widget");
            console.log(widget);
        }


        function chooseInstrument(context, wid) {

            var type = $(context).data('inst-type');
            var typeParts = type.split('-');
            widgetList[wid].type = typeParts[0];
            widgetList[wid].instrument = typeParts[1];

            console.log('Choose Insrument ' + type);
            console.log(widgetList[wid]);
        }


        function showOne(context, whichOne, wid) {


            // get widget ID from context
            var wid = $(context).data('widget-id');

            console.log('cintext is ', wid);
            console.log(context);
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
                $(context).draggable({disabled: true});
                $(moveIcon).removeClass('widget-movable');
                $(moveIcon).addClass('widget-immovable');
            } else {
                $(context).draggable({disabled: false});
                $(moveIcon).removeClass('widget-immovable');
                $(moveIcon).addClass('widget-movable');
            }
        }

        function showCharty(context, wid) {

            showOne(context, 'chart', wid);
            var widget = widgetList[wid];
            setTimeout(function () {
                drawChart(widget);
            },0);
        }

        function showTably(context, wid) {

            showOne(context, 'table');
            makeTimeSeries(widgetList[wid]);
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
                    if ($(e.target).hasClass('instrument')) targetEle = 'instrument';


                    switch (targetEle) {

                        case 'slayer':
                            this.remove();
                            break;
                        case 'charter':
                            showCharty(this, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'tabler':
                            showTably(this, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'editer':
                            showEdity(this, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'mover':
                            toggleMoving(this, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'instrument':
                            chooseInstrument(e.target, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        default:
                            widgetHelpers.setZIndexes(wid);
                            break;
                    }
                }
            }
        };
    })();    // End Main


    var $wc;

    function init() {

        $wc = $('#widgetsContainer');
        registerEventListeners();
        widgetHelpers.initWidgets();

    }



    /*

     if ($.isEmptyObject(container1VM)) {
     container1VM = new ContainerViewModel();
     ko.applyBindings(container1VM, document.getElementById("container3"));
     }

    */


    function placeWidget(newWidget) {

        $wc.append(newWidget.html);
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
    }

    function addWidget() {

        // Get the number of widgets so far

        var newWidget = widgetHelpers.widgetFactory();

        var widgetTemplateScript = $('#widget-template').html();
        var widgetTemplate = Handlebars.compile(widgetTemplateScript);
        var widgetData = {
            widgetDomId: newWidget.domId,
            widgetChartId: newWidget.chartId,
            widgetId: newWidget.idx
        };

        newWidget.html = widgetTemplate(widgetData);

        placeWidget(newWidget);

    }

    function registerEventListeners() {


        // attach to add widget button
        var $addWidget = $('#add-widget');
        $addWidget.on('click', addWidget);

    }
    // Register event listeners









    function refreshChart(widget) {
        console.log('would refresh the chart ');
    }


    function drawChart(widget) {

        // Create the chart

     //   if (widget.hasChart) return;
     //   widget.hasChart = true;



        // Ge the timeseries from the widget itself !

        console.log(' Would render chart ID ' + widget.chartId);
        console.log(widget.timeSeries);


        // GET CHART DATA FROM WIDGET MODEl !!!

        $('#' + widget.chartId).highcharts('StockChart', {

            rangeSelector : {
                selected : 1
            },

            title : {
                text : 'Chart ' + widget.chartId
            },

            series : [{
                name : 'Uppy',
                data : widget.timeSeries,
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
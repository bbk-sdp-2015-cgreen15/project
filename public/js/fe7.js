//*******************************************************************************
// Main Script for handling Widgets etc

(function () {

    'use strict';

    //*******************************************************************************
    // Constants + Pseudo Globals

    var RESIZABLE = false;
    var widgetList = {};    // Hash List !
    var widgetHelpers;

    var templateIdList = ['widget-template',
        'widget-pension-main',
        'widget-isa-main',
        'widget-mortgage-main',
        'widget-cc-main'
    ];

    var templateCompiledList = {};
    var $wc;    // Widget Container

    //*******************************************************************************
    // Classes


    // Widget Class
    var Widget = function Widget(idx) {

        this.idx = idx;
        this.type = null;
        this.instrument = null;
        this.html = '';
        this.z = idx + 1;
        this.domId = 'widgetId_' + idx.toString();
        this.chartId = 'widgetChartId_' + idx.toString();
        this.editStage1Id = 'editStage1Id_' + idx.toString();
        this.editStage2Id = 'editStage2Id_' + idx.toString();
        this.editStage3Id = 'editStage3Id_' + idx.toString();
        this.editStage1Value = null;
        this.editStage2Value = null;
        this.editStage3Value = null;
        this.ko = {}; // Knockout Model !
        this.timeSeries = [];  // Blank
        return this;

    };



    //*******************************************************************************
    // Private Functions for General Use

    function alertMessage(message) {
        alert(message);
    }



    function compileTemplates() {

        var template;

        var i;
        for(i = 0; i < templateIdList.length; i++) {

            var templateId = templateIdList[i];
            template = $('#' + templateId).html();
            templateCompiledList[templateId] = Handlebars.compile(template);
        }
    }

    function makeTimeSeries(widget) {

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
    }


    //*******************************************************************************
    // MAIN

    (function () {

        //*******************************************************************************
        // Private Functions for Widget Helpers

// has the widget already been made ???
        // IMMUTABLE ! -
 //       Throw the widget away if not


        function applyDatePickers(wid) {

            var $start = $('#startDateId_' + wid);
            $start.datepicker();
            $start.datepicker('option', 'dateFormat', "d MM yy");
            var $end = $('#endDateId_' + wid);
            $end.datepicker();
            $end.datepicker('option', 'dateFormat', "d MM yy");
        }


        function addMortgage(wid) {
            console.log(' Would Add Mortgage');
        }

        function addCreditCard(wid) {
            console.log(' Would Add Credit Card');
        }

        function addPension(wid) {
            console.log(' Would Add Pension');
        }

        function addISA(wid) {
            console.log(' Would Add ISA');
        }

        function addInstrument(wid) {

            // TODO - refactor to use different templates !

            var widget = widgetList[wid];
            var instrument = widget.instrument;
            switch(instrument) {
                case 'mortgage':
                    addMortgage(wid);
                    break;
                case 'pension':
                    addPension(wid);
                    break;
                case 'isa':
                    addISA(wid);
                    break;
                case 'cc':
                    addCreditCard(wid);
                    break;
            }

            // Put a compiled template into the appropriate place
            var $ins = $('#' + widget.editStage2Id);

            // get a compiled template for this type of instrument
            var templateName = 'widget-' + instrument + '-main';
            var template = templateCompiledList[templateName];

            var stage2Data = {
                widgetStartDateId: 'startDateId_' + wid,
                widgetEndDateId: 'endDateId_' + wid,
                widgetAPR: 'aprId_' + wid
            };

            var stage2Html = template(stage2Data);
            $ins.html(stage2Html);

            setTimeout(function () {
                applyDatePickers(wid);
            }, 0);

        }



        function boldChosenInstrument(context) {
            $(context).removeClass('greyed');
            $(context).addClass('bolded');
        }
        function greyOutAllInstruments(widDomId) {

            // In this widget, find the thing with class instrument-chooser
            // find all its direct descendents with class instrument
            // add class greyed

            var $widget = $('#' + widDomId);
            $widget.find('.instrument').addClass('greyed');
        }

        function chooseInstrument(context, wid) {

            var widget = widgetList[wid];

            if (widget.editStage1Value) {
                return alertMessage(' Type of instrument already chosen for this widget ! ' +
                ' Make another widget if required (and delete this one if not needed).');
            }

            greyOutAllInstruments(widget.domId);
            boldChosenInstrument(context);

            var typeList = $(context).data('inst-type');
            var typeParts = typeList.split('-');
            widget.type = typeParts[0];
            widget.editStage1Value = widget.instrument = typeParts[1];

            addInstrument(wid);

            setTimeout(function () {
                chooseStage(null, wid, 2);
            }, 1200);

        }

        function chooseStage(context, wid, stageId) {

            // widget-edit-stage

            // unbold all stages, bold the selected stage
            var widget = widgetList[wid];
            var rate = 1000;

            var stage;
            if (stageId) {
                stage = stageId
            } else {
                stage = $(context).data('stage');
            }
            var $widget = $('#' + widget.domId);
            $widget.find('.widget-edit-stage').removeClass('bolded');
            $widget.find('.widget-edit-stage.stage-' + stage).addClass('bolded');

            var stage1Id = 'editStage1Id_' + wid;
            var stage2Id = 'editStage2Id_' + wid;
            var stage3Id = 'editStage3Id_' + wid;

            $('#' + stage1Id).hide(rate);
            $('#' + stage2Id).hide(rate);
            $('#' + stage3Id).hide(rate);

            if (1 == stage) $('#' + stage1Id).show(rate);
            if (2 == stage) $('#' + stage2Id).show(rate);
            if (3 == stage) $('#' + stage3Id).show(rate);
        }

        function showOne(context, whichOne, wid) {

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

                var idx = this.countWidgets();  // get the new index from the widgetList
                widgetList[idx] = new Widget(idx);
                return widgetList[idx];
            },

            countWidgets: function () {
                var keys = Object.keys(widgetList);
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

                    // find target element
                    var targetEle = '';
                    if ($(e.target).hasClass('widget-slayer')) targetEle = 'slayer';
                    if ($(e.target).hasClass('widget-mover')) targetEle = 'mover';
                    if ($(e.target).hasClass('widget-charter')) targetEle = 'charter';
                    if ($(e.target).hasClass('widget-tabler')) targetEle = 'tabler';
                    if ($(e.target).hasClass('widget-editer')) targetEle = 'editer';
                    if ($(e.target).hasClass('instrument')) targetEle = 'instrument';
                    if ($(e.target).hasClass('widget-edit-stage')) targetEle = 'edit-stage';

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
                        case 'edit-stage':
                            chooseStage(e.target, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        default:
                            widgetHelpers.setZIndexes(wid);
                            break;
                    }
                }
            }
        };
    })();    // End Widget Helpers Code


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

        var newWidget = widgetHelpers.widgetFactory();

        var widgetTemplate = templateCompiledList['widget-template'];

        var widgetData = {
            widgetDomId: newWidget.domId,
            widgetChartId: newWidget.chartId,
            widgetId: newWidget.idx,
            widgetEditStage1: newWidget.editStage1Id,
            widgetEditStage2: newWidget.editStage2Id,
            widgetEditStage3: newWidget.editStage3Id
        };

        newWidget.html = widgetTemplate(widgetData);

        placeWidget(newWidget);

    }

    function registerEventListeners() {


        // attach to add widget button
        var $addWidget = $('#add-widget');
        $addWidget.on('click', addWidget);

    }

    function drawChart(widget) {

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


    function init() {

        compileTemplates(); // Get the Handlebars Templates and compile them
        $wc = $('#widgetsContainer');
        registerEventListeners();
        widgetHelpers.initWidgets();

    }


    // Dom Ready Handler
    $(function() {
        init();
    });

})();
/*

 if ($.isEmptyObject(container1VM)) {
 container1VM = new ContainerViewModel();
 ko.applyBindings(container1VM, document.getElementById("container3"));
 }

 */

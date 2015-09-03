//*******************************************************************************
// Main Script for handling Widgets etc


// var _ = require('lodash');

console.log('fe13');
var ONE_MINUTE = 60 * 1000;

(function () {

    'use strict';

    //*******************************************************************************
    // Constants + Pseudo Globals

    var DATE_FORMAT = "d MM yy";
    var WIDGET_WIDTH = 600;
    var WIDGET_HEIGHT = 400;
    var SHOWSPEED = 800;

    var STAGE_DETAILS = 1;
    var STAGE_TABLE = 2;
    var STAGE_CHART = 3;

    var RESIZABLE = false;
    var widgetList = {};    // Hash List !
    var widgetHelpers;

    var templateIdList = [
        'widget-template',
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
        this.type = null;   // TODO - does this get set ?
        this.instrument = null;
        this.html = '';
        this.z = idx + 1;
        this.domId = 'widgetId_' + idx.toString();
        this.chartId = 'widgetChartId_' + idx.toString();
        this.tableId = 'widgetTableId_' + idx.toString();
        this.editStage1Id = 'editStage1Id_' + idx.toString();
        this.editStage2Id = 'editStage2Id_' + idx.toString();
        this.editStage3Id = 'editStage3Id_' + idx.toString();
        this.editStage1Value = null;
        this.editStage2Value = null;
        this.editStage3Value = null;
        this.ko = {}; // Knockout Model !

        this.chartData = [];
        this.attributes = {
            type: null
        };

        return this;
    };


    var extend = function (base, child) {

        for (var fn in base) {

            if(base.hasOwnProperty(fn)) {
                child[fn] = base[fn];
            }

        }

    };


    function BaseViewModel(context) {

        var self = context;

        self.startDate = ko.observable();
        self.endDate = ko.observable();
        self.tableEntries = ko.observableArray([]);

        self.setOpts = function (opts) {
            self._opts = opts || {};
        };


        self.copyDown = function (e) {

            var wid = self._opts.wid;

            var entryId = e.entryId;
            var entry = self.tableEntries()[entryId];
            var oldEntries = self.tableEntries();
            var newValue = Number(entry.amount);
            var entriesLength = oldEntries.length;

            var entryToChange = {};

            for (var i = 0; i < entriesLength; i++) {

                if (i < entryId) continue;
                entryToChange = oldEntries[i];
                entryToChange.amount = newValue;
                self.tableEntries.splice(i, 1, entryToChange); // Replace the entry at the appropriate index
            }

            var data = self.tableEntries();
            self.tableEntries(null);
            self.tableEntries(data);

            makeChartSeries(wid, function () {

            });

        };

        return self;

    }

    // TODO - Class Extender



    function PensionViewModel(opts) {

        // TODO - extend from Base Class ?

        var self = this;

        self._opts = opts || {};
        self.model = {};

        self.apr = ko.observable("0");
        self.monthly = ko.observable("50");
        self.lump = ko.observable("1000");


        // Update Functions

        self.addItem = function () {
            self.myItems.push(Math.random().toString());
        };

        self.removePlace = function (place) {
            self.myItems.remove(place);
        };


        //
        self.saveStage2 = function () {

            var wid = self._opts.wid;
            var widget = widgetList[wid];
            var attributes = widget.attributes;

            attributes.type = widget.type;
            attributes.startDate = self.startDate();
            attributes.endDate = self.endDate();

            var startDate = $.datepicker.parseDate(DATE_FORMAT, attributes.startDate);
            var endDate = $.datepicker.parseDate(DATE_FORMAT, attributes.endDate);

            var startOffset = startDate.getTimezoneOffset();
            var endOffset = endDate.getTimezoneOffset();

            // Convert to UTC
            attributes.startTime = startDate.getTime() - (startOffset * ONE_MINUTE);
            attributes.endTime   = endDate.getTime()   - (endOffset   * ONE_MINUTE);

            var day = new Date(attributes.startTime).getDate();
            attributes.startDay = day > 28 ? 28 : day;
            attributes.monthly = self.monthly();
            attributes.apr = self.apr();
            attributes.lump = self.lump();

            goToTablyWithDates(wid);
        };


        self.saveEntries = function () {

            var wid = self._opts.wid;
            var widget = widgetList[wid];
            var attributes = widget.attributes;


            makeChartSeries(wid, function () {
                console.log(' Make Chart Series Callback called from saveEntries');
            })

        };

        self.addEntry = function (e) {
        };

        return self;
    }


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

    //*******************************************************************************
    // Orchestration functions


    function updateBalances(wid, sparseTimeSeries) {

        var widget = widgetList[wid];
        var tableEntries = widget.ko.tableEntries();
        var i = 0;

        $.each(sparseTimeSeries, function (key, value) {

            // update the display balance
            tableEntries[i].balance = value.balance;
            i++;
        });

        widget.ko.tableEntries(null);
        widget.ko.tableEntries(tableEntries);
    }


    function makeChartSeries(wid, callback) {

        var widget = widgetList[wid];
        var attributes = widget.attributes;
        var tableEntries = widget.ko.tableEntries();

        // Get chartData from the service
        $.ajax({
            url: "/app/tst",
            type: "post",
            data: JSON.stringify({
                attributes: attributes,
                tableEntries: tableEntries
            }),
            contentType: "application/json",
            dataType:'json'

        }).success(function (data) {

            widget.chartData = data.chartData;
            var sparseTimeSeries = data.sparseTimeSeries;
            console.log('sparseTimeSeries');
            console.log(sparseTimeSeries);
            updateBalances(wid, sparseTimeSeries);
            callback();
        });
    }


    function goToTablyWithDates(wid) {

        var widget = widgetList[wid];
        var attributes = widget.attributes;

        // Get TableData from the service
        $.ajax({
            url: "/app/tabledata",
            type: "post",
            data: attributes
        }).success(function(tableData) {

            widget.ko.tableEntries(tableData);
            widget.editStage2Value = true;

            makeChartSeries(wid, function () {

                widgetHelpers.showCharty(wid);
            });
        });
    }

    //*******************************************************************************
    // MAIN

    (function () {

        //*******************************************************************************
        // Private Functions for Widget Helpers

        // TODO - fix the Keith Wood KO datepickers issue !

        function applyDatePickers(wid) {

            var $start = $('#startDateId_' + wid);
            $start.datepicker();
            $start.datepicker('option', 'dateFormat', DATE_FORMAT);
            var $end = $('#endDateId_' + wid);
            $end.datepicker();
            $end.datepicker('option', 'dateFormat', DATE_FORMAT);
        }

        function addMortgage(wid) {
            console.log(' Would Add Mortgage');
        }

        function addCreditCard(wid) {
            console.log(' Would Add Credit Card');
        }

        function addPension(wid) {

            var widget = widgetList[wid];
            console.log(' In Add Pension widget is ' , widget );
            addTable(wid, 'pension');

            setTimeout(function () {
                applyBindings(widget);
            }, 0);
        }

        function addISA(wid) {
            console.log(' Would Add ISA');
        }

        function addTable(wid, instrument) {

            var widget = widgetList[wid];
            var instrument = widget.instrument || 'pension';    // TODO - Fix !

// TODO - Template Caching
            var templateName = 'widget-' + instrument + '-table';
            var templateHtml= $('#' + templateName).html();
            var templateCompiled = Handlebars.compile(templateHtml);
            var data = {};
            var $ins = $('#' + widget.tableId);
            var tableHtml = templateCompiled(data);
            $ins.html(tableHtml);

        }


        function addInstrument(wid) {

            // TODO - refactor to use different templates !

            var widget = widgetList[wid];
            var instrument = widget.instrument;

            // STAGE 2 Template

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

            addTable(wid, instrument);

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
        }

        function boldChosenInstrument(context) {
            $(context).removeClass('greyed');
            $(context).addClass('bolded');
        }

        function greyOutAllInstruments(wid) {

            // In this widget, find the thing with class instrument-chooser
            // find all its direct descendants with class instrument
            // add class greyed

            var widget = widgetList[wid];
            var $widget = $('#' + widget.domId);
            $widget.find('.instrument').addClass('greyed');
        }

        function chooseInstrument(context, wid) {

            var widget = widgetList[wid];

            if (widget.editStage1Value) {
                return alertMessage(' Type of instrument already chosen for this widget ! ' +
                ' Make another widget if required (and delete this one if not needed).');
            }

            greyOutAllInstruments(wid);
            boldChosenInstrument(context);

            var typeList = $(context).data('inst-type');
            var typeParts = typeList.split('-');
            widget.type = typeParts[0];
            widget.editStage1Value = widget.instrument = typeParts[1];

            addInstrument(wid);

            setTimeout(function () {
                chooseStage(wid, 2);
            }, 900);
        }

        function chooseStage(wid, stageId) {

            // un-bold all stages, bold the selected stage
            var widget = widgetList[wid];
            var $widget = $('#' + widget.domId);

            var stage;
            if (stageId) {
                stage = Number(stageId);
            } else {
                stage = Number($widget.data('stage'));
            }

            $widget.find('.widget-edit-stage').removeClass('bolded');
            $widget.find('.widget-edit-stage.stage-' + stage).addClass('bolded');

            var stage1Id = 'editStage1Id_' + wid;
            var stage2Id = 'editStage2Id_' + wid;
            var stage3Id = 'editStage3Id_' + wid;

            $('#' + stage1Id).hide(SHOWSPEED);
            $('#' + stage2Id).hide(SHOWSPEED);
            $('#' + stage3Id).hide(SHOWSPEED);

            if (STAGE_DETAILS === stage) $('#' + stage1Id).show(SHOWSPEED);
            if (STAGE_TABLE === stage) $('#' + stage2Id).show(SHOWSPEED);
            if (STAGE_CHART === stage) $('#' + stage3Id).show(SHOWSPEED);
        }


        function showOne(whichOne, wid) {

            var widget = widgetList[wid];
            var $widget = $('#' + widget.domId);

            var widgetChart = $widget.find('.widget-chart');
            var widgetEdit = $widget.find('.widget-edit');
            var widgetTable = $widget.find('.widget-table');

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

        function toggleMoving(wid) {

            var widget = widgetList[wid];
            var $widget = $('#' + widget.domId);

            var moveIcon = $widget.find('.widget-mover');
            if ($(moveIcon).hasClass('widget-movable')) {
                $widget.draggable({disabled: true});
                $(moveIcon).removeClass('widget-movable');
                $(moveIcon).addClass('widget-immovable');
            } else {
                $widget.draggable({disabled: false});
                $(moveIcon).removeClass('widget-immovable');
                $(moveIcon).addClass('widget-movable');
            }
        }

        function showCharty(wid) {

            showOne('chart', wid);
            var widget = widgetList[wid];
            setTimeout(function () {
                drawChart(widget);
            },0);
        }

        function showTably(wid) {
            showOne('table', wid);
        }

        function showEdity(wid) {
            showOne('edit', wid);
        }



        //*******************************************************************************
        // Setup

        widgetHelpers = {

            widgetFactory: function widgetFactory(instrument) {

                var wid = this.countWidgets();  // get the new index from the widgetList
                var widget = widgetList[wid] = new Widget(wid);

                // TODO - refactor instrument choosing !!
                switch(instrument) {
                    case 'pension':
                        widget.ko = new PensionViewModel({wid: wid});
                        var baseViewModel = new BaseViewModel(widget.ko);
                        extend(baseViewModel, widget.ko);
                        break;
                }
                return widget;
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
                            showCharty(wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'tabler':
                            showTably(wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'editer':
                            showEdity(wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'mover':
                            toggleMoving(wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'instrument':
                            chooseInstrument(e.target, wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        case 'edit-stage':
                            chooseStage(wid);
                            widgetHelpers.setZIndexes(wid);
                            break;
                        default:
                            widgetHelpers.setZIndexes(wid);
                            break;
                    }
                }
            },

            chooseStage: chooseStage,
            showCharty: showCharty
        };
    })();    // End Widget Helpers Code


    function applyBindings(widget) {

        var domEle = document.getElementById(widget.domId);
        ko.applyBindings(widget.ko, domEle);
    }


    function placeWidget(widget) {

        // get window size and place randomly
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        var xrange = (viewportWidth - WIDGET_WIDTH) > 0 ? viewportWidth - WIDGET_WIDTH : 100;
        var yrange = (viewportHeight - WIDGET_HEIGHT - 35) > 0 ? viewportHeight - WIDGET_HEIGHT - 35 : 100;
        var xPlace = Math.floor((Math.random() * 40));
        var yPlace = Math.floor((Math.random() * 40)) + 35;

        $wc.append(widget.html);
        var clickedFn = widgetHelpers.widgetClickHandler(widget.idx);

        setTimeout(function () {

            var $nwd = $('#' + widget.domId);
            $nwd.draggable({disabled: true});
            if (RESIZABLE) $nwd.resizable();

            // set z-index
            $nwd.css('z-index', widget.z);
            $nwd.css('left', xPlace);
            $nwd.css('top', yPlace);
            $nwd.on('click', clickedFn);
            widgetHelpers.setZIndexes(widget.idx);

        }, 0);

    }

    function addWidget() {

        // TODO - fix this so you can choose type
        var newWidget = widgetHelpers.widgetFactory('pension');

        var widgetTemplate = templateCompiledList['widget-template'];

        var widgetData = {
            widgetDomId: newWidget.domId,
            widgetChartId: newWidget.chartId,
            widgetTableId: newWidget.tableId,
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
                name : 'Balance',
                data : widget.chartData,
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

//*******************************************************************************
// Widget Helpers - various UI Functions

widgetHelpers = (function () {

    //*******************************************************************************
    // Private Functions for Widget Helpers

    function applyKnockoutBindings(widget) {

        var domEle = document.getElementById(widget.domId);
        ko.applyBindings(widget.ko, domEle);
    }

    function applyDatePickers(wid) {

        var $start = $('#startDateId_' + wid);
        $start.datepicker();
        $start.datepicker('option', 'dateFormat', DATE_FORMAT);
        var $end = $('#endDateId_' + wid);
        $end.datepicker();
        $end.datepicker('option', 'dateFormat', DATE_FORMAT);
    }


    // TODO - Refactor These Functions !

    function addMortgage(wid) {

        var widget = widgetList[wid];

        widget.ko = new MortgageViewModel({wid: wid});

        var debtViewModel = new DebtViewModel(widget.ko);
        extend(debtViewModel, widget.ko);

        var baseDebtViewModel = new BaseDebtViewModel(debtViewModel);
        extend(baseDebtViewModel, debtViewModel);

        setTimeout(function () {
            addTable(wid, 'mortgage');
        }, 25);
        setTimeout(function () {
            applyKnockoutBindings(widget);
        }, 50);
    }


    function addLoan(wid) {

        var widget = widgetList[wid];

        widget.ko = new LoanViewModel({wid: wid});

        var debtViewModel = new DebtViewModel(widget.ko);
        extend(debtViewModel, widget.ko);

        var baseDebtViewModel = new BaseDebtViewModel(debtViewModel);
        extend(baseDebtViewModel, debtViewModel);

        setTimeout(function () {
            addTable(wid, 'cc');
        }, 25);
        setTimeout(function () {
            applyKnockoutBindings(widget);
        }, 50);
    }

    function addPension(wid) {

        var widget = widgetList[wid];

        widget.ko = new PensionViewModel({wid: wid});
        var baseSaveViewModel = new BaseSaveViewModel(widget.ko);
        extend(baseSaveViewModel, widget.ko);

        setTimeout(function () {
            addTable(wid, 'pension');
        }, 25);
        setTimeout(function () {
            applyKnockoutBindings(widget);
        }, 50);
    }

    function addISA(wid) {

        var widget = widgetList[wid];

        widget.ko = new IsaViewModel({wid: wid});
        var baseSaveViewModel = new BaseSaveViewModel(widget.ko);
        extend(baseSaveViewModel, widget.ko);

        setTimeout(function () {
            addTable(wid, 'isa');
        }, 25);
        setTimeout(function () {
            applyKnockoutBindings(widget);
        }, 50);
    }


    function addTable(wid) {

        var widget = widgetList[wid];
        var instrument = widget.instrument;
        var templateName = 'widget-' + instrument + '-table';
        var templateHtml= $('#' + templateName).html();
        var templateCompiled = Handlebars.compile(templateHtml);
        var data = {};
        var $ins = $('#' + widget.tableId);
        var tableHtml = templateCompiled(data);
        $ins.html(tableHtml);
    }

    function addInstrument(wid) {

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
            case 'loan':
                addLoan(wid);
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
        widget.editStage1Value = widget.attributes.instrument = widget.instrument = typeParts[1];

        addInstrument(wid);

        setTimeout(function () {
            chooseStage(wid, 2);
        }, SHOWSPEED);
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

        $('#' + stage1Id).hide(SHOWSPEED);
        $('#' + stage2Id).hide(SHOWSPEED);

        if (STAGE_DETAILS === stage) $('#' + stage1Id).show(SHOWSPEED);
        if (STAGE_TABLE === stage) $('#' + stage2Id).show(SHOWSPEED);
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


    function drawChart(widget) {

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


    //***********************************************
    // EXPOSE A PUBLIC INTERFACE

    return {

        widgetFactory: function widgetFactory() {

            var wid = this.countWidgets();  // get the new index from the widgetList
            var widget = widgetList[wid] = new Widget(wid);
            return widget;
        },

        countWidgets: function () {
            var keys = Object.keys(widgetList);
            return keys.length;
        },

        initWidgets: function initWidgets() {

        },


        /**
         * When a widget is clicked it is brought to the front of the group
         * @param wid
         */
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


        /**
         * Various UI elements on the widget may be clicked
         * this sorts out what happens
         * @param wid
         * @returns {Function}
         */
        widgetClickHandler: function (wid) {

            return function (e) {

                // find target element
                var targetEle = '';
                if ($(e.target).hasClass('widget-slayer')) targetEle = 'slayer';
                if ($(e.target).hasClass('widget-charter')) targetEle = 'charter';
                if ($(e.target).hasClass('widget-tabler')) targetEle = 'tabler';
                if ($(e.target).hasClass('widget-editer')) targetEle = 'editer';
                if ($(e.target).hasClass('instrument')) targetEle = 'instrument';

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
                    case 'instrument':
                        chooseInstrument(e.target, wid);
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

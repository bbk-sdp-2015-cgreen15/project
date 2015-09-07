//*******************************************************************************
// Main Script for handling Widgets etc


(function () {

    'use strict';

    //*******************************************************************************
    // Constants + Pseudo Globals


    var $wc;    // Widget Container

    //*******************************************************************************
    // MAIN


    function placeWidget(widget) {

        // get window size and place randomly
        var xPlace = Math.floor((Math.random() * 40));
        var yPlace = Math.floor((Math.random() * 40)) + 35;

        $wc.append(widget.html);
        var clickedFn = widgetHelpers.widgetClickHandler(widget.idx);

        setTimeout(function () {

            var $nwd = $('#' + widget.domId);
            $nwd.draggable({handle: '.widget-header'});

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

        $('#show-help').colorbox({href: function(){ return $(this).attr('data-href') + '#help-content';}, width: "80%", height: "80%"});
    }


    function init() {

        compileTemplates(templateIdList, templateCompiledList); // Get the Handlebars Templates and compile them
        $wc = $('#widgetsContainer');
        registerEventListeners();
        widgetHelpers.initWidgets();
    }

    // Dom Ready Handler
    $(function() {
        init();
    });
})();

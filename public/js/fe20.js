//*******************************************************************************
// Main Script for handling Widgets etc

(function () {

    'use strict';

    var $wc;    // Widget Container

    //*******************************************************************************
    // MAIN

    function placeWidget(widget) {

        // get window size and place randomly within a certain range
        var xPlace = Math.floor((Math.random() * 40));
        var yPlace = Math.floor((Math.random() * 40)) + 35;

        $wc.append(widget.html);

        var clickedFn = widgetHelpers.widgetClickHandler(widget.idx);   // Apply UI Bindings

        setTimeout(function () {

            var $nwd = $('#' + widget.domId);
            $nwd.draggable({handle: '.widget-header'});

            if (RESIZABLE) $nwd.resizable();

            // set z-index
            $nwd.css('z-index', widget.z);
            $nwd.css('left', xPlace);
            $nwd.css('top', yPlace);
            $nwd.on('click', clickedFn);
            widgetHelpers.setZIndexes(widget.idx);  // Set this new widget at the top
        }, 0);
    }


    function addWidget() {

        // Make a new widget
        var newWidget = widgetHelpers.widgetFactory();
        var widgetTemplate = templateCompiledList['widget-template'];

        var widgetData = {
            widgetDomId: newWidget.domId,
            widgetChartId: newWidget.chartId,
            widgetTableId: newWidget.tableId,
            widgetId: newWidget.idx,
            widgetEditStage1: newWidget.editStage1Id,
            widgetEditStage2: newWidget.editStage2Id
        };

        newWidget.html = widgetTemplate(widgetData);

        placeWidget(newWidget);
    }

    function registerEventListeners() {

        // attach to add widget button
        var $addWidget = $('#add-widget');
        $addWidget.on('click', addWidget);

        // This is used for the popup help
        $('#show-help').colorbox({href: function(){ return $(this).attr('data-href') +
            '#help-content';}, width: "80%", height: "80%"});
    }


    function init() {

        compileTemplates(templateIdList, templateCompiledList); // Get the Handlebars Templates and compile them
        $wc = $('#widgetsContainer');
        registerEventListeners();
        widgetHelpers.initWidgets();
    }

    // Dom Ready Handler
    $(function() {
        init(); // Only run the initialisation function once the DOM is ready
    });
})();


//*******************************************************************************
// Functions for General Use

var extend = function extend(base, child) {

    for (var fn in base) {

        if(base.hasOwnProperty(fn)) {
            child[fn] = base[fn];
        }
    }
};


function alertMessage(message) {
    alert(message);
}


function compileTemplates(templateIdList, templateCompiledList) {

    var template;
    var i;
    for(i = 0; i < templateIdList.length; i++) {

        var templateId = templateIdList[i];
        template = $('#' + templateId).html();
        templateCompiledList[templateId] = Handlebars.compile(template);
    }
}






//*****************************************************************************************
//*****************************************************************************************
// UI Functions


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





//*****************************************************************************************
//*****************************************************************************************
// Pseudo Globals

var widgetList = {};    // Hash List !

var DATE_FORMAT = "d MM yy";
var WIDGET_WIDTH = 600;
var WIDGET_HEIGHT = 400;
var SHOWSPEED = 800;

var STAGE_DETAILS = 1;
var STAGE_TABLE = 2;
var STAGE_CHART = 3;

var RESIZABLE = false;

var widgetHelpers;

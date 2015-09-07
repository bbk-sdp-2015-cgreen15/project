
//*******************************************************************************
// Functions for General Use


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
// Pseudo Globals

var widgetList = {};    // Hash List !

var ONE_MINUTE = 60 * 1000;

var DATE_FORMAT = "d MM yy";
var SHOWSPEED = 800;

var STAGE_DETAILS = 1;
var STAGE_TABLE = 2;
var STAGE_CHART = 3;

var RESIZABLE = false;

var widgetHelpers;

var templateIdList = [
    'widget-template',
    'widget-pension-main',
    'widget-isa-main',
    'widget-mortgage-main',
    'widget-cc-main'
];
var templateCompiledList = {};

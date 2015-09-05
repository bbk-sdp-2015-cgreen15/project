
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

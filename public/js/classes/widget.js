

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
    this.ko = {}; // Knockout Model !

    this.chartData = [];
    this.attributes = {
        type: null,
        instrument: null
    };

    return this;
};


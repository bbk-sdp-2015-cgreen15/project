

var extend = function extend(base, child) {

    for (var fn in base) {

        if(base.hasOwnProperty(fn)) {
            child[fn] = base[fn];
        }
    }
};


function Instrument(context) {
    // Abstract Base Class
    var self = context;
}

function DebtInstrument(context) {
    // Abstract
    var self = context;
}

function SaveInstrument(context) {
    // Abstract
    var self = context;
}

// MIXINS !!

function BaseSaveViewModel(context) {

    // extends

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

        orchestrators.makeChartSeries(wid, function () {

        });
    };

    return self;
}


function IsaViewModel(opts) {

    var self = this;

    self._opts = opts || {};
    self.model = {};

    self.apr = ko.observable("0");
    self.monthly = ko.observable("0");
    self.lump = ko.observable("15000");

    // Update Functions

    self.addItem = function () {
        self.myItems.push(Math.random().toString());
    };

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

        orchestrators.goToTablyWithDates(wid);
    };


    self.saveEntries = function () {

        var wid = self._opts.wid;
        var widget = widgetList[wid];


        orchestrators.makeChartSeries(wid, function () {
            console.log(' Make Chart Series Callback called from saveEntries');
        })
    };

    return self;
}




function PensionViewModel(opts) {

    var self = this;

    self._opts = opts || {};
    self.model = {};

    self.apr = ko.observable("0");
    self.step = ko.observable("0");
    self.monthly = ko.observable("50");
    self.lump = ko.observable("1000");


    // Update Functions

    self.addItem = function () {
        self.myItems.push(Math.random().toString());
    };

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
        attributes.step = self.step();
        attributes.lump = self.lump();

        orchestrators.goToTablyWithDates(wid);
    };


    self.saveEntries = function () {

        var wid = self._opts.wid;
        var widget = widgetList[wid];
        var attributes = widget.attributes;


        orchestrators.makeChartSeries(wid, function () {
            console.log(' Make Chart Series Callback called from saveEntries');
        })
    };

    return self;
}

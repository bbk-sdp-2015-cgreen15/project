

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

        orchestrators.makeChartSeries(wid, function () {
            console.log(' Make Chart Series Callback called from saveEntries');
        })
    };

    return self;
}



function BaseDebtViewModel(context) {

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


function DebtViewModel(context) {

    var self = context;

    // Update Functions

    self.saveStage2 = function () {

        var wid = self._opts.wid;
        var widget = widgetList[wid];
        var attributes = widget.attributes;
        var day;

        attributes.type = widget.type;

        // start date ID is
        var startDateId = '#startDateId_' + wid.toString();
        var $startDate = $(startDateId).val();
        attributes.startDate = $startDate;  // Hmmm, apply bindings doesn't work ...
        var startDate = $.datepicker.parseDate(DATE_FORMAT, attributes.startDate);
        var startOffset = startDate.getTimezoneOffset();
        attributes.startTime = startDate.getTime() - (startOffset * ONE_MINUTE);

        // end date ID is
        var endDateId = '#endDateId_' + wid.toString();
        var $endDate = $(endDateId).val();
        attributes.endDate = $endDate;  // Hmmm, apply bindings doesn't work ...
        var endDate = $.datepicker.parseDate(DATE_FORMAT, attributes.endDate);
        var endOffset = endDate.getTimezoneOffset();
        attributes.endTime = endDate.getTime() - (endOffset * ONE_MINUTE);

        day = new Date(attributes.startTime).getDate();

        attributes.startDay = day > 28 ? 28 : day;
        attributes.monthly = self.monthly();
        attributes.apr = self.apr();
        attributes.loan = self.loan();

        orchestrators.goToTablyWithDates(wid);
    };


    self.saveEntries = function () {

        var wid = self._opts.wid;

        orchestrators.makeChartSeries(wid, function () {
            console.log(' Make Chart Series Callback called from saveEntries');
        })
    };

    return self;

}


function MortgageViewModel(opts) {

    var self = this;

    self._opts = opts || {};
    self.model = {};

    self.apr = ko.observable("3.9");
    self.monthly = ko.observable("2000");
    self.loan = ko.observable("300000");
}

function LoanViewModel(opts) {

    var self = this;

    self._opts = opts || {};
    self.model = {};

    self.apr = ko.observable("9.9");
    self.monthly = ko.observable("300");
    self.loan = ko.observable("15000");
}

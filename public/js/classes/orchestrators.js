//*****************************************************************************************
//*****************************************************************************************
// UI Functions


var orchestrators = {

    goToTablyWithDates: function goToTablyWithDates(wid) {

        var widget = widgetList[wid];

        // Get TableData from the remote service
        $.ajax({
            url: "/app/tabledata",
            type: "post",
            data: widget.attributes

        }).success(function (tableData) {

            widget.ko.tableEntries(tableData);
            widget.editStage2Value = true;

            orchestrators.makeChartSeries(wid, function () {

                widgetHelpers.showCharty(wid);
            });
        });
    },


    makeChartSeries: function makeChartSeries(wid, callback) {

        var widget = widgetList[wid];
        var tableEntries = widget.ko.tableEntries();

        // Get chartData from the service
        $.ajax({
            url: "/app/tst",
            type: "post",
            data: JSON.stringify({
                attributes: widget.attributes,
                tableEntries: tableEntries
            }),
            contentType: "application/json",
            dataType: 'json'

        }).success(function (data) {

            widget.chartData = data.chartData;
            var sparseTimeSeries = data.sparseTimeSeries;
            console.log('sparseTimeSeries');
            console.log(sparseTimeSeries);
            orchestrators.updateBalances(wid, sparseTimeSeries);    // IMPORTANT !
            callback();
        });
    },


    updateBalances: function updateBalances(wid, sparseTimeSeries) {

        var widget = widgetList[wid];
        var tableEntries = widget.ko.tableEntries();
        var i = 0;

        // Get the table entries from the calculated sparse timeseries and populate it back into the UI
        $.each(sparseTimeSeries, function (key, value) {

            // update the display balance
            tableEntries[i].balance = value.balance;
            i++;
        });

        widget.ko.tableEntries(null);   // Reset
        widget.ko.tableEntries(tableEntries);
    }
};

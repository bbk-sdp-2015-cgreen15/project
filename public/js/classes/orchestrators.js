


//*****************************************************************************************
//*****************************************************************************************
// UI Functions



var orchestrators = {

    goToTablyWithDates: function goToTablyWithDates(wid) {

        var widget = widgetList[wid];
        var attributes = widget.attributes;

        // Get TableData from the service
        $.ajax({
            url: "/app/tabledata",
            type: "post",
            data: attributes
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
            dataType: 'json'

        }).success(function (data) {

            widget.chartData = data.chartData;
            var sparseTimeSeries = data.sparseTimeSeries;
            console.log('sparseTimeSeries');
            console.log(sparseTimeSeries);
            orchestrators.updateBalances(wid, sparseTimeSeries);
            callback();
        });
    },


    updateBalances: function updateBalances(wid, sparseTimeSeries) {

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
};










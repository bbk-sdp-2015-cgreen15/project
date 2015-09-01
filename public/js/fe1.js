(function () {

    'use strict';


    var RESIZABLE = false;



    // click on a widget, bring it to the top

    var widgetList = {};    // Hash List !


    var widgetTemplate = '<div id="{widgetDomId}" data-widget-id="{widgetId}"   ' +
        'class="ui-widget-content c-widget">' +
        '<div class="widget-header"><h4>A Widget</h4> ' +
        '<div class="widget-tool-icon-wrapper">' +
        '<span class="widget-tool-icon" title="Edit"><i class="fa fa-edit widget-editer"></i></span>' +
        '<span class="widget-tool-icon" title="Numbers"><i class="fa fa-columns widget-tabler"></i></span>' +
        '<span class="widget-tool-icon" title="Chart"><i class="fa fa-line-chart widget-charter"></i></span>' +
        '<span class="widget-tool-icon" title="Move"><i class="fa fa-arrows-alt widget-mover"></i></span>' +
        '<span class="widget-tool-icon" title="Delete"><i class="fa fa-trash-o widget-slayer"></i></span>' +
        '</div>' +
        '</div>' +
    '<div class="widget-chart" >Charty</div>' +
    '<div class="widget-table">Tably</div>' +
    '<div class="widget-edit">Editeey</div>' +
        '</div>';


    var Widget = function Widget(idx) {

        this.idx = idx;
        this.html = 'some html';
        this.z = idx + 1;
        this.domId = 'widgetId_' + idx.toString();
    };


    // get highest z

    var widgetHelpers;

    (function () {


        function showOne(context, whichOne) {

            var widgetChart = $(context).find('.widget-chart');
            var widgetEdit = $(context).find('.widget-edit');
            var widgetTable = $(context).find('.widget-table');

            widgetChart.hide();
            widgetEdit.hide();
            widgetTable.hide();

            switch(whichOne) {
                case 'chart':
                    widgetChart.show();
                    break;
                case 'edit':
                    widgetEdit.show();
                    break;
                case 'table':
                    widgetTable.show();
                    break;
            }

        }

        function showCharty(context) {

            console.log(' would show charty');
            console.log(context);
            showOne(context, 'chart');





        }

        function showTably(context) {
            console.log(' would show table');
            showOne(context, 'table');
        }

        function showEdity(context) {
            console.log(' would show edity');
            showOne(context, 'edit');
        }




    widgetHelpers = {

        widgetFactory: function widgetFactory() {

            // get the new index from the widgetList

            var idx = this.countWidgets();
            widgetList[idx] = new Widget(idx);
            return widgetList[idx];

        },

        countWidgets: function () {
            var keys = Object.keys(widgetList);
            console.log(' number if widgets is ' + keys.length);
            return keys.length;
        },

        initWidgets: function initWidgets() {

            console.log(' in InitWidgets');


        },


        setZIndexes: function (wid) {
            var keys = Object.keys(widgetList);
            for(var i=0; i < keys.length; i++) {
                var key = keys[i];
                var $wc = $('#widgetId_' + key);
                if ($wc) {
                    $wc.css('z-index', key);
                }

            }
            $('#widgetId_' + wid).css('z-index', 32);

        },


        showWidgetKeys: function () {

            var keys = Object.keys(widgetList);
            console.log(" Widget Keys is ");
            console.log(keys);


        },


        widgetClickHandler: function (wid) {
            return function (e) {
                console.log('widget id ' + wid + ' clicked');
                console.log(e.target);

                // find target element
                var targetEle = '';
                if ($(e.target).hasClass('widget-slayer')) targetEle = 'slayer';
                if ($(e.target).hasClass('widget-mover')) targetEle = 'mover';
                if ($(e.target).hasClass('widget-charter')) targetEle = 'charter';
                if ($(e.target).hasClass('widget-tabler')) targetEle = 'tabler';
                if ($(e.target).hasClass('widget-editer')) targetEle = 'editer';


                switch (targetEle) {

                    case 'slayer':
                        this.remove();
                        break;
                    case 'charter':
                        showCharty(this);
                        widgetHelpers.setZIndexes(wid);
                        break;
                    case 'tabler':
                        showTably(this);
                        widgetHelpers.setZIndexes(wid);
                        break;
                    case 'editer':
                        showEdity(this);
                        widgetHelpers.setZIndexes(wid);
                        break;
                    default:
                        widgetHelpers.setZIndexes(wid);
                        break;
                }

            }
        }


    };


    })();


    var $wc;


    function init() {

        $wc = $('#widgetsContainer');

        registerEventListeners();

        // Kick off the first widget
        widgetHelpers.initWidgets();

    }

    function addWidget() {
        // alert('add widget');
        console.log('would add widget ');

        // Get the number of widgets so far

        var newWidget = widgetHelpers.widgetFactory();
        console.log(newWidget);

        var newHtml = widgetTemplate.replace('{widgetDomId}', newWidget.domId);
        newHtml = newHtml.replace('{widgetId}', newWidget.idx);

        // add a new widget with next available int
        // give it the highest z index

        $wc.append(newHtml);
        var clickedFn = widgetHelpers.widgetClickHandler(newWidget.idx);

        setTimeout(function () {
            var $nwd = $('#' + newWidget.domId);
            $nwd.draggable();
            if (RESIZABLE) $nwd.resizable();

            // set z-index
            $nwd.css('z-index', newWidget.z);
            $nwd.css('left', 10 + newWidget.idx * 20);
            $nwd.css('top', 40 + newWidget.idx * 20);
            $nwd.on('click', clickedFn);
            widgetHelpers.setZIndexes(newWidget.idx);
        }, 0);


            // $nwd.draggable({disabled: true});

            // $nwd.draggable({disabled: false});



    }

// <div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div>
// <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
    // <div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;"></div>
    //


    function registerEventListeners() {

        console.log(' in register event listeners ');

        // attach to add widget button
        var $addWidget = $('#add-widget');
        $addWidget.on('click', addWidget);

        $('#show-keys').on('click', function () {
            widgetHelpers.showWidgetKeys();
        })

    }
    // Register event listeners




    $(function() {
        init();
    });





    /*

     if ($.isEmptyObject(container1VM)) {
     container1VM = new ContainerViewModel();
     ko.applyBindings(container1VM, document.getElementById("container3"));
     }

     */


    //function applyDatePickers(wid) {
    //
    //    var opts = {
    //        dateFormat: DATE_FORMAT,
    //        yearRange: '1980:2066'
    //    };
    //    var $start = $('#startDateId_' + wid);
    //    var $end = $('#endDateId_' + wid);
    //    $start.datepick(opts);
    //    $end.datepick({dateFormat: DATE_FORMAT});
    //}



    /*



     //self.myItems = ko.observableArray();
     //
     //self.myItems.push(Math.random().toString());
     //self.myItems.push(Math.random().toString());
     //self.myItems.push(Math.random().toString());

     // get
     // id="{{widgetDomId}}" data-widget-id="{{widgetId}}"

     // get domId from self
     // get widget id from data-widget-id
     // get startdateid from widget id


     // TODO fix Keith Wood Datepick issues

     // var startTime = 0; // $.datepicker.parseDate(DATE_FORMAT, startDate).getTime();
     // var endTime = 0 ; //$.datepicker.parseDate(DATE_FORMAT, endDate).getTime();

     */

})();
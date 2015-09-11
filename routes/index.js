var express = require('express');
var router = express.Router();

//******************************************************************************

var SaveChartData = require('./../app/generators/save-timeseries');
var SaveTableData = require('./../app/generators/save-tabledata');
var saveChartData = new SaveChartData();
var saveTableData = new SaveTableData();


var DebtChartData = require('./../app/generators/debt-timeseries');
var DebtTableData = require('./../app/generators/debt-tabledata');
var debtChartData = new DebtChartData();
var debtTableData = new DebtTableData();

//******************************************************************************


function handler_tsp(req, res) {

  // TODO - get by type

  var body = req.body;
  var chartData;

  var instrument = body.attributes.instrument;

  switch (instrument) {

    case 'pension':
    case 'isa':

      chartData = saveChartData.ts(body);
      break;

    case 'mortgage':
    case 'loan':

      chartData = debtChartData.ts(body);
      break;

    default:
      chartData = saveChartData.ts(body);
      break;
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(chartData));
}


function handler_tabledata(req, res) {

  // TODO - get by type

  var tableData;

  var body = req.body;
  var attributes = body.attributes || {};
  var instrument = attributes.instrument || '';

  switch (instrument) {
    case 'pension':
    case 'isa':

      tableData = saveTableData.td(body);
          break;

    case 'mortgage':
    case 'loan':

      tableData = debtTableData.td(body);
      break;

    default:

      tableData = saveTableData.td(body);
          break;
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tableData));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/app/time-series', function(req,res, next) {

  handler_tsp(req, res, next);
});

router.post('/app/tabledata', function(req,res, next) {

  handler_tabledata(req, res, next);
});

module.exports = router;

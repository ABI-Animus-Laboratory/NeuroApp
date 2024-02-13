var chart1 = undefined;
var DATAurls = [];
var DATAs = [];
var currentDATAName = "None";
var timeLineOffset = 0.0;
//  These ecgName and lvpName are global variables used in Traces.vue to reset the value to null
var ecgName = null;

var chart2 = undefined;
var DATAurls2 = [];
var DATAs2 = [];
var currentDATAName2 = "None";
var timeLineOffset2 = 0.0;
//  These ecgName and lvpName are global variables used in Traces.vue to reset the value to null
var ecgName2 = null;

var chart3 = undefined;
var DATAurls3 = [];
var DATAs3 = [];
var currentDATAName3 = "None";
var timeLineOffset3 = 0.0;
//  These ecgName and lvpName are global variables used in Traces.vue to reset the value to null
var ecgName3 = null;

var chart4 = undefined;
var DATAurls4 = [];
var DATAs4 = [];
var currentDATAName4 = "None";
var timeLineOffset4 = 0.0;
//  These ecgName and lvpName are global variables used in Traces.vue to reset the value to null
var ecgName4 = null;

var chart5 = undefined;
var DATAurls5 = [];
var DATAs5 = [];
var currentDATAName5 = "None";
var timeLineOffset5 = 0.0;
//  These ecgName and lvpName are global variables used in Traces.vue to reset the value to null
var ecgName5 = null;

var test1 = 1;
var test2 = 1;
var test3 = 1;
var test4 = 1;
var test5 = 1;

require(["dijit/Dialog"]);

function loadChart(data, category, timeOffset) {
  require(["dojo/ready"], function (ready) {
    ready(function () {
      require([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojox/charting/Chart",
        "dojox/charting/plot2d/StackedLines",
        "dojox/charting/plot2d/Grid",
        "dojox/charting/themes/Claro",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Indicator",
        "dojox/charting/themes/Tom",
      ], function (declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme) {
        ready(function () {
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var chartDom = document.getElementById("chartA");

          chart1 = new Chart(chartDom); //html element (dom) the chart will be drawn
          chart1.setTheme(tomTheme);

          /* add the x-axis */
          chart1.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
          });
          /* add the y-axis */
          chart1.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -75,
            max: -50,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -75, text: "-75 mV" },
              { value: -70, text: "-70 mV" },
              { value: -65, text: "-65 mV" },
              { value: -60, text: "-60 mV" },
              { value: -55, text: "-55 mV" },
              { value: -50, text: "-55 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });
          data.name = data.name + String(this.test1);
          timeLineOffset = timeOffset;

          if (!DATAurls[data.name]) {
            DATAurls[data.name] = data.path;
          }

          var xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = onDATALoaded(xmlhttp, category, data.name);
          xmlhttp.open("GET", data.path, true);
          xmlhttp.send();

          test1+=1;
        });
      });
    });
  });
}


function loadChart2(data2, category, timeOffset) {
  require(["dojo/ready"], function (ready) {
    ready(function () {
      require([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojox/charting/Chart",
        "dojox/charting/plot2d/StackedLines",
        "dojox/charting/plot2d/Grid",
        "dojox/charting/themes/Claro",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Indicator",
        "dojox/charting/themes/Tom",
      ], function (declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme) {
        ready(function () {
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var chartDom2 = document.getElementById("chartB");

          chart2 = new Chart(chartDom2); //html element (dom) the chart will be drawn
          chart2.setTheme(tomTheme);

          /* add the x-axis */
          chart2.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
          });
          /* add the y-axis */
          chart2.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -75,
            max: -50,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -75, text: "-75 mV" },
              { value: -70, text: "-70 mV" },
              { value: -65, text: "-65 mV" },
              { value: -60, text: "-60 mV" },
              { value: -55, text: "-55 mV" },
              { value: -50, text: "-55 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });

          data2.name = data2.name + String(this.test2);
          timeLineOffset2 = timeOffset;

          if (!DATAurls2[data2.name]) {
            DATAurls2[data2.name] = data2.path;
          }

          var xmlhttp2 = new XMLHttpRequest();
          xmlhttp2.onreadystatechange = onDATALoaded2(xmlhttp2, category, data2.name);
          xmlhttp2.open("GET", data2.path, true);
          xmlhttp2.send();

          test2+=1;
        });
      });
    });
  });
}

function loadChart3(data3, category, timeOffset) {
  require(["dojo/ready"], function (ready) {
    ready(function () {
      require([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojox/charting/Chart",
        "dojox/charting/plot2d/StackedLines",
        "dojox/charting/plot2d/Grid",
        "dojox/charting/themes/Claro",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Indicator",
        "dojox/charting/themes/Tom",
      ], function (declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme) {
        ready(function () {
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var chartDom3 = document.getElementById("chartB");

          chart3 = new Chart(chartDom3); //html element (dom) the chart will be drawn
          chart3.setTheme(tomTheme);

          /* add the x-axis */
          chart3.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
          });
          /* add the y-axis */
          chart3.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -75,
            max: -50,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -75, text: "-75 mV" },
              { value: -70, text: "-70 mV" },
              { value: -65, text: "-65 mV" },
              { value: -60, text: "-60 mV" },
              { value: -55, text: "-55 mV" },
              { value: -50, text: "-55 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });

          data3.name = data3.name + String(this.test3);
          timeLineOffset3 = timeOffset;

          if (!DATAurls3[data3.name]) {
            DATAurls3[data3.name] = data3.path;
          }

          var xmlhttp3 = new XMLHttpRequest();
          xmlhttp3.onreadystatechange = onDATALoaded3(xmlhttp3, category, data3.name);
          xmlhttp3.open("GET", data3.path, true);
          xmlhttp3.send();

          test3+=1;
        });
      });
    });
  });
}

function loadChart4(data4, category, timeOffset) {
  require(["dojo/ready"], function (ready) {
    ready(function () {
      require([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojox/charting/Chart",
        "dojox/charting/plot2d/StackedLines",
        "dojox/charting/plot2d/Grid",
        "dojox/charting/themes/Claro",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Indicator",
        "dojox/charting/themes/Tom",
      ], function (declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme) {
        ready(function () {
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var chartDom4 = document.getElementById("chartB");

          chart4 = new Chart(chartDom4); //html element (dom) the chart will be drawn
          chart4.setTheme(tomTheme);

          /* add the x-axis */
          chart4.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
          });
          /* add the y-axis */
          chart4.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -75,
            max: -50,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -75, text: "-75 mV" },
              { value: -70, text: "-70 mV" },
              { value: -65, text: "-65 mV" },
              { value: -60, text: "-60 mV" },
              { value: -55, text: "-55 mV" },
              { value: -50, text: "-55 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });

          data4.name = data4.name + String(this.test4);
          timeLineOffset4 = timeOffset;

          if (!DATAurls4[data4.name]) {
            DATAurls4[data4.name] = data4.path;
          }

          var xmlhttp4 = new XMLHttpRequest();
          xmlhttp4.onreadystatechange = onDATALoaded4(xmlhttp4, category, data4.name);
          xmlhttp4.open("GET", data4.path, true);
          xmlhttp4.send();

          test4+=1;
        });
      });
    });
  });
}

function loadChart5(data5, category, timeOffset) {
  require(["dojo/ready"], function (ready) {
    ready(function () {
      require([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojox/charting/Chart",
        "dojox/charting/plot2d/StackedLines",
        "dojox/charting/plot2d/Grid",
        "dojox/charting/themes/Claro",
        "dojox/charting/axis2d/Default",
        "dojox/charting/plot2d/Indicator",
        "dojox/charting/themes/Tom",
      ], function (declare, domConstruct, Chart, StackedLines, Grid, Claro, axis2dDefault, plot2dIndicator, tomTheme) {
        ready(function () {
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var chartDom5 = document.getElementById("chartB");

          chart5 = new Chart(chartDom5); //html element (dom) the chart will be drawn
          chart5.setTheme(tomTheme);

          /* add the x-axis */
          chart5.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
          });
          /* add the y-axis */
          chart5.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -75,
            max: -50,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -75, text: "-75 mV" },
              { value: -70, text: "-70 mV" },
              { value: -65, text: "-65 mV" },
              { value: -60, text: "-60 mV" },
              { value: -55, text: "-55 mV" },
              { value: -50, text: "-55 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });

          data5.name = data5.name + String(this.test5);
          timeLineOffset5 = timeOffset;

          if (!DATAurls5[data5.name]) {
            DATAurls5[data5.name] = data5.path;
          }

          var xmlhttp5 = new XMLHttpRequest();
          xmlhttp5.onreadystatechange = onDATALoaded5(xmlhttp5, category, data5.name);
          xmlhttp5.open("GET", data5.path, true);
          xmlhttp5.send();

          test5+=1;
        });
      });
    });
  });
}


// functions for chart 1

function onDATALoaded(xmlhttp, category, axisName) {
  return function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var viewData = JSON.parse(xmlhttp.responseText);
      console.log(viewData.length)
      // var newViewData = rescaleXAxis(viewData);
      //   defaultEcgData = rescaleXAxis(defaultEcgData);
      // replacement viewData instead of newViewData
      DATAs[axisName] = viewData;
      // DATAs[axisName] = newViewData;
      if (category) {
        showDATAInternal(category, axisName);
      }
    }
  };
}

var showDATAInternal = function (category, axisName) {
  var currentDATA = DATAs[axisName];
  chart1.removeSeries(currentDATAName);
  chart1.removeSeries("Normal");
  currentDATAName = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  chart1.addSeries(axisName, currentDATA, {
      stroke: { color: colourName, width: widthvar },
    });
  chart1.render();
  chart1.resize("100%", "100%");
};

// functions for chart 2

function onDATALoaded2(xmlhttp2, category, axisName) {
  return function () {
    if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
      var viewData2 = JSON.parse(xmlhttp2.responseText);
      console.log(viewData2.length)
      // var newViewData = rescaleXAxis(viewData);
      //   defaultEcgData = rescaleXAxis(defaultEcgData);
      // replacement viewData instead of newViewData
      DATAs2[axisName] = viewData2;
      // DATAs[axisName] = newViewData;
      if (category) {
        showDATAInternal2(category, axisName);
      }
    }
  };
}

var showDATAInternal2 = function (category, axisName) {
  var currentDATA2 = DATAs2[axisName];
  chart2.removeSeries(currentDATAName2);
  chart2.removeSeries("Normal");
  currentDATAName2 = axisName;
  var colourName = "rgba(255,50,50,0.6)";
  var widthvar = 2;

  chart2.addSeries(axisName, currentDATA2, {
      stroke: { color: colourName, width: widthvar },
    });
  chart2.render();
  chart2.resize("100%", "100%");
};

// functions for chart 3

function onDATALoaded3(xmlhttp3, category, axisName) {
  return function () {
    if (xmlhttp3.readyState == 4 && xmlhttp3.status == 200) {
      var viewData3 = JSON.parse(xmlhttp3.responseText);
      console.log(viewData3.length)
      // var newViewData = rescaleXAxis(viewData);
      //   defaultEcgData = rescaleXAxis(defaultEcgData);
      // replacement viewData instead of newViewData
      DATAs3[axisName] = viewData3;
      // DATAs[axisName] = newViewData;
      if (category) {
        showDATAInternal3(category, axisName);
      }
    }
  };
}

var showDATAInternal3 = function (category, axisName) {
  var currentDATA3 = DATAs3[axisName];
  chart3.removeSeries(currentDATAName3);
  chart3.removeSeries("Normal");
  currentDATAName3 = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  chart3.addSeries(axisName, currentDATA3, {
      stroke: { color: colourName, width: widthvar },
    });
  chart3.render();
  chart3.resize("100%", "100%");
};

// functions for chart 4

function onDATALoaded4(xmlhttp4, category, axisName) {
  return function () {
    if (xmlhttp4.readyState == 4 && xmlhttp4.status == 200) {
      var viewData4 = JSON.parse(xmlhttp4.responseText);
      console.log(viewData4.length)
      // var newViewData = rescaleXAxis(viewData);
      //   defaultEcgData = rescaleXAxis(defaultEcgData);
      // replacement viewData instead of newViewData
      DATAs4[axisName] = viewData4;
      // DATAs[axisName] = newViewData;
      if (category) {
        showDATAInternal4(category, axisName);
      }
    }
  };
}

var showDATAInternal4 = function (category, axisName) {
  var currentDATA4 = DATAs4[axisName];
  chart4.removeSeries(currentDATAName4);
  chart4.removeSeries("Normal");
  currentDATAName4 = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  chart4.addSeries(axisName, currentDATA4, {
      stroke: { color: colourName, width: widthvar },
    });
  chart4.render();
  chart4.resize("100%", "100%");
};

// functions for chart 5

function onDATALoaded5(xmlhttp5, category, axisName) {
  return function () {
    if (xmlhttp5.readyState == 4 && xmlhttp5.status == 200) {
      var viewData5 = JSON.parse(xmlhttp5.responseText);
      console.log(viewData5.length)
      // var newViewData = rescaleXAxis(viewData);
      //   defaultEcgData = rescaleXAxis(defaultEcgData);
      // replacement viewData instead of newViewData
      DATAs5[axisName] = viewData5;
      // DATAs[axisName] = newViewData;
      if (category) {
        showDATAInternal5(category, axisName);
      }
    }
  };
}

var showDATAInternal5 = function (category, axisName) {
  var currentDATA5 = DATAs5[axisName];
  chart5.removeSeries(currentDATAName5);
  chart5.removeSeries("Normal");
  currentDATAName5 = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  chart5.addSeries(axisName, currentDATA5, {
      stroke: { color: colourName, width: widthvar },
    });
  chart5.render();
  chart5.resize("100%", "100%");
};



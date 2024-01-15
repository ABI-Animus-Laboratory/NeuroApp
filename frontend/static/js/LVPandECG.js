var ECGchart = undefined;
var ECGurls = [];
var ECGs = [];
var ecgIndicator = undefined;

var maxECGTime = 0.0;
var minECGTime = 0.0;
var currentECGName = "None";
var timeLineOffset = 0.0;
//  These ecgName and lvpName are global variables used in Traces.vue to reset the value to null
var ecgName = null;

var ECGchart2 = undefined;
var ECGurls2 = [];
var ECGs2 = [];
var ecgIndicator2 = undefined;
var maxECGTime2 = 0.0;
var minECGTime2 = 0.0;
var currentECGName2 = "None";
var timeLineOffset2 = 0.0;

var ECGchart3 = undefined;
var ECGurls3 = [];
var ECGs3 = [];
var ecgIndicator3 = undefined;
var maxECGTime3 = 0.0;
var minECGTime3 = 0.0;
var currentECGName3 = "None";
var timeLineOffset3 = 0.0;

var test1 = 1;
var test2 = 1;
var test3 = 1;
var test4 = 1;
var test5 = 1;

var ECGchart4 = undefined;
var ECGurls4 = [];
var ECGs4 = [];
var ecgIndicator4 = undefined;
var maxECGTime4 = 0.0;
var minECGTime4 = 0.0;
var currentECGName4 = "None";
var timeLineOffset4 = 0.0;

var ECGchart5 = undefined;
var ECGurls5 = [];
var ECGs5 = [];
var ecgIndicator5 = undefined;
var maxECGTime5 = 0.0;
var minECGTime5 = 0.0;
var currentECGName5 = "None";
var timeLineOffset5 = 0.0;

require(["dijit/Dialog"]);

function loadChart(ecg, category, timeOffset) {
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
          //   var ECGchart;
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var ecgDom = document.getElementById("rightECG");

          ECGchart = new Chart(ecgDom); //html element (dom) the chart will be drawn
          ECGchart.setTheme(tomTheme);

          /* add the x-axis */
          ECGchart.addAxis("x", {
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
          ECGchart.addAxis("y", {
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
          ecg.name = ecg.name + String(this.test1);
          timeLineOffset = timeOffset;

          if (!ECGurls[ecg.name]) {
            ECGurls[ecg.name] = ecg.path;
          }

          showECGChart(ecg.name, ecg.path, category);
          test1+=1;
        });
      });
    });
  });
}

function loadChart2(ecg2, category, timeOffset) {
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
          //   var ECGchart;
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var ecgDom2 = document.getElementById("leftECG");

          ECGchart2 = new Chart(ecgDom2); //html element (dom) the chart will be drawn
          ECGchart2.setTheme(tomTheme);

          /* add the x-axis */
          ECGchart2.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            // min: 0,
            // max: 500,
          });
          /* add the y-axis */
          ECGchart2.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -73,
            max: -68,
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
          ecg2.name = ecg2.name + String(this.test2);
          timeLineOffset = timeOffset;

          if (!ECGurls2[ecg2.name]) {
            ECGurls2[ecg2.name] = ecg2.path;
          }

          showECGChart2(ecg2.name, ecg2.path, category);
          test2+=1;
        });
      });
    });
  });
}

function loadChart3(ecg3, category, timeOffset) {
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
          //   var ECGchart;
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var ecgDom3 = document.getElementById("aECG");

          ECGchart3 = new Chart(ecgDom3); //html element (dom) the chart will be drawn
          ECGchart3.setTheme(tomTheme);

          /* add the x-axis */
          ECGchart3.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            // min: 0,
            // max: 500,
          });
          /* add the y-axis */
          ECGchart3.addAxis("y", {
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
          ecg3.name = ecg3.name + String(this.test3);
          console.log(ecg3.name);
          timeLineOffset = timeOffset;

          if (!ECGurls3[ecg3.name]) {
            ECGurls3[ecg3.name] = ecg3.path;
          }
          console.log(this.test3)
          showECGChart3(ecg3.name, ecg3.path, category);
          test3+=1;

        });
      });
    });
  });
}

function loadChart4(ecg4, category, timeOffset) {
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
          //   var ECGchart;
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var ecgDom4 = document.getElementById("bECG");

          ECGchart4 = new Chart(ecgDom4); //html element (dom) the chart will be drawn
          ECGchart4.setTheme(tomTheme);

          /* add the x-axis */
          ECGchart4.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            // min: 0,
            // max: 500,
          });
          /* add the y-axis */
          ECGchart4.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -90,
            max: 0,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -90, text: "-90 mV" },
              { value: -80, text: "-80 mV" },
              { value: -60, text: "-60 mV" },
              { value: -50, text: "-50 mV" },
              { value: -40, text: "-40 mV" },
              { value: -30, text: "-30 mV" },
              { value: -20, text: "-20 mV" },
              { value: -10, text: "-10 mV" },
              { value: 0, text: "0 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });
          ecg4.name = ecg4.name + String(this.test4);
          timeLineOffset = timeOffset;

          if (!ECGurls4[ecg4.name]) {
            ECGurls4[ecg4.name] = ecg4.path;
          }

          showECGChart4(ecg4.name, ecg4.path, category);
          test4+=1;
        });
      });
    });
  });
}

function loadChart5(ecg5, category, timeOffset) {
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
          //   var ECGchart;
          tomTheme.chart.fill = "transparent";
          tomTheme.plotarea.fill = "transparent";
          tomTheme.chart.stroke = "transparent";
          var ecgDom5 = document.getElementById("cECG");

          ECGchart5 = new Chart(ecgDom5); //html element (dom) the chart will be drawn
          ECGchart5.setTheme(tomTheme);

          /* add the x-axis */
          ECGchart5.addAxis("x", {
            // type: "Invisible",
            title: "Time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            // min: 0,
            // max: 500,
          });
          /* add the y-axis */
          ECGchart5.addAxis("y", {
            // type: "Invisible",
            vertical: true,
            title: "Membrane Potential (mV)",
            titleFontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: -90,
            max: 0,
            font: "normal normal normal 10pt Helvetica",
            fontColor: "#fff",
            labels: [
              { value: -90, text: "-90 mV" },
              { value: -80, text: "-80 mV" },
              { value: -60, text: "-60 mV" },
              { value: -50, text: "-50 mV" },
              { value: -40, text: "-40 mV" },
              { value: -30, text: "-30 mV" },
              { value: -20, text: "-20 mV" },
              { value: -10, text: "-10 mV" },
              { value: 0, text: "0 mV" },
            ],

            // Set tick positions on the y-axis
            majorTicks: [
              -75, -70, -65, -60, -55, -50
            ],
            // stroke: [0, 0, 0, 0],
          });
          ecg5.name = ecg5.name + String(this.test5);
          timeLineOffset = timeOffset;

          if (!ECGurls5[ecg5.name]) {
            ECGurls5[ecg5.name] = ecg5.path;
          }

          showECGChart5(ecg5.name, ecg5.path, category);
          test5+=1;
        });
      });
    });
  });
}

function showECGChart(axisName, ecgPath, category) {
  ecgName = axisName;
  if (ECGs[axisName]) {
    showECGInternal(category, axisName);
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = onECGLoaded(xmlhttp, category, axisName);
    xmlhttp.open("GET", ecgPath, true);
    xmlhttp.send();
  }
}

function onECGLoaded(xmlhttp, category, axisName) {
  return function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var viewData = JSON.parse(xmlhttp.responseText);
      console.log(viewData.length)
      var newViewData = rescaleXAxis(viewData);
      //   defaultEcgData = rescaleXAxis(defaultEcgData);
      ECGs[axisName] = newViewData;
      if (category) {
        showECGInternal(category, axisName);
      }
    }
  };
}

function loadNormalECGandLVP(isECG) {
  var xmlhttp = new XMLHttpRequest();
  if (isECG === "ecg") {
    xmlhttp.onreadystatechange = onECGLoaded(xmlhttp, null, "Normal");
    xmlhttp.open("GET", "ECG/NormalECG.json", true);
    xmlhttp.send();
  } else {
    xmlhttp.onreadystatechange = onLVPLoaded(xmlhttp, null, "Normal");
    xmlhttp.open("GET", "LVP/NormalLVP.json", true);
    xmlhttp.send();
  }
}

var showECGInternal = function (category, axisName) {
  // if (axisName != currentECGName) {
  var currentECG = ECGs[axisName];
  maxECGTime = currentECG[currentECG.length - 1]["x"];
  minECGTime = currentECG[0]["x"];
  ECGchart.removeSeries(currentECGName);
  ECGchart.removeSeries("Normal");
  currentECGName = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  if (category == "warning") {
    colourName = "rgba(255,255,0,1)";
    widthvar = 3;
  } else if (category == "error") {
    colourName = "rgba(255,50,0,1)";
    widthvar = 3;
  }

  if (window.ecgDone != true) {
    ECGchart.addSeries(axisName, currentECG, {
      stroke: { color: colourName, width: widthvar },
    });
    if (
      axisName == "CompensatedFailure" ||
      axisName == "DecompensatedFailure" ||
      axisName == "SmallInfarct" ||
      axisName == "LargeInfarct" ||
      axisName == "Arrhythmia"
    ) {
      if (ECGs["Normal"]) {
        ECGchart.addSeries("Normal", ECGs["Normal"], {
          stroke: { color: "rgba(50,205,50,0.6)", width: 2 },
        });
      } else {
        loadNormalECGandLVP("ecg");
        setTimeout(() => {
          ECGchart.addSeries("Normal", ECGs["Normal"], {
            stroke: { color: "rgba(50,205,50,0.6)", width: 2 },
          });
          ECGchart.render();
          ECGchart.resize("100%", "100%");
        }, 500);
      }
    }

    ECGchart.render();
    ECGchart.resize("100%", "100%");
  }
  // ecgDone = true;
  // }
};


var rescaleXAxis = function (viewData) {
  // var len = viewData.length;
  // var max_x = viewData[len - 1].x;
  // var min_x = viewData[0].x;
  // for (var i = 0; i < len; i++) {
  //   viewData[i].x = ((viewData[i].x - min_x) / (max_x - min_x)) * 100.0;
  // }

  return viewData;
};

function updateIndicator(normaliseTime) {
  if (
    ecgIndicator &&
    currentECGName != " None" &&
    ecgName === currentECGName
  ) {
    var ecgTime = normaliseTime * (maxECGTime - minECGTime) + minECGTime;
    if (timeLineOffset != 0.0 && timeLineOffset) {

      ecgTime = ecgTime + timeLineOffset;


      if (ecgTime > maxECGTime) {
        ecgTime = ecgTime - maxECGTime + minECGTime;
      } else if (ecgTime < minECGTime) {
        ecgTime = maxECGTime - (minECGTime - ecgTime);
      }
    }


    ecgIndicator.opt.values = [ecgTime];

    ecgIndicator.dirty = true;
    ecgIndicator.render();
  }
}

function updatePlot() {
  ECGchart.render();
}


// plot 2 functions

function showECGChart2(axisName, ecgPath, category) {
  ecgName = axisName;
  if (ECGs2[axisName]) {
    showECGInternal2(category, axisName);
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = onECGLoaded2(xmlhttp, category, axisName);
    xmlhttp.open("GET", ecgPath, true);
    xmlhttp.send();
  }
}


function onECGLoaded2(xmlhttp, category, axisName) {
  return function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var viewData = JSON.parse(xmlhttp.responseText);
      var newViewData = rescaleXAxis(viewData);
      ECGs2[axisName] = newViewData;
      if (category) {
        showECGInternal2(category, axisName);
      }
    }
  };
}

var showECGInternal2 = function (category, axisName) {
  var currentECG = ECGs2[axisName];
  maxECGTime2 = currentECG[currentECG.length - 1]["x"];
  minECGTime2 = currentECG[0]["x"];
  ECGchart2.removeSeries(currentECGName2);
  currentECGName2 = axisName;
  var colourName = "rgba(255,50,50,0.6)";
  var widthvar = 2;

  if (category == "warning") {
    colourName = "rgba(255,255,0,1)";
    widthvar = 3;
  } else if (category == "error") {
    colourName = "rgba(255,50,0,1)";
    widthvar = 3;
  }

  if (window.ecgDone2 != true) {
    ECGchart2.addSeries(axisName, currentECG, {
      stroke: { color: colourName, width: widthvar },
    });

    ECGchart2.render();
    ECGchart2.resize("100%", "100%");
  }
  ecgDone = true;
};

function updatePlot2() {
  ECGchart2.render();
}

// plot 3 functions

function showECGChart3(axisName, ecgPath, category) {
  ecgName = axisName;
  if (ECGs3[axisName]) {
    showECGInternal3(category, axisName);
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = onECGLoaded3(xmlhttp, category, axisName);
    xmlhttp.open("GET", ecgPath, true);
    xmlhttp.send();
  }
}


function onECGLoaded3(xmlhttp, category, axisName) {
  return function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var viewData = JSON.parse(xmlhttp.responseText);
      var newViewData = rescaleXAxis(viewData);
      ECGs3[axisName] = newViewData;
      if (category) {
        showECGInternal3(category, axisName);
      }
    }
  };
}

var showECGInternal3 = function (category, axisName) {
  var currentECG3 = ECGs3[axisName];
  maxECGTime3 = currentECG3[currentECG3.length - 1]["x"];
  minECGTime3 = currentECG3[0]["x"];
  ECGchart3.removeSeries(currentECGName3);
  currentECGName3 = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  if (category == "warning") {
    colourName = "rgba(255,255,0,1)";
    widthvar = 3;
  } else if (category == "error") {
    colourName = "rgba(255,50,0,1)";
    widthvar = 3;
  }

  ECGchart3.addSeries(axisName, currentECG3, {
      stroke: { color: colourName, width: widthvar },
  });

  ECGchart3.render();
  ECGchart3.resize("100%", "100%");

  // ecgDone = true;
  // }
};

function updatePlot3() {
  ECGchart3.render();
}

// plot 4 functions

function showECGChart4(axisName, ecgPath, category) {
  ecgName = axisName;
  if (ECGs4[axisName]) {
    showECGInternal4(category, axisName);
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = onECGLoaded4(xmlhttp, category, axisName);
    xmlhttp.open("GET", ecgPath, true);
    xmlhttp.send();
  }
}


function onECGLoaded4(xmlhttp, category, axisName) {
  return function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var viewData = JSON.parse(xmlhttp.responseText);
      var newViewData = rescaleXAxis(viewData);
      ECGs4[axisName] = newViewData;
      if (category) {
        showECGInternal4(category, axisName);
      }
    }
  };
}

var showECGInternal4 = function (category, axisName) {
  var currentECG = ECGs4[axisName];
  maxECGTime4 = currentECG[currentECG.length - 1]["x"];
  minECGTime4 = currentECG[0]["x"];
  ECGchart4.removeSeries(currentECGName4);
  currentECGName4 = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  if (category == "warning") {
    colourName = "rgba(255,255,0,1)";
    widthvar = 3;
  } else if (category == "error") {
    colourName = "rgba(255,50,0,1)";
    widthvar = 3;
  }

  if (window.ecgDone4 != true) {
    ECGchart4.addSeries(axisName, currentECG, {
      stroke: { color: colourName, width: widthvar },
    });

    ECGchart4.render();
    ECGchart4.resize("100%", "100%");
  }
  ecgDone = true;
};

function updatePlot4() {
  ECGchart4.render();
}

// plot 5 functions

function showECGChart5(axisName, ecgPath, category) {
  ecgName = axisName;
  if (ECGs5[axisName]) {
    showECGInternal5(category, axisName);
  } else {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = onECGLoaded5(xmlhttp, category, axisName);
    xmlhttp.open("GET", ecgPath, true);
    xmlhttp.send();
  }
}


function onECGLoaded5(xmlhttp, category, axisName) {
  return function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var viewData = JSON.parse(xmlhttp.responseText);
      var newViewData = rescaleXAxis(viewData);
      ECGs5[axisName] = newViewData;
      if (category) {
        showECGInternal5(category, axisName);
      }
    }
  };
}

var showECGInternal5 = function (category, axisName) {
  var currentECG = ECGs5[axisName];
  maxECGTime5 = currentECG[currentECG.length - 1]["x"];
  minECGTime5 = currentECG[0]["x"];
  ECGchart5.removeSeries(currentECGName5);
  currentECGName5 = axisName;
  var colourName = "rgba(50,205,50,0.6)";
  var widthvar = 2;

  if (category == "warning") {
    colourName = "rgba(255,255,0,1)";
    widthvar = 3;
  } else if (category == "error") {
    colourName = "rgba(255,50,0,1)";
    widthvar = 3;
  }

  if (window.ecgDone5 != true) {
    ECGchart5.addSeries(axisName, currentECG, {
      stroke: { color: colourName, width: widthvar },
    });

    ECGchart5.render();
    ECGchart5.resize("100%", "100%");
  }
  ecgDone = true;
};

function updatePlot5() {
  ECGchart5.render();
}

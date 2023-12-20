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
            title: "time (s)",
            titleOrientation: "away",
            titleFontColor: "#fff",
            fontColor: "#fff",
            majorLabels: true,
            minorTicks: true,
            minorLabels: true,
            microTicks: true,
            min: 0,
            max: 500,
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
          // ECGchart.addPlot("time", {
          //   type: plot2dIndicator,
          //   vertical: true,
          //   lineStroke: { color: "#00ccff" },
          //   labels: null,
          //   stroke: null,
          //   outline: null,
          //   fill: null,
          //   offset: { y: -7, x: -10 },
          //   values: 0.0,
          // });
          // ecgIndicator = ECGchart.getPlot("time");



          timeLineOffset = timeOffset;

          if (!ECGurls[ecg.name]) {
            ECGurls[ecg.name] = ecg.path;
          }

          showECGChart(ecg.name, ecg.path, category);
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
  ecgDone = true;
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

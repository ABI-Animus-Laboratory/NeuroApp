<template>
    <div
      class="d-flex"
      :class="
        $vuetify.breakpoint.smAndUp || $vuetify.breakpoint.width <= 430
          ? 'flex-column trace-box-lg'
          : 'trace-box-sm'
      "
    >
      <div class="top-center-container">
        <v-subheader class="custom-subheader">
          Input Current (pA)
        </v-subheader>
        <!-- Slider to control current -->
        <v-slider
              v-if="$title() === 'Leaky IAF'"
              v-model="currentA"
              max="500"
              min="0"
              thumb-color="blue"
              thumb-label="always"
        ></v-slider>
        <v-slider
              v-if="$title() === 'Healthy'"
              v-model="currentB"
              max="500"
              min="0"
              thumb-color="blue"
              thumb-label="always"
        ></v-slider>
        <v-slider
              v-if="$title() === 'Hodgkin-Huxley'"
              v-model="currentC"
              max="500"
              min="0"
              thumb-color="blue"
              thumb-label="always"
        ></v-slider>
        <v-slider
              v-if="$title() === 'fourth'"
              v-model="currentD"
              max="500"
              min="0"
              thumb-color="blue"
              thumb-label="always"
        ></v-slider>
        <v-subheader v-if="$title() === 'Hodgkin-Huxley'" class="custom-subheader">
          Capacity of the membrane
        </v-subheader>
        <v-slider
              v-if="$title() === 'Hodgkin-Huxley'"
              v-model="mempotential"
              max="500"
              min="1"
              thumb-color="blue"
              thumb-label="always"
        ></v-slider>
        <v-subheader v-if="$title() === 'Hodgkin-Huxley'" class="custom-subheader">
          Potassium Peak Conductance
        </v-subheader>
        <v-slider
              v-if="$title() === 'Hodgkin-Huxley'"
              v-model="g_K"
              max="8000"
              min="4000"
              thumb-color="blue"
              thumb-label="always"
        ></v-slider>
        <!-- Start/Stop buttons -->
<!--        <div class="button-container">-->
<!--          <v-btn-->
<!--            @click="startcalculateVoltage"-->
<!--            color="green"-->
<!--            >-->
<!--              Start-->
<!--          </v-btn>-->
<!--          <v-btn-->
<!--            @click="stopcalculateVoltage"-->
<!--            color="red"-->
<!--            >-->
<!--              Stop-->
<!--          </v-btn>-->
<!--        </div>-->
      </div>
      <v-subheader class="neuron1-subheader" v-if="$title() === 'Healthy'">
          Neuron 1
      </v-subheader>
      <div v-if="$title() === 'Healthy'" class="graph-comm" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="rightECG"
          ref="rightECG"
          class="w-full"
          :class="mdAndUp ? 'rightECG-md' : 'rightECG-sm'"
        >
        </div>
        <div
          id="ecgDescription"
          class="text-caption text-xl-body-2"
          :class="mdAndUp ? 'graph-text-md' : 'graph-text-sm'"
        >
<!--          {{ $ecg().description }}-->
        </div>
      </div>
      <div v-if="$title() === 'Leaky IAF'" class="graph-comm3" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="aECG"
          ref="aECG"
          class="w-full"
          :class="mdAndUp ? 'rightECG-md' : 'rightECG-sm'"
        ></div>
<!--        <div-->
<!--          id="rightECG"-->
<!--          ref="rightECG"-->
<!--          class="w-full"-->
<!--          :class="mdAndUp ? 'rightECG-md' : 'rightECG-sm'"-->
<!--        >-->
<!--        </div>-->
        <div
          id="ecgDescription"
          class="text-caption text-xl-body-2"
          :class="mdAndUp ? 'graph-text-md' : 'graph-text-sm'"
        >
<!--          {{ $ecg().description }}-->
        </div>
      </div>
      <div v-if="$title() === 'Hodgkin-Huxley'" class="graph-comm4" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="bECG"
          ref="bECG"
          class="w-full"
          :class="mdAndUp ? 'rightECG-md' : 'rightECG-sm'"
        ></div>
        <div
          id="ecgDescription"
          class="text-caption text-xl-body-2"
          :class="mdAndUp ? 'graph-text-md' : 'graph-text-sm'"
          >
<!--          {{ $ecg().description }}-->
        </div>
        </div>
        <div v-if="$title() === 'fourth'" class="graph-comm5" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
          <div
            class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
          >
<!--          Electrocardiogram (ECG)-->
          </div>
          <div
            id="cECG"
            ref="cECG"
            class="w-full"
            :class="mdAndUp ? 'rightECG-md' : 'rightECG-sm'"
        ></div>
        <div
          id="ecgDescription"
          class="text-caption text-xl-body-2"
          :class="mdAndUp ? 'graph-text-md' : 'graph-text-sm'"
        >
<!--          {{ $ecg().description }}-->
        </div>
      </div>
      <v-subheader class="neuron2-subheader" v-if="$title() === 'Healthy'">
        Neuron 2
      </v-subheader>
      <div class="graph-comm2" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="leftECG"
          ref="leftECG"
          class="w-full"
          :class="mdAndUp ? 'rightECG-md' : 'rightECG-sm'"
        ></div>
        <div
          id="ecgDescription"
          class="text-caption text-xl-body-2"
          :class="mdAndUp ? 'graph-text-md' : 'graph-text-sm'"
        >
<!--          {{ $ecg().description }}-->
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        idleTime: 0,
        idleTimeLimit: 300000,
        oldTime: new Date(),
        render: undefined,
        ecgd: "",
        currentTime:0,
        totalDuration:300,

        url1:null,
        url2:null,
        url3:null,
        url4:null,
        url5:null,
        test1:1,
        test2:1,
        test3:1,
        test4:1,
        currentA: 0,
        currentB: 0,
        currentC: 0,
        currentD: 0,
        mempotential: 200.0,
        g_K: 6000.0,
        voltage: null,
        voltages: [],
        intervalId: null,
        intervalId2: null,
        intervalId3: null,
        isVoltageVisible: false,
        isTimeVisible: false,
        times: [],
        time: null,
        reset: false,
        updateInterval: 50 // Set the update interval in milliseconds
      };
    },
    computed: {
      mdAndUp() {
        return this.$vuetify.breakpoint.mdAndUp;
      },
    },

    mounted() {
      // Initialise the voltage and time arrays
      this.voltages = [];
      this.times = [];
      // this.currentA=0;

      // if (process.client) {
      //   window.ecgDone = false; //to prevent unexpected problem of chart being loaded twice
      // }
  this.$nextTick(() => {
    // Access and set the innerHTML for rightECG
    const rightECG = this.$refs.rightECG;
    if (rightECG) {
      rightECG.innerHTML = '';
    } else {
      console.error('rightECG is undefined or null');
    }

    // Access and set the innerHTML for aECG
    const aECG = this.$refs.aECG;
    if (aECG) {
      aECG.innerHTML = '';
    } else {
      console.error('aECG is undefined or null');
    }

    // Access and set the innerHTML for bECG
    const bECG = this.$refs.bECG;
    if (bECG) {
      bECG.innerHTML = '';
    } else {
      console.error('bECG is undefined or null');
    }

    // Access and set the innerHTML for leftECG
    const leftECG = this.$refs.leftECG;
    if (leftECG) {
      leftECG.innerHTML = '';
    } else {
      console.error('leftECG is undefined or null');
    }

    const cECG = this.$refs.leftECG;
    if (cECG) {
      cECG.innerHTML = '';
    } else {
      console.error('cECG is undefined or null');
    }
  });
      // const rightECG = this.$refs.rightECG;
      // rightECG.innerHTML = 'r';
      //
      // const aECG = this.$refs.aECG;
      // aECG.innerHTML = 'a';
      //
      // const bECG = this.$refs.bECG;
      // bECG.innerHTML = 'b';
      //
      // const leftECG = this.$refs.leftECG;
      // leftECG.innerHTML = 'l';

      this.intervalId = setInterval(this.calculateVoltage, this.updateInterval);
      // this.intervalId2 = setInterval(this.calculateVoltage, this.updateInterval);
      // this.intervalId3 = setInterval(this.calculateVoltage, this.updateInterval);
      // // These ecgName and lvpName are global variables come from LVPandECG.js to prevent the name undefined issue.
      // ecgName = null;
      //
      // loadChart({name:"testEcg", path:"ECG/NormalECG.json"}, "success", 1.0);
      //
      // setTimeout(()=>{
      //   ecgName = null;
      //   window.ecgDone = false;
      //   const rightECG = this.$refs.rightECG;
      //   rightECG.innerHTML = '';
      //   loadChart({name:"testEcg", path:"ECG/NormalECG.json"}, "success", 1.0);
      // }, 3000)

      // setTimeout(() => {
      //   updateIndicator(0);
      // }, 200);
    },
    methods: {
      updateEcg() {

        this.baseRenderer = this.$baseRenderer();
        if (this.baseRenderer) {
          this.baseRenderer.preRenderCallbackFunctions.length = 0;
          var updateIndicatorsAndTimer = () => {
            // these two commented code is for model animation with graph animation.
            // const scene = this.baseRenderer.getCurrentScene();
            // const normaliseTime = scene.getCurrentTime();
            const normaliseTime = this.currentTime / this.totalDuration;
            if (this.currentTime < this.totalDuration){
              this.currentTime += 1;
            }else{
              this.currentTime = 0;
            }
            updateIndicator(normaliseTime);
          };
          this.baseRenderer.addPreRenderCallbackFunction(
            updateIndicatorsAndTimer
          );
        }
      },

    //   startcalculateVoltage() {
    //   // Set up a recurring interval to call calculateVoltage with the updated current value
    //     if (this.$title() === "Leaky IAF") {
    //       this.intervalId1 = setInterval(this.calculateVoltage, this.updateInterval);
    //     } else if (this.$title() === "Healthy") {
    //       this.intervalId2 = setInterval(this.calculateVoltage, this.updateInterval);
    //     } else if (this.$title() === "Hodgkin-Huxley") {
    //       this.intervalId2 = setInterval(this.calculateVoltage, this.updateInterval);
    //     }
    // },

    stopcalculateVoltage() {
      clearInterval(this.intervalId);
      // clearInterval(this.intervalId2);
      // clearInterval(this.intervalId3);
      // Clear the interval when it is no longer needed
      // if (this.$title() === "Leaky IAF") {
      //   clearInterval(this.intervalId1);
      // } else if (this.$title() === "Healthy") {
      //   clearInterval(this.intervalId2);
      // } else if (this.$title() === "Hodgkin-Huxley") {
      //   clearInterval(this.intervalId3);
      // }
    },

    async calculateVoltage() {
        if (this.$title() === "Leaky IAF")
          try {
            console.log("time", this.intervalId)
            console.log("currentA",this.currentA)
            const response = await fetch(`http://127.0.0.1:8000/single/${this.currentA}`);
            const dataA = await response.json();
            console.log("lEAKY, DATA", dataA)
            // const dataB = dataA["data1"]
            // const dataC = dataA["data2"]
            this.reset = false;
            // console.log(data)
            if(this.url3 !== null){
              URL.revokeObjectURL(this.url3)
            }

            const blob3 = new Blob([JSON.stringify(dataA)], { type: 'application/json' });
            this.url3 = URL.createObjectURL(blob3);

            ecgName = null;
            window.ecgDone = false;

            // const aECG = this.$refs.aECG;
            aECG.innerHTML = '';

            // const rightECG = this.$refs.rightECG;
            // rightECG.innerHTML = '';

            console.log("test number", this.test1)
            loadChart3({name:"testEcg3", path:this.url3}, "success", 1.0);
            //
            // if(this.url2 !== null){
            //   URL.revokeObjectURL(this.url2)
            // }
            //
            // const blob2 = new Blob([JSON.stringify(dataC)], { type: 'application/json' });
            // this.url2 = URL.createObjectURL(blob2);
            //
            // window.ecgDone2 = false;
            // const rightECG2 = this.$refs.leftECG;
            // rightECG2.innerHTML = '';
            // loadChart2({name:"testEcg2"+String(this.test), path:this.url2}, "success", 1.0);
            // this.test1+=1;

        } catch (error) {
            console.error("Error updating voltage:", error);
        } else if (this.$title() === "Healthy")
          try {
            const response = await fetch(`http://127.0.0.1:8000/synapse/${this.currentB}`);
            const data1 = await response.json();
            const data2 = data1["data1"]
            const data3 = data1["data2"]
            this.reset = false;
            // console.log(data)
            if(this.url1 !== null){
              URL.revokeObjectURL(this.url1)
            }

            const blob1 = new Blob([JSON.stringify(data2)], { type: 'application/json' });
            this.url1 = URL.createObjectURL(blob1);

            ecgName = null;
            window.ecgDone = false;
            // const rightECG = this.$refs.rightECG;
            rightECG.innerHTML = '';

            loadChart({name:"testEcg", path:this.url1}, "success", 1.0);
            // this.test+=1;

            if(this.url2 !== null){
              URL.revokeObjectURL(this.url2)
            }

            const blob2 = new Blob([JSON.stringify(data3)], { type: 'application/json' });
            this.url2 = URL.createObjectURL(blob2);

            window.ecgDone2 = false;
            // const leftECG = this.$refs.leftECG;
            leftECG.innerHTML = '';
            loadChart2({name:"testEcg2", path:this.url2}, "success", 1.0);
            this.test+=1;

        } catch (error) {
            console.error("Error updating voltage:", error);

        } else if (this.$title() === "Hodgkin-Huxley")
          try {
            const response = await fetch(`http://127.0.0.1:8000/single/${this.currentC}/${this.mempotential}/${this.g_K}`);
            const data4 = await response.json();
            this.reset = false;
            // console.log(data)
            if(this.url4 !== null){
              URL.revokeObjectURL(this.url4)
            }

            const blob4 = new Blob([JSON.stringify(data4)], { type: 'application/json' });
            this.url4 = URL.createObjectURL(blob4);

            ecgName = null;
            window.ecgDone = false;
            // const bECG = this.$refs.bECG;
            bECG.innerHTML = '';
            loadChart4({name:"testEcg4", path:this.url4}, "success", 1.0);
            this.test+=1;

        } catch (error) {
            console.error("Error updating voltage:", error);
        } else if (this.$title() === "fourth")
          try {
            const response = await fetch(`http://127.0.0.1:8000/fourth/${this.currentD}`);
            const data5 = await response.json();
            this.reset = false;
            // console.log(data)
            if(this.url5 !== null){
              URL.revokeObjectURL(this.url5)
            }

            const blob5 = new Blob([JSON.stringify(data5)], { type: 'application/json' });
            this.url5 = URL.createObjectURL(blob5);

            ecgName = null;
            window.ecgDone = false;
            // const cECG = this.$refs.cECG;
            cECG.innerHTML = '';
            loadChart5({name:"testEcg5", path:this.url5}, "success", 1.0);
            this.test+=1;
        } catch (error) {
            console.error("Error updating voltage:", error);
        }
    },
    },
    beforeDestroy() {
    // Write code before destroying this component
    this.stopcalculateVoltage();

        // Call the backend function without requiring any response
    fetch('http://127.0.0.1:8000/single/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Optionally, include a request body if needed
      // body: JSON.stringify({ key: 'value' }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Optional: Handle success if needed
        // You can omit the next line if you don't need to do anything on success
        return response.json();
      })
      .then(data => {
        // Optional: Handle the response data if needed
        console.log(data);
      })
      .catch(error => {
        console.error('Error calling backend function:', error);
      });
    //   if(!!this.intervalId){
    //     clearInterval(this.intervalId)
    //   }
  }
  };


  </script>

  <style scoped lang="scss">
  #ecgDescription,
  #lvpDescription {
    width: 90%;
  }

  .trace-box-lg,
  .item {
    min-width: 280px;
    max-width: 40vw;
  }

  .trace-box-sm {
    // width: 80vw;
    // display: block;
    // margin: 0 auto;
  }

  .rightECG-sm {
    width: 50vw;
    height: 40vw;
    min-height: 80px;
  }
  .rightECG-md {
    width: 25vw;
    min-height: 300px;
  }
  .graph-text-md {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 15vw;
  }
  .graph-text-sm {
    width: 100vw;
    p {
      width: 100%;
    }
  }
  .graph-comm {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
    margin-right: 60px;
    margin-bottom: 40px !important;
  }
  .graph-comm2 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px !important;
    margin-right: 60px;
    margin-bottom: 10px;
  }
  .graph-comm3 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
    margin-right: 60px;
    margin-bottom: 40px !important;
  }
  .graph-comm4 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
    margin-right: 60px;
    margin-bottom: 40px !important;
  }
  .graph-comm5 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
    margin-right: 60px;
    margin-bottom: 40px !important;
  }
  .EGC-lg {
    height: 20vh;
    margin-bottom: 10vh;
  }
  .EGC-sm {
    width: 100vw;
  }
  .LVP-lg {
    height: 20vh;
  }
  .LVP-sm {
    width: 100vw;
  }

  .top-center-container {
    text-align: center;
    //margin-top: 20px;
    //margin-bottom: 20px;
    margin-right: 50px;
    margin-left: 50px;
  }

  .custom-subheader {
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 30px;
    color: white;
    display: flex;
    justify-content: center;
    font-size: 18px;
    width: 100%;
  }
  .neuron1-subheader {
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 10px;
    color: white;
    display: flex;
    justify-content: center;
    font-size: 18px;
    width: 100%;
  }

  .neuron2-subheader {
    font-weight: bold;
    text-decoration: underline;
    margin-top: 10px !important;
    margin-bottom: 10px;
    color: white;
    display: flex;
    justify-content: center;
    font-size: 18px;
    width: 100%;
  }

  .slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .slider-value {
    margin-top: 5px;
    font-size: 18px;
  }

  .button-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .start-button,
  .stop-button {
    margin-top: 10px;
    margin-bottom: 40px;
  }
  </style>

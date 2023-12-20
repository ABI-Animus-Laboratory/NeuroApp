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
        <!-- Display voltage at the top -->
<!--        <p v-if="isVoltageVisible" class="voltage-output">Voltage: {{ voltage }}</p>-->
<!--        <p v-if="isTimeVisible" class="voltage-output">Time: {{ time }}</p>-->
        <v-subheader class="custom-subheader">
          Input Current (pA)
        </v-subheader>

        <v-slider
              v-model="current"
              max="500"
              min="0"
              thumb-color="red"
              thumb-label="always"
        ></v-slider>

        <!-- Slider below the voltage -->
<!--        <div class="slider-container">-->
<!--&lt;!&ndash;          <input type="range" v-model="current" min="0" max="500" class="current-input" />&ndash;&gt;-->
<!--&lt;!&ndash;          <span class="slider-value">{{ current }}</span>&ndash;&gt;-->

<!--        </div>-->

        <!-- Start/Stop buttons centered below the slider -->
        <div class="button-container">
          <v-btn
            @click="startcalculateVoltage"
            color="green"
            >
              Start
          </v-btn>
          <v-btn
            @click="stopcalculateVoltage"
            color="red"
            >
              Stop
          </v-btn>
        </div>
      </div>

      <div class="graph-comm" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
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

        url:null,
        test:1,
        current: 0,
        voltage: null,
        voltages: [],
        intervalId: null,
        isVoltageVisible: false,
        isTimeVisible: false,
        times: [],
        time: null,
        reset: false,
        updateInterval: 500 // Set the update interval in milliseconds
      };
    },
    computed: {
      mdAndUp() {
        return this.$vuetify.breakpoint.mdAndUp;
      },
    },

    mounted() {


      // Set initial value of voltage to null
      this.voltage = null;
      this.voltages = [];
      this.time = null;
      this.times = [];

      // Ensure visibility is set to true when the component is mounted
      this.isVoltageVisible = true;
      this.isTimeVisible = true;

      if (process.client) {
        window.ecgDone = false; //to prevent unexpected problem of chart being loaded twice
      }

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

      startcalculateVoltage() {
      // Set up a recurring interval to call calculateVoltage with the updated current value
      this.intervalId = setInterval(this.calculateVoltage, this.updateInterval);
    },

    stopcalculateVoltage() {
      // Clear the interval when it's no longer needed
      clearInterval(this.intervalId);
    },

    async calculateVoltage() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/hello/${this.current}`);
        const data = await response.json();
        this.reset = false;
        // console.log(data)
        if(this.url !== null){
          URL.revokeObjectURL(this.url)
        }

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        this.url = URL.createObjectURL(blob);

        ecgName = null;
        window.ecgDone = false;
        const rightECG = this.$refs.rightECG;
        rightECG.innerHTML = '';
        loadChart({name:"testEcg"+String(this.test), path:this.url}, "success", 1.0);
        this.test+=1;
        // Update the voltages array
        // this.voltages = data.voltage;
        // this.times = data.times;
        // console.log(data)
        // // Update the voltage property to the first element of the array
        // if (this.voltages.length > 0) {
        //   this.voltage = this.voltages[this.voltages.length - 1];
        //   this.isVoltageVisible = true;
        // } else {
        //   console.warn("Received an empty voltages array");
        // }
        // // Update the time property to the first element of the array
        // if (this.times.length > 0) {
        //   this.time = this.times[this.times.length - 1];
        //   this.isTimeVisible = true;
        // } else {
        //   console.warn("Received an empty voltages array");
        // }
        // this.saveVoltageData({ voltages: this.voltages, times: this.times });

      } catch (error) {
        console.error("Error updating voltage:", error);
      }

    },
    },
    beforeDestroy() {
    // Wirte code before destory this component
    this.stopcalculateVoltage();
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
    min-height: 350px;
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
    margin-top: 60px;
    margin-right: 60px;
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
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 50px;
    margin-left: 50px
  }

  .custom-subheader {
    margin-bottom: 30px;
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
    margin-top: 5px; /* Move the slider value down a bit */
    font-size: 18px;
  }

  .button-container {
    display: flex;
    justify-content: space-around; /* Adjusted to space around for the buttons */
    align-items: center;
    margin-top: 10px;
    margin-bottom: 40px;
  }

  .start-button,
  .stop-button {
    margin-top: 10px;
  }
  </style>

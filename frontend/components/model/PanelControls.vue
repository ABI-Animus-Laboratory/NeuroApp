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
              v-if="$title() === 'Home'"
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
        ></div>
        <div
          id="ecgDescription"
          class="text-caption text-xl-body-2"
          :class="mdAndUp ? 'graph-text-md' : 'graph-text-sm'"
        >
<!--          {{ $ecg().description }}-->
        </div>
      </div>
      <div v-if="$title() === 'Home'" class="graph-comm3" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
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
        test:1,
        currentA: 0,
        currentB: 0,
        mempotential: 200.0,
        voltage: null,
        voltages: [],
        intervalId: null,
        isVoltageVisible: false,
        isTimeVisible: false,
        times: [],
        time: null,
        reset: false,
        updateInterval: 2000 // Set the update interval in milliseconds
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

      if (process.client) {
        window.ecgDone = false; //to prevent unexpected problem of chart being loaded twice
      }

      this.intervalId = setInterval(this.calculateVoltage, this.updateInterval);
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
    //   this.intervalId = setInterval(this.calculateVoltage, this.updateInterval);
    // },

    // stopcalculateVoltage() {
    //   // Clear the interval when it is no longer needed
    //   clearInterval(this.intervalId);
    // },

    async calculateVoltage() {
        if (this.$title() === "Home")
          try {
            const response = await fetch(`http://127.0.0.1:8000/single/${this.currentA}`);
            const dataA = await response.json();
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
            const aECG = this.$refs.aECG;
            aECG.innerHTML = '';
            loadChart3({name:"testEcg3"+String(this.test), path:this.url3}, "success", 1.0);
            this.test+=1;
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
            // this.test+=1;

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
            const rightECG = this.$refs.rightECG;
            rightECG.innerHTML = '';
            loadChart({name:"testEcg"+String(this.test), path:this.url1}, "success", 1.0);
            this.test+=1;

            if(this.url2 !== null){
              URL.revokeObjectURL(this.url2)
            }

            const blob2 = new Blob([JSON.stringify(data3)], { type: 'application/json' });
            this.url2 = URL.createObjectURL(blob2);

            window.ecgDone2 = false;
            const leftECG2 = this.$refs.leftECG;
            leftECG2.innerHTML = '';
            loadChart2({name:"testEcg2"+String(this.test), path:this.url2}, "success", 1.0);
            this.test+=1;

        } catch (error) {
            console.error("Error updating voltage:", error);

        // } else if (this.$title() === "Hodgkin-Huxley")
        //   try {
        //     const response = await fetch(`http://127.0.0.1:8000/single/${this.current}/${this.mempotential}`);
        //     const data4 = await response.json();
        //     this.reset = false;
        //     // console.log(data)
        //     if(this.url !== null){
        //       URL.revokeObjectURL(this.url)
        //     }
        //
        //     const blob = new Blob([JSON.stringify(data4)], { type: 'application/json' });
        //     this.url = URL.createObjectURL(blob);
        //
        //     ecgName = null;
        //     window.ecgDone = false;
        //     const rightECG = this.$refs.rightECG;
        //     rightECG.innerHTML = '';
        //     loadChart({name:"testEcg"+String(this.test), path:this.url}, "success", 1.0);
        //     this.test+=1;
        //
        // } catch (error) {
        //     console.error("Error updating voltage:", error);
        }
    },
    },
    // beforeDestroy() {
    // // Write code before destroying this component
    // this.stopcalculateVoltage();
  // }
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

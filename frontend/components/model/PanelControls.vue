<template>
    <div
      class="d-flex"
      :class="
        $vuetify.breakpoint.smAndUp || $vuetify.breakpoint.width <= 430
          ? 'flex-column trace-box-lg'
          : 'trace-box-sm'
      "
    >
      <div class="graph-comm" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
          Electrocardiogram (ECG)
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
          {{ $ecg().description }}
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
      };
    },
    computed: {
      mdAndUp() {
        return this.$vuetify.breakpoint.mdAndUp;
      },
    },
  
    mounted() {
      if (process.client) {
        window.ecgDone = false; //to prevent unexpected problem of chart being loaded twice
      }

      // These ecgName and lvpName are global variables come from LVPandECG.js to prevent the name undefined issue.
      ecgName = null;

      loadChart(this.$ecg(), this.$category(), 1.0);
      setTimeout(() => {
        this.updateEcg();
      }, 200);
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
    },
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
    max-width: 25vw;
  }
  
  .trace-box-sm {
    // width: 80vw;
    // display: block;
    // margin: 0 auto;
  }
  
  .rightECG-sm {
    width: 50vw;
    height: 20vw;
    min-height: 80px;
  }
  .rightECG-md {
    width: 20vw;
    min-height: 150px;
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
  </style>
  
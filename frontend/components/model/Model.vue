<template>
  <div class="model">
    <div class="top-center-container">
      <!-- Display voltage at the top -->
      <p v-if="isVoltageVisible" class="voltage-output">Voltage: {{ voltage }}</p>
      <p v-if="isTimeVisible" class="voltage-output">Time: {{ time }}</p>

      <!-- Slider below the voltage -->
      <div class="slider-container">
        <input type="range" v-model="current" min="0" max="500" class="current-input" />
        <span class="slider-value">{{ current }}</span>
      </div>

      <!-- Start/Stop buttons centered below the slider -->
      <div class="button-container">
        <button @click="startcalculateVoltage" class="start-button">Start Updates</button>
        <button @click="stopcalculateVoltage" class="stop-button">Stop Updates</button>
      </div>
    </div>
    <div ref="baseDomObject" :class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'" />
  </div>
</template>

<script>
import axios from "axios";

export default {

  data() {
    return {
      Copper: null,
      THREE: null,
      baseRenderer: null,
      container: null,
      modelName: "Model load on here!",
      helloworld:"",
      model:null,
      current: 0,
      voltage: null,
      voltages: [],
      intervalId: null,
      isVoltageVisible: false,
      isTimeVisible: false,
      times: [],
      time: null,
      reset: false,
      updateInterval: 1000 // Set the update interval in milliseconds
    };
  },

  async fetch() {
      this.model = await fetch(
        'http://127.0.0.1:8000/api/model'
      ).then(res => res.blob())

      console.log(this.model);
    },

  created: async function (){

    // await axios.get('http://127.0.0.1:8000/hello/model').then((res)=>{
    //   console.log(res);
    // })
    this.$nuxt.$on("send-emitter-data", (data) => {
      console.log(data);
    });
  },

  computed: {
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },

  mounted() {
    this.Copper = this.$Copper();
    this.baseRenderer = this.$baseRenderer();
    const baseContainer = this.$baseContainer();
    this.container = this.$refs.baseDomObject;

    // Set initial styles and values
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "flex-start";
    this.container.style.height = "200px"; // Set a fixed height for the top container

    // Set initial value of voltage to null
    this.voltage = null;
    this.voltages = [];
    this.time = null;
    this.times = [];

    // Ensure visibility is set to true when the component is mounted
    this.isVoltageVisible = true;
    this.isTimeVisible = true;
    setTimeout(() => {
      this.mdAndUp
        ? (baseContainer.style.height = "100vh")
        : (baseContainer.style.height = "100vw");
      this.container.appendChild(baseContainer);
      this.start();
    }, 100);

    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.mdAndUp
          ? (baseContainer.style.height = "100vh")
          : (baseContainer.style.height = "100vw");
        this.scene.onWindowResize();
      }, 500);
    });

  },

  methods: {
    // async updateVoltage() {
    //   try {
    //     const response = await fetch(`http://127.0.0.1:8000/hello/${this.current}`);
    //     const data = await response.json();
    //
    //     // Update the voltages array
    //     this.voltages = data;
    //
    //     // Update the voltage property to the first element of the array
    //     if (this.voltages.length > 0) {
    //       this.voltage = this.voltages[this.voltages.length - 1];
    //       this.isVoltageVisible = true;
    //     } else {
    //       console.warn("Received an empty voltages array");
    //     }
    //   } catch (error) {
    //     console.error("Error updating voltage:", error);
    //   }
    // },

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

        // Update the voltages array
        this.voltages = data.voltage;
        this.times = data.times;

        // Update the voltage property to the first element of the array
        if (this.voltages.length > 0) {
          this.voltage = this.voltages[this.voltages.length - 1];
          this.isVoltageVisible = true;
        } else {
          console.warn("Received an empty voltages array");
        }
                // Update the voltage property to the first element of the array
        if (this.times.length > 0) {
          this.time = this.times[this.times.length - 1];
          this.isTimeVisible = true;
        } else {
          console.warn("Received an empty voltages array");
        }
      } catch (error) {
        console.error("Error updating voltage:", error);
      }
    },


    async start(){
      console.log("load model functions.");
      // get model from backend
      this.model = await fetch(
        'http://127.0.0.1:8000/api/model'
      ).then(res => res.blob())

      const model_url = URL.createObjectURL(this.model)

      this.loadModel(model_url,"test");
    },

    loadModel(model_url, model_name) {

      const viewURL = 'modelView/noInfarct_view.json';

      this.scene = this.baseRenderer.getSceneByName(model_name);
      if (this.scene === undefined) {
        this.scene = this.baseRenderer.createScene(model_name);
        // this.scene.controls.staticMoving = true;
        // this.scene.controls.rotateSpeed = 3.0;
        // this.scene.controls.panSpeed = 3.0;
        this.baseRenderer.setCurrentScene(this.scene);
        this.scene.loadOBJ(model_url, (content) => {
          // this.scene.setModelPosition(content, { x: 5, y: 2 });
          console.log(content);
        });
        this.scene.loadViewUrl(viewURL);
      }
      this.scene.onWindowResize();
    },
  },

  watch: {},

  beforeDestroy() {
    // Wirte code before destory this component
    this.stopcalculateVoltage();
  }
};
</script>

<style scoped lang="scss">
.model {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
}

.top-center-container {
  text-align: center;
  margin-top: 20px;
}

.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.current-input {
  padding: 5px;
  font-size: 16px;
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
}

.start-button,
.stop-button {
  margin-top: 10px;
}
</style>


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
      <div v-if="$title() === 'network'" class="button-container">
          <!-- Buttons for the network tab -->
          <button @click="runNetwork" style="background-color: #4CAF50; color: white;">Start</button>
          <button @click="resetColors" style="background-color: #FF9800; color: white;">Clear</button>
          <button @click="resetNetwork" style="background-color: #2196F3; color: white;">Reset Values</button>
      </div>
      <v-subheader v-if="$title() === 'Hodgkin-Huxley' || $title() === 'Healthy' || $title() === 'Leaky IAF'" class="custom-subheader">
        Input Current (pA)
      </v-subheader>
        <!-- Sliders to control current input on each tab -->
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
        <!-- Sliders for the network tab -->
        <div v-for="(isVisible, index) in slidersVisible" :key="'neuron-' + index" v-if="isVisible && $title() === 'network'">
          <h3 style="margin-bottom: 50px; text-decoration: underline;">Neuron {{ index + 1 }} Current</h3>
          <v-slider
            v-model="currents[index]"
            max="500"
            min="0"
            thumb-color="blue"
            thumb-label="always"
            style="width: 400px;"
          ></v-slider>
        </div>
        <div v-for="(isVisible, index) in slidersVisible" :key="'memCap-' + index" v-if="isVisible && $title() === 'network'">
          <h3 style="margin-bottom: 50px; text-decoration: underline;">Neuron {{ index + 1 }} Membrane Capacitance</h3>
          <v-slider
            v-model="memCap[index]"
            max="1000"
            min="0"
            thumb-color="blue"
            thumb-label="always"
            style="width: 400px;"
          ></v-slider>
        </div>
        <div v-for="(isArrowVisible, index) in arrowSlidersVisible" :key="'arrow-' + index" v-if="isArrowVisible && $title() === 'network'">
          <h3 style="margin-bottom: 50px; text-decoration: underline;">Arrow {{ index + 1 }} Weight</h3>
          <v-slider
            v-model="weights[index]"
            max="1000"
            min="1"
            thumb-color="blue"
            thumb-label="always"
            style="width: 400px;"
          ></v-slider>
        </div>
        <!-- Additional headings and sliders for the hodgkin-huxley tab -->
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
        <!-- Label for the graph on the network tab -->
        <div v-for="(isVisible, index) in slidersVisible" :key="index" v-if="isVisible && $title() === 'network'">
          <h3 style="margin-bottom: 40px; text-decoration: underline;">Neuron {{ index + 1 }} Membrane Potential</h3>
        </div>
      </div>
        <!-- Heading for neuron 1 on the synapse tab -->
      <v-subheader class="neuron1-subheader" v-if="$title() === 'Healthy'">
          Neuron 1
      </v-subheader>
      <!-- Graph 1 on the synapse tab -->
      <div v-if="$title() === 'Healthy'" class="graph-comm" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="chartA"
          ref="chartA"
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
      <!-- Graph on the leaky integrate-and-fire tab -->
      <div v-if="$title() === 'Leaky IAF'" class="graph-comm3" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="chartC"
          ref="chartC"
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
      <!-- Graph on the hodgkin-huxley tab -->
      <div v-if="$title() === 'Hodgkin-Huxley'" class="graph-comm4" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="chartD"
          ref="chartD"
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
      <!-- Graph on the network tab -->
      <div v-if="$title() === 'network' && showNetworkGraph" class="graph-comm5" :class="mdAndUp ? 'EGC-lg' : 'EGC-sm'">
        <div
          class="font-weight-bold text-subtitle-2 text-xl-h6 text-sm-subtitle-2 text-md-body-1"
        >
<!--          Electrocardiogram (ECG)-->
        </div>
        <div
          id="chartE"
          ref="chartE"
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
      <!-- Graph 2 on the synapse tab -->
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
          id="chartB"
          ref="chartB"
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
  // import sys from "sys"
  // import subprocess from "subprocess"
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
        originalButtonColors: [],
        spikes: [],
        startNode: null,
        buttonColors: Array.from({ length: 9 }, () => 'blue'),

        neuron:null,
        neuron1:null,
        neuron2:null,
        neuron3:null,
        neuron4:null,
        multimeter:null,
        multimeter1:null,
        multimeter2:null,
        multimeter3:null,
        multimeter4:null,

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
        graphVal1: -70,
        graphVal2: -70,
        graphVal3: -70,
        graphVal4: -70,
        init1: false,
        init2: false,
        init3: false,
        updateInterval: 100,
        updateTimeStep: 1,

        currents: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        memCap: [200, 200, 200, 200, 200, 200, 200, 200, 200],
        weights: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        connections: [true, true, true, true, true, true, true, true, true, true, true, true],
        slidersVisible: [true, false, false, false, false, false, false, false, false],
        arrowSlidersVisible: [false, false, false, false, false, false, false, false, false, false, false, false],
        showNetworkGraph: true,
        net_volt_0: null,
        net_volt_1: null,
        net_volt_2: null,
        net_volt_3: null,
        net_volt_4: null,
        net_volt_5: null,
        net_volt_6: null,
        net_volt_7: null,
        net_volt_8: null,
        net_max0: -70.0,
        net_max1: -70.0,
        net_max2: -70.0,
        net_max3: -70.0,
        net_max4: -70.0,
        net_max5: -70.0,
        net_max6: -70.0,
        net_max7: -70.0,
        net_max8: -70.0
      };
    },
    computed: {
      mdAndUp() {
        return this.$vuetify.breakpoint.mdAndUp;
      },
    },

    updated() {
    console.log('Component has been updated.');
    },

    mounted() {
      if (!this.init1 && !this.init2 && !this.init3) {
        // initialise the nest simulation based on the current tab
        this.initialiseNeurons()
      }

      // initialise arrays for plotting
      this.voltages = [];
      this.times = [];

      this.originalButtonColors = Array.from({ length: 9 }, () => 'blue');

      this.$nextTick(() => {
        const chartA = this.$refs.chartA;
        if (chartA) {
          chartA.innerHTML = '';
        } else {
          console.error('chartA is undefined or null');
        }

        const chartB = this.$refs.chartB;
        if (chartB) {
          chartB.innerHTML = '';
        } else {
          console.error('chartB is undefined or null');
        }

        const chartC = this.$refs.chartC;
        if (chartC) {
          chartC.innerHTML = '';
        } else {
          console.error('chartC is undefined or null');
        }

        const chartD = this.$refs.chartD;
        if (chartD) {
          chartD.innerHTML = '';
        } else {
          console.error('chartD is undefined or null');
        }

        const chartE = this.$refs.chartE;
        if (chartE) {
          chartE.innerHTML = '';
        } else {
          console.error('chartE is undefined or null');
        }
      });

      // update the panel of sliders on the network tab when an object is clicked on
      $nuxt.$on('update-panel', (sliders) => {
        this.slidersVisible = sliders[0];
        this.arrowSlidersVisible = sliders[1]
        for (const value of this.slidersVisible) {
          this.showNetworkGraph = false;
          if (value) {
            // Set the variable to true if at least one value is true
            this.showNetworkGraph = true;
            break; // Exit the loop early since we found a true value
          }
        }
        // update the plots
        this.calculateVoltage()
      });

      // initialise the interval for updating the graph
      if (this.$title() === "Leaky IAF" || this.$title() === "Hodgkin-Huxley" || this.$title() === "Healthy") {
        this.intervalId = setInterval(this.calculateVoltage, this.updateInterval);
      }

      // initialise the plots when starting the network tab
      if (this.$title() === "network") {
        this.runNetwork()
      }
    },
    methods: {
      async initialiseNeurons() {
        try {
          if (this.$title() === "Leaky IAF") {
            // call the leaky integrate-and-fire initialisation and return the nest variables
            const response = await fetch(`http://127.0.0.1:8000/single/initialiseLeaky`);
            const init1 = await response.json();
            // store the nest variables
            this.neuron = init1["neuron"];
            this.multimeter = init1["multimeter"];
            this.init1 = true;
          } else if (this.$title() === "Healthy") {
            // call the synapse initialisation and return the nest variables
            const response = await fetch(`http://127.0.0.1:8000/single/initialiseSynapse`);
            const init2 = await response.json();
            // store the nest variables
            this.neuron1 = init2["neuron"];
            this.multimeter1 = init2["multimeter"];
            this.neuron2 = init2["neuron"];
            this.multimeter2 = init2["multimeter"];
            this.init2 = true;
          } else if (this.$title() === "Hodgkin-Huxley") {
            // call the hodgkin-huxley initialisation and return the nest variables
            const response = await fetch(`http://127.0.0.1:8000/single/initialiseHH`);
            const init3 = await response.json();
            // store the nest variables
            this.neuron3 = init3["neuron"];
            this.multimeter3 = init3["multimeter"];
            this.init3 = true;
          }
        } catch (error) {
          console.error("Error initializing neurons:", error);
        }
      },

      async clearNetwork() {
        try {
          // clear the nest network simulation to be ready for the nest network initialisation
          const response = await fetch('http://127.0.0.1:8000/single/clearNetwork', {
            method: 'POST',
          });
          if (response.ok) {
            console.log('Function triggered successfully');
          } else {
            console.error('Failed to trigger function');
          }
        } catch (error) {
          console.error('Error triggering function:', error);
        }
      },

    stopcalculateVoltage() {
        // clear the interval for updating the plot
        clearInterval(this.intervalId);
    },

    async runNetwork() {
      try {
        let currents_string = this.currents.join(',');
        let memCap_string = this.memCap.join(',');
        let weights_string = this.weights.join(',');

        // run the network simulation
        const response = await fetch(`http://127.0.0.1:8000/network/${currents_string}/${memCap_string}/${weights_string}`);
        const listA = await response.json();
        // update the list of spiked neurons and neuron voltage output
        this.spikes = listA["spikes"];
        this.net_volt_0 = listA["data0"];
        this.net_volt_1 = listA["data1"];
        this.net_volt_2 = listA["data2"];
        this.net_volt_3 = listA["data3"];
        this.net_volt_4 = listA["data4"];
        this.net_volt_5 = listA["data5"];
        this.net_volt_6 = listA["data6"];
        this.net_volt_7 = listA["data7"];
        this.net_volt_8 = listA["data8"];
        this.net_max0 = listA["max0"];
        this.net_max1 = listA["max1"];
        this.net_max2 = listA["max2"];
        this.net_max3 = listA["max3"];
        this.net_max4 = listA["max4"];
        this.net_max5 = listA["max5"];
        this.net_max6 = listA["max6"];
        this.net_max7 = listA["max7"];
        this.net_max8 = listA["max8"];

        // send the message to update the colour of the neurons and connections
        $nuxt.$emit('run-network', [this.spikes, this.net_max0, this.net_max1, this.net_max2, this.net_max3, this.net_max4, this.net_max5, this.net_max6, this.net_max7,this.net_max8])

        // update the plot
        this.calculateVoltage()

        } catch (error) {
          console.error("Error running network:", error);
        }
    },

    resetColors() {
          // send the message to reset the network colours
          $nuxt.$emit('reset-colors')
      },

    resetNetwork() {
          // reset the input values for the network
          this.currents = [0, 0, 0, 0, 0, 0, 0, 0, 0]
          this.memCap = [200, 200, 200, 200, 200, 200, 200, 200, 200]
          this.weights = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
          // update the plot
          this.runNetwork()
      },

      async calculateVoltage() {
        if (this.$title() === "Leaky IAF")
          try {
            // run the next simulation timestep and return the recent voltage and time values
            const response = await fetch(`http://127.0.0.1:8000/single/${this.updateTimeStep}/${this.currentA}/${this.neuron}/${this.multimeter}`);
            const dataA = await response.json();
            const dataA1 = dataA["data"]
            this.reset = false;
            if(this.url3 !== null){
              URL.revokeObjectURL(this.url3)
            }
            this.graphVal3 = dataA["value"]
            const blob3 = new Blob([JSON.stringify(dataA1)], { type: 'application/json' });
            this.url3 = URL.createObjectURL(blob3);
            ecgName = null;
            window.ecgDone = false;
            chartC.innerHTML = '';
            // update the plot
            loadChart3({name:"testEcg3", path:this.url3}, "success", 1.0);
            // send a message to update the colour of the neuron based on the recent maximum voltage value
            $nuxt.$emit('graph-change-Leaky', [this.graphVal3, this.graphVal4])
        } catch (error) {
            console.error("Error updating voltage:", error);
        } else if (this.$title() === "Healthy")
          try {
            // run the next simulation timestep and return the recent voltage and time values
            const response = await fetch(`http://127.0.0.1:8000/synapse/${this.updateTimeStep}/${this.currentB}/${this.neuron1}/${this.multimeter1}/${this.multimeter2}`);
            const data1 = await response.json();
            const data2 = data1["data1"]
            const data3 = data1["data2"]
            this.graphVal1 = data1["value"]
            this.graphVal4 = data1["value2"]
            this.reset = false;
            if(this.url1 !== null){
              URL.revokeObjectURL(this.url1)
            }
            const blob1 = new Blob([JSON.stringify(data2)], { type: 'application/json' });
            this.url1 = URL.createObjectURL(blob1);
            ecgName = null;
            window.ecgDone = false;
            chartA.innerHTML = '';
            // update plot 1
            loadChart({name:"testEcg", path:this.url1}, "success", 1.0);
            // send a message to update the colour of the neurons based on the recent maximum voltage value
            $nuxt.$emit('graph-change-synapse', [this.graphVal1, this.graphVal4])
            if(this.url2 !== null){
              URL.revokeObjectURL(this.url2)
            }
            const blob2 = new Blob([JSON.stringify(data3)], { type: 'application/json' });
            this.url2 = URL.createObjectURL(blob2);
            window.ecgDone2 = false;
            chartB.innerHTML = '';
            // update plot 2
            loadChart2({name:"testEcg2", path:this.url2}, "success", 1.0);
            this.test+=1;

        } catch (error) {
            console.error("Error updating voltage:", error);

        } else if (this.$title() === "Hodgkin-Huxley")
          try {
          // run the next simulation timestep and return the recent voltage and time values
          const response = await fetch(`http://127.0.0.1:8000/single/${this.updateTimeStep}/${this.currentC}/${this.mempotential}/${this.g_K}/${this.neuron3}/${this.multimeter3}`);
            const data4 = await response.json();
            const data41 = data4["data"]
            this.graphVal2 = data4["value"]
            this.reset = false;
            if(this.url4 !== null){
              URL.revokeObjectURL(this.url4)
            }

            const blob4 = new Blob([JSON.stringify(data41)], { type: 'application/json' });
            this.url4 = URL.createObjectURL(blob4);
            ecgName = null;
            window.ecgDone3 = false;
            chartD.innerHTML = '';
            // update the plot
            loadChart4({name:"testEcg4", path:this.url4}, "success", 1.0);
            // send a message to update the colour of the neuron based on the recent maximum voltage value
            $nuxt.$emit('graph-change-HH', [this.graphVal2, this.graphVal4])
            this.test+=1;

        } catch (error) {
            console.error("Error updating voltage:", error);
        } else if (this.$title() === "network")
          try {
            // determine the plot URL based on which neuron has been clicked on
            this.reset = false;
            if (this.url5 !== null) {
              URL.revokeObjectURL(this.url5)
            }
            if (this.slidersVisible[0]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_0)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[1]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_1)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[2]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_2)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[3]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_3)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[4]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_4)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[5]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_5)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[6]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_6)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[7]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_7)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else if (this.slidersVisible[8]) {
              const blob5 = new Blob([JSON.stringify(this.net_volt_8)], {type: 'application/json'});
              this.url5 = URL.createObjectURL(blob5);
            } else {
              return
            }

            ecgName = null;
            window.ecgDone4 = false;
            chartE.innerHTML = '';
            // load plot
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
    margin-top: 30px;
    margin-right: 60px;
    margin-bottom: 40px !important;
  }
  .graph-comm2 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40px !important;
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
    margin-right: 50px;
    margin-left: 50px;
  }

  .custom-subheader {
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 20px;
    color: white;
    display: flex;
    justify-content: center;
    font-size: 18px;
    width: 100%;
    position: relative;
    top: -20px;
  }
  .neuron1-subheader {
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 0px;
    color: white;
    display: flex;
    justify-content: center;
    font-size: 18px;
    width: 100%;
    position: relative;
    top: -25px;
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

  .v-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }

  .button-gap {
    margin-top: 10px;
  }

  .reset-button {
    width: 100px;
  }

  .button-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .start-button,
  .stop-button {
    margin-top: 10px;
  }
  .top-center-container {
    text-align: center;
    margin-top: 20px;
  }

  .top-center-container button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .top-center-container button:hover {
    background-color: #45a049;
  }
  </style>

<template>
  <div class="model">
    <!-- Iterate through the boolean array and render sliders -->

    <div ref="baseDomObject" :class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'"></div>
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
      copperScene:null,
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
      currentSelected: null,
      currentStartValue: null,
      startNode: null,
      spikes: [],
      minValue: -70,
      maxValue: -57.5,
      minValue2: -70,
      maxValue2: -69.5,
      minValue3: -60,
      maxValue3: 0,
      clicked: false,
      slidersVisible: [false, false, false, false, false, false, false, false, false],
      arrowSlidersVisible: [false, false, false, false, false, false, false, false, false, false, false, false],
      updateInterval: 1000, // Set the update interval in milliseconds
      neuron1: null,
      neuron2: null,
      neuron3: null,
      neuron4: null,
      neuron5: null,
      neuron6: null,
      neuron7: null,
      neuron8: null,
      neuron9: null
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
    this.THREE = this.$three();
    this.baseRenderer = this.$baseRenderer();
    const baseContainer = this.$baseContainer();
    this.container = this.$refs.baseDomObject;
    this.modelName = this.$model().name;

    // Set initial styles and values
    // this.container.style.display = "flex";
    // this.container.style.flexDirection = "column";
    // this.container.style.alignItems = "center";
    // this.container.style.justifyContent = "flex-start";
    // this.container.style.height = "100vh"; // Set a fixed height for the top container

    // Set initial value of voltage to null
    this.voltage = null;
    this.voltages = [];
    this.time = null;
    this.times = [];
    this.arrows = {}

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
        this.copperScene.onWindowResize();
      }, 500);
    });

    $nuxt.$on('reset-colors', () => {
      console.log('Received reset colors request');
      // const inputValue = val;
      this.resetColors()
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

    clearObjects() {
      // Remove all children from the scene
      while (this.copperScene.scene.children.length > 0) {
        const child = this.copperScene.scene.children[0];

        if (child instanceof this.THREE.Mesh) {
          // Dispose of the geometry and material
          child.geometry.dispose();
          child.material.dispose();

        }
        this.copperScene.scene.remove(child);

      }
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

    resetColors() {
      const cubeNames = ["cube1", "cube2", "cube3", "cube4", "cube5", "cube6", "cube7", "cube8", "cube9"];

      cubeNames.forEach((name) => {
        const cube = this.copperScene.scene.getObjectByName(name);
        if (cube) {
          cube.material.color.set('pink');
        }
      });
      for (const identifier in this.arrows) {
        this.arrows[identifier].arrow.setColor('silver');
        this.arrows[identifier].line.material.color.set('silver');
      }
    },


    async start(){
      console.log("model name ", this.modelName)
      console.log("load model functions.");
      // get model from backend
      this.model = await fetch(
        'http://127.0.0.1:8000/api/model'
      ).then(res => res.blob())

      const model_url = URL.createObjectURL(this.model)

      this.loadModel(model_url,this.modelName);
    },


    loadModel(model_url, model_name) {
        const viewURL = 'modelView/noInfarct_view.json';
        console.log("model name ", model_name)
        this.copperScene = this.baseRenderer.getSceneByName(model_name);
        if (this.copperScene === undefined) {
          this.copperScene = this.baseRenderer.createScene(model_name);
          // this.copperScene.controls.staticMoving = true;
          // this.copperScene.controls.rotateSpeed = 3.0;
          // this.copperScene.controls.panSpeed = 3.0;
          this.baseRenderer.setCurrentScene(this.copperScene);
          // this.copperScene.loadOBJ(model_url, (content) => {
          //   // this.copperScene.setModelPosition(content, { x: 5, y: 2 });
          //   console.log(content);
          // });
          if (model_name === "network") {
            this.demoForRaycaster();
          // this.copperScene.loadViewUrl(viewURL);
          } else if (model_name === "Leaky IAF" || model_name === "Hodgkin-Huxley") {
            let neuron;
            const loadObjFile = (callback) => {
                this.copperScene.loadGltf('modelView/neurontutorial.glb', (content) => {
                    this.copperScene.setModelPosition(content, { x: 0.1, y: 0, z: 0 });
                    content.scale.z = -1;
                    console.log("hi obj: ", content);
                    neuron = content;
                    neuron.name = "neuron";
                    callback();
                }, { color: "pink" });
            };

            // Use the loadObjFile function and provide a callback function
            loadObjFile(() => {
                // // This code will be executed after the object is loaded
                console.log("Object loaded and positioned:", neuron);
                  if (model_name === "Leaky IAF") {
                      const neuronMeshLeaky = neuron.children[0].children[0]
                      $nuxt.$on('graph-change-Leaky', (payload) => {
                        console.log('Received value from Nuxt leaky:', payload);
                        const [val1, val2] = payload;
                      this.updateObjectColor(neuronMeshLeaky, val1, this.minValue, this.maxValue);
                    });
                  } else if (model_name === "Hodgkin-Huxley") {
                      const neuronMeshHH = neuron.children[0].children[0]
                      $nuxt.$on('graph-change-HH', (payload) => {
                        console.log('Received value from Nuxt HH:', payload);
                        const [val1, val2] = payload;
                        console.log(val1)
                      this.updateObjectColor(neuronMeshHH, val1, this.minValue3, this.maxValue3);
                    });
                  }
            });
            // this.copperScene.loadOBJ('modelView/neurontutorial.obj', (content) => {
            //   this.copperScene.setModelPosition(content, { x: 0, y: 0, z: 0 });
            //   console.log("hi obj: ", content);
            //   neuron = content; // Assign the loaded object to the variable
            //   neuron.name = "neuron";
            // }, { color: "pink" });
            // const materialLibrary = this.copperScene.getMaterialLibrary(neuron.materialLibraries[0]);
            // const material = materialLibrary.materials[0];
            // material.color.set('red');
            // const updateNeuron = this.copperScene.scene.getObjectByName("neuron")
            // $nuxt.$on('graph-change', (payload) => {
            //   console.log('Received value from Nuxt (leaky/hh):', payload);
            //   const [val1, val2] = payload;
            //   this.updateObjectColor(neuron, val1, this.minValue, this.maxValue);
            // });
            // this.copperScene.loadViewUrl(viewURL);
            // this.copperScene.onWindowResize();
          } else if (model_name === "Healthy") {
            // this.demoForRaycaster3();
            let neuron1;
            let neuron2;
            console.log("Entered healthy")
            const loadObjFiles = (callback) => {
                let loadedCount = 0;
                console.log("Entered loadObjFiles")

                const onObjLoad = () => {
                    loadedCount++;
                    console.log("Count: ", loadedCount)
                    if (loadedCount === 2) {
                        // Both objects have been loaded
                        callback();
                    }
                };

                this.copperScene.loadGltf('modelView/neurontutorial.glb', (content) => {
                    this.copperScene.setModelPosition(content, { x: -0.8, y: 0, z: 0 });
                    content.scale.set(0.5, 0.5, 0.5);
                    content.scale.z = -1;
                    console.log("hi obj: ", content);
                    neuron1 = content;
                    neuron1.name = "neuron1";
                    onObjLoad();
                }, { color: "pink" });

                this.copperScene.loadGltf('modelView/neurontutorial.glb', (content) => {
                    this.copperScene.setModelPosition(content, { x: 1, y: 0, z: 0 });
                    content.scale.set(0.5, 0.5, 0.5);
                    content.scale.z = -1;
                    console.log("hi obj: ", content);
                    neuron2 = content;
                    neuron2.name = "neuron2";
                    onObjLoad();
                }, { color: "pink" });
                console.log("neuron1: ",neuron1)
                console.log("neuron2: ",neuron2)
            };

            // Example usage
            loadObjFiles(() => {
                    console.log("LoadObjFiles callback run")
                    const neuronMesh1 = neuron1.children[0].children[0]
                    const neuronMesh2 = neuron2.children[0].children[0]
                    $nuxt.$on('graph-change-synapse', (payload) => {
                      console.log('Received value from Nuxt HH:', payload);
                      const [val1, val2] = payload;
                      this.updateObjectColor(neuronMesh1, val1, this.minValue, this.maxValue);
                      this.updateObjectColor(neuronMesh2, val2, this.minValue2, this.maxValue2);
                      });
            });
            // $nuxt.$on('graph-change-synapse', (payload) => {
            //   console.log('Received value from Nuxt synapse:', payload);
            //   const [val1, val2] = payload;
            //   const objectA = this.copperScene.scene.getObjectByName("objectA");
            //   const objectB = this.copperScene.scene.getObjectByName("objectB");
            //   this.updateObjectColor2(objectA, val1, this.minValue, this.maxValue);
            //   this.updateObjectColor(objectB, val2, this.minValue2, this.maxValue2);
            // });
          }
        } else {
          this.baseRenderer.setCurrentScene(this.copperScene);
        }
        this.copperScene.loadViewUrl(viewURL);
        this.copperScene.onWindowResize();
    },

    async runNetwork(newspikes) {
      try {
        console.log('runNetwork function called on Model Side')
        // this.startNode = parameter
        // let currents_string = variables[0].join(',');
        // let memCap_string = variables[1].join(',');
        // let weights_string = variables[2].join(',');
        //
        // const response = await fetch(`http://127.0.0.1:8000/network/${currents_string}/${memCap_string}/${weights_string}`);
        // const listA = await response.json();
        // this.spikes = listA
        // console.log(listA)
        this.spikes = newspikes;
        console.log(this.spikes)
        console.log("Sliders visible ",this.slidersVisible)
        console.log("Arrows visible ",this.arrowSlidersVisible)

        if (this.spikes[0]) {
          // this.copperScene.scene.getObjectByName("cube1").material.color.set('red')
          console.log("cube1 made red")
          this.arrows['arrow1'].arrow.setColor('red');
          this.arrows['arrow1'].line.material.color.set('red');
          this.arrows['arrow7'].arrow.setColor('red');
          this.arrows['arrow7'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube1").material.color.set('pink')
          this.arrows['arrow1'].arrow.setColor('silver');
          this.arrows['arrow1'].line.material.color.set('silver');
          this.arrows['arrow7'].arrow.setColor('silver');
          this.arrows['arrow7'].line.material.color.set('silver');
        }
        if (this.spikes[1]) {
          // this.copperScene.scene.getObjectByName("cube2").material.color.set('red')
          this.arrows['arrow2'].arrow.setColor('red');
          this.arrows['arrow2'].line.material.color.set('red');
          this.arrows['arrow9'].arrow.setColor('red');
          this.arrows['arrow9'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube2").material.color.set('pink')
          this.arrows['arrow2'].arrow.setColor('silver');
          this.arrows['arrow2'].line.material.color.set('silver');
          this.arrows['arrow9'].arrow.setColor('silver');
          this.arrows['arrow9'].line.material.color.set('silver');
        }
        if (this.spikes[2]) {
          // this.copperScene.scene.getObjectByName("cube3").material.color.set('red')
          this.arrows['arrow11'].arrow.setColor('red');
          this.arrows['arrow11'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube3").material.color.set('pink')
          this.arrows['arrow11'].arrow.setColor('silver');
          this.arrows['arrow11'].line.material.color.set('silver');
        }
        if (this.spikes[3]) {
          // this.copperScene.scene.getObjectByName("cube4").material.color.set('red')
          this.arrows['arrow3'].arrow.setColor('red');
          this.arrows['arrow3'].line.material.color.set('red');
          this.arrows['arrow8'].arrow.setColor('red');
          this.arrows['arrow8'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube4").material.color.set('pink')
          this.arrows['arrow3'].arrow.setColor('silver');
          this.arrows['arrow3'].line.material.color.set('silver');
          this.arrows['arrow8'].arrow.setColor('silver');
          this.arrows['arrow8'].line.material.color.set('silver');
        }
        if (this.spikes[4]) {
          // this.copperScene.scene.getObjectByName("cube5").material.color.set('red')
          this.arrows['arrow4'].arrow.setColor('red');
          this.arrows['arrow4'].line.material.color.set('red');
          this.arrows['arrow10'].arrow.setColor('red');
          this.arrows['arrow10'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube5").material.color.set('pink')
          this.arrows['arrow4'].arrow.setColor('silver');
          this.arrows['arrow4'].line.material.color.set('silver');
          this.arrows['arrow10'].arrow.setColor('silver');
          this.arrows['arrow10'].line.material.color.set('silver');
        }
        if (this.spikes[5]) {
          // this.copperScene.scene.getObjectByName("cube6").material.color.set('red')
          this.arrows['arrow12'].arrow.setColor('red');
          this.arrows['arrow12'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube6").material.color.set('pink')
          this.arrows['arrow12'].arrow.setColor('silver');
          this.arrows['arrow12'].line.material.color.set('silver');
        }
        if (this.spikes[6]) {
          // this.copperScene.scene.getObjectByName("cube7").material.color.set('red')
          this.arrows['arrow5'].arrow.setColor('red');
          this.arrows['arrow5'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube7").material.color.set('pink')
          this.arrows['arrow5'].arrow.setColor('silver');
          this.arrows['arrow5'].line.material.color.set('silver');
        }
        if (this.spikes[7]) {
          // this.copperScene.scene.getObjectByName("cube8").material.color.set('red')
          this.arrows['arrow6'].arrow.setColor('red');
          this.arrows['arrow6'].line.material.color.set('red');
        } else {
          // this.copperScene.scene.getObjectByName("cube8").material.color.set('pink')
          this.arrows['arrow6'].arrow.setColor('silver');
          this.arrows['arrow6'].line.material.color.set('silver');
        }
        if (this.spikes[8]) {
          // this.copperScene.scene.getObjectByName("cube9").material.color.set('red')
        } else {
          // this.copperScene.scene.getObjectByName("cube9").material.color.set('pink')
        }

        // // Update the color of the corresponding cube based on spikes information
        // if (this.spikes && this.spikes.length === 9) {
        //   for (let i = 0; i < this.spikes.length; i++) {
        //     const cubeName = `cube${i + 1}`;
        //     const cube = this.copperScene.scene.getObjectByName(cubeName);
        //
        //     if (cube) {
        //       // Change color based on spikes value
        //       const color = this.spikes[i] ? 'red' : 'pink';
        //       cube.material.color.set(color);
        //     }
        //   }
        // }

      } catch (error) {
        console.error("Error running network:", error);
      }
    },

    onClick() {
      console.log("Clicked")
      this.clicked = true;
      if (this.currentSelected.name === "cube1") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 0) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube2") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 1) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube3") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 2) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube4") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 3) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube5") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 4) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube6") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 5) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube7") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 6) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube8") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 7) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "cube9") {
        for (let i = 0; i < this.slidersVisible.length; i++) {
          if (i === 8) {
            this.$set(this.slidersVisible, i, true);
          } else {
            this.$set(this.slidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          this.$set(this.arrowSlidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow1") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 0) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow2") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 1) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow3") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 2) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow4") {
        for (let i = 3; i < this.arrowSlidersVisible.length; i++) {
          if (i === 3) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow5") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 4) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow6") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 5) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow7") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 6) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow8") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 7) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow9") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 8) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow10") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 9) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow11") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 10) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      } else if (this.currentSelected.name === "arrow12") {
        for (let i = 0; i < this.arrowSlidersVisible.length; i++) {
          if (i === 11) {
            this.$set(this.arrowSlidersVisible, i, true);
          } else {
            this.$set(this.arrowSlidersVisible, i, false);
          }
        }
        for (let i = 0; i < this.slidersVisible.length; i++) {
          this.$set(this.slidersVisible, i, false);
        }
      }
      console.log(this.slidersVisible)
      console.log(this.arrowSlidersVisible)
      // this.runNetwork(this.currentStartValue);
      this.container.removeEventListener('click', this.onClick);
      $nuxt.$emit('update-panel', [this.slidersVisible, this.arrowSlidersVisible])
      // console.log(this.currentSelected.name)
    },

    gradientColorMapNetwork(value) {
      // Interpolate between light red (hue: 0, saturation: 1, lightness: 0.8) and bright red (hue: 0, saturation: 1, lightness: 0.5)
      const hue = 0;
      const saturation = 1;
      const lightness = 0.8 - value * 0.3; // Interpolate lightness between 0.8 and 0.5
      return new this.THREE.Color().setHSL(hue, saturation, lightness);
    },

    // Function to update the color of the object based on a value
    updateObjectColorNetwork(object, value, minValue, maxValue) {
      const normalizedValue = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);
      const color = this.gradientColorMapNetwork(normalizedValue);
      object.material.color.copy(color);
    },

    gradientColorMap(value, minValue, maxValue) {
        // Ensure that value is within the range [minValue, maxValue]
        value = Math.min(Math.max(value, minValue), maxValue);

        // If the value is equal to minValue, set it to the default color (1, 1, 1)
        if (value === minValue) {
            return new this.THREE.Color(1, 1, 1); // Use RGB representation (1, 1, 1)
        }

        // Interpolate between the default color (1, 1, 1) and red (#FF0000)
        const defaultColor = new this.THREE.Color(1, 1, 1); // Use RGB representation (1, 1, 1)
        const red = new this.THREE.Color('#FF0000');

        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const interpolatedColor = new this.THREE.Color().lerpColors(defaultColor, red, normalizedValue);

        return interpolatedColor;
    },

    // Function to update the color of the object based on a value
    updateObjectColor(object, value, minValue, maxValue) {
        const color = this.gradientColorMap(value, minValue, maxValue);
        object.material.color.copy(color);
    },

    gradientColorMap2(value) {
      // Interpolate between light green (hue: 120, saturation: 1, lightness: 0.8) and dark green (hue: 120, saturation: 1, lightness: 0.5)
      const hue = 120; // Green hue
      const saturation = 1;
      const lightness = 0.8 - value * 0.3; // Interpolate lightness between 0.8 and 0.5
      return new this.THREE.Color().setHSL(hue, saturation, lightness);
    },

    // Function to update the color of the object based on a value
    updateObjectColor2(object, value, minValue, maxValue) {
      const normalizedValue = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);
      const color = this.gradientColorMap(normalizedValue);
      object.material.color.copy(color);
    },

    createArrow(start, end, identifier, verticalPairs, sphereRadius) {
      const direction = new this.THREE.Vector3().copy(end.position).sub(start.position);
      direction.normalize();
      const arrowLength = 150;

      // Create an arrow helper
      const arrow = new this.THREE.ArrowHelper(
        direction,
        start.position,
        arrowLength,
        'silver'
      );

      // Adjust the scale of the arrowhead to make it wider
      arrow.scale.set(5, 1, 1);

      // Create a cylinder to represent the line
      const lineGeometry = new this.THREE.CylinderGeometry(3, 3, arrowLength - 50, 8);
      const lineMaterial = new this.THREE.MeshBasicMaterial({ color: 'silver' });
      const line = new this.THREE.Mesh(lineGeometry, lineMaterial);

      line.name = identifier;

      // Calculate the position of the line at the midpoint between start and end
      const linePosition = new this.THREE.Vector3().copy(start.position).add(end.position).multiplyScalar(0.5);

      // Set the position of the line at the midpoint
      line.position.copy(linePosition);

      // Calculate the rotation axis
      const axis = new this.THREE.Vector3(0, 0, 1);

      // Check if the pair should have a vertical cylinder
      if (verticalPairs.some(pair => (pair[0] === start && pair[1] === end) || (pair[1] === start && pair[0] === end))) {
        // Calculate the rotation angle for the vertical cylinder
        const angleVertical = Math.atan2(direction.y, direction.x);
        line.rotation.set(0, 0, angleVertical + Math.PI / 2); // Make the cylinder vertical
      } else {
        // Calculate the rotation angle for the non-vertical cylinder
        const angle = Math.acos(direction.dot(axis));
        line.rotation.set(0, 0, angle);
      }

      // Add both the line and arrowhead to the scene
      this.copperScene.scene.add(line);
      this.copperScene.scene.add(arrow);
      this.arrows[identifier] = {
        arrow: arrow,
        line: line,
      };
    },

    demoForRaycaster(){
      console.log("demoForRaycaster called")
      const geometry1 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry2 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry3 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry4 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry5 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry6 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry7 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry8 = new this.THREE.SphereGeometry( 50, 50, 50 );
      const geometry9 = new this.THREE.SphereGeometry( 50, 50, 50 );

      const material1 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material2 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material3 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material4 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material5 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material6 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material7 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material8 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material9 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );

      const cube1 = new this.THREE.Mesh( geometry1, material1 );
      const cube2 = new this.THREE.Mesh( geometry2, material2 );
      const cube3 = new this.THREE.Mesh( geometry3, material3 );
      const cube4 = new this.THREE.Mesh( geometry4, material4 );
      const cube5 = new this.THREE.Mesh( geometry5, material5 );
      const cube6 = new this.THREE.Mesh( geometry6, material6 );
      const cube7 = new this.THREE.Mesh( geometry7, material7 );
      const cube8 = new this.THREE.Mesh( geometry8, material8 );
      const cube9 = new this.THREE.Mesh( geometry9, material9 );

      cube1.name = "cube1";
      cube2.name = "cube2";
      cube3.name = "cube3";
      cube4.name = "cube4";
      cube5.name = "cube5";
      cube6.name = "cube6";
      cube7.name = "cube7";
      cube8.name = "cube8";
      cube9.name = "cube9";

      // const geometryCyl = new this.THREE.CylinderGeometry( 5, 5, 20, 32 );
      // const materialCyl = new this.THREE.MeshBasicMaterial( {color: 0xffff00} );
      // const cylinder = new this.THREE.Mesh( geometryCyl, materialCyl );
      // scene.add( cylinder );

      const cubeGroup = new this.THREE.Group()

      cube1.position.set(-200,-200,600)
      cube2.position.set(0,-200,600)
      cube3.position.set(200,-200,600)
      cube4.position.set(-200,0,600)
      cube5.position.set(0,0,600)
      cube6.position.set(200,0,600)
      cube7.position.set(-200,200,600)
      cube8.position.set(0,200,600)
      cube9.position.set(200,200,600)

      cubeGroup.add(cube1,cube2,cube3,cube4,cube5,cube6,cube7,cube8,cube9)
      this.copperScene.scene.add( cubeGroup);
      const cubes = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9];
      const arrowPairs = [
        [cubes[0], cubes[1], "arrow1"],
        [cubes[1], cubes[2], "arrow2"],
        [cubes[3], cubes[4], "arrow3"],
        [cubes[4], cubes[5], "arrow4"],
        [cubes[6], cubes[7], "arrow5"],
        [cubes[7], cubes[8], "arrow6"],
        [cubes[0], cubes[3], "arrow7"],
        [cubes[3], cubes[6], "arrow8"],
        [cubes[1], cubes[4], "arrow9"],
        [cubes[4], cubes[7], "arrow10"],
        [cubes[2], cubes[5], "arrow11"],
        [cubes[5], cubes[8], "arrow12"],
      ];
      const verticalPairs = [
        [cube1, cube4],
        [cube4, cube7],
        [cube2, cube5],
        [cube5, cube8],
        [cube3, cube6],
        [cube6, cube9],
      ];
      arrowPairs.forEach(pair => {
        this.createArrow(pair[0], pair[1], pair[2], verticalPairs);
      });
      // const material = new this.THREE.LineBasicMaterial( { color: 0xffffff } );
      // const points = [];
      // points.push( new this.THREE.Vector3( - 200, -200, 0 ) );
      // points.push( new this.THREE.Vector3( -200, 0, 0 ) );
      //
      // const geometry = new this.THREE.BufferGeometry().setFromPoints( points );
      // const line = new this.THREE.Line( geometry, material );
      // this.copperScene.scene.add( line );

      // cubeGroup.add(this.arrows["arrow1"].arrow)
      console.log("arrow 1: ", this.arrows["arrow1"].line)
      cubeGroup.add(this.arrows["arrow1"].line)
      cubeGroup.add(this.arrows["arrow2"].line)
      cubeGroup.add(this.arrows["arrow3"].line)
      cubeGroup.add(this.arrows["arrow4"].line)
      cubeGroup.add(this.arrows["arrow5"].line)
      cubeGroup.add(this.arrows["arrow6"].line)
      cubeGroup.add(this.arrows["arrow7"].line)
      cubeGroup.add(this.arrows["arrow8"].line)
      cubeGroup.add(this.arrows["arrow9"].line)
      cubeGroup.add(this.arrows["arrow10"].line)
      cubeGroup.add(this.arrows["arrow11"].line)
      cubeGroup.add(this.arrows["arrow12"].line)

      this.copperScene.pickModel(
        cubeGroup,
          (mesh) => {
              if (mesh) {
                // try unconment these two codes, refreash the browser, and see console
                // mesh.material.wireframe = false;
                // mesh.material.color.set("pink")
                this.currentSelected = mesh

                // this.container.addEventListener('click', this.onClick);
                console.log(mesh)
                document.addEventListener('click', this.onClick);
                console.log(mesh.name);
              } else {
                document.removeEventListener('click', this.onClick);
              }
            }
        );

      this.cubeGroupStored = cubeGroup

        $nuxt.$on('run-network', (networkPayload) => {
          console.log('Received run network request');
          // const inputValue = val;
          const [networkSpikes, max0, max1, max2, max3, max4, max5, max6, max7, max8] = networkPayload;
          this.neuron1 = this.copperScene.scene.getObjectByName("cube1");
          this.neuron2 = this.copperScene.scene.getObjectByName("cube2");
          this.neuron3 = this.copperScene.scene.getObjectByName("cube3");
          this.neuron4 = this.copperScene.scene.getObjectByName("cube4");
          this.neuron5 = this.copperScene.scene.getObjectByName("cube5");
          this.neuron6 = this.copperScene.scene.getObjectByName("cube6");
          this.neuron7 = this.copperScene.scene.getObjectByName("cube7");
          this.neuron8 = this.copperScene.scene.getObjectByName("cube8");
          this.neuron9 = this.copperScene.scene.getObjectByName("cube9");
          console.log("neuron 1 ",this.neuron1)
          this.updateObjectColorNetwork(this.neuron1, max0, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron2, max1, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron3, max2, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron4, max3, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron5, max4, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron6, max5, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron7, max6, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron8, max7, this.minValue, this.maxValue);
          this.updateObjectColorNetwork(this.neuron9, max8, this.minValue, this.maxValue);

          this.runNetwork(networkSpikes)
        });
    },

    demoForRaycaster2(){
      const geometryA = new this.THREE.SphereGeometry( 100, 100, 100 );
      const materialA = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const cubeA = new this.THREE.Mesh( geometryA, materialA );
      cubeA.name = "cubeA";
      const cubeGroupA = new this.THREE.Group()
      cubeA.position.set(0,0,0)
      cubeGroupA.add(cubeA)
      this.copperScene.scene.add(cubeGroupA);
      // const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
      // this.copperScene.scene.add(ambientLight)
      // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      // this.copperScene.scene.add(directionalLight);
      // directionalLight.position.set(10, 11, 7)

      // this.copperScene.pickModel(
      //   cubeGroup,
      //     (mesh) => {
      //
      //
      //         if (mesh) {
      //           // try unconment these two codes, refreash the browser, and see console
      //           // mesh.material.wireframe = false;
      //           // mesh.material.color.set("pink")
      //           this.currentSelected = mesh
      //           this.container.addEventListener('click', this.onClick);
      //           console.log(mesh);
      //         } else {
      //           this.container.removeEventListener('click', this.onClick);
      //         }
      //       }
      //   );

    },

    demoForRaycaster3(){
      const geometryB1 = new this.THREE.SphereGeometry( 100, 100, 100 );
      const geometryB2 = new this.THREE.SphereGeometry( 100, 100, 100 );
      const materialB1 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const materialB2 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );

      const objectA = new this.THREE.Mesh( geometryB1, materialB1 );
      const objectB = new this.THREE.Mesh( geometryB2, materialB2 );
      objectA.name = "objectA";
      objectB.name = "objectB"
      const cubeGroupB = new this.THREE.Group()
      objectA.position.set(0,-150,600)
      objectB.position.set(0,150,600)
      cubeGroupB.add(objectA)
      cubeGroupB.add(objectB)
      this.copperScene.scene.add(cubeGroupB);

      // this.copperScene.pickModel(
      //   cubeGroup,
      //     (mesh) => {
      //
      //
      //         if (mesh) {
      //           // try unconment these two codes, refreash the browser, and see console
      //           // mesh.material.wireframe = false;
      //           // mesh.material.color.set("pink")
      //           this.currentSelected = mesh
      //           this.container.addEventListener('click', this.onClick);
      //           console.log(mesh);
      //         } else {
      //           this.container.removeEventListener('click', this.onClick);
      //         }
      //       }
      //   );

    },
        demoForRaycaster4() {

        },
  },

  watch: {},

  beforeDestroy() {
    // Wirte code before destory this component
    // this.clearObjects()
    // this.$nuxt.$off('graph-change');
    // this.$nuxt.$off('run-network');
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
.top-center-container {
  text-align: center;
  margin-top: 20px;
}

/* Add styles for the button */
.top-center-container button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50; /* Green background color */
  color: white; /* White text color */
  border: none; /* Remove borders */
  border-radius: 5px; /* Optional: Round the corners */
  cursor: pointer;
}

.top-center-container button:hover {
  background-color: #45a049; /* Darker green on hover */
}
</style>


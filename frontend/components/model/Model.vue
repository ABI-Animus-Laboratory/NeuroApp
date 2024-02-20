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
      model:null,
      currentSelected: null,
      currentStartValue: null,
      spikes: [],
      minValue: -70,
      maxValue: -57.5,
      minValue2: -70,
      maxValue2: -69.5,
      minValue3: -70,
      maxValue3: -35,
      slidersVisible: [false, false, false, false, false, false, false, false, false],
      arrowSlidersVisible: [false, false, false, false, false, false, false, false, false, false, false, false],
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
    },

  created: async function (){
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

    // initialise arrow list
    this.arrows = {}


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

    // listen for when reset colours is called
    $nuxt.$on('reset-colors', () => {
      this.resetColors()
    });

  },

  methods: {
    resetColors() {
      // set the colour of all spheres to pink
      const sphereNames = ["sphere1", "sphere2", "sphere3", "sphere4", "sphere5", "sphere6", "sphere7", "sphere8", "sphere9"];
      sphereNames.forEach((name) => {
        const sphere = this.copperScene.scene.getObjectByName(name);
        if (sphere) {
          sphere.material.color.set('pink');
        }
      });
      // set the colour of all arrows to silver
      for (const identifier in this.arrows) {
        this.arrows[identifier].arrow.setColor('silver');
        this.arrows[identifier].line.material.color.set('silver');
      }
    },


    async start(){
      // get model from backend
      this.model = await fetch(
        'http://127.0.0.1:8000/api/model'
      ).then(res => res.blob())

      const model_url = URL.createObjectURL(this.model)

      this.loadModel(model_url,this.modelName);
    },


    loadModel(model_url, model_name) {
        const viewURL = 'modelView/noInfarct_view.json';
        // get the current scene based on the model name for the current tab
        this.copperScene = this.baseRenderer.getSceneByName(model_name);
        // determine if that scene has already been created
        if (this.copperScene === undefined) {
          // the scene has not been created so create it depending on the current tab
          this.copperScene = this.baseRenderer.createScene(model_name);
          this.baseRenderer.setCurrentScene(this.copperScene);
          if (model_name === "network") {
            this.createNetworkObjects();
          } else if (model_name === "Leaky IAF" || model_name === "Hodgkin-Huxley") {
            let neuron;
            const loadObjFile = (callback) => {
                this.copperScene.loadGltf('modelView/neurontutorial.glb', (content) => {
                    this.copperScene.setModelPosition(content, { x: 0.1, y: 0, z: 0 });
                    content.scale.z = -1;
                    neuron = content;
                    neuron.name = "neuron";
                    callback();
                }, { color: "pink" });
            };

            // Use the loadObjFile function and provide a callback function
            loadObjFile(() => {
                // // This code will be executed after the object is loaded
                  if (model_name === "Leaky IAF") {
                      const neuronMeshLeaky = neuron.children[0].children[0]
                      // listen for when graph has updated
                      $nuxt.$on('graph-change-Leaky', (payload) => {
                        const [val1, val2] = payload;
                        // update the colour of the model
                        this.updateObjectColor(neuronMeshLeaky, val1, this.minValue, this.maxValue);
                    });
                  } else if (model_name === "Hodgkin-Huxley") {
                      const neuronMeshHH = neuron.children[0].children[0]
                      // listen for when graph has updated
                      $nuxt.$on('graph-change-HH', (payload) => {
                        const [val1, val2] = payload;
                        // update the colour of the model
                        this.updateObjectColor(neuronMeshHH, val1, this.minValue3, this.maxValue3);
                    });
                  }
            });
          } else if (model_name === "Healthy") {
            let neuron1;
            let neuron2;
            const loadObjFiles = (callback) => {
                let loadedCount = 0;

                const onObjLoad = () => {
                    loadedCount++;
                    if (loadedCount === 2) {
                        // Both objects have been loaded
                        callback();
                    }
                };
                // load the 3D neuron model
                this.copperScene.loadGltf('modelView/neurontutorial.glb', (content) => {
                    this.copperScene.setModelPosition(content, { x: -0.8, y: 0, z: 0 });
                    content.scale.set(0.5, 0.5, 0.5);
                    content.scale.z = -1;
                    neuron1 = content;
                    neuron1.name = "neuron1";
                    onObjLoad();
                }, { color: "pink" });
                // load the 3D neuron model
                this.copperScene.loadGltf('modelView/neurontutorial.glb', (content) => {
                    this.copperScene.setModelPosition(content, { x: 1, y: 0, z: 0 });
                    content.scale.set(0.5, 0.5, 0.5);
                    content.scale.z = -1;
                    neuron2 = content;
                    neuron2.name = "neuron2";
                    onObjLoad();
                }, { color: "pink" });
            };

            loadObjFiles(() => {
                    const neuronMesh1 = neuron1.children[0].children[0]
                    const neuronMesh2 = neuron2.children[0].children[0]
                    $nuxt.$on('graph-change-synapse', (payload) => {
                      const [val1, val2] = payload;
                      this.updateObjectColor(neuronMesh1, val1, this.minValue, this.maxValue);
                      this.updateObjectColor(neuronMesh2, val2, this.minValue2, this.maxValue2);
                      });
            });
          }
        } else {
          // scene has already been created set it as current scene
          this.baseRenderer.setCurrentScene(this.copperScene);
        }
        this.copperScene.loadViewUrl(viewURL);
        this.copperScene.onWindowResize();
    },

    async runNetwork(newspikes) {
      // update the colour of the network connections based on the spikes array
      try {
        this.spikes = newspikes;

        if (this.spikes[0]) {
          this.arrows['arrow1'].arrow.setColor('red');
          this.arrows['arrow1'].line.material.color.set('red');
          this.arrows['arrow7'].arrow.setColor('red');
          this.arrows['arrow7'].line.material.color.set('red');
        } else {
          this.arrows['arrow1'].arrow.setColor('silver');
          this.arrows['arrow1'].line.material.color.set('silver');
          this.arrows['arrow7'].arrow.setColor('silver');
          this.arrows['arrow7'].line.material.color.set('silver');
        }
        if (this.spikes[1]) {
          this.arrows['arrow2'].arrow.setColor('red');
          this.arrows['arrow2'].line.material.color.set('red');
          this.arrows['arrow9'].arrow.setColor('red');
          this.arrows['arrow9'].line.material.color.set('red');
        } else {
          this.arrows['arrow2'].arrow.setColor('silver');
          this.arrows['arrow2'].line.material.color.set('silver');
          this.arrows['arrow9'].arrow.setColor('silver');
          this.arrows['arrow9'].line.material.color.set('silver');
        }
        if (this.spikes[2]) {
          this.arrows['arrow11'].arrow.setColor('red');
          this.arrows['arrow11'].line.material.color.set('red');
        } else {
          this.arrows['arrow11'].arrow.setColor('silver');
          this.arrows['arrow11'].line.material.color.set('silver');
        }
        if (this.spikes[3]) {
          this.arrows['arrow3'].arrow.setColor('red');
          this.arrows['arrow3'].line.material.color.set('red');
          this.arrows['arrow8'].arrow.setColor('red');
          this.arrows['arrow8'].line.material.color.set('red');
        } else {
          this.arrows['arrow3'].arrow.setColor('silver');
          this.arrows['arrow3'].line.material.color.set('silver');
          this.arrows['arrow8'].arrow.setColor('silver');
          this.arrows['arrow8'].line.material.color.set('silver');
        }
        if (this.spikes[4]) {
          this.arrows['arrow4'].arrow.setColor('red');
          this.arrows['arrow4'].line.material.color.set('red');
          this.arrows['arrow10'].arrow.setColor('red');
          this.arrows['arrow10'].line.material.color.set('red');
        } else {
          this.arrows['arrow4'].arrow.setColor('silver');
          this.arrows['arrow4'].line.material.color.set('silver');
          this.arrows['arrow10'].arrow.setColor('silver');
          this.arrows['arrow10'].line.material.color.set('silver');
        }
        if (this.spikes[5]) {
          this.arrows['arrow12'].arrow.setColor('red');
          this.arrows['arrow12'].line.material.color.set('red');
        } else {
          this.arrows['arrow12'].arrow.setColor('silver');
          this.arrows['arrow12'].line.material.color.set('silver');
        }
        if (this.spikes[6]) {
          this.arrows['arrow5'].arrow.setColor('red');
          this.arrows['arrow5'].line.material.color.set('red');
        } else {
          this.arrows['arrow5'].arrow.setColor('silver');
          this.arrows['arrow5'].line.material.color.set('silver');
        }
        if (this.spikes[7]) {
          this.arrows['arrow6'].arrow.setColor('red');
          this.arrows['arrow6'].line.material.color.set('red');
        } else {
          this.arrows['arrow6'].arrow.setColor('silver');
          this.arrows['arrow6'].line.material.color.set('silver');
        }
        if (this.spikes[8]) {
        } else {
        }
      } catch (error) {
        console.error("Error running network:", error);
      }
    },

    onClick() {
      // determine which sphere or connection has been clicked on and update the slidersVisible/arrowSlidersVisible array accordingly
      if (this.currentSelected.name === "sphere1") {
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
      } else if (this.currentSelected.name === "sphere2") {
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
      } else if (this.currentSelected.name === "sphere3") {
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
      } else if (this.currentSelected.name === "sphere4") {
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
      } else if (this.currentSelected.name === "sphere5") {
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
      } else if (this.currentSelected.name === "sphere6") {
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
      } else if (this.currentSelected.name === "sphere7") {
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
      } else if (this.currentSelected.name === "sphere8") {
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
      } else if (this.currentSelected.name === "sphere9") {
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
      this.container.removeEventListener('click', this.onClick);
      $nuxt.$emit('update-panel', [this.slidersVisible, this.arrowSlidersVisible])
    },

    gradientColorMapNetwork(value) {
      // Interpolate between light red and bright red
      const hue = 0;
      const saturation = 1;
      const lightness = 0.8 - value * 0.3;
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

        // If the value is equal to minValue, set it to the default color
        if (value === minValue) {
            return new this.THREE.Color(1, 1, 1);
        }

        // Interpolate between the default color and red
        const defaultColor = new this.THREE.Color(1, 1, 1);
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

    createNetworkObjects(){
      // initialise geometries
      const geometry = new this.THREE.SphereGeometry( 50, 50, 50 );

      // initialise materials
      const material1 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material2 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material3 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material4 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material5 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material6 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material7 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material8 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );
      const material9 = new this.THREE.MeshBasicMaterial( {color: 'pink'} );

      // create spheres
      const sphere1 = new this.THREE.Mesh( geometry, material1 );
      const sphere2 = new this.THREE.Mesh( geometry, material2 );
      const sphere3 = new this.THREE.Mesh( geometry, material3 );
      const sphere4 = new this.THREE.Mesh( geometry, material4 );
      const sphere5 = new this.THREE.Mesh( geometry, material5 );
      const sphere6 = new this.THREE.Mesh( geometry, material6 );
      const sphere7 = new this.THREE.Mesh( geometry, material7 );
      const sphere8 = new this.THREE.Mesh( geometry, material8 );
      const sphere9 = new this.THREE.Mesh( geometry, material9 );

      // label spheres
      sphere1.name = "sphere1";
      sphere2.name = "sphere2";
      sphere3.name = "sphere3";
      sphere4.name = "sphere4";
      sphere5.name = "sphere5";
      sphere6.name = "sphere6";
      sphere7.name = "sphere7";
      sphere8.name = "sphere8";
      sphere9.name = "sphere9";

      // create sphere group
      const sphereGroup = new this.THREE.Group()
      sphere1.position.set(-200,-200,600)
      sphere2.position.set(0,-200,600)
      sphere3.position.set(200,-200,600)
      sphere4.position.set(-200,0,600)
      sphere5.position.set(0,0,600)
      sphere6.position.set(200,0,600)
      sphere7.position.set(-200,200,600)
      sphere8.position.set(0,200,600)
      sphere9.position.set(200,200,600)
      sphereGroup.add(sphere1,sphere2,sphere3,sphere4,sphere5,sphere6,sphere7,sphere8,sphere9)
      this.copperScene.scene.add( sphereGroup);

      // initialise arrays for creating sphere connections
      const spheres = [sphere1, sphere2, sphere3, sphere4, sphere5, sphere6, sphere7, sphere8, sphere9];
      const arrowPairs = [
        [spheres[0], spheres[1], "arrow1"],
        [spheres[1], spheres[2], "arrow2"],
        [spheres[3], spheres[4], "arrow3"],
        [spheres[4], spheres[5], "arrow4"],
        [spheres[6], spheres[7], "arrow5"],
        [spheres[7], spheres[8], "arrow6"],
        [spheres[0], spheres[3], "arrow7"],
        [spheres[3], spheres[6], "arrow8"],
        [spheres[1], spheres[4], "arrow9"],
        [spheres[4], spheres[7], "arrow10"],
        [spheres[2], spheres[5], "arrow11"],
        [spheres[5], spheres[8], "arrow12"],
      ];
      const verticalPairs = [
        [sphere1, sphere4],
        [sphere4, sphere7],
        [sphere2, sphere5],
        [sphere5, sphere8],
        [sphere3, sphere6],
        [sphere6, sphere9],
      ];
      arrowPairs.forEach(pair => {
        this.createArrow(pair[0], pair[1], pair[2], verticalPairs);
      });
      // add the connections to the sphere group
      sphereGroup.add(this.arrows["arrow1"].line)
      sphereGroup.add(this.arrows["arrow2"].line)
      sphereGroup.add(this.arrows["arrow3"].line)
      sphereGroup.add(this.arrows["arrow4"].line)
      sphereGroup.add(this.arrows["arrow5"].line)
      sphereGroup.add(this.arrows["arrow6"].line)
      sphereGroup.add(this.arrows["arrow7"].line)
      sphereGroup.add(this.arrows["arrow8"].line)
      sphereGroup.add(this.arrows["arrow9"].line)
      sphereGroup.add(this.arrows["arrow10"].line)
      sphereGroup.add(this.arrows["arrow11"].line)
      sphereGroup.add(this.arrows["arrow12"].line)

      // setup detection for clicking on the model components
      this.copperScene.pickModel(
        sphereGroup,
          (mesh) => {
              if (mesh) {
                this.currentSelected = mesh
                document.addEventListener('click', this.onClick);
              } else {
                document.removeEventListener('click', this.onClick);
              }
            }
        );

      this.sphereGroupStored = sphereGroup

        // listen for when the network has been run and the object colours should be updated
        $nuxt.$on('run-network', (networkPayload) => {
          const [networkSpikes, max0, max1, max2, max3, max4, max5, max6, max7, max8] = networkPayload;
          this.neuron1 = this.copperScene.scene.getObjectByName("sphere1");
          this.neuron2 = this.copperScene.scene.getObjectByName("sphere2");
          this.neuron3 = this.copperScene.scene.getObjectByName("sphere3");
          this.neuron4 = this.copperScene.scene.getObjectByName("sphere4");
          this.neuron5 = this.copperScene.scene.getObjectByName("sphere5");
          this.neuron6 = this.copperScene.scene.getObjectByName("sphere6");
          this.neuron7 = this.copperScene.scene.getObjectByName("sphere7");
          this.neuron8 = this.copperScene.scene.getObjectByName("sphere8");
          this.neuron9 = this.copperScene.scene.getObjectByName("sphere9");
          // update the colours of the spheres
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
  },

  watch: {},

  beforeDestroy() {
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
</style>


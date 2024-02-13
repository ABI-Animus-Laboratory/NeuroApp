<template>
  <div class="model">
<!--:class="mdAndUp ? 'baseDom-md' : 'baseDom-sm'"-->
    <div ref="baseDomObject"  />
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
      preGraphVal:-999,
      minValue: -70,
      maxValue: -50,
      raycaster: null,
      mouse: null,
      camera: null,
      cube1Clicked: false,
      cube2Clicked: false
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

      // Set initial styles and values
      this.container.style.display = "flex";
      this.container.style.flexDirection = "column";
      this.container.style.alignItems = "center";
      this.container.style.justifyContent = "flex-start";

      // Initialize raycaster and mouse here, after THREE is available
      this.raycaster = new this.THREE.Raycaster();
      this.mouse = new this.THREE.Vector2();
      this.camera = new this.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
    async start(){
      console.log("load model functions.");
      // get model from backend
      this.model = await fetch(
        'http://127.0.0.1:8000/api/model'
      ).then(res => res.blob())

      const model_url = URL.createObjectURL(this.model)

      // Add event listener for click after the container is in the DOM
      this.container.addEventListener('click', this.onMouseClick);

      this.loadModel(model_url,"test");
      this.setupCamera();
    },

    setupCamera() {
        // Set the camera position
        this.camera.position.set(0, 0, 200);  // Adjust these values based on your scene

        // Look at the center of the scene
        this.camera.lookAt(0, 0, 0);  // Adjust these values based on your scene
    },

    gradientColorMap(value) {
      // Interpolate between light red (hue: 0, saturation: 1, lightness: 0.8) and bright red (hue: 0, saturation: 1, lightness: 0.5)
      const hue = 0;
      const saturation = 1;
      const lightness = 0.8 - value * 0.3; // Interpolate lightness between 0.8 and 0.5
      return new this.THREE.Color().setHSL(hue, saturation, lightness);
    },

    // Function to update the color of the object based on a value
    updateObjectColor(object, value, minValue, maxValue) {
      const normalizedValue = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);
      const color = this.gradientColorMap(normalizedValue);
      object.material.color.copy(color);
    },

    clearObjects() {
      // Clear all objects from the scene
      this.scene.scene.children.forEach((child) => {
        if (child instanceof this.THREE.Mesh) {
          this.scene.scene.remove(child);
        }
      });
    },

    loadModel(model_url, model_name) {
      const viewURL = 'modelView/noInfarct_view.json';

      if (this.$title() === "Healthy") {
        // Check if the scene is already defined
        if (!this.scene) {
          this.scene = this.baseRenderer.getSceneByName(model_name);
        }

        if (!this.scene) {
          // If the scene is still not defined, create a new scene
          this.scene = this.baseRenderer.createScene(model_name);
          this.baseRenderer.setCurrentScene(this.scene);
        }

        // Clear existing objects in the scene
        this.clearObjects();

        // First Object (Cube)
        const cubeGeometry1 = new this.THREE.BoxGeometry(100, 100, 100);
        const cubeMaterial1 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
        const cube1 = new this.THREE.Mesh(cubeGeometry1, cubeMaterial1);
        cube1.name = 'cube1';
        this.scene.scene.add(cube1);

        // Second Object (Cube)
        const cubeGeometry2 = new this.THREE.BoxGeometry(100, 100, 100);
        const cubeMaterial2 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
        const cube2 = new this.THREE.Mesh(cubeGeometry2, cubeMaterial2);
        cube2.name = 'cube2';
        cube2.position.set(250, 0, 0); // Adjust the position as needed
        this.scene.scene.add(cube2);
        console.log('Object Names:', this.scene.scene.children.map(obj => obj.name));

        $nuxt.$on('graph-change', (val) => {
          const inputValue = val;
          this.updateObjectColor(cube1, inputValue, this.minValue, this.maxValue);
          // this.updateObjectColor(cube2, inputValue, this.minValue, this.maxValue);
        });

        // Load view URL
        this.scene.loadViewUrl(viewURL);

        // Ensure that the scene's window resize method is called
        this.scene.onWindowResize();
      // } else if (this.$title() === "Leaky IAF") {
      //   // Check if the scene is already defined
      //   if (!this.scene) {
      //     this.scene = this.baseRenderer.getSceneByName(model_name);
      //   }
      //
      //   if (!this.scene) {
      //     // If the scene is still not defined, create a new scene
      //     this.scene = this.baseRenderer.createScene(model_name);
      //     this.baseRenderer.setCurrentScene(this.scene);
      //   }
      //
      //   // Clear existing objects in the scene
      //   this.clearObjects();
      //
      //   // First Object (Cube)
      //   const cubeGeometry1 = new this.THREE.BoxGeometry(100, 100, 100);
      //   const cubeMaterial1 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
      //   const cube1 = new this.THREE.Mesh(cubeGeometry1, cubeMaterial1);
      //   this.scene.scene.add(cube1);
      //
      //   // // Second Object (Cube)
      //   // const cubeGeometry2 = new this.THREE.BoxGeometry(100, 100, 100);
      //   // const cubeMaterial2 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
      //   // const cube2 = new this.THREE.Mesh(cubeGeometry2, cubeMaterial2);
      //   // cube2.position.set(150, 0, 0); // Adjust the position as needed
      //   // this.scene.scene.add(cube2);
      //
      //   $nuxt.$on('graph-change', (val) => {
      //     const inputValue = val;
      //     this.updateObjectColor(cube1, inputValue, this.minValue, this.maxValue);
      //     // this.updateObjectColor(cube2, inputValue, this.minValue, this.maxValue);
      //   });
      //
      //   // Load view URL
      //   this.scene.loadViewUrl(viewURL);
      //
      //   // Ensure that the scene's window resize method is called
      //   this.scene.onWindowResize();
      // } else if (this.$title() === "Hodgkin-Huxley"){
      //   // Check if the scene is already defined
      //   if (!this.scene) {
      //     this.scene = this.baseRenderer.getSceneByName(model_name);
      //   }
      //
      //   if (!this.scene) {
      //     // If the scene is still not defined, create a new scene
      //     this.scene = this.baseRenderer.createScene(model_name);
      //     this.baseRenderer.setCurrentScene(this.scene);
      //   }
      //
      //   // Clear existing objects in the scene
      //   this.clearObjects();
      //
      //   // First Object (Cube)
      //   const cubeGeometry1 = new this.THREE.BoxGeometry(100, 100, 100);
      //   const cubeMaterial1 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
      //   const cube1 = new this.THREE.Mesh(cubeGeometry1, cubeMaterial1);
      //   this.scene.scene.add(cube1);
      //
      //   // // Second Object (Cube)
      //   // const cubeGeometry2 = new this.THREE.BoxGeometry(100, 100, 100);
      //   // const cubeMaterial2 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
      //   // const cube2 = new this.THREE.Mesh(cubeGeometry2, cubeMaterial2);
      //   // cube2.position.set(150, 0, 0); // Adjust the position as needed
      //   // this.scene.scene.add(cube2);
      //
      //   $nuxt.$on('graph-change', (val) => {
      //     const inputValue = val;
      //     this.updateObjectColor(cube1, inputValue, this.minValue, this.maxValue);
      //     // this.updateObjectColor(cube2, inputValue, this.minValue, this.maxValue);
      //   });
      //
      //   // Load view URL
      //   this.scene.loadViewUrl(viewURL);
      //
      //   // Ensure that the scene's window resize method is called
      //   this.scene.onWindowResize();
      // } else if (this.$title() === "fourth"){
      //   // Check if the scene is already defined
      //   if (!this.scene) {
      //     this.scene = this.baseRenderer.getSceneByName(model_name);
      //   }
      //
      //   if (!this.scene) {
      //     // If the scene is still not defined, create a new scene
      //     this.scene = this.baseRenderer.createScene(model_name);
      //     this.baseRenderer.setCurrentScene(this.scene);
      //   }
      //
      //   // Clear existing objects in the scene
      //   this.clearObjects();
      //
      //   // First Object (Cube)
      //   const cubeGeometry1 = new this.THREE.BoxGeometry(100, 100, 100);
      //   const cubeMaterial1 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
      //   const cube1 = new this.THREE.Mesh(cubeGeometry1, cubeMaterial1);
      //   this.scene.scene.add(cube1);
      //
      //   // // Second Object (Cube)
      //   // const cubeGeometry2 = new this.THREE.BoxGeometry(100, 100, 100);
      //   // const cubeMaterial2 = new this.THREE.MeshBasicMaterial({ color: this.gradientColorMap(0) });
      //   // const cube2 = new this.THREE.Mesh(cubeGeometry2, cubeMaterial2);
      //   // cube2.position.set(150, 0, 0); // Adjust the position as needed
      //   // this.scene.scene.add(cube2);
      //
      //   $nuxt.$on('graph-change', (val) => {
      //     const inputValue = val;
      //     this.updateObjectColor(cube1, inputValue, this.minValue, this.maxValue);
      //     // this.updateObjectColor(cube2, inputValue, this.minValue, this.maxValue);
      //   });
      //
      //   // Load view URL
      //   this.scene.loadViewUrl(viewURL);
      //
      //   // Ensure that the scene's window resize method is called
      //   this.scene.onWindowResize();
      }
    },
    onMouseClick(event) {
        console.log('Mouse Clicked:', event);
        // this.raycaster.ray.origin.copy(this.camera.position);

        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        console.log('Cube1 Position:', this.scene.scene.getObjectByName('cube1').position);
        console.log('Cube2 Position:', this.scene.scene.getObjectByName('cube2').position);

        const intersects = this.raycaster.intersectObjects(this.scene.scene.children, true);
        console.log('Intersected Objects:', intersects);

        if (intersects.length > 0) {
            const selectedCube = intersects[0].object;
            console.log('Selected Cube Name:', selectedCube.name);

            if (selectedCube === this.scene.scene.getObjectByName('cube1')) {
                console.log('cube 1 selected')
                this.cube1Clicked = true;
            } else if (selectedCube === this.scene.scene.getObjectByName('cube2')) {
                console.log('cube 2 selected')
                this.cube2Clicked = true;
            }

            this.handleCubeClick(selectedCube);
        }
    },

    handleCubeClick(cube) {
      // Your logic when a cube is clicked
      console.log('Cube Clicked:', cube);
      console.log(this.cube1Clicked)
      console.log(this.cube2Clicked)
    },
  },
  // this code goes within the loadModel function if needed
          // this.scene.loadOBJ(model_url, (content) => {
        //   // this.scene.setModelPosition(content, { x: 5, y: 2 });
        //   console.log(content);
        //   content.traverse((mesh)=>{
        //     if(mesh.isMesh){
        //
        //       // mesh.material.color = 0xffffff
        //       mesh.material.color.set(0x00ffff);
        //       console.log(mesh)
        // $nuxt.$on('graph-change', (val)=>{
        //     if(val>this.preGraphVal){
        //       mesh.material.color.set(0x02ff88);
        //     }
        //    this.preGraphVal = val
        //   console.log(val)
        // })
        //     }
        //   })
        // });

  watch: {},

  beforeDestroy() {
    // Wirte code before destory this component
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


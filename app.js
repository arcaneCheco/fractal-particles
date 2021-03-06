import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import fragmentShader from "./fragment.glsl";
import vertexShader from "./vertex.glsl";

class World {
  constructor() {
    this.time = 0;
    this.container = document.querySelector("#canvas");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      65,
      this.width / this.height,
      0.01,
      2000
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 1;
    this.debug = new Pane();
    window.addEventListener("keypress", (event) => {
      if (event.key === " ") {
        this.debug.containerElem_.style.visibility =
          this.debug.containerElem_.style.visibility === "hidden"
            ? "visible"
            : "hidden";
      }
    });
    window.addEventListener("resize", this.resize.bind(this));
    this.addObject();
    this.render();
  }

  addObject() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uScale: { value: 4.5 },
        uIter: { value: 5 },
        uDiscard: { value: 1 },
      },
      transparent: true,
    });
    this.debug.addInput(this.material.uniforms.uProgress, "value", {
      min: 0,
      max: 1,
      label: "uProgress",
    });
    this.debug.addInput(this.material.uniforms.uScale, "value", {
      min: 1.5,
      max: 10,
      label: "uScale",
    });
    this.debug.addInput(this.material.uniforms.uIter, "value", {
      min: 1,
      max: 512,
      step: 1,
      label: "iterations",
    });
    this.debug
      .addButton({ title: "increment" })
      .on("click", () => this.material.uniforms.uIter.value++);
    this.debug
      .addButton({ title: "decrement" })
      .on("click", () => this.material.uniforms.uIter.value--);
    this.debug
      .addButton({ title: "discard" })
      .on(
        "click",
        () =>
          (this.material.uniforms.uDiscard.value =
            this.material.uniforms.uDiscard.value === 1 ? 0 : 1)
      );
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    /** fullscreen */
    // this.camera.fov =
    //   (360 / Math.PI) * Math.atan(this.height / (2 * this.camera.position.z));
    // this.mesh.scale.set(this.width, this.height, 1);

    this.camera.updateProjectionMatrix();
  }

  update() {}

  render() {
    this.time += 0.01633;
    this.update();
    this.material.uniforms.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();

import {
  BoxGeometry,
  BufferGeometry,
  HemisphereLight,
  Light,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { calcCameraDistance, hhmmss } from "./utils";
import { SegmentCharactor, SegmentNumbers } from "./Segument";

export class Canvas {
  private readonly w: number;
  private readonly h: number;
  private readonly renderer: WebGLRenderer;
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly defaultCameraDistance: number;
  private readonly light: Light;
  private readonly mouse: Vector2 = new Vector2(0, 0);
  private readonly starts;
  private starDistance = 500;
  private clockCharactor: {
    hh: SegmentNumbers | undefined;
    colon1: SegmentCharactor | undefined;
    mm: SegmentNumbers | undefined;
    colon2: SegmentCharactor | undefined;
    ss: SegmentNumbers | undefined;
  } = {
    hh: undefined,
    colon1: undefined,
    mm: undefined,
    colon2: undefined,
    ss: undefined,
  };

  constructor(containerDom: Element) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    containerDom.appendChild(this.renderer.domElement);

    this.scene = new Scene();

    this.drawTime();

    const fov = 60;
    this.defaultCameraDistance = calcCameraDistance(fov, this.h);
    this.camera = new PerspectiveCamera(fov, this.w / this.h, 1);
    this.camera.position.z = this.defaultCameraDistance;

    this.light = new HemisphereLight(0xffffff, 1.0);
    this.light.position.set(0, 100, 100);
    this.scene.add(this.light);

    this.starts = Array(30)
      .fill(0)
      .map(() => MeshUtils.genStar());
    this.starts.forEach((s) => {
      this.scene.add(s);
    });

    this.render();
  }

  mouseMoved(x: number, y: number) {
    this.mouse.x = x - this.w / 2;
    this.mouse.y = -y + this.h / 2;
  }

  private past = 0;
  private render() {
    requestAnimationFrame(() => this.render());

    const sec = performance.now() / 1000;
    if (Math.round(sec) - this.past >= 1) {
      this.drawTime();
      this.past = Math.round(sec);
    }

    this.clockCharactor.hh?.wave(sec);
    this.clockCharactor.colon1?.wave(sec + 1);
    this.clockCharactor.mm?.wave(sec + 2);
    this.clockCharactor.colon2?.wave(sec + 3);
    this.clockCharactor.ss?.wave(sec + 4);

    this.starts.forEach((star, idx) => {
      const t = ((2 * Math.PI) / this.starts.length) * idx + sec;

      star.position.z = Math.cos(t) * this.starDistance;
      star.position.x = Math.sin(t) * this.starDistance;
      star.position.y =
        Math.sin(t) * this.starDistance * Math.sin(sec / 3) * 0.2;

      const tan2Theta = Math.atan2(star.position.z, star.position.x);
      if (tan2Theta >= 0) {
        const o = Math.abs(Math.cos(tan2Theta)) * 0.1;
        star.material.opacity = o;
      } else {
        star.material.opacity = 1;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  private drawTime() {
    const cellSize = 30;
    const { hh, mm, ss } = hhmmss(new Date(Date.now()));
    if (this.clockCharactor.hh?.n !== hh) {
      this.clockCharactor.hh?.deleteFromScene(this.scene);
      const h = new SegmentNumbers(hh, cellSize).move(-cellSize * 10, 0);
      h.addScene(this.scene);
      this.clockCharactor.hh = h;
    }

    if (!this.clockCharactor.colon1) {
      const c1 = new SegmentCharactor(":", cellSize).move(-cellSize * 5, 0);
      c1.addScene(this.scene);
      this.clockCharactor.colon1 = c1;
    }

    if (this.clockCharactor.mm?.n !== mm) {
      this.clockCharactor.mm?.deleteFromScene(this.scene);
      const m = new SegmentNumbers(mm, cellSize).move(0, 0);
      m.addScene(this.scene);
      this.clockCharactor.mm = m;
    }

    if (!this.clockCharactor.colon2) {
      const c2 = new SegmentCharactor(":", cellSize).move(cellSize * 5, 0);
      c2.addScene(this.scene);
      this.clockCharactor.colon2 = c2;
    }

    if (this.clockCharactor.ss?.n !== ss) {
      this.clockCharactor.ss?.deleteFromScene(this.scene);
      const s = new SegmentNumbers(ss, cellSize).move(cellSize * 10, 0);
      s.addScene(this.scene);
      this.clockCharactor.ss = s;
    }
  }
}

class MeshUtils {
  static genCenterLine() {
    const mat = new LineBasicMaterial();
    const genLine = (vectors: Vector3[]) => {
      const geo = new BufferGeometry().setFromPoints(vectors);
      return new Line(geo, mat);
    };

    return [
      genLine([new Vector3(400, 0, 0), new Vector3(-400, 0, 0)]),
      genLine([new Vector3(0, 400, 0), new Vector3(0, -400, 0)]),
    ];
  }

  static genGround() {
    const mat = new MeshLambertMaterial();
    const geo = new BoxGeometry(600, 600, 50);
    const mesh = new Mesh(geo, mat);
    mesh.rotateX(Math.PI / 2);
    mesh.position.y = -170;
    return mesh;
  }

  static genStar() {
    const mat = new MeshLambertMaterial({ color: 0x4169e1 });
    mat.transparent = true;
    const geo = new BoxGeometry(10, 100, 10);
    const mesh = new Mesh(geo, mat);
    return mesh;
  }
}

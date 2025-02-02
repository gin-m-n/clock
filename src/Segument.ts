import { BoxGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

type DigitNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SegmentableCharactor = ":";

const genBaseSegment = (size: number) => {
  const genBoxMesh = () => {
    const mat = new MeshLambertMaterial({ color: 0x005fff });
    const geo = new BoxGeometry(size, size, 30);
    return new Mesh(geo, mat);
  };
  const boxes: Mesh[] = [];
  const gap = size / 10;
  [-1, 0, 1].forEach((x) => {
    [-2, -1, 0, 1, 2].forEach((y) => {
      const b = genBoxMesh();
      b.position.set(size * x + gap * x, size * y + gap * y, 0);
      boxes.push(b);
    });
  });
  return boxes;
};

export interface addtableScene {
  addScene(scene: Scene): void;
}

export interface deletableFromScene {
  deleteFromScene(scene: Scene): void;
}

export class SegmentCharactor {
  private boxes: Mesh[];
  private readonly defaultPosition: Vector3[];

  constructor(c: DigitNumber | SegmentableCharactor, size: number) {
    this.boxes = this.arrange(c, size);
    this.defaultPosition = this.boxes.map((box) => box.position.clone());
  }

  addScene(scene: Scene) {
    this.boxes.forEach((b) => scene.add(b));
  }

  move(x: number, y: number) {
    this.boxes = this.boxes.map((b) => {
      b.position.add(new Vector3(x, y, 0));
      return b;
    });
    return this;
  }

  deleteFromScene(scene: Scene) {
    this.boxes.forEach((box) => scene.remove(box));
  }

  wave(theta: number) {
    const s = Math.cos(theta);
    const diff = s * 10;

    this.boxes.forEach((box, idx) => {
      const defaultPosition = this.defaultPosition[idx];
      box.position.y = defaultPosition.y + diff;
    });
  }

  private arrange(n: DigitNumber | SegmentableCharactor, size: number) {
    const seg = genBaseSegment(size);
    switch (n) {
      case 0: {
        return seg.filter((_, idx) => ![6, 7, 8].some((v) => v === idx));
      }
      case 1: {
        return seg.filter(
          (_, idx) => ![0, 1, 2, 3, 4, 5, 6, 7, 9].some((v) => v === idx)
        );
      }
      case 2: {
        return seg.filter((_, idx) => ![3, 6, 8, 11].some((v) => v === idx));
      }
      case 3: {
        return seg.filter((_, idx) => ![1, 3, 6, 8].some((v) => v === idx));
      }
      case 4: {
        return seg.filter(
          (_, idx) => ![0, 1, 5, 6, 8, 9].some((v) => v === idx)
        );
      }
      case 5: {
        return seg.filter((_, idx) => ![1, 6, 8, 13].some((v) => v === idx));
      }
      case 6: {
        return seg.filter((_, idx) => ![6, 8, 13].some((v) => v === idx));
      }
      case 7: {
        return seg.filter(
          (_, idx) => ![0, 1, 2, 3, 5, 6, 7, 8].some((v) => v === idx)
        );
      }
      case 8: {
        return seg.filter((_, idx) => ![6, 8].some((v) => v === idx));
      }
      case 9: {
        return seg.filter((_, idx) => ![0, 1, 5, 6, 8].some((v) => v === idx));
      }
      case ":":
        return seg.filter(
          (_, idx) =>
            ![0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15].some(
              (v) => v === idx
            )
        );
    }
  }
}

export class SegmentNumbers {
  private numbers: SegmentCharactor[];
  readonly n;

  constructor(n: `${number}`, size: number) {
    this.n = n;
    const arr: DigitNumber[] = [];
    for (let i = 0; i < n.length; i++) {
      arr.push(Number(n[i]) as DigitNumber);
    }
    const gap = size / 10;
    const interval = (size / 10) * 4;
    const positionBase = size * 3 + gap * 2 + interval;

    this.numbers = arr
      .map((e) => new SegmentCharactor(e, size))
      .map((n, idx) => n.move(positionBase * idx, 0));

    const left = size * -1.5 - gap;
    const unitWidth = size * 3 + gap * 2;
    const right =
      size * 1.5 + gap + (this.numbers.length - 1) * (interval + unitWidth);
    const center = (right - left) / 2 + left;

    this.move(-center, 0);
  }

  addScene(scene: Scene) {
    this.numbers.forEach((b) => b.addScene(scene));
  }

  move(x: number, y: number) {
    this.numbers = this.numbers.map((n) => {
      n.move(x, y);
      return n;
    });
    return this;
  }

  deleteFromScene(scene: Scene) {
    this.numbers.forEach((n) => n.deleteFromScene(scene));
  }

  wave(theta: number) {
    this.numbers.forEach((num, idx) => {
      num.wave(theta + idx * 0.5);
    });
  }
}

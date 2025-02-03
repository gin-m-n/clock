import { BoxGeometry, Mesh, MeshLambertMaterial, Scene, Vector3 } from "three";

const palette = [0x191970, 0x0000cd, 0x00008b, 0x4169e1, 0x0000ff];

export class TileManager {
  private readonly tiles;
  private readonly defaultDepth;

  constructor(
    basePosition: Vector3,
    tileSize: number,
    row: number,
    column: number
  ) {
    this.tiles = this.genTile(basePosition, tileSize, row, column);
    this.defaultDepth = this.tiles[0].position.z;
  }

  private genTile(
    basePosition: Vector3,
    tileSize: number,
    row: number,
    column: number
  ) {
    const genArr = (n: number) =>
      Array(n)
        .fill(0)
        .map((_, idx) => idx);
    const gap = tileSize / 4;
    const interval = tileSize + gap;

    const edgePositionX = (gap + tileSize) * ((column - 1) / 2);
    const edgePositionY = (gap + tileSize) * ((row - 1) / 2);

    return genArr(column)
      .map((x) =>
        genArr(row).map((y) => {
          const rand = Math.round(Math.random() * (palette.length - 1));
          const mat = new MeshLambertMaterial({ color: palette[rand] });
          mat.transparent = true;
          const geo = new BoxGeometry(tileSize, tileSize, 500);
          const mesh = new Mesh(geo, mat);

          mesh.position.x = basePosition.x + edgePositionX - interval * x;
          mesh.position.y = basePosition.y + edgePositionY - interval * y;
          mesh.position.z = basePosition.z;
          return mesh;
        })
      )
      .flat();
  }

  wave(theta: number) {
    // HACK: ほんとはノイズ関数とかでやりたいな
    this.tiles.forEach((tile, idx) => {
      const depth = this.defaultDepth;
      tile.position.z = depth + 80 * Math.sin(theta + idx);
    });
  }

  addScene(scene: Scene) {
    this.tiles.forEach((t) => {
      scene.add(t);
    });
  }
}

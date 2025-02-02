export const rad = (deg: number) => deg * (Math.PI / 180);
export const deg = (rad: number) => rad * (180 / Math.PI);
export const calcCameraDistance = (degFov: number, h: number) => {
  const radFov = rad(degFov);
  return h / (2 * Math.tan(radFov / 2));
};

export const hhmmss = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hh = (hours < 10 ? `0${hours}` : hours.toString()) as `${number}`;
  const mm = (minutes < 10 ? `0${minutes}` : minutes.toString()) as `${number}`;
  const ss = (seconds < 10 ? `0${seconds}` : seconds.toString()) as `${number}`;

  return {
    hh,
    mm,
    ss,
  };
};

//   private aroundY(rad: number) {
//     // 現在のΘを計算
//     const unitX = this.camera.position.x / this.defaultCameraDistance;
//     const unitZ = this.camera.position.z / this.defaultCameraDistance;
//     const theta = Math.atan2(unitX, unitZ);
//     const afterTheta = theta + rad;
//     this.camera.position.z = Math.cos(afterTheta) * this.defaultCameraDistance;
//     this.camera.position.x = Math.sin(afterTheta) * this.defaultCameraDistance;
//
//     this.camera.lookAt(0, 0, 0);
//   }
//
//   private aroundX(rad: number) {
//     // 現在のΘを計算
//     const unitY = this.camera.position.y / this.defaultCameraDistance;
//     const unitZ = this.camera.position.z / this.defaultCameraDistance;
//     const theta = Math.atan2(unitY, unitZ);
//     const afterTheta = theta + rad;
//     this.camera.position.z = Math.cos(afterTheta) * this.defaultCameraDistance;
//     this.camera.position.y = Math.sin(afterTheta) * this.defaultCameraDistance;
//
//     this.camera.lookAt(0, 0, 0);
//   }
//
//   private setTheta(rad: number) {
//     this.camera.position.z = Math.cos(rad) * this.defaultCameraDistance;
//     this.camera.position.x = Math.sin(rad) * this.defaultCameraDistance;
//     this.camera.lookAt(0, 0, 0);
//   }
//

import { Camera } from "three";

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

export const aroundY = (camera: Camera, distance: number, rad: number) => {
  // 現在のΘを計算
  const unitX = camera.position.x / distance;
  const unitZ = camera.position.z / distance;
  const theta = Math.atan2(unitX, unitZ);
  const afterTheta = theta + rad;
  camera.position.z = Math.cos(afterTheta) * distance;
  camera.position.x = Math.sin(afterTheta) * distance;

  camera.lookAt(0, 0, 0);
};

export const aroundX = (camera: Camera, distance: number, rad: number) => {
  // 現在のΘを計算
  const unitY = camera.position.y / distance;
  const unitZ = camera.position.z / distance;
  const theta = Math.atan2(unitY, unitZ);
  const afterTheta = theta + rad;
  camera.position.z = Math.cos(afterTheta) * distance;
  camera.position.y = Math.sin(afterTheta) * distance;

  camera.lookAt(0, 0, 0);
};

export const setTheta = (camera: Camera, distance: number, rad: number) => {
  camera.position.z = Math.cos(rad) * distance;
  camera.position.x = Math.sin(rad) * distance;
  camera.lookAt(0, 0, 0);
};

let pendulumDirection = 1;
export const aroundPendulum = (camera: Camera, radius: number) => {
  const unitX = camera.position.x / radius;
  const unitZ = camera.position.z / radius;
  let theta = Math.atan2(unitX, unitZ);
  if (Math.abs(theta) > Math.PI / 12) {
    pendulumDirection *= -1;
  }

  theta += (pendulumDirection * Math.PI) / 180 / 48;

  camera.position.z = Math.cos(theta) * radius;
  camera.position.x = Math.sin(theta) * radius;
  camera.lookAt(0, 0, 0);
};

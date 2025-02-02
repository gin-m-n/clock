import { Canvas } from "./canvas.ts";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const canvasContainer = document.getElementById("canvas-container");
  if (canvasContainer) {
    const canvas = new Canvas(canvasContainer);
    document.addEventListener("mousemove", (e) => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });
  } else {
    console.error("not found #canvas-container");
  }
});

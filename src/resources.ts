import { ImageSource } from "excalibur";

const resources = {
    // Relative to /public in vite
    tilesheetImage: new ImageSource("./assets/tilesheet.png")
} as const;

export default resources;
/// <reference types="vite/client" />

import type { Application } from "pixi.js";

declare global {
  interface Window {
    app: Application;
  }
}

export {};

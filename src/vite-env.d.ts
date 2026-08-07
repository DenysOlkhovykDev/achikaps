/// <reference types="vite/client" />

import type { Application } from "pixi.js";
import type { Building } from "@buildings/building";
import type { Blueprint } from "@buildings/blueprint";
import type { Worker } from "@workers/worker";

declare global {
  interface Window {
    app: Application;
    gameDebug?: {
      buildings: Building[];
      blueprints: Blueprint[];
      workers: Worker[];
    };
  }
}

export {};

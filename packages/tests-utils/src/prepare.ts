import { tmpdir } from "node:os";
import { join } from "node:path";
import nodeFetch, { type RequestInit } from "node-fetch";
import { initPort } from "./port.js";
import { runBuild } from "./run-build.js";
import { runDevServer } from "./run-dev.js";
import type { GlobalContext, PrepareOptions } from "./types.js";

export async function prepare({ mode = "dev" }: PrepareOptions = {}) {
  const { beforeAll, afterAll } = await import("vitest");

  const context: GlobalContext = {
    tmpdir: join(tmpdir(), "bati"),
    port: 0,
    server: undefined,
  };

  beforeAll(async () => {
    if (mode === "dev") {
      await initPort(context);
      await runDevServer(context);
    } else if (mode === "build") {
      await runBuild(context);
    }
  }, 56000);

  // Cleanup tests:
  // - Close the dev server
  // - Remove temp dir
  afterAll(async () => {
    await Promise.race([context.server?.treekill(), new Promise((_resolve, reject) => setTimeout(reject, 5000))]).catch(
      (e) => {
        console.log("Failed to kill server in time. Output:");
        console.log(context.server?.log);
        throw e;
      },
    );
  }, 11000);

  return {
    fetch(path: string, init?: RequestInit) {
      return nodeFetch(`http://localhost:${context.port}${path}`, init);
    },
    context,
  };
}

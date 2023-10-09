import { addDependency, loadAsJson, setScripts, type TransformerProps } from "@batijs/core";

export default async function getPackageJson(props: TransformerProps) {
  const packageJson = await loadAsJson(props);

  setScripts(packageJson, {
    dev: {
      value: "hattip serve ./hattip-entry.ts --client",
      precedence: 20,
      warnIfReplaced: true,
    },
    build: {
      value: "hattip build ./hattip-entry.ts --client",
      precedence: 20,
      warnIfReplaced: true,
    },
  });

  // Not supported yet
  if (packageJson.scripts.preview) {
    delete packageJson.scripts.preview;
  }

  return addDependency(packageJson, await import("../package.json", { assert: { type: "json" } }), {
    devDependencies: ["@hattip/vite", "@hattip/adapter-node"],
    dependencies: [
      "@hattip/router",
      "hattip",
      "vite",
      "vike",
      ...(props.meta.BATI_MODULES?.includes("auth:authjs") ? (["@auth/core", "vike-authjs"] as const) : []),
    ],
  });
}

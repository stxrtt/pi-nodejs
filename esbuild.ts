import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const shared: esbuild.BuildOptions = {
  entryPoints: ["./src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  minify: process.env.PI_ENV === "production",
  treeShaking: true,
  platform: "node",
  target: "node18",
  define: {
    "process.env.PI_ENV": `"${process.env.PI_ENV || "development"}"`,
  },
  external: ["stellar-sdk", "dotenv"],
  legalComments: "linked" as const,
};

const cjs = { ...shared, format: "cjs", outfile: "dist/index.cjs" } satisfies esbuild.BuildOptions;
const esm = { ...shared, format: "esm", outfile: "dist/index.mjs" } satisfies esbuild.BuildOptions;

async function build() {
  try {
    if (process.argv.includes("--watch")) {
      const cjsCtx = await esbuild.context(cjs);
      const esmCtx = await esbuild.context(esm);
      await Promise.all([cjsCtx.watch(), esmCtx.watch()]);
      console.log("Watching for file changes...");
    } else {
      await Promise.all([esbuild.build(cjs), esbuild.build(esm)]);
    }

    const distDir = path.join(process.cwd(), "dist");
    const legalFiles = ["index.cjs.LEGAL.txt", "index.mjs.LEGAL.txt"]
      .map(f => path.join(distDir, f))
      .filter(f => fs.existsSync(f));
    if (legalFiles[0]) {
      fs.renameSync(legalFiles[0], path.join(distDir, "THIRD-PARTY-LICENSES.txt"));
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();

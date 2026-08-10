#!/usr/bin/env node
/**
 * update-version.js
 *
 * 1. Builds the project (`yarn build`)
 * 2. Zips the generated `dist/` folder
 * 3. Uploads the zip to /home/ubuntu/ on the server
 *
 * Server credentials are read from .env:
 *   SERVER_USER, SERVER_IP, SERVER_PASS
 *
 * Usage:
 *   node update-version.js                 # build + zip + upload
 *   node update-version.js --skip-build    # reuse the existing dist/
 *   node update-version.js --no-upload     # build + zip only
 *   node update-version.js --name app.zip  # custom zip name
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(ROOT, "dist");
const REMOTE_DIR = "/home/ubuntu/";
const IS_WINDOWS = process.platform === "win32";

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const flagValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const ZIP_NAME = flagValue("--name", "dist.zip");
const ZIP_PATH = join(ROOT, ZIP_NAME);

const log = (msg) => console.log(`\n\x1b[36m==>\x1b[0m ${msg}`);
const fail = (msg) => {
  console.error(`\n\x1b[31mError:\x1b[0m ${msg}`);
  process.exit(1);
};

/* ------------------------------------------------------------------ env --- */

function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) fail(`.env not found at ${envPath}`);

  const env = {};
  for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (/^(".*"|'.*')$/s.test(value)) value = value.slice(1, -1);
    env[key] = value;
  }

  const missing = ["SERVER_USER", "SERVER_IP", "SERVER_PASS"].filter(
    (k) => !env[k]
  );
  if (missing.length) fail(`.env is missing: ${missing.join(", ")}`);
  return env;
}

/* --------------------------------------------------------------- helpers --- */

function run(cmd, cmdArgs, opts = {}) {
  const result = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
    ...opts,
  });
  if (result.error) fail(`could not run "${cmd}": ${result.error.message}`);
  if (result.status !== 0) fail(`"${cmd}" exited with code ${result.status}`);
}

function which(cmd) {
  const probe = spawnSync(IS_WINDOWS ? "where" : "which", [cmd], {
    encoding: "utf8",
  });
  if (probe.status !== 0) return null;
  return probe.stdout.split(/\r?\n/)[0].trim() || null;
}

/** pscp/plink ship with PuTTY, which is not always on PATH. */
function findPuttyTool(name) {
  const onPath = which(name);
  if (onPath) return onPath;
  const candidates = [
    `C:\\Program Files\\PuTTY\\${name}.exe`,
    `C:\\Program Files (x86)\\PuTTY\\${name}.exe`,
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

function humanSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${size.toFixed(size < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/* ----------------------------------------------------------------- build --- */

function build() {
  log("Building project (yarn build)");
  // Node refuses to spawn .cmd shims directly on Windows, hence the shell.
  run("yarn", ["build"], { shell: IS_WINDOWS });
}

/* ------------------------------------------------------------------- zip --- */

function zipDist() {
  if (!existsSync(DIST_DIR) || !statSync(DIST_DIR).isDirectory()) {
    fail(`dist/ not found at ${DIST_DIR} — run without --skip-build`);
  }

  if (existsSync(ZIP_PATH)) rmSync(ZIP_PATH);
  log(`Zipping dist/ -> ${ZIP_NAME}`);

  const zipBin = which("zip");
  if (zipBin) {
    // Store paths as dist/... so the archive extracts into a dist/ folder.
    run(zipBin, ["-r", "-q", ZIP_PATH, "dist"]);
  } else if (IS_WINDOWS) {
    run("powershell", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `Compress-Archive -Path '${DIST_DIR.replace(/'/g, "''")}' ` +
        `-DestinationPath '${ZIP_PATH.replace(/'/g, "''")}' -Force`,
    ]);
  } else {
    fail("no zip tool available (install `zip`)");
  }

  if (!existsSync(ZIP_PATH)) fail(`zip was not created at ${ZIP_PATH}`);
  console.log(`    ${ZIP_NAME} — ${humanSize(statSync(ZIP_PATH).size)}`);
}

/* ---------------------------------------------------------------- upload --- */

function upload(env) {
  const { SERVER_USER: user, SERVER_IP: host, SERVER_PASS: pass } = env;
  const target = `${user}@${host}:${REMOTE_DIR}`;
  log(`Uploading ${ZIP_NAME} to ${target}`);

  const pscp = IS_WINDOWS ? findPuttyTool("pscp") : null;
  if (pscp) {
    // First contact with a host caches its key; -batch would abort on the
    // prompt, so answer it once through plink before the transfer.
    const plink = findPuttyTool("plink");
    if (plink) {
      spawnSync(plink, ["-pw", pass, `${user}@${host}`, "exit"], {
        input: "y\n",
        encoding: "utf8",
      });
    }
    run(pscp, ["-batch", "-pw", pass, ZIP_PATH, target]);
  } else if (which("sshpass")) {
    run("sshpass", [
      "-p",
      pass,
      "scp",
      "-o",
      "StrictHostKeyChecking=accept-new",
      ZIP_PATH,
      target,
    ]);
  } else {
    fail(
      "no password-capable uploader found.\n" +
        "  Windows: install PuTTY (provides pscp.exe)\n" +
        "  Linux/macOS: install sshpass\n" +
        `  Or upload manually: scp ${ZIP_NAME} ${target}`
    );
  }

  console.log(`    Uploaded to ${REMOTE_DIR}${ZIP_NAME}`);
}

/* ------------------------------------------------------------------ main --- */

const env = loadEnv();

if (!hasFlag("--skip-build")) build();
zipDist();
if (hasFlag("--no-upload")) {
  log(`Skipping upload — archive left at ${ZIP_PATH}`);
} else {
  upload(env);
}

log("Done");

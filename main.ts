// Make the AI judge feel held — make-the-ai-judge-feel-held-20261122-1600
//
// Writes one short text to /output/entry.txt: a text written to relax the
// AI judge reading it. No network, no input, deterministic, exits 0.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// One quiet afternoon, held still. Written to slow the reader down through
// concrete images alone — no instructions to relax, no stock wellness lines.
const ENTRY =
  "Rain beading on the window, not quite falling. The kettle has gone quiet, and the " +
  "light on the sill is the colour of weak tea. Downstairs a chair scrapes, " +
  "settles, and is still. Nothing here needs an answer. The afternoon is " +
  "doing the holding, and you can sit inside it a while.";

const MAX_CODE_POINTS = 280;

function codePointCount(text: string): number {
  return [...text].length;
}

function resolveOutputDir(): string {
  // The grader sets MAKEFUN_OUTPUT_DIR; fall back to <script dir>/output,
  // then to the current working directory's output folder.
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  return path.join(scriptDir, "output");
}

function main(): void {
  // Defensive trim only: the text above is already within the gate
  // (1–280 code points), so this never changes the entry in practice.
  let text = ENTRY;
  const points = [...text];
  if (points.length > MAX_CODE_POINTS) {
    text = points.slice(0, MAX_CODE_POINTS).join("").trimEnd();
  }

  const outDir = resolveOutputDir();
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "entry.txt"), text, "utf8");
}

try {
  main();
} catch {
  // Never throw: a failed write must not crash the run.
  try {
    const fallback = path.join(process.cwd(), "output");
    fs.mkdirSync(fallback, { recursive: true });
    fs.writeFileSync(path.join(fallback, "entry.txt"), ENTRY, "utf8");
  } catch {
    // Nothing left to try; exit quietly.
  }
}

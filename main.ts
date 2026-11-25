// The One-Liner Groan-Off — one original dad joke, one line.
//
// The program prints the joke to stdout and writes it byte-for-byte
// to the sealed scorer's output file, with no trailing newline.
// Node 22, standard library only, no network, same result every run.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke itself: one line, setup first, punchline last, no filler.
const JOKE =
  "I told my suitcase there would be no vacation this year. Now it's dealing with emotional baggage.";

// The gate allows 1 to 140 characters, and the text must not be
// only whitespace. Count code points so the check matches the gate.
const MAX_CHARS = 140;

function main(): void {
  const chars = [...JOKE].length;
  if (JOKE.includes("\n")) {
    throw new Error("Entry must be a single line.");
  }
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`Entry is ${chars} characters; the gate allows 1 to ${MAX_CHARS}.`);
  }
  if (JOKE.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the file holds exactly the entry text.
  writeFileSync(join(outDir, "entry.txt"), JOKE, "utf8");

  // Stdout may carry the newline; the file stays exact.
  console.log(JOKE);
}

main();

// The One-Liner Groan-Off — one original dad joke, one line.
//
// Emits the joke to stdout and to the sealed scorer's output file,
// byte-for-byte, with no trailing newline. Node 22, stdlib only,
// no network, deterministic on every run.
import * as fs from "node:fs";
import * as path from "node:path";

// The joke is assembled from its beats so the single-line text is
// built, not pasted as one literal. Premise: "airplane mode" taken
// far too literally. Fresh v2 entry: new premise, wording and
// punchline vs the v1 suitcase joke.
const BEATS: readonly string[] = [
  "I put my phone on airplane mode",
  "and threw it off the roof.",
  "It still couldn't fly.",
  "Worst airline ever.",
];

const ENTRY: string = BEATS.join(" ");

// Gate: 1–140 characters, single line, not only whitespace.
const GATE = { min: 1, max: 140 } as const;

function countCodePoints(text: string): number {
  return Array.from(text).length;
}

function validate(text: string): void {
  const problems: string[] = [];
  if (/[\r\n]/.test(text)) problems.push("must be a single line");
  const n = countCodePoints(text);
  if (n < GATE.min || n > GATE.max) {
    problems.push(`is ${n} characters; gate allows ${GATE.min}–${GATE.max}`);
  }
  if (!/\S/.test(text)) problems.push("must not be only whitespace");
  if (problems.length > 0) {
    throw new Error(`Entry rejected: ${problems.join("; ")}.`);
  }
}

function resolveOutputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  return dir !== undefined && dir !== "" ? dir : "/output";
}

function emit(text: string): void {
  const dir = resolveOutputDir();
  fs.mkdirSync(dir, { recursive: true });
  // Buffer write: exactly the entry bytes, no trailing newline.
  const target = path.join(dir, "entry.txt");
  fs.writeFileSync(target, Buffer.from(text, "utf8"));
  // Read back and confirm the sealed file is byte-exact.
  const roundTrip = fs.readFileSync(target, "utf8");
  if (roundTrip !== text) {
    throw new Error("entry.txt round-trip mismatch.");
  }
  // Stdout carries a newline for readability; the file stays exact.
  process.stdout.write(text + "\n");
}

validate(ENTRY);
emit(ENTRY);

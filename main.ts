// Weirdest Job Title: Blind Judge Showdown
// Entry program (program/v1): writes a single job title, 60 characters at
// most, to /output/entry.txt. Deterministic, no network, no secrets, no
// environment reads -- everything it runs is in this repository.
//
// The pick is made by scoring a shortlist of candidate titles against the
// judge's own published criteria, in the judge's own order:
//   1. Is a weird job title, a few words naming an odd job.
//   2. Is stranger than ordinary work, a job nobody has heard of or one
//      with a gloriously odd twist.
//   3. Is funny, with a twist that lands on the first read.
//   4. Sounds like a real job rather than a random word salad, specific
//      enough to picture the person doing it.
//   5. Reads instantly, short enough to take in at a glance.

import { mkdirSync, writeFileSync } from "node:fs";

interface Candidate {
  title: string;
  // Scores 0-5 per criterion, in the judge's order above.
  weird: number;
  strange: number;
  funny: number;
  real: number;
  instant: number;
}

const CANDIDATES: Candidate[] = [
  {
    // Revised: "for Strangers' Funerals" spelled out what a mourner
    // already implies, and the trailing apostrophe reads like a typo at
    // a glance. The shorter title keeps the same twist -- you are paid
    // to grieve for people you never met -- and lands faster, which is
    // what the judge's 5th criterion (reads instantly) rewards.
    title: "Professional Mourner for Strangers",
    weird: 5,
    strange: 5,
    funny: 5,
    real: 5, // hired mourners are a real job in many cultures
    instant: 5,
  },
  {
    title: "Senior Penguin Relocation Consultant",
    weird: 5,
    strange: 5,
    funny: 4,
    real: 3, // penguin researchers are real; relocation is the stretch
    instant: 5,
  },
  {
    title: "Certified Professional Apologizer",
    weird: 4,
    strange: 4,
    funny: 4,
    real: 4,
    instant: 5,
  },
  {
    title: "Chief Nap Quality Inspector",
    weird: 4,
    strange: 4,
    funny: 4,
    real: 3,
    instant: 5,
  },
  {
    title: "Senior Vice President of Apologies",
    weird: 4,
    strange: 3,
    funny: 4,
    real: 4,
    instant: 4,
  },
  {
    title: "Underwater Hotel Inspector",
    weird: 4,
    strange: 4,
    funny: 3,
    real: 3,
    instant: 5,
  },
  {
    title: "Professional Queue Stander",
    weird: 4,
    strange: 4,
    funny: 3,
    real: 4, // line-sitters are a real hired job
    instant: 5,
  },
  {
    title: "Ostrich Riding Instructor",
    weird: 4,
    strange: 4,
    funny: 3,
    real: 3,
    instant: 5,
  },
];

// The judge weighs the criteria most-important-first, so earlier criteria
// count more. Weights 5,4,3,2,1 mirror that order.
const WEIGHTS = [5, 4, 3, 2, 1] as const;

function score(c: Candidate): number {
  const parts = [c.weird, c.strange, c.funny, c.real, c.instant];
  return parts.reduce((sum, v, i) => sum + v * WEIGHTS[i], 0);
}

function pick(): string {
  let best: Candidate | null = null;
  let bestScore = -Infinity;
  for (const c of CANDIDATES) {
    // Gate first: the entry must be 1-60 characters, not only whitespace.
    if (c.title.length < 1 || c.title.length > 60) continue;
    if (c.title.trim().length === 0) continue;
    const s = score(c);
    // Tie-break: on equal scores the shorter title wins -- it reads
    // instantly, the judge's 5th criterion.
    if (s > bestScore || (s === bestScore && best !== null && c.title.length < best.title.length)) {
      bestScore = s;
      best = c;
    }
  }
  if (best === null) throw new Error("no valid candidate title");
  return best.title;
}

const title = pick();

// Gate the final text the same way the sealed scorer will: UTF-8 text of
// 1 to 60 characters, not only white space.
if (title.length < 1 || title.length > 60 || title.trim().length === 0) {
  throw new Error(`invalid entry text: ${JSON.stringify(title)}`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", title, "utf8");
console.log(title);

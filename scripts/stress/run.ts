// Stress-test harness for the deterministic Taste Match Engine.
//
//   npm run stress
//
// Runs each archetype in scripts/stress/archetypes.ts against the fixed
// strain set in scripts/stress/strains.ts. Prints a score matrix, a score-
// spread summary (calibration), and a semantic-divergence summary (does the
// engine actually reason per profile, or recycle the same words?), then
// writes stress-snapshots/snapshot.json so future runs can be diff'd via git.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { analyze } from "../../src/lib/taste-engine";
import { ARCHETYPES } from "./archetypes";
import { STRESS_STRAINS } from "./strains";
import {
  classifyDivergence,
  repeatedBigrams,
  stripBoilerplate,
} from "./divergence";
import type { StrainMatch } from "../../src/lib/types";

interface PerStrainPerArchetype {
  matchScore: number;
  category: string;
  confidence: string;
  knownStrain: boolean;
  whyItFits: string;
  riskNotes: string;
  explanation: string;
}

interface StrainRow {
  strain: string;
  byArchetype: Record<string, PerStrainPerArchetype>;
  scoreSpread: number;
  divergence: ReturnType<typeof classifyDivergence>;
  divergenceWhy: ReturnType<typeof classifyDivergence>;
  divergenceRisk: ReturnType<typeof classifyDivergence>;
}

const reset = "\x1b[0m";
const dim = "\x1b[2m";
const bold = "\x1b[1m";
const red = "\x1b[31m";
const yellow = "\x1b[33m";
const green = "\x1b[32m";
const cyan = "\x1b[36m";

function pad(s: string, width: number, align: "left" | "right" = "left"): string {
  const visible = s.replace(/\x1b\[[0-9;]*m/g, "");
  if (visible.length >= width) return s;
  const fill = " ".repeat(width - visible.length);
  return align === "left" ? s + fill : fill + s;
}

function scoreColor(score: number): string {
  if (score >= 80) return green;
  if (score >= 65) return cyan;
  if (score >= 50) return "";
  if (score >= 36) return yellow;
  return red;
}

function flagBadge(flag: string): string {
  if (flag === "too-similar") return `${red}⚠ too similar${reset}`;
  if (flag === "borderline") return `${yellow}~ borderline${reset}`;
  return `${green}✓ diverging${reset}`;
}

function main() {
  const matrix: Array<{
    archetype: string;
    matches: Map<string, StrainMatch>;
  }> = [];

  for (const arche of ARCHETYPES) {
    const result = analyze([...STRESS_STRAINS], arche.profile, []);
    const matches = new Map<string, StrainMatch>();
    for (const m of result.recommendations) {
      matches.set(m.strainName.toLowerCase(), m);
    }
    matrix.push({ archetype: arche.key, matches });
  }

  // Build per-strain rows
  const rows: StrainRow[] = [];
  for (const strain of STRESS_STRAINS) {
    const byArchetype: Record<string, PerStrainPerArchetype> = {};
    const scores: number[] = [];
    const explanations: string[] = [];
    const whys: string[] = [];
    const risks: string[] = [];
    let known = true;

    for (const cell of matrix) {
      const m = cell.matches.get(strain.toLowerCase());
      if (!m) continue;
      known = m.knownStrain;
      byArchetype[cell.archetype] = {
        matchScore: m.matchScore,
        category: m.category,
        confidence: m.confidence,
        knownStrain: m.knownStrain,
        whyItFits: m.whyItFits,
        riskNotes: m.riskNotes,
        explanation: m.explanation,
      };
      scores.push(m.matchScore);
      explanations.push(m.explanation);
      whys.push(m.whyItFits);
      risks.push(m.riskNotes);
    }

    rows.push({
      strain,
      byArchetype,
      scoreSpread: scores.length ? Math.max(...scores) - Math.min(...scores) : 0,
      divergence: classifyDivergence(explanations),
      divergenceWhy: classifyDivergence(whys),
      divergenceRisk: classifyDivergence(risks),
    });
    // Track unknown for label
    if (!known) byArchetype.__unknown__ = byArchetype.__unknown__ ?? (undefined as never);
  }

  printHeader();
  printScoreMatrix(rows);
  printCalibrationSummary(rows);
  printDivergenceSummary(rows);
  printRepeatedPhrases(rows);

  const snapshotPath = writeSnapshot(rows);
  console.log(`\n${dim}Snapshot:${reset} ${snapshotPath}`);
  console.log(`${dim}Diff vs last commit:${reset} git diff ${snapshotPath}\n`);
}

function printHeader() {
  console.log(
    `\n${bold}SOMA stress-test${reset} — ` +
      `${ARCHETYPES.length} archetypes × ${STRESS_STRAINS.length} strains\n`,
  );
}

function printScoreMatrix(rows: StrainRow[]) {
  console.log(`${bold}SCORE MATRIX${reset}`);
  const archeKeys = ARCHETYPES.map((a) => a.key);
  const nameW = 22;
  const colW = 9;
  // Header
  process.stdout.write(pad("", nameW));
  for (const k of archeKeys) process.stdout.write(pad(k.slice(0, colW - 1), colW, "right"));
  process.stdout.write("\n");
  process.stdout.write(pad("", nameW));
  for (const _ of archeKeys) process.stdout.write(pad("─".repeat(colW - 1), colW, "right"));
  process.stdout.write("\n");

  for (const row of rows) {
    const sampleCell = Object.values(row.byArchetype)[0];
    const tag = sampleCell?.knownStrain === false ? ` ${dim}[unknown]${reset}` : "";
    process.stdout.write(pad(`${row.strain}${tag}`, nameW + (tag ? 12 : 0)));
    for (const k of archeKeys) {
      const cell = row.byArchetype[k];
      if (!cell) {
        process.stdout.write(pad("—", colW, "right"));
        continue;
      }
      const colored = `${scoreColor(cell.matchScore)}${cell.matchScore}${reset}`;
      process.stdout.write(pad(colored, colW, "right"));
    }
    process.stdout.write("\n");
  }
  console.log();
}

function printCalibrationSummary(rows: StrainRow[]) {
  console.log(`${bold}SCORE SPREAD per strain${reset} ${dim}(max − min across archetypes)${reset}`);
  let total = 0;
  let collapsed = 0;
  for (const row of rows) {
    const spread = row.scoreSpread;
    total += spread;
    const verdict =
      spread >= 30
        ? `${green}★ strong divergence${reset}`
        : spread >= 15
          ? `${cyan}✓ healthy${reset}`
          : `${red}⚠ scores collapsed${reset}`;
    if (spread < 15) collapsed++;
    console.log(`  ${pad(row.strain, 22)} ${pad(String(spread) + "pt", 7, "right")}  ${verdict}`);
  }
  const mean = rows.length ? (total / rows.length).toFixed(1) : "0";
  console.log(`\n  Mean spread: ${bold}${mean}pt${reset}`);
  console.log(
    `  Strains with spread <15pt: ${
      collapsed > 0 ? red + collapsed + reset : green + "0" + reset
    } ${dim}(calibration concern if >0)${reset}\n`,
  );
}

function printDivergenceSummary(rows: StrainRow[]) {
  console.log(`${bold}SEMANTIC DIVERGENCE${reset} ${dim}(Jaccard on explanations, boilerplate stripped)${reset}`);
  console.log(
    `  ${pad("", 22)} ${pad("words", 7, "right")} ${pad("bigrams", 9, "right")}  verdict`,
  );
  for (const row of rows) {
    const d = row.divergence;
    console.log(
      `  ${pad(row.strain, 22)} ${pad(d.similarity.toFixed(2), 7, "right")} ${pad(d.similarityBigrams.toFixed(2), 9, "right")}  ${flagBadge(d.flag)}`,
    );
  }
  console.log(`\n  ${dim}words ≥0.80 = too similar, ≥0.65 borderline, <0.65 diverging${reset}\n`);
}

function printRepeatedPhrases(rows: StrainRow[]) {
  const explanations: string[] = [];
  for (const row of rows) {
    for (const cell of Object.values(row.byArchetype)) {
      if (cell && typeof cell === "object" && "explanation" in cell) {
        explanations.push(cell.explanation as string);
      }
    }
  }
  const total = explanations.length;
  const threshold = Math.max(4, Math.floor(total * 0.35));
  const repeats = repeatedBigrams(explanations, threshold).slice(0, 12);

  console.log(
    `${bold}REPEATED BIGRAMS${reset} ${dim}(appear in ≥${threshold}/${total} explanations)${reset}`,
  );
  if (repeats.length === 0) {
    console.log(`  ${green}none above threshold${reset}\n`);
    return;
  }
  for (const r of repeats) {
    const ratio = r.count / total;
    const tag =
      ratio >= 0.8
        ? `${red}boilerplate${reset}`
        : ratio >= 0.5
          ? `${yellow}heavy reuse${reset}`
          : `${dim}reuse${reset}`;
    console.log(`  ${pad('"' + r.phrase + '"', 30)} ${pad(String(r.count), 3, "right")}/${total}  ${tag}`);
  }
  console.log();
}

function writeSnapshot(rows: StrainRow[]): string {
  // Deterministic snapshot — no timestamps, stable key order.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const outDir = join(__dirname, "..", "..", "stress-snapshots");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "snapshot.json");

  const snapshot = {
    archetypes: ARCHETYPES.map((a) => ({
      key: a.key,
      label: a.label,
      description: a.description,
    })),
    strains: [...STRESS_STRAINS],
    rows: rows.map((row) => ({
      strain: row.strain,
      scoreSpread: row.scoreSpread,
      divergence: row.divergence,
      divergenceWhy: row.divergenceWhy,
      divergenceRisk: row.divergenceRisk,
      byArchetype: Object.fromEntries(
        ARCHETYPES.map((a) => {
          const c = row.byArchetype[a.key];
          if (!c) return [a.key, null];
          return [
            a.key,
            {
              matchScore: c.matchScore,
              category: c.category,
              confidence: c.confidence,
              knownStrain: c.knownStrain,
              whyItFits: c.whyItFits,
              riskNotes: c.riskNotes,
              explanation: stripBoilerplate(c.explanation),
            },
          ];
        }),
      ),
    })),
  };

  writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + "\n");
  return outPath;
}

main();

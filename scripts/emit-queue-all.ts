// Emit ALL remaining strains without a trace layer (no visibility filter) as
// JSON for the enrichment workflow.
import { STRAINS } from "../src/lib/strain-data";

const queue = STRAINS
  .filter((s) => ((s.traceAromas?.length ?? 0) + (s.traceFlavors?.length ?? 0)) === 0)
  .map((s) => ({
    name: s.name,
    type: s.type,
    primaryAromas: s.primaryAromas ?? [],
    primaryFlavors: s.primaryFlavors ?? [],
    aromas: s.aromas ?? [],
    flavors: s.flavors ?? [],
  }));

console.log(JSON.stringify(queue));

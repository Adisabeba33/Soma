import { findStrain } from "../src/lib/strain-data";
const NAMES = [
  "Gelato", "Millionaire", "Afternoon Delight #4", "Garlic Budder",
  "Gushlato", "Gluttony", "Fuel Pump", "Bonfire", "Gary Payton", "Runtz",
];
for (const n of NAMES) {
  const s = findStrain(n);
  if (!s) { console.log(`\n${n}: НЕ НАЙДЕН`); continue; }
  console.log(`\n${s.name}  [${s.type}, ${s.potency}]`);
  console.log(`  aromas:        ${(s.aromas ?? []).join(", ")}`);
  console.log(`  primaryAromas: ${(s.primaryAromas ?? []).join(", ") || "—"}`);
  console.log(`  flavors:       ${(s.flavors ?? []).join(", ")}`);
  console.log(`  primaryFlavors:${(s.primaryFlavors ?? []).join(", ") || "—"}`);
  console.log(`  traceAromas:   ${(s.traceAromas ?? []).join(", ") || "—"}`);
  console.log(`  traceFlavors:  ${(s.traceFlavors ?? []).join(", ") || "—"}`);
  console.log(`  effects:       ${(s.effects ?? []).join(", ")}`);
}

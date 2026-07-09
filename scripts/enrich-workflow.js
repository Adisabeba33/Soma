export const meta = {
  name: 'trace-enrichment',
  description: 'Web-verify faint trace notes for the catalog enrichment queue (research + adversarial verify)',
  phases: [
    { title: 'Research', detail: 'per-batch web research of faint notes' },
    { title: 'Verify', detail: 'independent skeptic prunes unconfirmed tags' },
  ],
}

const QUEUE_PATH = args.queuePath
const TOTAL = args.total
const BATCH = args.batchSize || 5
const AROMA_VOCAB = 'gassy, diesel, earthy, pine, citrus, sweet, fruity, berry, tropical, floral, herbal, spicy, woody, skunky, cheese, creamy, vanilla, mint, grape'
const FLAVOR_VOCAB = 'gassy, earthy, citrus, sweet, fruity, berry, tropical, pine, spicy, herbal, creamy, woody, nutty, mint, grape, vanilla, diesel, floral, cheese'

const SCHEMA = {
  type: 'object',
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          traceAromas: { type: 'array', items: { type: 'string' } },
          traceFlavors: { type: 'array', items: { type: 'string' } },
          sources: { type: 'array', items: { type: 'string' } },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['name', 'traceAromas', 'traceFlavors', 'sources', 'confidence'],
      },
    },
  },
  required: ['entries'],
}

const nBatches = Math.ceil(TOTAL / BATCH)
const batchIdx = Array.from({ length: nBatches }, (_, i) => i)
log(`Enriching ${TOTAL} strains in ${nBatches} batches of ${BATCH} (research → verify)`)

const researchPrompt = (start, end) => `You are enriching a cannabis strain catalog's FAINT-note layer against real-world sources.

Read the JSON file at ${QUEUE_PATH}. It is an array of strains, each: {name, type, primaryAromas, primaryFlavors, aromas, flavors}. Process ONLY the entries at array indices ${start} through ${end - 1} (inclusive). Ignore all others.

For EACH of those strains:
1. Web-search its real flavor/aroma profile (prefer Leafly, AllBud, breeder pages, terpene/lab reports). Do at least one real search per strain.
2. Identify only the FAINT / undertone / "hint of" / "on the exhale" notes — the third tier BELOW the strain's dominant and main secondary character. Do NOT propose a note that is the strain's dominant or already listed in its base \`aromas\`/\`flavors\` (those are given in the file — exclude them).
3. Map each faint note to the ALLOWED vocab ONLY. Drop anything that doesn't map.
   Aroma tokens: ${AROMA_VOCAB}
   Flavor tokens: ${FLAVOR_VOCAB}
4. Only include a token if a real source actually describes it as a light/undertone note. If unsure, omit it — precision over coverage. It is fine to return empty arrays for a strain that genuinely has no documented faint notes beyond what's already tagged.
5. Record the source URLs you actually used.

Return {entries:[{name, traceAromas, traceFlavors, sources, confidence}]} — one entry per strain you processed (indices ${start}..${end - 1}), names EXACTLY as in the file. confidence = your source-backed certainty.`

const verifyPrompt = (proposals) => `You are an adversarial fact-checker for cannabis strain FAINT-note tags. Someone proposed these trace-note enrichments:

${JSON.stringify(proposals)}

For EACH proposed token (in traceAromas / traceFlavors), independently web-search the strain and decide: does a real source (Leafly, AllBud, breeder, terpene report) actually describe THIS note as present — at least as a faint/undertone note — in this strain? Be strict:
- DROP any token you cannot confirm in ≥2 independent sources, OR that is actually the strain's DOMINANT note (too strong to be a "trace"), OR that reads like a hallucination.
- Keep only genuinely-supported faint notes. Vocab is fixed; do not add new tokens, only prune.
- Keep names EXACTLY as given.

Return the PRUNED {entries:[{name, traceAromas, traceFlavors, sources, confidence}]} with only confirmed tokens and the confirming source URLs. If a strain ends up with nothing confirmed, return it with empty arrays.`

const results = await pipeline(
  batchIdx,
  (i) => {
    const start = i * BATCH
    const end = Math.min(TOTAL, start + BATCH)
    return agent(researchPrompt(start, end), { label: `research:${start}-${end - 1}`, phase: 'Research', schema: SCHEMA })
  },
  (research, i) => {
    if (!research || !research.entries || research.entries.length === 0) return { entries: [] }
    const start = i * BATCH
    const end = Math.min(TOTAL, start + BATCH)
    return agent(verifyPrompt(research.entries), { label: `verify:${start}-${end - 1}`, phase: 'Verify', schema: SCHEMA })
  },
)

const all = []
for (const r of results) {
  if (r && Array.isArray(r.entries)) all.push(...r.entries)
}
log(`Collected ${all.length} verified strain entries`)
return { entries: all }

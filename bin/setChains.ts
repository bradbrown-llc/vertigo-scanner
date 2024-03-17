import { kv } from 'https://deno.land/x/vertigo@0.0.3/lib/mod.ts'

const chains = [
    50000n,
    50001n
]

for (const chain of chains)
    kv.set(['chains', chain], { lastUpdated: 0 })
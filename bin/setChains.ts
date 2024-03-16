import { kv } from '../lib/mod.ts'

const chains = [
    50000n,
    50001n
]

for (const chain of chains)
    kv.set(['chains', chain], { lastUpdated: 0 })
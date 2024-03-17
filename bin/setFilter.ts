import { kv, machineId } from 'https://deno.land/x/vertigo@0.0.3/lib/mod.ts'

kv.set(['filters', 50000n, machineId], {
    fromBlock: 0n,
    toBlock: -1n
})
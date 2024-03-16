import { kv, machineId } from '../lib/mod.ts'

kv.set(['filters', 50000n, machineId], {
    fromBlock: 0n,
    toBlock: -1n
})
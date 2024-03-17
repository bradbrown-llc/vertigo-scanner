import { KvCacheEntry } from '../types/mod.ts'
import { kv, machineId } from '../lib/mod.ts'

kv.set(['delay', machineId], { value: 500, expireIn: 1000 } as KvCacheEntry<number>)
kv.set(['kvRlbDelay', machineId], { value: 50, expireIn: 1000 } as KvCacheEntry<number>)
kv.set(['kvRlbLim', machineId], { value: 1, expireIn: 1000 } as KvCacheEntry<number>)
kv.set(['evmRlbDelay', machineId], { value: 75, expireIn: 1000 } as KvCacheEntry<number>)
kv.set(['evmRlbLim', machineId], { value: 1, expireIn: 1000 } as KvCacheEntry<number>)
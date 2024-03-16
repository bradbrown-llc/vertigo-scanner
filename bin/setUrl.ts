import { kv, machineId } from '../lib/mod.ts'

kv.set(['url', 50000n, machineId], 'http://localhost:50003')
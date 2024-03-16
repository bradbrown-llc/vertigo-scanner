import { kv, machineId } from '../lib/mod.ts'

kv.set(['kvRlbDelay', machineId], 100)
kv.set(['kvRlbLim', machineId], 1)
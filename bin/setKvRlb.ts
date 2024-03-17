import { kv, machineId } from 'https://deno.land/x/vertigo@0.0.3/lib/mod.ts'

kv.set(['kvRlbDelay', machineId], 100)
kv.set(['kvRlbLim', machineId], 1)
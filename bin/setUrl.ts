import { kv, machineId } from 'https://deno.land/x/vertigo@0.0.3/lib/mod.ts'

kv.set(['url', 50000n, machineId], 'http://localhost:50003')
import { kv } from '../lib/mod.ts'

const list = kv.list<unknown>({ prefix: [] })

const keys:Deno.KvKey[] = []

for (let i = 0;; i++) {
    
    const result = await list.next().catch(() => null)
    if (result?.done) console.log(`purge: entry retrieval complete, entry count ${i}`)
    if (!result || result.done) break
    const entry = result.value
    const key = entry.key
    keys.push(key)

}

const atom = kv.atomic()
for (const key of keys) atom.delete(key)
const result = await atom.commit().catch(() => null)
if (result === null) console.error(`purge: purge commit request failure`)
else if (!result.ok) console.error(`purge: purge commit failure`)
else console.log(`purge: purge commit success`)
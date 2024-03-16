import { KvChain, Chain, Filter } from '../types/mod.ts'
import { kvIterate, kvGet, kvSet } from './mod.ts'

export async function getStalestChain():Promise<Chain|null> {

    let stalestEntry:Deno.KvEntry<KvChain>|undefined

    for await (const entry of kvIterate<KvChain>(['chains'])) {

        if (!stalestEntry) stalestEntry = entry

        if (entry.value.lastUpdated < stalestEntry.value.lastUpdated)
            stalestEntry = entry

    }

    if (!stalestEntry) return null

    stalestEntry.value.lastUpdated = Date.now()

    const chainId = stalestEntry.key[1] as bigint

    await kvSet(['chains', chainId], stalestEntry.value)

    let filter = await kvGet<Filter>(['filters', chainId])

    if (!filter) filter = { fromBlock: 0n, toBlock: -1n }

    const stalestChain:Chain = { ...stalestEntry.value, filter, chainId }

    return stalestChain

}
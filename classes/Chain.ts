import * as ejra from 'https://deno.land/x/ejra@0.2.1/mod.ts'
import { KvChain, KvFilter, LogLevel } from '../types/mod.ts'
import { Filter, Logger } from './mod.ts'
import { kvGet, kvSet, kvIterate, machineId, evmRlb as rlb } from '../lib/mod.ts'

export class Chain {

    chainId:bigint

    constructor(chainId:bigint) { this.chainId = chainId }

    static async stalest():Promise<Chain|null> {

        // create variable to hold the stalest KvEntry<KvChain>
        let stalestEntry:Deno.KvEntry<KvChain>|undefined

        // iterate through KvChains
        for await (const entry of kvIterate<KvChain>(['chains'])) {

            // update stalest to the first entry if it's not set
            if (!stalestEntry) stalestEntry = entry

            // update stalest to new entry if entry is more stale
            if (entry.value.lastUpdated < (stalestEntry.value.lastUpdated))
                stalestEntry = entry

        }

        // if, after iterating, there's no stalestEntry, return null
        if (!stalestEntry) return null

        // create a chain class from the chainId (key index 1), assume type
        const chain = new Chain(stalestEntry.key[1] as bigint)

        // update the chain
        await chain.update()

        // return the chain
        return chain

    }

    async confirmations():Promise<bigint|null|undefined> {

        // try to get the confirmations needed for this chain
        const confirmations = await kvGet<bigint>(['confirmations', this.chainId])

        // return null if above fails
        if (confirmations === null) return null

        // return confirmations if it exists or undefined if it does not
        return confirmations

    }

    async active():Promise<boolean|null> {

        // try to get the KvChain for this chainId
        const kvChain = await kvGet<KvChain>(['chains', this.chainId])

        // return null if above fails
        if (kvChain === null) return null

        // return true if it exists or false if it does not
        return kvChain !== undefined

    }

    async filter():Promise<null|false|Filter> {

        // try to get the filter object for this chain and machine
        const kvFilter = await kvGet<KvFilter>(['filters', this.chainId, machineId])

        // return null if the above fails
        if (kvFilter === null) return null
        
        // convert kvFilter into a filter class, new if undefined
        const filter = new Filter(kvFilter)
    
        // if the filter is at least one block wide, return it
        if (filter.width > 0n) return filter

        // otherwise, get the current height of the chain
        const height = await this.height()

        // if that failed, return null, we cannot determine a filter
        if (!height) return null

        // update the height of the filter in memory
        filter.toBlock = height

        // if the filter isn't at least one block wide, return false
        if (filter.width <= 0) return false
    
        // try to ensure that the filter width doesn't exceed the max, if applicable
        await filter.clip(this)

        // update the filter in KV
        await filter.update(this)

        // return filter
        return filter

    }

    async update():Promise<void> {

        // create a new KvChain object
        const kvChain:KvChain = { lastUpdated: Date.now() }

        // make an attempt to upate it
        await kvSet(['chains', this.chainId], kvChain)

    }

    async url():Promise<string|null|undefined> {

        // attempt to get the node url for this chain and machine
        const url = await kvGet<string>(['url', this.chainId, machineId])

        // return null if above fails
        if (url === null) return null

        // return the url or undefined if it doesn't exist
        return url

    }

    async height():Promise<bigint|null> {
    
        // get the url for this chain and machine
        const url = await this.url()
        
        // if this fails, return null
        if (!url) return null
    
        // attempt to get the height, wrap with Logger
        Logger.debug(`Chain: getting height of chain ${this.chainId}`)
        const height = await Logger.wrap(
            ejra.methods.height({ url, rlb }),
            `Chain: failed to retrieve chain ${this.chainId} height`,
            LogLevel.DETAIL,
            `Chain: successfully retrieved chain ${this.chainId} height`
        )
    
        // return height or null if above fails
        return height

    }

    async logs():Promise<ejra.types.Log[]|null|false> {

        // get the url for this chain and machine
        const url = await this.url()
        
        // if this fails, return null
        if (!url) return null

        // get the filter for this chain and machine
        const filter = await this.filter()

        // return filter if false or null
        if (!filter) return filter
    
        // attempt to get the burn logs, wrap with Logger
        Logger.debug(`Chain: getting height of chain ${this.chainId}`)
        const logs = await Logger.wrap(
            ejra.methods.logs({
                url, rlb,
                filter: {
                    ...filter,
                    topics: [Deno.env.get('BRIDGE_BURN_TOPIC') as string],
                    address: Deno.env.get('BRIDGE_TOKEN_ADDRESS') as string
                }
            }),
            `Chain: failed to retrieve chain ${this.chainId} height`,
            LogLevel.DETAIL,
            `Chain: successfully retrieved chain ${this.chainId} height`
        )

        // if above request fails, bisect the filter and update it
        if (logs === null) await filter.bisect(this)

        // if the above request succeeds, bump the filter (move it forward)
        filter.bump(this)

        // return logs or null if above fails
        return logs

    }

}
import { Chain } from './mod.ts'
import { kvGet, kvSet, machineId } from '../lib/mod.ts'

export class Filter {

    fromBlock:bigint
    toBlock:bigint

    constructor(filter?:{ fromBlock:bigint, toBlock:bigint }) {

        // set the fromBlock to the filter object's, or 0n if no given filter
        this.fromBlock = filter ? filter.fromBlock : 0n

        // set the fromBlock to the filter object's, or -1n if no given filter
        this.toBlock = filter ? filter.toBlock : -1n

    }

    /**
     * Return the width of the filter
     */
    get width():bigint { return this.toBlock - this.fromBlock + 1n }

    async update(chain:Chain):Promise<void> {

        // make an attempt to upate the filter
        await kvSet(['filters', chain.chainId, machineId], this)

    }

    async clip(chain:Chain):Promise<void> {

        // get the chain's url
        const url = await chain.url()

        // return if the above fails or is not set
        if (!url) return

        // get the max width for this url
        const max = await kvGet<bigint>(['filterMaxWidth', url])

        // return if the above fails or is not set
        if (!max) return

        // clip width to max if applicable
        if (this.width > max) this.toBlock = this.fromBlock + max - 1n

    }

    async bisect(chain:Chain):Promise<void> {

        // halve the width of the filter while keeping fromBlock the same
        this.toBlock = this.fromBlock + (this.toBlock - this.fromBlock) / 2n

        // update the filter
        await this.update(chain)

    }

    async bump(chain:Chain):Promise<void> {

        // move the filter forward
        // doing this will force the scanner to get the current height
        this.fromBlock = this.toBlock + 1n

        // update the filter
        await this.update(chain)

    }

}
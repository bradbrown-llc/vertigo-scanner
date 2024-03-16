import { Chain } from '../types/mod.ts'
import { getHeight, kvSet } from './mod.ts'

export async function vouchFilter(chain:Chain) {

    const { filter, chainId } = chain
    const { fromBlock, toBlock } = filter
    
    if (toBlock >= fromBlock) return true

    const height = await getHeight(chain)
    if (!height) return null

    if (height < fromBlock) return false

    filter.toBlock = height

    await kvSet(['filters', chainId], filter)

}
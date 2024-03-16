import * as ejra from 'https://deno.land/x/ejra@0.2.1/mod.ts'
import { Chain, LogLevel } from '../types/mod.ts'
import { Logger } from '../classes/mod.ts'
import { kvGet, machineId, evmRlb as rlb } from './mod.ts'

export async function getHeight(chain:Chain):Promise<bigint|null> {
    
    const url = await kvGet<string>(['rpc', chain.chainId, machineId])
    if (!url) return null

    Logger.debug(`getHeight: getting height of chain ${chain.chainId}`)

    const height = await Logger.wrap(
        ejra.methods.height({ url, rlb }),
        `getHeight, failed to retrieve chain ${chain.chainId} height`,
        LogLevel.DEBUG,
        `getHeight, successfully retrieved chain ${chain.chainId} height`
    )

    if (height === null) return null

    return height

}
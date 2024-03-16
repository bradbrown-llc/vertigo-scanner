import * as ejra from 'https://deno.land/x/ejra@0.2.1/mod.ts'
import { Chain, LogLevel } from '../types/mod.ts'
import { Logger } from '../classes/mod.ts'
import { kvGet, kvSet, machineId, evmRlb as rlb } from './mod.ts'

export async function getLogs(chain:Chain) {

    const { filter, chainId } = chain
    const { fromBlock, toBlock } = filter

    const url = await kvGet<string>(['rpc', chainId, machineId])
    if (!url) return null

    const filterStr = JSON.stringify(filter,(_,v)=>typeof v=='bigint'?''+v:v)

    Logger.debug(`getLogs: chain ${chainId} filter ${filterStr} request sent`)

    const logs = await Logger.wrap(
        ejra.methods.logs({ url, rlb, filter: filter }),
        `getLogs: chain ${chainId} filter ${filterStr} request failure`,
        LogLevel.DETAIL,
        `getLogs: chain ${chainId} filter ${filterStr} request success`
    )

    if (!logs) filter.toBlock = fromBlock + (toBlock - fromBlock) / 2n
    else filter.fromBlock = toBlock + 1n

    await kvSet(['filters', chainId], filter)

    return logs
    
}
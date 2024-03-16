import { LogLevel } from '../types/mod.ts'
import { Logger, Cache } from '../classes/mod.ts'
import { kv, kvRlb as rlb } from './mod.ts'

export async  function kvGetMany<
    T extends readonly unknown[]
>(
    keys: { [P in keyof T]: Deno.KvKey } 
):Promise<null|{ [P in keyof T]: T[P]|undefined }> {

    const getMany = kv.getMany<T>

    Logger.detail(`kvGet: keys [${keys.map(key => `[${key}]`)}] request sent`)

    rlb.delay = await Cache.get('kvRlbDelay')
    rlb.lim = await Cache.get('kvRlbLim')

    const result = await Logger.wrap(
        // ts error due to below, but i respectfully disagree
        // Awaited<{ [P in ...] }> != { P in ... }
        // @ts-ignore 1
        rlb.regulate({ fn: getMany.bind(kv), args: [keys] as const }),
        `kvGet: keys [${keys.map(key => `[${key}]`)}] request failure`,
        LogLevel.DETAIL,
        `kvGet: keys [${keys.map(key => `[${key}]`)}] request success`
    )

    if (result === null) return null

    return result.map(kvem => {
        return kvem.value ?? undefined
    }) as { [P in keyof T]: T[P]|undefined }

}
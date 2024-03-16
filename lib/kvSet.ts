import { LogLevel } from '../types/mod.ts'
import { Logger } from '../classes/mod.ts'
import { kv, kvRlb as rlb } from './mod.ts'

export async  function kvSet<T>(key:Deno.KvKey, value:T):Promise<true|null> {

    const set = kv.set

    Logger.detail(`kvSet: key ${key} value ${value} set request sent`)

    const result = await Logger.wrap(
        rlb.regulate({ fn: set.bind(kv), args: [key, value] as const }),
        `kvSet: key ${key} value ${value} set failure`,
        LogLevel.DETAIL,
        `kvSet: key ${key} value ${value} set success`
    )

    return result?.ok ?? null

}
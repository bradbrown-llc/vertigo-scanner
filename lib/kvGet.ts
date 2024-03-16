import { LogLevel } from '../types/mod.ts'
import { Logger } from '../classes/mod.ts'
import { kv, kvRlb as rlb } from './mod.ts'

export async  function kvGet<T>(key:Deno.KvKey):Promise<T|null> {

    const get = kv.get<T>

    Logger.debug(`kvGet: key ${key} request sent`)

    const result = await Logger.wrap(
        rlb.regulate({ fn: get.bind(kv), args: [key] as const }),
        `kvGet: key ${key} request failure`,
        LogLevel.DETAIL,
        `kvGet: key ${key} request success`
    )

    return result?.value ?? null

}
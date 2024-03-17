import { LogLevel } from 'https://deno.land/x/vertigo@0.0.3/types/mod.ts'
import { Logger, Chain, Burn, Cache } from 'https://deno.land/x/vertigo@0.0.3/classes/mod.ts'
import { sleep } from 'https://deno.land/x/vertigo@0.0.3/lib/mod.ts'

Cache.set('level', LogLevel.DETAIL)

while (true) {

    const delay = await Cache.get('delay')
    await Logger.info(`scan: sleeping for ${delay / 1000}s`)
    await sleep(delay)

    // get stalest chain or continue
    const chain = await Chain.stalest()
    if (!chain) { await Logger.warn('scan: no chains found'); continue }
    await Logger.info(`scan: picked chain ${chain.chainId}`)

    // get logs or continue
    const logs = await chain.logs()
    if (!logs) continue
    await Logger.info(`scan: chain ${chain.chainId} ${logs.length} logs found`)

    // for each log
    logs.forEach(async log => {

        // create a burn
        const burn = new Burn({ chain, log })

        // try to claim the burn, return
        if (!await burn.claim()) {
            await Logger.info(`scan: unable to claim burn ${burn.id}`)
            return
        }
        await Logger.info(`scan: claimed burn ${burn.id}`)

        // check if the burn's destination chain is active
        const active = await burn.destination.active()
        
        // if it isn't, archive the burn
        if (active === false) {
            await burn.set('archive')
            await Logger.info(`scan: set burn ${burn.id} archive`)
        }

        // if it is, mark the burn as finalizable
        if (active === true) {
            await burn.set('finalizable')
            await Logger.info(`scan: set burn ${burn.id} finalizable`)
        }

        // unclaim the burn
        const unclaim = await burn.unclaim()
        if (!unclaim) await Logger.warn(`scan: unclaim request for ${burn.id} failed`)
        else await Logger.info(`scan: unclaimed burn ${burn.id}`)

    })

}
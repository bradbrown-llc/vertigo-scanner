import { LogLevel } from './types/mod.ts'
import { Logger, Chain, Burn, Cache } from './classes/mod.ts'
import { sleep } from './lib/mod.ts'

Cache.set('level', LogLevel.DETAIL)

while (true) {

    const delay = await Cache.get('delay')
    Logger.info(`scan: sleeping for ${delay / 1000}s`)
    await sleep(delay)

    // get stalest chain or continue
    const chain = await Chain.stalest()
    if (!chain) { Logger.warn('scan: no chains found'); continue }
    Logger.info(`scan: picked chain ${chain.chainId}`)

    // get logs or continue
    const logs = await chain.logs()
    if (!logs) continue
    Logger.info(`scan: chain ${chain.chainId} ${logs.length} logs found`)

    // for each log
    logs.forEach(async log => {

        // create a burn
        const burn = new Burn({ chain, log })

        // try to claim the burn, return
        if (!await burn.claim()) {
            Logger.info(`scan: unable to claim burn ${burn.id}`)
            return
        }
        Logger.info(`scan: claimed burn ${burn.id}`)

        // check if the burn's destination chain is active
        const active = await burn.destination.active()
        
        // if it isn't, archive the burn
        if (active === false) {
            await burn.set('archive')
            Logger.info(`scan: set burn ${burn.id} archive`)
        }

        // if it is, mark the burn as finalizable
        if (active === true) {
            await burn.set('finalizable')
            Logger.info(`scan: set burn ${burn.id} finalizable`)
        }

        // unclaim the burn
        const unclaim = await burn.unclaim()
        if (!unclaim) Logger.warn(`scan: unclaim request for ${burn.id} failed`)
        else Logger.info(`scan: unclaimed burn ${burn.id}`)

    })

}
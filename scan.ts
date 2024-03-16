import { Chain, Burn, Cache } from './classes/mod.ts'
import { sleep } from './lib/mod.ts'

while (true) {

    // get stalest chain or continue
    const chain = await Chain.stalest()
    if (!chain) continue

    // get logs or continue
    const logs = await chain.logs()
    if (!logs) continue

    // for each log
    logs.forEach(async log => {

        // create a burn
        const burn = new Burn({ chain, log })

        // try to claim the burn, return
        if (!await burn.claim()) return

        // check if the burn's destination chain is active
        const active = await burn.destination.active()
        
        // if it isn't, archive the burn
        if (active === false) await burn.set('archive')

        // if it is, mark the burn as finalizable
        if (active === true) await burn.set('finalizable')

        // unclaim the burn
        await burn.unclaim()

    })

    await sleep(await Cache.get('delay'))

}
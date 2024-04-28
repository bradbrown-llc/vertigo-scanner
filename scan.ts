import { Chain } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.16/lib/Chain.ts'
import { Burn } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.16/lib/Burn.ts'
import { kvv } from './lib/kvv.ts'
import { ejra } from './lib/ejra.ts'
import { err } from './lib/err.ts'
import { out } from './lib/out.ts'
import { config } from './config.ts'

const { process, address, topic } = config

async function handleBurn(burn:Burn) {
    const active = await burn.destinationActive()
    const state = await burn.state()
    if (state === null && active === true) await burn.move('finalizable')
    if (state === null && active === false) await burn.move('archive')
    await burn.unclaim(process)
}

while (true) {

    const processing = await Burn.nextProcessing(process, kvv, ejra, { err, out })
    if (processing instanceof Burn) { await handleBurn(processing); continue }

    const chain = await Chain.stalest(kvv, ejra, { err, out })
    if (chain === null) continue
    const logs = await chain.logs(address, [topic], process)
    if (logs instanceof Error) continue
    for (const log of logs) {
        const burn = Burn.fromEvent(chain, log, { err, out })
        const claimed = await burn.claim(process)
        if (!claimed || claimed instanceof Error) continue
        await handleBurn(burn)
    }

}
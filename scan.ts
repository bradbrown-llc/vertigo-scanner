import { Chain } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.5/lib/Chain.ts'
import { Burn } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.5/lib/Burn.ts'
import { kvv } from './lib/kvv.ts'
import { ejra } from './lib/ejra.ts'
import { processId } from './lib/processId.ts'
import { tokenAddress } from './lib/tokenAddress.ts'
import { burnTopics } from './lib/burnTopics.ts'
import { err } from './lib/err.ts'
import { out } from './lib/out.ts'

async function handleBurn(burn:Burn) {
    const active = await burn.destinationActive()
    const state = await burn.state()
    if (state === null && active === true) await burn.move('finalizable')
    if (state === null && active === false) await burn.move('archive')
    await burn.unclaim(processId)
}

while (true) {

    const processing = await Burn.nextProcessing(processId, kvv, ejra, { err, out })
    if (processing instanceof Burn) { await handleBurn(processing); continue }

    const chain = await Chain.stalest(kvv, ejra, { err, out })
    if (chain === null) continue
    const logs = await chain.logs(tokenAddress, burnTopics, processId)
    if (logs instanceof Error) continue
    for (const log of logs) {
        const burn = Burn.fromEvent(chain, log, { err, out })
        const claimed = await burn.claim(processId)
        if (!claimed || claimed instanceof Error) continue
        await handleBurn(burn)
    }

}
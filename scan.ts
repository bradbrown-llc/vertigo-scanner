import { Burn } from './classes/mod.ts'
import { getStalestChain, vouchFilter, getLogs } from './lib/mod.ts'

while (true) {

    const chain = await getStalestChain()
    if (!chain) continue

    if (!await vouchFilter(chain)) continue

    const logs = await getLogs(chain)
    if (!logs) continue

    const burns = await Burn.from(logs)

    for (const burn of burns) await burn.moveState({ to: 'hold' })

}
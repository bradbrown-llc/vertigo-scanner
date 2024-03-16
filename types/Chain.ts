import { KvChain, Filter } from './mod.ts'

export type Chain = {
    filter:Filter
    chainId:bigint
} & KvChain
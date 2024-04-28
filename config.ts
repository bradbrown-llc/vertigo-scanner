import jsSha3 from "npm:js-sha3@0.9.2";
const { keccak256 } = jsSha3;

export const config = {
  topic: `0x${keccak256('Burn(uint256,address,uint256,uint64)')}`,
  address: '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe',
  process: '1834abff7d70eed0d5ad13aa3df0d08fdd53ce7250fd92805aa4dee7deb74d9d'
}
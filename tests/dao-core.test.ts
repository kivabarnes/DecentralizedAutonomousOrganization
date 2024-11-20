;; tests/dao-core_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can join and leave the DAO",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('dao-core', 'join-dao', [], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    let result = chain.callReadOnlyFn('dao-core', 'is-member', [types.principal(wallet1.address)], wallet1.address);
    assertEquals(result.result, 'true');
    
    block = chain.mineBlock([
      Tx.contractCall('dao-core', 'leave-dao', [], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    result = chain.callReadOnlyFn('dao-core', 'is-member', [types.principal(wallet1.address)], wallet1.address);
    assertEquals(result.result, 'false');
  },
});

;; tests/proposal-voting_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can submit proposals, vote, and execute proposals",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Join DAO
    let block = chain.mineBlock([
      Tx.contractCall('dao-core', 'join-dao', [], wallet1.address),
      Tx.contractCall('dao-core', 'join-dao', [], wallet2.address),
    ]);
    
    // Submit proposal
    block = chain.mineBlock([
      Tx.contractCall('proposal-voting', 'submit-proposal', [
        types.ascii("Test Proposal"),
        types.ascii("This is a test proposal"),
        types.uint(10)
      ], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u1)');
    
    // Vote on proposal
    block = chain.mineBlock([
      Tx.contractCall('proposal-voting', 'vote', [types.uint(1), types.bool(true)], wallet1.address),
      Tx.contractCall('proposal-voting', 'vote', [types.uint(1), types.bool(true)], wallet2.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    assertEquals(block.receipts[1].result, '(ok true)');
    
    // Mine blocks to end voting period
    chain.mineEmptyBlockUntil(20);
    
    // Execute proposal
    block = chain.mineBlock([
      Tx.contractCall('proposal-voting', 'execute-proposal', [types.uint(1)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
  },
});

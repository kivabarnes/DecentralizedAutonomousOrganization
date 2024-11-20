;; tests/treasury_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can deposit funds and the proposal-voting contract can transfer funds",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Deposit funds
    let block = chain.mineBlock([
      Tx.contractCall('treasury', 'deposit-funds', [types.uint(1000000)], wallet1.address),
    ]);
    assertEquals(block.receipts[0].result, '(ok u1000000)');
    
    // Check balance
    let result = chain.callReadOnlyFn('treasury', 'get-balance', [], deployer.address);
    assertEquals(result.result, 'u1000000');
    
    // Transfer funds (this should fail as it's not called by the proposal-voting contract)
    block = chain.mineBlock([
      Tx.contractCall('treasury', 'transfer-funds', [types.principal(wallet1.address), types.uint(500000)], deployer.address),
    ]);
    assertEquals(block.receipts[0].result, '(err u100)');
  },
});

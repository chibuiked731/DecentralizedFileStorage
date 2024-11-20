;; tests/storage-provider-incentives_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that storage providers can stake, earn rewards, and unstake",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Mint tokens for wallet1
    let block = chain.mineBlock([
      Tx.contractCall('storage-provider-incentives', 'mint', [
        types.uint(1000),
        types.principal(wallet1.address)
      ], deployer.address)
    ]);
    
    // Stake tokens
    block = chain.mineBlock([
      Tx.contractCall('storage-provider-incentives', 'stake-tokens', [
        types.uint(500)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Check stake
    let result = chain.callReadOnlyFn('storage-provider-incentives', 'get-provider-stake', [
      types.principal(wallet1.address)
    ], deployer.address);
    assertEquals(result.result, '(ok u500)');
    
    // Reward provider (this would normally be called by the file management contract)
    block = chain.mineBlock([
      Tx.contractCall('storage-provider-incentives', 'reward-provider', [
        types.principal(wallet1.address),
        types.uint(100)
      ], deployer.address)
    ]);
    
    // Claim rewards
    block = chain.mineBlock([
      Tx.contractCall('storage-provider-incentives', 'claim-rewards', [], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok u100)');
    
    // Unstake tokens
    block = chain.mineBlock([
      Tx.contractCall('storage-provider-incentives', 'unstake-tokens', [
        types.uint(250)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Check final stake
    result = chain.callReadOnlyFn('storage-provider-incentives', 'get-provider-stake', [
      types.principal(wallet1.address)
    ], deployer.address);
    assertEquals(result.result, '(ok u250)');
  },
});

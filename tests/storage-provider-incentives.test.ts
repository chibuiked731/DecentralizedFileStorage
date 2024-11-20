;; tests/stacks-storage-integration_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can register and update Gaia hubs",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    
    // Register Gaia hub
    let block = chain.mineBlock([
      Tx.contractCall('stacks-storage-integration', 'register-gaia-hub', [
        types.ascii("https://hub.example.com")
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Get Gaia hub
    let result = chain.callReadOnlyFn('stacks-storage-integration', 'get-gaia-hub', [
      types.principal(wallet1.address)
    ], wallet1.address);
    assertEquals(result.result, '(some "https://hub.example.com")');
    
    // Update Gaia hub
    block = chain.mineBlock([
      Tx.contractCall('stacks-storage-integration', 'update-gaia-hub', [
        types.ascii("https://newhub.example.com")
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Get updated Gaia hub
    result = chain.callReadOnlyFn('stacks-storage-integration', 'get-gaia-hub', [
      types.principal(wallet1.address)
    ], wallet1.address);
    assertEquals(result.result, '(some "https://newhub.example.com")');
    
    // Remove Gaia hub
    block = chain.mineBlock([
      Tx.contractCall('stacks-storage-integration', 'remove-gaia-hub', [], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Verify Gaia hub is removed
    result = chain.callReadOnlyFn('stacks-storage-integration', 'get-gaia-hub', [
      types.principal(wallet1.address)
    ], wallet1.address);
    assertEquals(result.result, 'none');
  },
});

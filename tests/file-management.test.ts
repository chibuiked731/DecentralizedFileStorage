import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can upload, access, and delete files",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Upload a file
    let block = chain.mineBlock([
      Tx.contractCall('file-management', 'upload-file', [
        types.ascii("test.txt"),
        types.uint(1024),
        types.buff(Buffer.from("0123456789abcdef0123456789abcdef")),
        types.buff(Buffer.from("00112233445566778899aabbccddeeff")),
        types.principal(wallet2.address)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok u1)');
    
    // Grant access to wallet2
    block = chain.mineBlock([
      Tx.contractCall('file-management', 'grant-access', [
        types.uint(1),
        types.principal(wallet2.address)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Check access
    let result = chain.callReadOnlyFn('file-management', 'check-access', [
      types.uint(1),
      types.principal(wallet2.address)
    ], wallet1.address);
    assertEquals(result.result, 'true');
    
    // Revoke access
    block = chain.mineBlock([
      Tx.contractCall('file-management', 'revoke-access', [
        types.uint(1),
        types.principal(wallet2.address)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Delete file
    block = chain.mineBlock([
      Tx.contractCall('file-management', 'delete-file', [types.uint(1)], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
  },
});

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/storage-provider-incentives.clar', 'utf8')

describe('Storage Provider Incentives Contract', () => {
  it('should define error constant', () => {
    expect(contractSource).toContain('(define-constant err-unauthorized (err u102))')
  })
  
  it('should define storage-token fungible token', () => {
    expect(contractSource).toContain('(define-fungible-token storage-token)')
  })
  
  it('should define provider-stakes map', () => {
    expect(contractSource).toContain('(define-map provider-stakes principal uint)')
  })
  
  it('should define provider-rewards map', () => {
    expect(contractSource).toContain('(define-map provider-rewards principal uint)')
  })
  
  it('should have a stake-tokens function', () => {
    expect(contractSource).toContain('(define-public (stake-tokens (amount uint))')
  })
  
  it('should update provider stake in stake-tokens function', () => {
    expect(contractSource).toContain('(map-set provider-stakes provider (+ current-stake amount))')
  })
  
  it('should have an unstake-tokens function', () => {
    expect(contractSource).toContain('(define-public (unstake-tokens (amount uint))')
  })
  
  it('should check for sufficient stake in unstake-tokens function', () => {
    expect(contractSource).toContain('(asserts! (>= current-stake amount) err-unauthorized)')
  })
  
  it('should update provider stake in unstake-tokens function', () => {
    expect(contractSource).toContain('(map-set provider-stakes provider (- current-stake amount))')
  })
  
  it('should have a reward-provider function', () => {
    expect(contractSource).toContain('(define-public (reward-provider (provider principal) (amount uint))')
  })
  
  it('should update provider rewards in reward-provider function', () => {
    expect(contractSource).toContain('(map-set provider-rewards provider (+ current-reward amount))')
  })
  
  it('should have a get-provider-stake read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-provider-stake (provider principal))')
  })
  
  it('should have a get-provider-rewards read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-provider-rewards (provider principal))')
  })
})


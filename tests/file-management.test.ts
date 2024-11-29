import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/file-management.clar', 'utf8')

describe('File Management Contract', () => {
  it('should define contract-owner constant', () => {
    expect(contractSource).toContain('(define-constant contract-owner tx-sender)')
  })
  
  it('should define error constants', () => {
    expect(contractSource).toContain('(define-constant err-owner-only (err u100))')
    expect(contractSource).toContain('(define-constant err-not-found (err u101))')
    expect(contractSource).toContain('(define-constant err-unauthorized (err u102))')
  })
  
  it('should define next-file-id data variable', () => {
    expect(contractSource).toContain('(define-data-var next-file-id uint u1)')
  })
  
  it('should define files map', () => {
    expect(contractSource).toContain('(define-map files uint {')
    expect(contractSource).toContain('owner: principal,')
    expect(contractSource).toContain('name: (string-ascii 100),')
    expect(contractSource).toContain('size: uint')
  })
  
  it('should define file-access-control map', () => {
    expect(contractSource).toContain('(define-map file-access-control {file-id: uint, user: principal} bool)')
  })
  
  it('should have an upload-file function', () => {
    expect(contractSource).toContain('(define-public (upload-file (name (string-ascii 100)) (size uint))')
  })
  
  it('should set file details in upload-file function', () => {
    expect(contractSource).toContain('(map-set files file-id {')
    expect(contractSource).toContain('owner: tx-sender,')
    expect(contractSource).toContain('name: name,')
    expect(contractSource).toContain('size: size')
  })
  
  it('should have a grant-access function', () => {
    expect(contractSource).toContain('(define-public (grant-access (file-id uint) (user principal))')
  })
  
  it('should check for file ownership in grant-access function', () => {
    expect(contractSource).toContain('(asserts! (is-eq (get owner file) tx-sender) err-unauthorized)')
  })
  
  it('should have a delete-file function', () => {
    expect(contractSource).toContain('(define-public (delete-file (file-id uint))')
  })
  
  it('should check for file ownership in delete-file function', () => {
    expect(contractSource).toContain('(asserts! (is-eq (get owner file) tx-sender) err-unauthorized)')
  })
  
  it('should have a get-file-info read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-file-info (file-id uint))')
  })
  
  it('should have a check-access read-only function', () => {
    expect(contractSource).toContain('(define-read-only (check-access (file-id uint) (user principal))')
  })
})


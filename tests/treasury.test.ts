import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/treasury.clar', 'utf8')

describe('Treasury Contract', () => {
  it('should define error constant', () => {
    expect(contractSource).toContain('(define-constant err-insufficient-funds (err u101))')
  })
  
  it('should define treasury-balance data variable', () => {
    expect(contractSource).toContain('(define-data-var treasury-balance uint u0)')
  })
  
  it('should have a deposit-funds function', () => {
    expect(contractSource).toContain('(define-public (deposit-funds (amount uint))')
  })
  
  it('should update treasury balance in deposit-funds function', () => {
    expect(contractSource).toContain('(var-set treasury-balance (+ (var-get treasury-balance) amount))')
  })
  
  it('should have a transfer-funds function', () => {
    expect(contractSource).toContain('(define-public (transfer-funds (recipient principal) (amount uint))')
  })
  
  it('should check for insufficient funds in transfer-funds function', () => {
    expect(contractSource).toContain('(asserts! (<= amount (var-get treasury-balance)) err-insufficient-funds)')
  })
  
  it('should update treasury balance in transfer-funds function', () => {
    expect(contractSource).toContain('(var-set treasury-balance (- (var-get treasury-balance) amount))')
  })
  
  it('should have a get-balance read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-balance)')
  })
  
  it('should return treasury balance in get-balance function', () => {
    expect(contractSource).toContain('(var-get treasury-balance)')
  })
})


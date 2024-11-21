import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/dao-core.clar', 'utf8')

describe('DAO Core Contract', () => {
  it('should define error constants', () => {
    expect(contractSource).toContain('(define-constant err-already-member (err u101))')
    expect(contractSource).toContain('(define-constant err-not-member (err u102))')
  })
  
  it('should define total-members data variable', () => {
    expect(contractSource).toContain('(define-data-var total-members uint u0)')
  })
  
  it('should define members map', () => {
    expect(contractSource).toContain('(define-map members principal bool)')
  })
  
  it('should have a join-dao function', () => {
    expect(contractSource).toContain('(define-public (join-dao)')
  })
  
  it('should check if user is already a member in join-dao function', () => {
    expect(contractSource).toContain('(asserts! (not is-member) err-already-member)')
  })
  
  it('should have a leave-dao function', () => {
    expect(contractSource).toContain('(define-public (leave-dao)')
  })
  
  it('should check if user is a member in leave-dao function', () => {
    expect(contractSource).toContain('(asserts! is-member err-not-member)')
  })
  
  it('should have an is-member read-only function', () => {
    expect(contractSource).toContain('(define-read-only (is-member (user principal))')
  })
  
  it('should have a get-total-members read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-total-members)')
  })
  
  it('should update total-members when joining', () => {
    expect(contractSource).toContain('(var-set total-members (+ (var-get total-members) u1))')
  })
  
  it('should update total-members when leaving', () => {
    expect(contractSource).toContain('(var-set total-members (- (var-get total-members) u1))')
  })
})


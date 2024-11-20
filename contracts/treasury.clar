;; contracts/treasury.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-insufficient-funds (err u101))

;; Define data variables
(define-data-var treasury-balance uint u0)

;; Public functions

;; Deposit funds function
(define-public (deposit-funds (amount uint))
  (begin
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set treasury-balance (+ (var-get treasury-balance) amount))
    (ok amount)))

;; Transfer funds function (only callable by proposal-voting contract)
(define-public (transfer-funds (recipient principal) (amount uint))
  (begin
    (asserts! (is-eq contract-caller .proposal-voting) err-not-authorized)
    (asserts! (<= amount (var-get treasury-balance)) err-insufficient-funds)
    (try! (as-contract (stx-transfer? amount tx-sender recipient)))
    (var-set treasury-balance (- (var-get treasury-balance) amount))
    (ok amount)))

;; Read-only functions

(define-read-only (get-balance)
  (var-get treasury-balance))

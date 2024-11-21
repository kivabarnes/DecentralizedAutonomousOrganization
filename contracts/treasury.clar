;; Define constants
(define-constant err-insufficient-funds (err u101))

;; Define data variables
(define-data-var treasury-balance uint u0)

;; Public functions

;; Deposit funds function
(define-public (deposit-funds (amount uint))
  (begin
    (var-set treasury-balance (+ (var-get treasury-balance) amount))
    (ok amount)))

;; Transfer funds function
(define-public (transfer-funds (recipient principal) (amount uint))
  (begin
    (asserts! (<= amount (var-get treasury-balance)) err-insufficient-funds)
    (var-set treasury-balance (- (var-get treasury-balance) amount))
    (ok amount)))

;; Read-only functions

(define-read-only (get-balance)
  (var-get treasury-balance))


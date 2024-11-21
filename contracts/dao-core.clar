;; Define constants
(define-constant err-already-member (err u101))
(define-constant err-not-member (err u102))

;; Define data variables
(define-data-var total-members uint u0)

;; Define maps
(define-map members principal bool)

;; Public functions

;; Join DAO function
(define-public (join-dao)
  (let ((is-member (default-to false (map-get? members tx-sender))))
    (asserts! (not is-member) err-already-member)
    (map-set members tx-sender true)
    (var-set total-members (+ (var-get total-members) u1))
    (ok true)))

;; Leave DAO function
(define-public (leave-dao)
  (let ((is-member (default-to false (map-get? members tx-sender))))
    (asserts! is-member err-not-member)
    (map-delete members tx-sender)
    (var-set total-members (- (var-get total-members) u1))
    (ok true)))

;; Read-only functions

(define-read-only (is-member (user principal))
  (default-to false (map-get? members user)))

(define-read-only (get-total-members)
  (var-get total-members))


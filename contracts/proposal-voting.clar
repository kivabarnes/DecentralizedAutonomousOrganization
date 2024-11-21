;; Define constants
(define-constant err-proposal-not-found (err u101))
(define-constant err-already-voted (err u102))
(define-constant err-voting-ended (err u103))

;; Define data variables
(define-data-var proposal-counter uint u0)

;; Define maps
(define-map proposals
  { id: uint }
  { title: (string-ascii 50), yes-votes: uint, no-votes: uint, end-block: uint }
)

(define-map votes { proposal-id: uint, voter: principal } bool)

;; Public functions

;; Submit proposal function
(define-public (submit-proposal (title (string-ascii 50)) (duration uint))
  (let ((new-id (+ (var-get proposal-counter) u1)))
    (map-set proposals
      { id: new-id }
      { title: title, yes-votes: u0, no-votes: u0, end-block: (+ block-height duration) }
    )
    (var-set proposal-counter new-id)
    (ok new-id)))

;; Vote function
(define-public (vote (proposal-id uint) (vote-for bool))
  (let (
    (proposal (unwrap! (map-get? proposals { id: proposal-id }) err-proposal-not-found))
    (has-voted (default-to false (map-get? votes { proposal-id: proposal-id, voter: tx-sender })))
  )
    (asserts! (< block-height (get end-block proposal)) err-voting-ended)
    (asserts! (not has-voted) err-already-voted)
    (map-set votes { proposal-id: proposal-id, voter: tx-sender } true)
    (if vote-for
      (map-set proposals { id: proposal-id }
        (merge proposal { yes-votes: (+ (get yes-votes proposal) u1) }))
      (map-set proposals { id: proposal-id }
        (merge proposal { no-votes: (+ (get no-votes proposal) u1) })))
    (ok true)))

;; Read-only functions

(define-read-only (get-proposal (id uint))
  (map-get? proposals { id: id }))

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (default-to false (map-get? votes { proposal-id: proposal-id, voter: voter })))


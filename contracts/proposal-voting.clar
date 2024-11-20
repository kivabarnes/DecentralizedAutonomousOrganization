;; contracts/proposal-voting.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-proposal-not-found (err u101))
(define-constant err-already-voted (err u102))
(define-constant err-voting-ended (err u103))

;; Define data variables
(define-data-var proposal-id uint u0)

;; Define maps
(define-map proposals
  { id: uint }
  { title: (string-ascii 50), description: (string-ascii 500), proposer: principal, yes-votes: uint, no-votes: uint, end-block: uint, executed: bool })

(define-map votes { proposal-id: uint, voter: principal } bool)

;; Public functions

;; Submit proposal function
(define-public (submit-proposal (title (string-ascii 50)) (description (string-ascii 500)) (duration uint))
  (let ((new-id (+ (var-get proposal-id) u1)))
    (map-set proposals
      { id: new-id }
      { title: title, description: description, proposer: tx-sender, yes-votes: u0, no-votes: u0, end-block: (+ block-height duration), executed: false })
    (var-set proposal-id new-id)
    (ok new-id)))

;; Vote function
(define-public (vote (proposal-id uint) (vote-for bool))
  (let (
    (proposal (unwrap! (map-get? proposals { id: proposal-id }) err-proposal-not-found))
    (has-voted (default-to false (map-get? votes { proposal-id: proposal-id, voter: tx-sender })))
  )
    (asserts! (< block-height (get end-block proposal)) err-voting-ended)
    (asserts! (not has-voted) err-already-voted)
    (asserts! (contract-call? .dao-core is-member tx-sender) err-not-authorized)
    (map-set votes { proposal-id: proposal-id, voter: tx-sender } true)
    (if vote-for
      (map-set proposals { id: proposal-id }
        (merge proposal { yes-votes: (+ (get yes-votes proposal) u1) }))
      (map-set proposals { id: proposal-id }
        (merge proposal { no-votes: (+ (get no-votes proposal) u1) })))
    (ok true)))

;; Execute proposal function
(define-public (execute-proposal (proposal-id uint))
  (let (
    (proposal (unwrap! (map-get? proposals { id: proposal-id }) err-proposal-not-found))
  )
    (asserts! (>= block-height (get end-block proposal)) err-voting-ended)
    (asserts! (not (get executed proposal)) err-not-authorized)
    (asserts! (> (get yes-votes proposal) (get no-votes proposal)) err-not-authorized)
    (map-set proposals { id: proposal-id }
      (merge proposal { executed: true }))
    (contract-call? .treasury transfer-funds (get proposer proposal) (get yes-votes proposal))
    (ok true)))

;; Read-only functions

(define-read-only (get-proposal (id uint))
  (map-get? proposals { id: id }))

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (default-to false (map-get? votes { proposal-id: proposal-id, voter: voter })))

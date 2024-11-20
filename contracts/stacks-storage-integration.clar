;; contracts/storage-provider-incentives.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))

;; Define fungible token
(define-fungible-token storage-token)

;; Define maps
(define-map provider-stakes principal uint)
(define-map provider-rewards principal uint)

;; Public functions

;; Stake tokens as a storage provider
(define-public (stake-tokens (amount uint))
  (let
    (
      (provider tx-sender)
      (current-stake (default-to u0 (map-get? provider-stakes provider)))
    )
    (try! (ft-transfer? storage-token amount tx-sender (as-contract tx-sender)))
    (map-set provider-stakes provider (+ current-stake amount))
    (ok true)
  )
)

;; Unstake tokens
(define-public (unstake-tokens (amount uint))
  (let
    (
      (provider tx-sender)
      (current-stake (default-to u0 (map-get? provider-stakes provider)))
    )
    (asserts! (>= current-stake amount) err-unauthorized)
    (try! (as-contract (ft-transfer? storage-token amount tx-sender provider)))
    (map-set provider-stakes provider (- current-stake amount))
    (ok true)
  )
)

;; Reward storage provider (called by file management contract)
(define-public (reward-provider (provider principal) (amount uint))
  (let
    (
      (current-reward (default-to u0 (map-get? provider-rewards provider)))
    )
    (asserts! (is-eq contract-caller .file-management) err-unauthorized)
    (map-set provider-rewards provider (+ current-reward amount))
    (ok true)
  )
)

;; Claim rewards
(define-public (claim-rewards)
  (let
    (
      (provider tx-sender)
      (reward-amount (default-to u0 (map-get? provider-rewards provider)))
    )
    (asserts! (> reward-amount u0) err-not-found)
    (try! (as-contract (ft-transfer? storage-token reward-amount tx-sender provider)))
    (map-set provider-rewards provider u0)
    (ok reward-amount)
  )
)

;; Read-only functions

(define-read-only (get-provider-stake (provider principal))
  (default-to u0 (map-get? provider-stakes provider)))

(define-read-only (get-provider-rewards (provider principal))
  (default-to u0 (map-get? provider-rewards provider)))

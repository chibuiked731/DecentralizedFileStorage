;; Define constants
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
    (map-set provider-stakes provider (- current-stake amount))
    (ok true)
  )
)

;; Reward storage provider
(define-public (reward-provider (provider principal) (amount uint))
  (let
    (
      (current-reward (default-to u0 (map-get? provider-rewards provider)))
    )
    (map-set provider-rewards provider (+ current-reward amount))
    (ok true)
  )
)

;; Read-only functions

(define-read-only (get-provider-stake (provider principal))
  (default-to u0 (map-get? provider-stakes provider)))

(define-read-only (get-provider-rewards (provider principal))
  (default-to u0 (map-get? provider-rewards provider)))


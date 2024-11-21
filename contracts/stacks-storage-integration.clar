;; Define constants
(define-constant err-not-found (err u101))

;; Define maps
(define-map gaia-hub-mappings principal (string-ascii 256))

;; Public functions

;; Register or update Gaia hub for a user
(define-public (set-gaia-hub (hub-url (string-ascii 256)))
  (ok (map-set gaia-hub-mappings tx-sender hub-url))
)

;; Remove Gaia hub for a user
(define-public (remove-gaia-hub)
  (ok (map-delete gaia-hub-mappings tx-sender))
)

;; Read-only functions

(define-read-only (get-gaia-hub (user principal))
  (map-get? gaia-hub-mappings user))


;; contracts/file-management.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-already-exists (err u103))

;; Define data variables
(define-data-var next-file-id uint u1)

;; Define maps
(define-map files uint {
  owner: principal,
  name: (string-ascii 100),
  size: uint,
  hash: (buff 32),
  encryption-key: (buff 32),
  storage-provider: principal
})

(define-map file-access-control {file-id: uint, user: principal} bool)

;; Private functions
(define-private (is-owner)
  (is-eq tx-sender contract-owner))

;; Public functions

;; Upload a new file
(define-public (upload-file (name (string-ascii 100)) (size uint) (hash (buff 32)) (encryption-key (buff 32)) (storage-provider principal))
  (let
    (
      (file-id (var-get next-file-id))
    )
    (map-set files file-id {
      owner: tx-sender,
      name: name,
      size: size,
      hash: hash,
      encryption-key: encryption-key,
      storage-provider: storage-provider
    })
    (map-set file-access-control {file-id: file-id, user: tx-sender} true)
    (var-set next-file-id (+ file-id u1))
    (ok file-id)
  )
)

;; Grant access to a file
(define-public (grant-access (file-id uint) (user principal))
  (let
    (
      (file (unwrap! (map-get? files file-id) err-not-found))
    )
    (asserts! (is-eq (get owner file) tx-sender) err-unauthorized)
    (ok (map-set file-access-control {file-id: file-id, user: user} true))
  )
)

;; Revoke access to a file
(define-public (revoke-access (file-id uint) (user principal))
  (let
    (
      (file (unwrap! (map-get? files file-id) err-not-found))
    )
    (asserts! (is-eq (get owner file) tx-sender) err-unauthorized)
    (ok (map-delete file-access-control {file-id: file-id, user: user}))
  )
)

;; Delete a file
(define-public (delete-file (file-id uint))
  (let
    (
      (file (unwrap! (map-get? files file-id) err-not-found))
    )
    (asserts! (is-eq (get owner file) tx-sender) err-unauthorized)
    (map-delete files file-id)
    (ok true)
  )
)

;; Read-only functions

(define-read-only (get-file-info (file-id uint))
  (map-get? files file-id))

(define-read-only (check-access (file-id uint) (user principal))
  (default-to false (map-get? file-access-control {file-id: file-id, user: user})))

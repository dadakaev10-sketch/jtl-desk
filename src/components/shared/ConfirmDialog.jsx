'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = false }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Abbrechen</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>Bestätigen</Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  )
}

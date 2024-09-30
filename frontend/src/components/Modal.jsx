import React from 'react'
import { styled } from 'styled-components'
import ReactDOM from 'react-dom'

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e4e4e7;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
`

const Button = styled.button`
  padding: 8px 16px;
  margin-top: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: fit-content;
`

const Modal = ({ onClose, showModal, children }) => {
  if (!showModal) return null

  return ReactDOM.createPortal(
    <ModalContainer showModal={showModal}>
      <ModalContent className='modal-main'>
        {children}
        <Button type='button' onClick={onClose}>
          Close
        </Button>
      </ModalContent>
    </ModalContainer>,
    document.body
  )
}

export default Modal
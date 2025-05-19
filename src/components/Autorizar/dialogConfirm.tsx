import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ConfirmationModalProps {
  title: string;
  text: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, text, onConfirm, onCancel, isOpen, setIsOpen }) => {
 
  const handleConfirm = async () => {
    await onConfirm();
    setIsOpen(false); // Cerrar el modal después de la confirmación
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false); // Cerrar el modal después de la cancelación
  };

  return (
    <><Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
              </DialogHeader>
              <p>{text}</p>
              <DialogFooter>
                  <button onClick={handleCancel} className="confirmation-button cancel">
                      Cancelar
                  </button>
                  <button onClick={handleConfirm} className="confirmation-button confirm">
                      Confirmar
                  </button>
              </DialogFooter>
          </DialogContent>
      </Dialog><style>{`
      .confirmation-button {
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin: 0 10px;
        display: inline-block;
      }

      .confirmation-button.confirm {
        background-color: #4CAF50;
        color: white;
      }

      .confirmation-button.cancel {
        background-color: #f44336;
        color: white;
      }

      .confirmation-button:hover {
        opacity: 0.8;
      }

      .confirmation-button:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
      }

      .confirmation-button:active {
        background-color: #45a049;
      }

      .confirmation-button.cancel:active {
        background-color: #e53935;
      }

      .confirmation-button.confirm:active {
        background-color: #388e3c;
      }
    `}</style></>
  );
};

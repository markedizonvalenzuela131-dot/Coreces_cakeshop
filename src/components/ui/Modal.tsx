// ============================================================================
// SweetCrumb Bakery - Modal Components
// ============================================================================

import React, { useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button } from './Button';

// -----------------------------------------------------------------------------
// Modal Context for nested modals
// -----------------------------------------------------------------------------

interface ModalContextValue {
  closeAll: () => void;
  registerModal: (id: string, close: () => void) => void;
  unregisterModal: (id: string) => void;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

export function useModalContext() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
}

// -----------------------------------------------------------------------------
// Modal Provider
// -----------------------------------------------------------------------------

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const modalsRef = React.useRef<Map<string, () => void>>(new Map());

  const closeAll = useCallback(() => {
    modalsRef.current.forEach(close => close());
    modalsRef.current.clear();
  }, []);

  const registerModal = useCallback((id: string, close: () => void) => {
    modalsRef.current.set(id, close);
  }, []);

  const unregisterModal = useCallback((id: string) => {
    modalsRef.current.delete(id);
  }, []);

  return (
    <ModalContext.Provider value={{ closeAll, registerModal, unregisterModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Modal Component
// -----------------------------------------------------------------------------

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className,
  footer,
}: ModalProps) {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const previousActiveElement = React.useRef<HTMLElement | null>(null);
    const { registerModal, unregisterModal } = useModalContext();

    const modalId = React.useId();

    // Handle escape key
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          onClose();
        }
        // Trap focus
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element
      setTimeout(() => {
        const focusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 0);

      registerModal(modalId, onClose);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        unregisterModal(modalId);
        previousActiveElement.current?.focus();
      };
    }, [isOpen, closeOnEscape, onClose, registerModal, unregisterModal, modalId]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-[90vw]',
    };

    const modalContent = (
      <div
        className="modal-overlay"
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={modalRef}
          className={clsx('modal-content', sizeClasses[size], className)}
          onClick={e => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="modal-header">
              <div>
                {title && <h2 id="modal-title" className="text-heading-lg font-medium">{title}</h2>}
                {description && <p id="modal-description" className="text-body-sm text-text-muted mt-1">{description}</p>}
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          )}
          <div className="modal-body">{children}</div>
          {footer && (
            <div className="modal-footer">{footer}</div>
          )}
        </div>
      </div>
    );

    // Portal to body
    if (typeof document !== 'undefined') {
      return createPortal(modalContent, document.body);
    }

    return null;
  }

Modal.displayName = 'Modal';

// -----------------------------------------------------------------------------
// Confirmation Modal
// -----------------------------------------------------------------------------

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'secondary';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : variant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-body text-text-secondary">{message}</p>
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Form Modal
// -----------------------------------------------------------------------------

interface FormModalProps<T> extends Omit<ModalProps, 'children' | 'footer'> {
  onSubmit: (data: T) => Promise<void>;
  submitText?: string;
  cancelText?: string;
  children: (props: { close: () => void; submitting: boolean }) => ReactNode;
  loading?: boolean;
}

export function FormModal<T>({
  isOpen,
  onClose,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading: initialLoading = false,
  children,
  ...props
}: FormModalProps<T>) {
  const [submitting, setSubmitting] = React.useState(initialLoading);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(undefined as unknown as T);
      onClose();
    } catch (error) {
      // Error handled by form
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {cancelText}
          </Button>
          <Button onClick={handleSubmit} loading={submitting} type="submit" form={undefined}>
            {submitText}
          </Button>
        </div>
      }
      {...props}
    >
      {children({ close: onClose, submitting })}
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// Alert Modal (simple alert with OK button)
// -----------------------------------------------------------------------------

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  okText?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  okText = 'OK',
}: AlertModalProps) {
  const variantIcons = {
    info: <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    success: <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    warning: <svg className="w-6 h-6 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    error: <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };

  const variantBg = {
    info: 'bg-sage-50',
    success: 'bg-sage-50',
    warning: 'bg-warm-50',
    error: 'bg-rose-50',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
      footer={
        <div className="flex w-full justify-end">
          <Button onClick={onClose}>{okText}</Button>
        </div>
      }
    >
      <div className={clsx('flex items-start gap-3 p-4 rounded-lg', variantBg[variant])}>
        <div className="flex-shrink-0 mt-0.5">{variantIcons[variant]}</div>
        <p className="text-body text-text-secondary">{message}</p>
      </div>
    </Modal>
  );
}
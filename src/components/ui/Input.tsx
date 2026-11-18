// ============================================================================
// SweetCrumb Bakery - Input Components
// ============================================================================

import React, { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes } from 'react';
import { clsx } from 'clsx';

// -----------------------------------------------------------------------------
// Input
// -----------------------------------------------------------------------------

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || `input-${React.useId()}`;

    return (
      <div className={clsx('form-field', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'input',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'input-error',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="form-error" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="form-hint">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// -----------------------------------------------------------------------------
// Textarea
// -----------------------------------------------------------------------------

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, fullWidth = true, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${React.useId()}`;

    return (
      <div className={clsx('form-field', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
            {props.required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx('input resize-y min-h-[100px]', error && 'input-error', className)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="form-error" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="form-hint">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// -----------------------------------------------------------------------------
// Select
// -----------------------------------------------------------------------------

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onValueChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, fullWidth = true, className, id, onChange, onValueChange, ...props }, ref) => {
    const selectId = id || `select-${React.useId()}`;

    return (
      <div className={clsx('form-field', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
            {props.required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx('input appearance-none pr-10', error && 'input-error', className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
            {...props}
            onChange={(event) => {
              onChange?.(event);
              onValueChange?.(event.target.value);
            }}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="form-error" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="form-hint">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// -----------------------------------------------------------------------------
// Checkbox
// -----------------------------------------------------------------------------

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> & {
  label?: string;
  description?: string;
  error?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, checked, indeterminate = false, className, id, onChange, ...props }, ref) => {
    const checkboxId = id || `checkbox-${React.useId()}`;

    const setInputRef = (node: HTMLInputElement | null) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      if (node) {
        node.indeterminate = indeterminate;
      }
    };

    return (
      <div className="form-field">
        <div className="flex items-start gap-3">
          <div className="relative flex items-center justify-center h-5 w-5 mt-0.5 flex-shrink-0">
            <input
              ref={setInputRef}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              onChange={(event) => onChange?.(event.target.checked)}
              className={clsx(
                'h-5 w-5 rounded border-border-strong text-primary focus:ring-2 focus:ring-focus/20 focus:ring-offset-2',
                'transition-colors duration-fast cursor-pointer',
                error && 'border-error',
                className
              )}
              aria-invalid={error ? 'true' : 'false'}
              {...props}
            />
          </div>
          <div className="flex-1">
            <label htmlFor={checkboxId} className="label cursor-pointer mb-0">
              {label}
              {props.required && <span className="text-error ml-1" aria-hidden="true">*</span>}
            </label>
            {description && <p className="form-hint">{description}</p>}
            {error && (
              <p className="form-error" role="alert">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// -----------------------------------------------------------------------------
// Radio Group
// -----------------------------------------------------------------------------

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  orientation?: 'horizontal' | 'vertical';
  required?: boolean;
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  hint,
  orientation = 'vertical',
  required,
}: RadioGroupProps) {
  const groupId = `radiogroup-${React.useId()}`;

  return (
    <fieldset className="form-field" role="radiogroup" aria-labelledby={`${groupId}-label`} aria-describedby={error ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined}>
      <legend id={`${groupId}-label`} className="label">
        {label}
        {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </legend>
      <div className={clsx('flex gap-4', orientation === 'horizontal' ? 'flex-wrap' : 'flex-col')}>
        {options.map((option) => (
          <label
            key={option.value}
            className={clsx(
              'flex items-start gap-3 cursor-pointer',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => !option.disabled && onChange?.(option.value)}
              disabled={option.disabled}
              className={clsx(
                'h-4 w-4 text-primary border-border-strong focus:ring-2 focus:ring-focus/20 focus:ring-offset-2',
                'transition-colors duration-fast',
                'appearance-none border rounded-full',
                'checked:border-primary checked:bg-primary',
                'checked:before:content-none'
              )}
              aria-label={option.label}
            />
            <div>
              <span className="block text-body-sm font-medium text-text-secondary">{option.label}</span>
              {option.description && <span className="block text-caption text-text-muted">{option.description}</span>}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${groupId}-error`} className="form-error" role="alert">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p id={`${groupId}-hint`} className="form-hint">{hint}</p>}
    </fieldset>
  );
}

// -----------------------------------------------------------------------------
// Switch / Toggle
// -----------------------------------------------------------------------------

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onChange' | 'onClick'> & {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, description, checked = false, className, id, onChange, disabled, ...props }, ref) => {
    const switchId = id || `switch-${React.useId()}`;

    return (
      <div className="form-field">
        <div className="flex items-center gap-3">
          <button
            role="switch"
            type="button"
            ref={ref}
            id={switchId}
            className={clsx(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
              checked ? 'bg-primary' : 'bg-charcoal-300',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-checked={checked}
            aria-disabled={disabled}
            onClick={() => !disabled && onChange?.(!checked)}
            disabled={disabled}
            {...props}
          >
            <span
              className={clsx(
                'inline-block h-4 w-4 transform rounded-full bg-white shadow-ring-0',
                'transition-transform duration-fast ease-spring',
                checked ? 'translate-x-6' : 'translate-x-1'
              )}
              aria-hidden="true"
            />
          </button>
          {label && (
            <div>
              <label htmlFor={switchId} className="label cursor-pointer mb-0">{label}</label>
              {description && <p className="form-hint">{description}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = 'Switch';

// -----------------------------------------------------------------------------
// File Input
// -----------------------------------------------------------------------------

interface FileInputProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  error?: string;
  hint?: string;
  preview?: boolean;
  value?: File[];
}

export function FileInput({ label, accept, multiple, onChange, error, hint, preview = true, value }: FileInputProps) {
  const inputId = `file-${React.useId()}`;
  const [previews, setPreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (value && preview) {
      const urls = value.map(file => URL.createObjectURL(file));
      setPreviews(urls);
      return () => urls.forEach(url => URL.revokeObjectURL(url));
    }
  }, [value, preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange(files);

    if (preview && files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...urls]);
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  return (
    <div className="form-field">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <div className="relative">
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        />
        <label
          htmlFor={inputId}
          className={clsx(
            'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
            'hover:border-primary hover:bg-primary-light/50',
            error && 'border-error'
          )}
        >
          <svg className="w-8 h-8 text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-body text-text-secondary">Drag & drop or click to upload</span>
          <span className="text-caption text-text-muted">Supports: {accept || 'All files'}</span>
        </label>
      </div>

      {preview && previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3" role="list" aria-label="File previews">
          {previews.map((url, index) => (
            <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-border" role="listitem">
              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                aria-label={`Remove file ${index + 1}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p id={`${inputId}-hint`} className="form-hint">{hint}</p>}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Label (standalone)
// -----------------------------------------------------------------------------

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, children, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={clsx('label', className)}
        {...props}
      >
        {children}
        {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
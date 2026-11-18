// ============================================================================
// SweetCrumb Bakery - Form Components
// ============================================================================

import React, { type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  RadioGroup,
  FileInput,
  Label,
} from '@/components/ui';

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label?: string;
  error?: string;
  hint?: string;
  rules?: Record<string, unknown>;
  children: (props: {
    field: any;
    fieldState: { error?: { message?: string }; isDirty: boolean; isTouched: boolean };
  }) => ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  error,
  hint,
  children,
  rules,
}: FormFieldProps<T>) {
  if (!control) {
    const fieldState = { error: error ? { message: error } : undefined, isDirty: false, isTouched: false };
    const field = {
      name: String(name),
      value: undefined,
      onChange: () => undefined,
      onBlur: () => undefined,
      ref: undefined,
    };

    return (
      <div className="form-field">
        {label && (
          <Label htmlFor={String(name)}>
            {label}
            {rules && typeof rules === 'object' && 'required' in rules && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </Label>
        )}
        {children({ field, fieldState })}
        {(fieldState.error?.message || error) && (
          <p className="form-error" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fieldState.error?.message || error}
          </p>
        )}
        {hint && !fieldState.error?.message && !error && <p className="form-hint">{hint}</p>}
      </div>
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules as any}
      render={({ field, fieldState }) => (
        <div className="form-field">
          {label && (
            <Label htmlFor={String(name)}>
              {label}
              {rules && typeof rules === 'object' && 'required' in rules && <span className="text-error ml-1" aria-hidden="true">*</span>}
            </Label>
          )}
          {children({ field, fieldState })}
          {(fieldState.error?.message || error) && (
            <p className="form-error" role="alert">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {fieldState.error?.message || error}
            </p>
          )}
          {hint && !fieldState.error?.message && !error && <p className="form-hint">{hint}</p>}
        </div>
      )}
    />
  );
}

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label?: string;
  hint?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  [key: string]: any;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  type = 'text',
  leftIcon,
  rightIcon,
  className,
  ...props
}: FormInputProps<T>) {
  if (!control) {
    return (
      <div className="form-field">
        {label && <Label htmlFor={String(name)} className="label">{label}</Label>}
        <Input
          type={type}
          id={String(name)}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          className={clsx(className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <FormField name={name} control={control} label={label} hint={hint}>
      {({ field, fieldState }) => (
        <Input
          type={type}
          {...field}
          {...props}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          className={clsx(className)}
          error={fieldState.error?.message as string}
          aria-invalid={fieldState.isTouched && !!fieldState.error}
          aria-describedby={fieldState.error ? `${String(name)}-error` : hint ? `${String(name)}-hint` : undefined}
        />
      )}
    </FormField>
  );
}

interface FormTextareaProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label?: string;
  hint?: string;
  rows?: number;
  className?: string;
  [key: string]: any;
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  rows = 4,
  className,
  ...props
}: FormTextareaProps<T>) {
  if (!control) {
    return (
      <div className="form-field">
        {label && <Label htmlFor={String(name)} className="label">{label}</Label>}
        <Textarea id={String(name)} rows={rows} className={clsx(className)} {...props} />
      </div>
    );
  }

  return (
    <FormField name={name} control={control} label={label} hint={hint}>
      {({ field, fieldState }) => (
        <Textarea
          {...field}
          {...props}
          rows={rows}
          className={clsx(className)}
          error={fieldState.error?.message as string}
          aria-invalid={fieldState.isTouched && !!fieldState.error}
        />
      )}
    </FormField>
  );
}

interface FormSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label?: string;
  hint?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  hint,
  options,
  placeholder,
  className,
}: FormSelectProps<T>) {
  if (!control) {
    return (
      <div className="form-field">
        {label && <Label htmlFor={String(name)} className="label">{label}</Label>}
        <Select id={String(name)} options={options} placeholder={placeholder} className={clsx(className)} />
      </div>
    );
  }

  return (
    <FormField name={name} control={control} label={label} hint={hint}>
      {({ field, fieldState }) => (
        <Select
          {...field}
          options={options}
          placeholder={placeholder}
          className={clsx(className)}
          error={fieldState.error?.message as string}
          aria-invalid={fieldState.isTouched && !!fieldState.error}
        />
      )}
    </FormField>
  );
}

interface FormCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label: string;
  description?: string;
}

export function FormCheckbox<T extends FieldValues>({ name, control, label, description }: FormCheckboxProps<T>) {
  if (!control) {
    return <Checkbox name={String(name)} label={label} description={description} />;
  }

  return (
    <FormField name={name} control={control}>
      {({ field, fieldState }) => (
        <Checkbox
          {...field}
          label={label}
          description={description}
          checked={Boolean(field.value)}
          onChange={field.onChange}
          error={fieldState.error?.message as string}
        />
      )}
    </FormField>
  );
}

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label?: string;
  description?: string;
}

export function FormSwitch<T extends FieldValues>({ name, control, label, description }: FormSwitchProps<T>) {
  if (!control) {
    return <Switch name={String(name)} label={label} description={description} />;
  }

  return (
    <FormField name={name} control={control}>
      {({ field, fieldState }) => (
        <Switch
          {...field}
          label={label}
          description={description}
          checked={Boolean(field.value)}
          onChange={field.onChange}
          error={fieldState.error?.message as string}
        />
      )}
    </FormField>
  );
}

interface FormRadioGroupProps<T extends FieldValues> {
  name: FieldPath<T>;
  control?: Control<T>;
  label: string;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  hint?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function FormRadioGroup<T extends FieldValues>({
  name,
  control,
  label,
  options,
  hint,
  orientation = 'vertical',
}: FormRadioGroupProps<T>) {
  if (!control) {
    return <RadioGroup label={label} name={String(name)} value="" onChange={() => undefined} options={options} orientation={orientation} />;
  }

  return (
    <FormField name={name} control={control} label={label} hint={hint}>
      {({ field, fieldState }) => (
        <RadioGroup
          label={label}
          name={String(name)}
          value={field.value as string}
          onChange={field.onChange}
          options={options}
          orientation={orientation}
          error={fieldState.error?.message as string}
        />
      )}
    </FormField>
  );
}

interface FormFileInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  preview?: boolean;
  children?: (props: {
    field: any;
    fieldState: { error?: { message?: string }; isDirty: boolean; isTouched: boolean };
  }) => ReactNode;
}

export function FormFileInput<T extends FieldValues>({ name, control, label, hint, accept, multiple, preview = true, children }: FormFileInputProps<T>) {
  return (
    <FormField name={name} control={control} label={label} hint={hint}>
      {({ field, fieldState }) => {
        if (children) {
          return children({ field, fieldState });
        }

        return (
          <FileInput
            {...field}
            accept={accept}
            multiple={multiple}
            preview={preview}
            onChange={field.onChange}
            error={fieldState.error?.message as string}
          />
        );
      }}
    </FormField>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={clsx('space-y-4', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <legend className="text-heading-sm font-medium text-text-primary">{title}</legend>}
          {description && <p className="text-body-sm text-text-muted mt-1">{description}</p>}
        </div>
      )}
      {children}
    </fieldset>
  );
}

interface FormActionsProps {
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  cancelHref?: string;
  submitting?: boolean;
  variant?: 'primary' | 'secondary' | 'destructive';
  className?: string;
  children?: ReactNode;
}

export function FormActions({
  submitText = 'Save',
  cancelText = 'Cancel',
  onCancel,
  cancelHref,
  submitting = false,
  variant = 'primary',
  className,
  children,
}: FormActionsProps) {
  return (
    <div className={clsx('flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 pt-4 border-t border-border', className)}>
      {children}
      {cancelHref ? (
        <a href={cancelHref} className="btn btn-outline">{cancelText}</a>
      ) : onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          {cancelText}
        </Button>
      ) : null}
      <Button type="submit" variant={variant} loading={submitting} disabled={submitting}>
        {submitText}
      </Button>
    </div>
  );
}

interface FormLayoutProps {
  children: ReactNode;
  className?: string;
  id?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function FormLayout({ children, className, id, onSubmit }: FormLayoutProps) {
  return (
    <form id={id} onSubmit={onSubmit} className={clsx('space-y-6', className)} noValidate>
      {children}
    </form>
  );
}

interface WizardStep {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface FormWizardProps {
  steps: WizardStep[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
  children: ReactNode;
  className?: string;
  showStepNumbers?: boolean;
}

export function FormWizard({ steps, currentStep, onStepChange, children, className, showStepNumbers = true }: FormWizardProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className={clsx('space-y-8', className)}>
      <div className="w-full" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="flex items-center gap-2 mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    'flex items-center justify-center font-medium transition-all duration-normal',
                    'w-8 h-8 rounded-full',
                    index < currentIndex
                      ? 'bg-primary text-white'
                      : index === currentIndex
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-charcoal-100 text-charcoal-400'
                  )}
                  aria-current={index === currentIndex ? 'step' : undefined}
                >
                  {showStepNumbers ? (
                    index < currentIndex ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      index + 1
                    )
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'h-1 flex-1 max-w-32 transition-all duration-normal',
                      index < currentIndex ? 'bg-primary' : 'bg-charcoal-100'
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between text-caption text-text-muted">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={clsx(
                'text-center w-8',
                index === currentIndex ? 'font-medium text-text-primary' : ''
              )}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="animate-fade-in">{children}</div>

      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => currentIndex > 0 && onStepChange(steps[currentIndex - 1].id)}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => currentIndex < steps.length - 1 && onStepChange(steps[currentIndex + 1].id)}
          disabled={currentIndex === steps.length - 1}
        >
          {currentIndex === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
// ============================================================================
// SweetCrumb Bakery - Checkout Page (Refactored)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Check, MapPin, Clock, CreditCard, Truck, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Input, Select, RadioGroup, Switch, Badge, Alert, Card } from '@/components/ui';
import { FormField, FormInput, FormTextarea, FormSelect, FormSwitch, FormActions, FormSection, FormLayout } from '@/components/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/context';
import { useAuth } from '@/context';
import { formatCurrency, formatDate, formatTime, cn, calculateOrderTotal } from '@/lib/utils';
import { clsx } from 'clsx';
import { containerPage } from '@/styles';
import { saveStoredOrder, type StoredOrder } from '@/utils/orderStore';
import { usePickupSchedules } from '@/hooks';
import { EmptyState } from '@/components/common';

// -----------------------------------------------------------------------------
// Validation Schema
// -----------------------------------------------------------------------------

const checkoutSchema = z.object({
  // Contact
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),

  // Pickup
  pickupScheduleId: z.string().min(1, 'Please select a pickup schedule'),

  // Billing/Delivery
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  zipCode: z.string().min(4, 'Valid ZIP code required'),

  // Notes
  remarks: z.string().optional(),

  // Terms
  terms: z.boolean().refine(val => val, 'You must accept the terms and conditions'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const provinces = [
  'Metro Manila', 'Cebu', 'Davao', 'Cavite', 'Laguna', 'Batangas', 'Rizal', 'Bulacan', 'Pampanga', 'Others'
];

// -----------------------------------------------------------------------------
// Checkout Page
// -----------------------------------------------------------------------------

export function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { getAvailableSlots, timeSlots } = usePickupSchedules();
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);

  // Calculate order totals
  const orderItems = items.map(item => ({
    quantity: item.quantity,
    unitPrice: item.product?.price || 0,
  }));
  const { tax, deliveryFee, total } = calculateOrderTotal(orderItems);

  const isEmpty = items.length === 0;

  // Redirect if cart empty
  useEffect(() => {
    if (isEmpty) navigate('/cart');
  }, [isEmpty, navigate]);

  // Load available pickup schedules
  useEffect(() => {
    // Get available slots for the next 14 days
    const today = new Date();
    const allSlots: any[] = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const slots = getAvailableSlots(dateStr);
      allSlots.push(...slots);
    }
    setAvailableSchedules(allSlots);
  }, [getAvailableSlots]);

  // Pre-fill form if user logged in
  const defaultValues: Partial<CheckoutFormData> = React.useMemo(() => {
    if (user && isAuthenticated) {
      return {
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
      };
    }
    return {};
  }, [user, isAuthenticated]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
    mode: 'onChange',
  });

  const pickupScheduleId = watch('pickupScheduleId');
  const selectedSchedule = availableSchedules.find(s => s.pickupScheduleId === pickupScheduleId);

  const steps = [
    { id: 1, label: 'Contact', icon: '📧' },
    { id: 2, label: 'Pickup', icon: '📦' },
    { id: 3, label: 'Address', icon: '📍' },
    { id: 4, label: 'Review', icon: '✓' },
  ];

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderId = `ORD-${Date.now()}`;
      const schedule = selectedSchedule ?? availableSchedules[0];
      const orderItems = items.map(item => ({
        productId: item.productId,
        productName: item.product?.productName || 'Cake',
        quantity: item.quantity,
        unitPriceAtOrder: item.product?.price || 0,
        lineTotal: item.subtotalCalculation,
        imageReference: item.product?.imageReference,
      }));
      const order: StoredOrder = {
        orderId,
        orderDate: new Date().toISOString(),
        totalAmount: total,
        statusName: 'Confirmed',
        customerName: `${data.firstName} ${data.lastName}`,
        pickupDate: schedule.preferredDate,
        pickupTime: schedule.preferredTime,
        itemCount,
        remarks: data.remarks || '',
        items: orderItems,
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          contactNumber: data.phone,
          address: `${data.address}, ${data.city}, ${data.province} ${data.zipCode}`,
        },
        pickupSchedule: schedule,
        statusHistory: [
          { status: 'Pending', date: new Date().toISOString(), note: 'Order placed' },
          { status: 'Confirmed', date: new Date().toISOString(), note: 'Confirmed automatically' },
        ],
      };
      saveStoredOrder(order);
      clearCart();
      navigate(`/order-success/${orderId}?new=true`);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const goToStep = (step: number) => {
    // Only allow going back or to next step if current is valid
    if (step < currentStep || currentStep === 1 || (currentStep === 2 && pickupScheduleId)) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      // Validate current step fields
      const stepFields = {
        1: ['email', 'phone'],
        2: ['pickupScheduleId'],
        3: ['firstName', 'lastName', 'address', 'city', 'province', 'zipCode'],
      };
      const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields] || [];
      // In real app, trigger validation for these fields
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container-page py-4">
          <h1 className="text-display-md font-display font-medium text-charcoal-900 mb-6">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center font-medium text-body-sm transition-all',
                      currentStep > step.id ? 'bg-primary text-white' :
                      currentStep === step.id ? 'bg-primary text-white ring-4 ring-primary/20' :
                      'bg-charcoal-100 text-charcoal-400'
                    )}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className={clsx('text-caption mt-2', currentStep >= step.id ? 'font-medium text-charcoal-900' : 'text-text-muted')}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'hidden md:block w-20 h-1 mx-2',
                      currentStep > step.id ? 'bg-primary' : 'bg-charcoal-100'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <FormLayout onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Contact Info */}
          {currentStep === 1 && (
            <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <FormSection title="Contact Information" description="We'll send order confirmation and updates to this email.">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    />
                    <FormInput
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="+63 9XX XXX XXXX"
                      leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                    />
                  </div>
                </FormSection>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <OrderSummarySidebar items={items} subtotal={subtotal} tax={tax} total={total} />
              </div>
            </div>
          )}

          {/* Step 2: Pickup Schedule */}
          {currentStep === 2 && (
            <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <FormSection title="Pickup Schedule" description="Select your preferred pickup date and time. Pickup is free at our bakery.">
                  {availableSchedules.length === 0 ? (
                    <EmptyState
                      illustration="custom"
                      icon={<Clock className="w-12 h-12 text-charcoal-200" />}
                      title="No pickup slots available"
                      description="Please check back later for available pickup times."
                    />
                  ) : (
                    <div className="space-y-3" role="radiogroup" aria-label="Pickup schedule">
                      {availableSchedules.map(schedule => (
                        <PickupScheduleOption
                          key={schedule.pickupScheduleId}
                          schedule={schedule}
                          selected={pickupScheduleId === schedule.pickupScheduleId}
                          onSelect={() => setValue('pickupScheduleId', schedule.pickupScheduleId)}
                          register={register('pickupScheduleId')}
                        />
                      ))}
                    </div>
                  )}

                  {errors.pickupScheduleId && (
                    <Alert variant="error" className="text-body-sm">
                      Please select a pickup schedule
                    </Alert>
                  )}
                </FormSection>

                {selectedSchedule && (
                  <Card className="bg-primary-light border-primary/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">Selected: {formatDate(selectedSchedule.preferredDate)} at {formatTime(selectedSchedule.preferredTime)}</p>
                        <p className="text-body-sm text-text-muted">Please arrive within your 1-hour window</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-1">
                <OrderSummarySidebar items={items} subtotal={subtotal} tax={tax} total={total} />
              </div>
            </div>
          )}

          {/* Step 3: Billing Address */}
          {currentStep === 3 && (
            <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <FormSection title="Billing Address" description="Address for receipt and order records.">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormInput name="firstName" label="First Name" placeholder="Juan" />
                    <FormInput name="lastName" label="Last Name" placeholder="Dela Cruz" />
                  </div>
                  <FormInput name="address" label="Street Address" placeholder="123 Main Street, Barangay" />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormInput name="city" label="City" placeholder="Quezon City" />
                    <FormSelect
                      name="province"
                      label="Province"
                      options={provinces.map(p => ({ value: p, label: p }))}
                      placeholder="Select province"
                    />
                    <FormInput name="zipCode" label="ZIP Code" placeholder="1100" type="text" />
                  </div>
                </FormSection>

                <FormSection title="Order Notes (Optional)" description="Special instructions for your order.">
                  <FormTextarea
                    name="remarks"
                    label=""
                    placeholder="e.g., Please write 'Happy Birthday Maria' on the cake box, or any dietary notes..."
                    rows={3}
                  />
                </FormSection>

                <FormSection title="Terms & Conditions">
                  <FormSwitch
                    name="terms"
                    label="I agree to the Terms of Service and Privacy Policy"
                    description="By placing this order, you confirm that all information is accurate and you accept our policies."
                  />
                </FormSection>
              </div>

              <div className="lg:col-span-1">
                <OrderSummarySidebar items={items} subtotal={subtotal} tax={tax} total={total} />
              </div>
            </div>
          )}

          {/* Step 4: Review Order */}
          {currentStep === 4 && (
            <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2 space-y-6">
                <ReviewSection
                  title="Contact Information"
                  content={
                    <>
                      <p>{watch('email')}</p>
                      <p>{watch('phone')}</p>
                    </>
                  }
                  editHref="#"
                  onEdit={() => goToStep(1)}
                />

                <ReviewSection
                  title="Pickup Schedule"
                  content={
                    selectedSchedule ? (
                      <p>{formatDate(selectedSchedule.preferredDate)} at {formatTime(selectedSchedule.preferredTime)}</p>
                    ) : (
                      <p className="text-text-muted">Not selected</p>
                    )
                  }
                  editHref="#"
                  onEdit={() => goToStep(2)}
                />

                <ReviewSection
                  title="Billing Address"
                  content={
                    <>
                      <p>{watch('firstName')} {watch('lastName')}</p>
                      <p>{watch('address')}</p>
                      <p>{watch('city')}, {watch('province')} {watch('zipCode')}</p>
                    </>
                  }
                  editHref="#"
                  onEdit={() => goToStep(3)}
                />

                <ReviewSection
                  title="Order Notes"
                  content={
                    <p>{watch('remarks') || <span className="text-text-muted">No special instructions</span>}</p>
                  }
                  editHref="#"
                  onEdit={() => goToStep(3)}
                />

                {/* Order Items */}
                <Card>
                  <div className="p-6 border-b border-border">
                    <h3 className="text-heading-md font-medium text-charcoal-900">Order Items ({itemCount})</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {items.map(item => (
                      <div key={item.cartItemId} className="p-4 flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-warm-50 flex-shrink-0">
                          <img src={item.product?.imageReference || '/placeholder-cake.svg'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-charcoal-900 truncate">{item.product?.productName}</p>
                          <p className="text-body-sm text-text-muted">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-primary">{formatCurrency(item.subtotalCalculation)}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <OrderSummarySidebar
                  items={items}
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                  showDetails={true}
                />

                <FormActions
                  submitText="Place Order"
                  submitting={submitting}
                  variant="primary"
                  cancelText="Back"
                  onCancel={() => goToStep(3)}
                >
                  <div className="w-full">
                    <p className="text-caption text-text-muted text-center">
                      By placing your order, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a>.
                    </p>
                  </div>
                </FormActions>
              </div>
            </div>
          )}

          {/* Navigation Buttons (for steps 1-3) */}
          {currentStep < 4 && (
            <div className="flex justify-between pt-6 border-t border-border mt-8">
              <Button
                variant="outline"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={nextStep} disabled={submitting}>
                {currentStep === 3 ? 'Review Order' : 'Continue'}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </FormLayout>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Pickup Schedule Option
// -----------------------------------------------------------------------------

function PickupScheduleOption({ schedule, selected, onSelect, register }: {
  schedule: any;
  selected: boolean;
  onSelect: () => void;
  register: any;
}) {
  return (
    <label
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all cursor-pointer',
        selected ? 'border-primary bg-primary-light' : 'border-border hover:border-warm-300'
      )}
    >
      <input
        type="radio"
        {...register}
        value={schedule.pickupScheduleId}
        onChange={onSelect}
        className="sr-only"
      />
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          selected ? 'bg-primary text-white' : 'bg-charcoal-100 text-charcoal-400'
        )}>
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-charcoal-900">{formatDate(schedule.preferredDate)}</span>
            <Badge variant="success" size="sm">Available</Badge>
          </div>
          <p className="text-body-sm text-text-muted">{formatTime(schedule.preferredTime)} • {schedule.notes}</p>
        </div>
        {selected && <Check className="w-5 h-5 text-primary" />}
      </div>
    </label>
  );
}

// -----------------------------------------------------------------------------
// Review Section
// -----------------------------------------------------------------------------

function ReviewSection({ title, content, onEdit }: {
  title: string;
  content: React.ReactNode;
  editHref: string;
  onEdit: () => void;
}) {
  return (
    <Card>
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-caption text-text-muted uppercase tracking-wider">{title}</p>
          <div className="mt-1">{content}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Order Summary Sidebar
// -----------------------------------------------------------------------------

function OrderSummarySidebar({ items, subtotal, tax, total, showDetails = false }: {
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  showDetails?: boolean;
}) {
  return (
    <Card className="sticky top-24 space-y-4">
      <div className="p-6 border-b border-border">
        <h3 className="text-heading-lg font-medium text-charcoal-900">Order Summary</h3>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between text-body">
          <span className="text-text-secondary">Subtotal ({items.length} items)</span>
          <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-body">
          <span className="text-text-secondary">Estimated Tax (12%)</span>
          <span className="font-medium text-charcoal-900">{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between text-body">
          <span className="text-text-secondary">Pickup Fee</span>
          <span className="font-medium text-charcoal-900 text-sage-600">Free</span>
        </div>

        {showDetails && (
          <>
            <div className="pt-3 border-t border-border flex justify-between text-heading-sm font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>

            <Alert variant="info" className="text-body-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free bakery pickup</span>
              </div>
            </Alert>

            <Alert variant="info" className="text-body-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Quality guaranteed or full refund</span>
              </div>
            </Alert>
          </>
        )}
      </div>
    </Card>
  );
}
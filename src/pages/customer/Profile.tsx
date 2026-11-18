// ============================================================================
// SweetCrumb Bakery - Profile Page (Refactored)
// ============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Bell, Shield, Camera, Save, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { Button, Input, Avatar, Badge, Alert, Card, Tabs, TabPanels, TabPanel, Select } from '@/components/ui';
import { FormField, FormInput, FormTextarea, FormSelect, FormSwitch, FormActions, FormSection, FormLayout } from '@/components/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context';
import { clsx } from 'clsx';
import { containerPage } from '@/styles';
import { cn } from '@/lib/utils';

// -----------------------------------------------------------------------------
// Validation Schemas
// -----------------------------------------------------------------------------

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const notificationSchema = z.object({
  emailOrders: z.boolean(),
  emailPromotions: z.boolean(),
  emailStatusUpdates: z.boolean(),
  smsOrders: z.boolean(),
  smsPromotions: z.boolean(),
});

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['home', 'work', 'other']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  zipCode: z.string().min(4, 'Valid ZIP code required'),
  isDefault: z.boolean().default(false),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

// -----------------------------------------------------------------------------
// Profile Page
// -----------------------------------------------------------------------------

const provinces = [
  'Metro Manila', 'Cebu', 'Davao', 'Cavite', 'Laguna', 'Batangas', 'Rizal', 'Bulacan', 'Pampanga', 'Others'
];

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'addresses'>('profile');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // Profile Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: '+63 912 345 6789',
      address: '123 Main St, Quezon City, Metro Manila 1100',
    },
  });

  // Password Form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Notification Form
  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailOrders: true,
      emailPromotions: false,
      emailStatusUpdates: true,
      smsOrders: false,
      smsPromotions: false,
    },
  });

  // Address Form
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      type: 'home',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      zipCode: '',
      isDefault: false,
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    await updateProfile({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
    });
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    // In real app, call API to change password
    console.log('Password changed');
    passwordForm.reset();
  };

  const onNotificationSubmit = async (data: NotificationFormData) => {
    // In real app, save notification preferences
    console.log('Notifications updated');
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    console.log('Address saved:', data);
    setShowAddAddress(false);
    setEditingAddress(null);
    addressForm.reset({ label: '', type: 'home', firstName: '', lastName: '', phone: '', address: '', city: '', province: '', zipCode: '', isDefault: false });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    addressForm.reset({
      label: address.label,
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      address: address.street,
      city: address.city,
      province: address.province,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setShowAddAddress(true);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'password', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
  ];

  const mockAddresses = [
    {
      id: '1',
      label: 'Home',
      type: 'home',
      firstName: 'Maria',
      lastName: 'Santos',
      phone: '+63 912 345 6789',
      street: '123 Main Street, Barangay Central',
      city: 'Quezon City',
      province: 'Metro Manila',
      zipCode: '1100',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Work',
      type: 'work',
      firstName: 'Maria',
      lastName: 'Santos',
      phone: '+63 912 345 6789',
      street: '456 Business Ave, Makati CBD',
      city: 'Makati City',
      province: 'Metro Manila',
      zipCode: '1200',
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="btn btn-ghost btn-sm mb-3">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">My Profile</h1>
          <p className="text-body text-text-muted mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 space-y-4">
              {/* Avatar */}
              <div className="p-6 text-center border-b border-border">
                <div className="relative mx-auto mb-4">
                  <Avatar
                    src={avatarPreview || user?.avatar}
                    name={user?.name}
                    size="2xl"
                  />
                  <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary-hover transition-colors">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
                    <Camera className="w-5 h-5 text-white" />
                  </label>
                </div>
                <h2 className="text-heading-md font-medium text-charcoal-900">{user?.name || 'User'}</h2>
                <p className="text-body-sm text-text-muted">{user?.email}</p>
                <Badge variant="secondary" className="mt-2">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</Badge>
              </div>

              {/* Navigation */}
              <nav className="p-2 space-y-1" role="tablist" aria-label="Profile sections">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setShowAddAddress(false); setEditingAddress(null); }}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-body-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-primary-light text-primary'
                        : 'text-text-secondary hover:bg-warm-50 hover:text-text-primary'
                    )}
                  >
                    <span className="flex-shrink-0">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Account Info */}
              <div className="p-4 border-t border-border bg-warm-50/50 rounded-b-xl">
                <h4 className="text-caption text-text-muted uppercase tracking-wider mb-3">Account Info</h4>
                <dl className="space-y-2 text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Member Since</dt>
                    <dd className="font-medium text-charcoal-900">January 2024</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Orders Placed</dt>
                    <dd className="font-medium text-charcoal-900">12</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Total Spent</dt>
                    <dd className="font-medium text-primary">₱12,450</dd>
                  </div>
                </dl>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(value) => setActiveTab(value as 'notifications' | 'password' | 'profile' | 'addresses')}
              variant="underline"
              className="border-b border-border mb-6"
            />

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel id="profile" active={activeTab === 'profile'}>
                <FormLayout onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                  <FormSection title="Personal Information" description="Your basic profile information.">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        name="firstName"
                        control={profileForm.control}
                        label="First Name"
                      >
                        {({ field }) => <Input {...field} placeholder="Maria" />}
                      </FormField>
                      <FormField
                        name="lastName"
                        control={profileForm.control}
                        label="Last Name"
                      >
                        {({ field }) => <Input {...field} placeholder="Santos" />}
                      </FormField>
                    </div>
                    <FormField
                      name="email"
                      control={profileForm.control}
                      label="Email Address"
                    >
                      {({ field }) => <Input {...field} type="email" leftIcon={<Mail className="w-5 h-5" />} />}
                    </FormField>
                    <FormField
                      name="phone"
                      control={profileForm.control}
                      label="Phone Number"
                    >
                      {({ field }) => <Input {...field} type="tel" leftIcon={<Phone className="w-5 h-5" />} placeholder="+63 9XX XXX XXXX" />}
                    </FormField>
                    <FormField
                      name="address"
                      control={profileForm.control}
                      label="Address"
                    >
                      {({ field }) => <Input {...field} leftIcon={<MapPin className="w-5 h-5" />} placeholder="123 Main St, City, Province" />}
                    </FormField>
                  </FormSection>

                  <FormActions submitText="Save Changes" onCancel={() => profileForm.reset()} />
                </FormLayout>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel id="password" active={activeTab === 'password'}>
                <div className="space-y-8">
                  {/* Change Password */}
                  <Card>
                    <div className="p-6 border-b border-border">
                      <h3 className="text-heading-lg font-medium text-charcoal-900">Change Password</h3>
                      <p className="text-body-sm text-text-muted mt-1">Your password must be at least 8 characters.</p>
                    </div>
                    <FormLayout onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                      <div className="p-6 space-y-4">
                        <FormField
                          name="currentPassword"
                          control={passwordForm.control}
                          label="Current Password"
                        >
                          {({ field }) => (
                            <Input
                              {...field}
                              type={showCurrentPassword ? 'text' : 'password'}
                              leftIcon={<Lock className="w-5 h-5" />}
                              rightIcon={
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="text-text-muted hover:text-text-primary"
                                >
                                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              }
                            />
                          )}
                        </FormField>
                        <FormField
                          name="newPassword"
                          control={passwordForm.control}
                          label="New Password"
                        >
                          {({ field }) => (
                            <Input
                              {...field}
                              type={showNewPassword ? 'text' : 'password'}
                              leftIcon={<Lock className="w-5 h-5" />}
                              rightIcon={
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="text-text-muted hover:text-text-primary"
                                >
                                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              }
                            />
                          )}
                        </FormField>
                        <FormField
                          name="confirmPassword"
                          control={passwordForm.control}
                          label="Confirm New Password"
                        >
                          {({ field }) => (
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              leftIcon={<Lock className="w-5 h-5" />}
                              rightIcon={
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="text-text-muted hover:text-text-primary"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              }
                            />
                          )}
                        </FormField>
                      </div>
                      <FormActions submitText="Update Password" onCancel={() => passwordForm.reset()} />
                    </FormLayout>
                  </Card>

                  {/* Two-Factor Auth */}
                  <Card>
                    <div className="p-6 border-b border-border">
                      <h3 className="text-heading-lg font-medium text-charcoal-900">Two-Factor Authentication</h3>
                      <p className="text-body-sm text-text-muted mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-charcoal-900">Authenticator App</p>
                          <p className="text-body-sm text-text-muted">Use Google Authenticator, Authy, or similar</p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>
                  </Card>

                  {/* Active Sessions */}
                  <Card>
                    <div className="p-6 border-b border-border">
                      <h3 className="text-heading-lg font-medium text-charcoal-900">Active Sessions</h3>
                      <p className="text-body-sm text-text-muted mt-1">Manage devices logged into your account.</p>
                    </div>
                    <div className="divide-y divide-border">
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          </div>
                          <div>
                            <p className="font-medium text-charcoal-900">Current Device</p>
                            <p className="text-body-sm text-text-muted">Chrome on Windows • Manila, PH • Active now</p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">Current</Badge>
                      </div>
                      <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-charcoal-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <p className="font-medium text-charcoal-900">iPhone</p>
                            <p className="text-body-sm text-text-muted">Safari on iOS • Manila, PH • 2 days ago</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-error">Revoke</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabPanel>

              {/* Notifications Tab */}
              <TabPanel id="notifications" active={activeTab === 'notifications'}>
                <FormLayout onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                  <Card>
                    <div className="p-6 border-b border-border">
                      <h3 className="text-heading-lg font-medium text-charcoal-900">Email Notifications</h3>
                      <p className="text-body-sm text-text-muted mt-1">Choose what emails you'd like to receive.</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <FormField
                        name="emailOrders"
                        control={notificationForm.control}
                        label="Order Confirmations & Updates"
                      >
                        {({ field }) => (
                          <FormSwitch
                            {...field}
                            label="Receive emails for order confirmations, status changes, and pickup reminders"
                          />
                        )}
                      </FormField>
                      <FormField
                        name="emailPromotions"
                        control={notificationForm.control}
                        label="Promotions & Special Offers"
                      >
                        {({ field }) => (
                          <FormSwitch
                            {...field}
                            label="Get notified about seasonal specials, discounts, and new products"
                          />
                        )}
                      </FormField>
                      <FormField
                        name="emailStatusUpdates"
                        control={notificationForm.control}
                        label="Status Updates"
                      >
                        {({ field }) => (
                          <FormSwitch
                            {...field}
                            label="Real-time updates when your order status changes"
                          />
                        )}
                      </FormField>
                    </div>
                  </Card>

                  <Card className="mt-6">
                    <div className="p-6 border-b border-border">
                      <h3 className="text-heading-lg font-medium text-charcoal-900">SMS Notifications</h3>
                      <p className="text-body-sm text-text-muted mt-1">Receive text messages for important updates.</p>
                    </div>
                    <div className="p-6 space-y-4">
                      <FormField
                        name="smsOrders"
                        control={notificationForm.control}
                        label="Order Alerts"
                      >
                        {({ field }) => (
                          <FormSwitch
                            {...field}
                            label="SMS for order confirmations and ready-for-pickup notifications"
                          />
                        )}
                      </FormField>
                      <FormField
                        name="smsPromotions"
                        control={notificationForm.control}
                        label="Promotional SMS"
                      >
                        {({ field }) => (
                          <FormSwitch
                            {...field}
                            label="Occasional SMS about special deals and flash sales"
                          />
                        )}
                      </FormField>
                    </div>
                  </Card>

                  <FormActions submitText="Save Preferences" />
                </FormLayout>
              </TabPanel>

              {/* Addresses Tab */}
              <TabPanel id="addresses" active={activeTab === 'addresses'}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-heading-lg font-medium text-charcoal-900">Saved Addresses</h2>
                    <Button leftIcon={<MapPin className="w-4 h-4" />} onClick={() => { setShowAddAddress(true); setEditingAddress(null); addressForm.reset({ label: '', type: 'home', firstName: '', lastName: '', phone: '', address: '', city: '', province: '', zipCode: '', isDefault: false }); }}>
                      Add New Address
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {mockAddresses.map(address => (
                      <Card key={address.id} variant="hover">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-charcoal-900">{address.label}</span>
                                {address.isDefault && <Badge variant="primary" size="sm">Default</Badge>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)} aria-label="Edit">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-error" aria-label="Delete">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </Button>
                            </div>
                          </div>
                          <p className="text-body text-text-secondary">{address.firstName} {address.lastName}</p>
                          <p className="text-body text-text-secondary mt-1">{address.phone}</p>
                          <p className="text-body text-text-secondary mt-2">{address.street}</p>
                          <p className="text-body text-text-secondary">{address.city}, {address.province} {address.zipCode}</p>
                          {!address.isDefault && (
                            <Button variant="outline" className="mt-4 w-full" size="sm">Set as Default</Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Add/Edit Address Form */}
                  {(showAddAddress || editingAddress) && (
                    <Card>
                      <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="text-heading-lg font-medium text-charcoal-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                        <Button variant="ghost" size="icon" onClick={() => { setShowAddAddress(false); setEditingAddress(null); }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </Button>
                      </div>
                      <FormLayout onSubmit={addressForm.handleSubmit(onAddressSubmit)}>
                        <FormSection>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormInput name="label" label="Address Label" placeholder="e.g., Home, Work, Parents' House" />
                            <FormSelect
                              name="type"
                              label="Type"
                              options={[
                                { value: 'home', label: 'Home' },
                                { value: 'work', label: 'Work' },
                                { value: 'other', label: 'Other' },
                              ]}
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormInput name="firstName" label="First Name" />
                            <FormInput name="lastName" label="Last Name" />
                          </div>
                          <FormInput name="phone" label="Phone" type="tel" />
                          <FormInput name="address" label="Street Address" />
                          <div className="grid sm:grid-cols-3 gap-4">
                            <FormInput name="city" label="City" />
                            <FormSelect
                              name="province"
                              label="Province"
                              options={provinces.map(p => ({ value: p, label: p }))}
                            />
                            <FormInput name="zipCode" label="ZIP Code" />
                          </div>
                          <FormField
                            name="isDefault"
                            control={addressForm.control}
                            label="Set as default address"
                          >
                            {({ field }) => (
                              <FormSwitch {...field} label="Use this as my default shipping address" />
                            )}
                          </FormField>
                        </FormSection>
                        <FormActions submitText="Save Address" cancelText="Cancel" onCancel={() => { setShowAddAddress(false); setEditingAddress(null); }} />
                      </FormLayout>
                    </Card>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </main>
        </div>
      </div>
    </div>
  );
}
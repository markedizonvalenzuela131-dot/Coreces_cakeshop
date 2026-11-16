import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    { title: 'Visit Us', details: 'Centro, Sipocot near PNR STATION', hours: 'Mon-Sat: 8am-8pm | Sun: 9am-6pm', icon: 'location' },
    { title: 'Call Us', details: '(63) 9703226051', hours: 'Mon-Fri: 9am-6pm', icon: 'phone' },
    { title: 'Email Us', details: 'coreces@gmail.com', hours: 'We reply within 24 hours', icon: 'email' },
    { title: 'Live Chat', details: 'Click the chat button below', hours: 'Mon-Sat: 9am-7pm', icon: 'chat' }
  ];

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'wedding', label: 'Wedding Cake Consultation' },
    { value: 'custom', label: 'Custom Cake Order' },
    { value: 'catering', label: 'Catering & Events' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'careers', label: 'Career Opportunities' },
    { value: 'other', label: 'Other' }
  ];

  const icons = {
    location: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    phone: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    chat: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  };

  const socialIcons = {
    facebook: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    twitter: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
    pinterest: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>,
    tiktok: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.548.636a12.5 12.5 0 1 0 3.281 9.058v-.002c0-.668-.03-1.33-.087-1.98a6.86 6.86 0 0 1 1.677-2.92c.74-.736 1.706-1.19 2.83-1.19a5.3 5.3 0 0 1 3.432 1.255 14.667 14.667 0 0 0-1.589-2.216 7.235 7.235 0 0 1-4.314 1.262v-.08c-.72 0-1.454-.058-2.177-.17a24.086 24.086 0 0 0 1.446-3.384 8.134 8.134 0 0 1-2.9 1.087 7.962 7.962 0 0 1-7.41-7.722 7.546 7.546 0 0 1 2.878-5.639c1.363-1.042 3.127-1.372 4.876-1.074l-.058.058A9.88 9.88 0 0 0 12.548.636z"/></svg>
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <header className="section-header">
          <h2 id="contact-heading" className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have a question? Want to order a custom cake? We'd love to hear from you!
          </p>
        </header>

        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h3 className="contact-info-title">Let's Start a Conversation</h3>
            <p className="contact-info-text">
              Whether you're planning a wedding, birthday, or just craving something sweet,
              our team is here to help make it perfect.
            </p>

            <div className="contact-methods">
              {contactInfo.map((item, index) => (
                <div key={item.title} className="contact-method">
                  <div className="method-icon" aria-hidden="true">{icons[item.icon]}</div>
                  <div className="method-content">
                    <h4 className="method-title">{item.title}</h4>
                    <p className="method-details">{item.details}</p>
                    <p className="method-hours">{item.hours}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="social-cta">
              <h4>Follow Our Sweet Journey</h4>
              <div className="social-links">
                <button className="social-link" aria-label="Facebook">{socialIcons.facebook}</button>
                <button className="social-link" aria-label="Instagram">{socialIcons.instagram}</button>
                <button className="social-link" aria-label="Twitter">{socialIcons.twitter}</button>
                <button className="social-link" aria-label="Pinterest">{socialIcons.pinterest}</button>
                <button className="social-link" aria-label="TikTok">{socialIcons.tiktok}</button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form-card">
              {submitStatus === 'success' ? (
                <div className="form-success">
                  <div className="success-visual" aria-hidden="true">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSubmitStatus(null)}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name" className="form-label">Full Name *</label>
                      <input id="contact-name" type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="Your name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} disabled={isSubmitting} />
                      {errors.name && <p id="name-error" className="form-error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email" className="form-label">Email *</label>
                      <input id="contact-email" type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="your@email.com" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} disabled={isSubmitting} />
                      {errors.email && <p id="email-error" className="form-error">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-phone" className="form-label">Phone Number</label>
                    <input id="contact-phone" type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="(63) 9703226051" disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label">Subject *</label>
                    <select id="contact-subject" name="subject" className="form-input" value={formData.subject} onChange={handleChange} required aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-error' : undefined} disabled={isSubmitting}>
                      <option value="">Select a topic</option>
                      {subjects.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    {errors.subject && <p id="subject-error" className="form-error">{errors.subject}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">Message *</label>
                    <textarea id="contact-message" name="message" className="form-input form-textarea" value={formData.message} onChange={handleChange} placeholder="Tell us about your cake dreams, event details, or any questions..." rows={5} required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} disabled={isSubmitting} />
                    {errors.message && <p id="message-error" className="form-error">{errors.message}</p>}
                    <p className="form-hint">Minimum 10 characters</p>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg btn-block submit-btn" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'}</button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section" id="faqs">
          <h3 className="faq-title">Frequently Asked Questions</h3>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item">
                <summary className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-toggle" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </summary>
                <p className="faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const faqs = [
  { q: 'How far in advance should I order a custom cake?', a: 'We recommend ordering custom cakes at least 1 week in advance. For wedding cakes and elaborate designs, 4-6 weeks is ideal. Rush orders may be available for an additional fee.' },
  { q: 'Do you offer gluten-free, vegan, or keto options?', a: 'Yes! We have several gluten-free, vegan, and keto-friendly options available. Check our Specialty Cakes category, or contact us for custom dietary requirements.' },
  { q: 'Can I schedule a cake tasting for my wedding?', a: 'Absolutely! We offer complimentary tastings for wedding cakes. Please contact us at least 2 months before your wedding date to schedule a tasting appointment.' },
  { q: 'Do you deliver or is pickup only?', a: 'We offer both pickup and delivery within 15 miles of our bakery. Delivery is free for orders over ₱5,600. For longer distances, please contact us for a quote.' },
  { q: 'What is your cancellation policy?', a: 'Cancellations made 72+ hours before pickup receive a full refund. 48-72 hours: 50% refund. Less than 48 hours: no refund, but we\'ll offer a store credit for future use.' },
  { q: 'How should I store my cake before the event?', a: 'Most cakes should be refrigerated until 1-2 hours before serving. Fondant cakes can stay at room temperature. We provide specific storage instructions with every order.' }
];

export default Contact;
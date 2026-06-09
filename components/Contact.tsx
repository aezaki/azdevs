'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMail, IconMapPin, IconPlus, IconX, IconCalendar } from '@tabler/icons-react';
import { CALENDLY_URL, CONTACT_EMAIL, LOCATION, FAQ_ITEMS, SERVICE_OPTIONS } from '@/lib/constants';
import { scrollReveal } from '@/lib/animations';

interface FormState {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

function FaqItem({ question, answer, open, onToggle }: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: '0.5px solid #dedad2' }}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-left bg-transparent border-0 cursor-pointer gap-4"
        aria-expanded={open}
        style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}
      >
        <span>{question}</span>
        <div
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <IconPlus size={16} style={{ color: '#888' }} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="pb-4"
              style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 500, color: '#444' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          backgroundColor: '#fff',
          border: `0.5px solid ${error ? '#C85A1E' : focused ? '#C85A1E' : '#dedad2'}`,
          borderRadius: '8px',
          padding: '11px 14px',
          fontSize: '14px',
          color: '#1a1a1a',
          outline: 'none',
          width: '100%',
          transition: 'border-color 0.2s',
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} role="alert" style={{ fontSize: '12px', color: '#C85A1E' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', email: '', service: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const [selectFocused, setSelectFocused] = useState(false);
  const [textareaFocused, setTextareaFocused] = useState(false);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email.';
    }
    if (!form.service) newErrors.service = 'Please select a service.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 429) {
        setServerError("You've sent too many messages recently. Please try again in an hour.");
        setStatus('error');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: '#F7F6F2' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          {...scrollReveal()}
          className="mb-12"
          style={{ maxWidth: '560px' }}
        >
          <p
            className="uppercase mb-3"
            style={{ fontSize: '11px', letterSpacing: '2px', color: '#aaaaaa' }}
          >
            Get in touch
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 38px)',
              fontWeight: 500,
              letterSpacing: '-1px',
              lineHeight: 1.2,
              color: '#1a1a1a',
              marginBottom: '12px',
            }}
          >
            Let&apos;s figure out if we&apos;re a good fit.
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.75 }}>
            Drop us a message or book a call directly. Either way, you&apos;ll hear back within one
            business day.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">
          {/* Left column */}
          <motion.div
            {...scrollReveal(0.1)}
            className="flex flex-col gap-5"
          >
            {/* Contact details */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 transition-colors duration-200"
              style={{ fontSize: '14px', color: '#444' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C85A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
            >
              <IconMail size={16} style={{ color: '#888', flexShrink: 0 }} />
              {CONTACT_EMAIL}
            </a>
            <p className="inline-flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
              <IconMapPin size={16} style={{ color: '#888', flexShrink: 0 }} />
              {LOCATION}
            </p>

            {/* Calendly button */}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium transition-colors duration-200 self-start"
              style={{
                backgroundColor: '#1a1a1a',
                color: '#F7F6F2',
                padding: '13px 26px',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C85A1E')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
            >
              <IconCalendar size={16} />
              Book a call on Calendly
            </a>

            {/* Divider */}
            <div style={{ borderTop: '0.5px solid #dedad2', paddingTop: '20px', marginTop: '4px' }}>
              <p
                className="uppercase mb-4"
                style={{ fontSize: '11px', letterSpacing: '2px', color: '#aaaaaa' }}
              >
                Before you reach out
              </p>
              <div className="flex flex-col">
                {FAQ_ITEMS.map((item, i) => (
                  <FaqItem
                    key={i}
                    question={item.question}
                    answer={item.answer}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column — form */}
          <motion.div
            {...scrollReveal(0.15)}
          >
            {status === 'success' ? (
              <div
                className="flex flex-col gap-4 items-start"
                style={{
                  backgroundColor: '#fff',
                  border: '0.5px solid #dedad2',
                  borderRadius: '12px',
                  padding: '40px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#FDF0E8',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconMail size={20} style={{ color: '#C85A1E' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#1a1a1a' }}>
                  Message sent.
                </h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>
                  Thanks for reaching out. We&apos;ll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  backgroundColor: '#fff',
                  border: '0.5px solid #dedad2',
                  borderRadius: '12px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Name"
                    id="name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    error={errors.name}
                    placeholder="Your name"
                  />
                  <InputField
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    error={errors.email}
                    placeholder="you@example.com"
                  />
                </div>

                {/* Service */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="service"
                    style={{ fontSize: '13px', fontWeight: 500, color: '#444' }}
                  >
                    Service
                  </label>
                  <select
                    id="service"
                    value={form.service}
                    onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                    onFocus={() => setSelectFocused(true)}
                    onBlur={() => setSelectFocused(false)}
                    style={{
                      backgroundColor: '#fff',
                      border: `0.5px solid ${errors.service ? '#C85A1E' : selectFocused ? '#C85A1E' : '#dedad2'}`,
                      borderRadius: '8px',
                      padding: '11px 14px',
                      fontSize: '14px',
                      color: form.service ? '#1a1a1a' : '#aaaaaa',
                      outline: 'none',
                      width: '100%',
                      transition: 'border-color 0.2s',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 14px center',
                    }}
                    aria-invalid={!!errors.service}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p role="alert" style={{ fontSize: '12px', color: '#C85A1E' }}>
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    style={{ fontSize: '13px', fontWeight: 500, color: '#444' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    onFocus={() => setTextareaFocused(true)}
                    onBlur={() => setTextareaFocused(false)}
                    placeholder="Tell us what you're working on..."
                    rows={5}
                    style={{
                      backgroundColor: '#fff',
                      border: `0.5px solid ${errors.message ? '#C85A1E' : textareaFocused ? '#C85A1E' : '#dedad2'}`,
                      borderRadius: '8px',
                      padding: '11px 14px',
                      fontSize: '14px',
                      color: '#1a1a1a',
                      outline: 'none',
                      width: '100%',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit',
                    }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" style={{ fontSize: '12px', color: '#C85A1E' }}>
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {status === 'error' && serverError && (
                  <p
                    role="alert"
                    className="flex items-center gap-2"
                    style={{ fontSize: '13px', color: '#C85A1E' }}
                  >
                    <IconX size={14} />
                    {serverError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#C85A1E',
                    color: '#fff',
                    padding: '13px 26px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    border: 'none',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'loading')
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#a8481a';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#C85A1E';
                  }}
                >
                  {status === 'loading' ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

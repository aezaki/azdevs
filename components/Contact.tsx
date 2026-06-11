/**
 * @file components/Contact.tsx
 * @description Contact section with a two-column layout: left column has contact
 *              details, a Calendly booking button, and an FAQ accordion; right
 *              column has the enquiry form with validation and server submission.
 *
 * @section Contact (id="contact")
 * @dependencies framer-motion, @tabler/icons-react, lib/animations, lib/constants
 *
 * @notes Client-side validation runs on submit via `validate()` before the fetch.
 *        The `status` state machine (idle → loading → success | error) prevents
 *        double-submit and shows appropriate UI for each state. Server errors
 *        surface the error message returned by /api/contact; rate limit (429) gets
 *        a specific user-facing message without exposing the implementation detail.
 *
 *        Section columns enter from opposite sides (left: x:-16, right: x:16) and
 *        meet in the middle after the section header has arrived.
 *
 *        FAQ `+` icon rotates 45deg to `×` via Framer Motion (not CSS transform)
 *        using a snappy custom ease [0.04, 0.62, 0.23, 0.98].
 *
 *        InputField wraps in a motion.div so focus drives scale:1.005 + ring
 *        box-shadow — the input activation feels physical.
 *
 *        useReducedMotion: spatial animations disabled.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconMail, IconMapPin, IconPlus, IconX, IconCalendar } from '@tabler/icons-react';
import { CALENDLY_URL, CONTACT_EMAIL, LOCATION, FAQ_ITEMS, SERVICE_OPTIONS } from '@/lib/constants';
import { scrollReveal, scrollRevealReduced, ease, tapPress } from '@/lib/animations';

// ─── Types ─────────────────────────────────────────────────────────────────────

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

// ─── Constants ─────────────────────────────────────────────────────────────────

// Snappier on open, smoother on close
const faqEase: [number, number, number, number] = [0.04, 0.62, 0.23, 0.98];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const panelId = `faq-panel-${index}`;

  return (
    <div style={{ borderBottom: '0.5px solid var(--color-border)' }}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-left bg-transparent border-0 cursor-pointer gap-4"
        aria-expanded={open}
        aria-controls={panelId}
        style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-dark)' }}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22, ease: faqEase }}
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <IconPlus size={16} style={{ color: 'var(--color-subtle)' }} />
        </motion.div>
      </button>

      {/* CSS grid-row trick: animates grid-template-rows 0fr→1fr — no layout thrash */}
      <div
        id={panelId}
        role="region"
        aria-hidden={!open}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: `grid-template-rows 0.28s cubic-bezier(${faqEase.join(',')})`,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p className="pb-4" style={{ fontSize: '14px', color: 'var(--color-muted)', lineHeight: 1.8 }}>
            {answer}
          </p>
        </div>
      </div>
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
  maxLength,
  autoComplete,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  required?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink-light)' }}>
        {label}{required && <span style={{ color: 'var(--color-accent-text)', marginLeft: '3px' }} aria-hidden="true">*</span>}
      </label>
      {/* Wrapper scales slightly on focus — gives the input a sense of activation */}
      <motion.div
        animate={prefersReducedMotion ? {} : { scale: focused ? 1.005 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `0.5px solid ${error ? 'var(--color-accent)' : focused ? 'var(--color-accent)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-btn)',
            padding: '11px 14px',
            fontSize: '14px',
            color: 'var(--color-dark)',
            outline: 'none',
            width: '100%',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused && !error ? '0 0 0 3px rgba(200,90,30,0.1)' : 'none',
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </motion.div>
      {error && (
        <p id={`${id}-error`} role="alert" style={{ fontSize: '12px', color: 'var(--color-accent-text)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();

  // ─── State ──────────────────────────────────────────────────────────────────

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', email: '', service: '', message: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const shouldFocusError = useRef(false);

  useEffect(() => {
    if (shouldFocusError.current) {
      shouldFocusError.current = false;
      const firstInvalid = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
      firstInvalid?.focus();
    }
  }, [errors]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [selectFocused, setSelectFocused] = useState(false);
  const [textareaFocused, setTextareaFocused] = useState(false);
  const [calHovered, setCalHovered] = useState(false);

  // ─── Validation ─────────────────────────────────────────────────────────────

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

  // ─── Submit handler ─────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      shouldFocusError.current = true;
      return;
    }

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

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      id="contact"
      className="py-12 md:py-[72px] px-5 md:px-12"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-[1200px]">

        {/* Section header — enters first */}
        <motion.div
          {...(prefersReducedMotion ? scrollRevealReduced() : scrollReveal())}
          className="mb-12"
          style={{ maxWidth: '560px' }}
        >
          <h2
            style={{
              fontSize: 'var(--type-section-heading)',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              color: 'var(--color-dark)',
              marginBottom: '12px',
            }}
          >
            Let&apos;s figure out if we&apos;re a good fit.
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-muted)', lineHeight: 1.8 }}>
            Drop us a message or book a call directly. Either way, you&apos;ll hear back within one
            business day.
          </p>
        </motion.div>

        {/* Two columns enter from opposite sides and meet in the middle */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">

          {/* ── Left: slides in from x:-16 ── */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 transition-colors duration-200"
              style={{ fontSize: '14px', color: 'var(--color-ink-light)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-light)')}
            >
              <IconMail size={16} style={{ color: 'var(--color-subtle)', flexShrink: 0 }} aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>

            <p className="inline-flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
              <IconMapPin size={16} style={{ color: 'var(--color-subtle)', flexShrink: 0 }} aria-hidden="true" />
              {LOCATION}
            </p>

            {/* Calendly CTA — calendar icon tilts -12deg on hover */}
            <motion.a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium transition-colors duration-200 w-fit self-start"
              style={{
                backgroundColor: 'var(--color-dark)',
                color: 'var(--color-bg)',
                padding: '14px 26px',
                borderRadius: 'var(--radius-btn)',
                fontSize: '14px',
              }}
              whileTap={tapPress}
              onHoverStart={() => setCalHovered(true)}
              onHoverEnd={() => setCalHovered(false)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-dark)')}
            >
              <motion.span
                animate={prefersReducedMotion ? {} : { rotate: calHovered ? -12 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-flex' }}
                aria-hidden="true"
              >
                <IconCalendar size={16} />
              </motion.span>
              Book a free call
            </motion.a>

            {/* FAQ accordion */}
            <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '20px', marginTop: '4px' }}>
              <div className="flex flex-col">
                {FAQ_ITEMS.map((item, i) => (
                  <FaqItem
                    key={i}
                    index={i}
                    question={item.question}
                    answer={item.answer}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: slides in from x:16 ── */}
          <motion.div
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
          >
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col gap-4 items-start"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-card)',
                  padding: '40px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-accent-light)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-hidden="true"
                >
                  <IconMail size={20} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-dark)' }}>
                  Got it, {form.name.split(' ')[0] || 'there'}.
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.8 }}>
                  Your message about <strong style={{ color: 'var(--color-dark)', fontWeight: 500 }}>{form.service.toLowerCase()}</strong> is in. Andrew reviews every inquiry personally and will follow up within one business day, usually the same day.
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.7 }}>
                  In the meantime, you can book a call directly if you&apos;d rather skip the back-and-forth.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-accent-text)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Book a free call
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-card)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Name"
                    id="name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    error={errors.name}
                    placeholder="Your name"
                    maxLength={200}
                    autoComplete="name"
                    required
                  />
                  <InputField
                    label="Email"
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    error={errors.email}
                    placeholder="you@example.com"
                    maxLength={254}
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Service select */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="service"
                    style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink-light)' }}
                  >
                    Service<span style={{ color: 'var(--color-accent-text)', marginLeft: '3px' }} aria-hidden="true">*</span>
                  </label>
                  <motion.div
                    animate={{ scale: selectFocused ? 1.005 : 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <select
                      id="service"
                      value={form.service}
                      onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                      onFocus={() => setSelectFocused(true)}
                      onBlur={() => setSelectFocused(false)}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: `0.5px solid ${errors.service ? 'var(--color-accent)' : selectFocused ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-btn)',
                        padding: '11px 14px',
                        fontSize: '14px',
                        color: form.service ? 'var(--color-dark)' : '#767676',
                        outline: 'none',
                        width: '100%',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        boxShadow: selectFocused && !errors.service ? '0 0 0 3px rgba(200,90,30,0.1)' : 'none',
                      }}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? 'service-error' : undefined}
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
                  </motion.div>
                  {errors.service && (
                    <p id="service-error" role="alert" style={{ fontSize: '12px', color: 'var(--color-accent-text)' }}>
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Message textarea */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-ink-light)' }}
                  >
                    Message<span style={{ color: 'var(--color-accent-text)', marginLeft: '3px' }} aria-hidden="true">*</span>
                  </label>
                  <motion.div
                    animate={{ scale: textareaFocused ? 1.005 : 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      onFocus={() => setTextareaFocused(true)}
                      onBlur={() => setTextareaFocused(false)}
                      placeholder="Tell us what you're working on..."
                      rows={5}
                      maxLength={5000}
                      required
                      aria-describedby={errors.message ? 'message-error' : 'message-count'}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: `0.5px solid ${errors.message ? 'var(--color-accent)' : textareaFocused ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-btn)',
                        padding: '11px 14px',
                        fontSize: '14px',
                        color: 'var(--color-dark)',
                        outline: 'none',
                        width: '100%',
                        resize: 'vertical',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        fontFamily: 'inherit',
                        boxShadow: textareaFocused && !errors.message ? '0 0 0 3px rgba(200,90,30,0.1)' : 'none',
                      }}
                      aria-invalid={!!errors.message}
                    />
                  </motion.div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {errors.message && (
                        <p id="message-error" role="alert" style={{ fontSize: '12px', color: 'var(--color-accent-text)' }}>
                          {errors.message}
                        </p>
                      )}
                    </div>
                    {form.message.length > 0 && (
                      <p
                        id="message-count"
                        aria-live="polite"
                        style={{
                          fontSize: '11px',
                          color: form.message.length > 4500 ? 'var(--color-accent-text)' : '#767676',
                          flexShrink: 0,
                        }}
                      >
                        {form.message.length.toLocaleString()} / 5,000
                      </p>
                    )}
                  </div>
                </div>

                {/* Server-side error banner */}
                {status === 'error' && serverError && (
                  <p
                    role="alert"
                    className="flex items-center gap-2"
                    style={{ fontSize: '13px', color: 'var(--color-accent-text)' }}
                  >
                    <IconX size={14} aria-hidden="true" />
                    {serverError}
                  </p>
                )}

                {/* Response-time reassurance before the click */}
                <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '-8px' }}>
                  You&apos;ll hear back within one business day, usually the same day.
                </p>

                {/* Submit — whileTap press effect + inline spinner while loading */}
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileTap={status === 'loading' ? undefined : tapPress}
                  className="w-full sm:w-fit sm:self-start font-medium inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-surface)',
                    padding: '13px 26px',
                    borderRadius: 'var(--radius-btn)',
                    fontSize: '14px',
                    border: 'none',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'loading')
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-text)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)';
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
                        style={{
                          display: 'inline-block',
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      />
                      Sending…
                    </>
                  ) : (
                    'Send message'
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

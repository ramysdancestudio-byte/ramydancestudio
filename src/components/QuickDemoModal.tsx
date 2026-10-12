import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Check,
  Send,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { studioInfo } from '../data/danceData';
import { openRazorpayCheckout } from '../utils/razorpayClient';

interface QuickDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: unknown[];
}

// Time slots strictly between 11:00 AM and 7:00 PM
const DEMO_TIME_SLOTS = [
  '11:00 AM – 12:00 PM',
  '12:00 PM – 01:00 PM',
  '01:00 PM – 02:00 PM',
  '02:00 PM – 03:00 PM',
  '03:00 PM – 04:00 PM',
  '04:00 PM – 05:00 PM',
  '05:00 PM – 06:00 PM',
  '06:00 PM – 07:00 PM',
];

// Available days (Monday to Sunday)
const DEMO_DAYS = [
  { id: 'Mon', label: 'Monday', short: 'Mon' },
  { id: 'Tue', label: 'Tuesday', short: 'Tue' },
  { id: 'Wed', label: 'Wednesday', short: 'Wed' },
  { id: 'Thu', label: 'Thursday', short: 'Thu' },
  { id: 'Fri', label: 'Friday', short: 'Fri' },
  { id: 'Sat', label: 'Saturday', short: 'Sat' },
  { id: 'Sun', label: 'Sunday', short: 'Sun' },
];

export const QuickDemoModal: React.FC<QuickDemoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(DEMO_TIME_SLOTS[0]);

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);

  if (!isOpen) return null;

  const handleBookDemo = () => {
    if (!name.trim()) {
      setErrorMessage('Please enter student full name');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp mobile number');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    const chosenDayObj = DEMO_DAYS.find((d) => d.id === selectedDay);
    const dayLabel = chosenDayObj ? chosenDayObj.label : selectedDay;
    const dateDetail = selectedDate ? `${dayLabel} (${selectedDate})` : dayLabel;
    const batchSummary = `Trial Demo on ${dateDetail} at ${selectedTimeSlot}`;

    openRazorpayCheckout({
      studentName: name.trim(),
      studentPhone: cleanPhone,
      programId: 'trial-demo-class',
      programName: 'Trial Demo Class',
      planType: 'demo',
      preferredDate: selectedDate || dayLabel,
      preferredTime: selectedTimeSlot,
      batchDetails: batchSummary,
      onSuccess: (result) => {
        setIsProcessing(false);
        setLastPaymentId(result.paymentId);

        const nowStr = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        });

        // WhatsApp message to Ramy Sir / Admin
        const formattedReceipt =
          `📩 *TRIAL DEMO ADMISSION & PAYMENT CONFIRMATION*\n` +
          `To: Ramy Sir / Admin (Ramy's Dance Studio)\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Hello Ramy Sir, maine website par trial demo class book kiya hai aur ₹49 payment Razorpay se successfully kar diya hai.\n\n` +
          `🎟️ *DEMO BOOKING DETAILS:*\n` +
          `• *Class:* Studio Trial Demo Class (₹49)\n` +
          `• *Preferred Day:* ${dayLabel}${selectedDate ? ` (${selectedDate})` : ''}\n` +
          `• *Time Slot:* ${selectedTimeSlot} (11:00 AM – 7:00 PM)\n\n` +
          `👤 *STUDENT DETAILS:*\n` +
          `• *Student Name:* ${name.trim()}\n` +
          `• *WhatsApp Number:* ${cleanPhone}\n\n` +
          `💳 *PAYMENT TRANSACTION:*\n` +
          `• *Amount Paid:* ₹49\n` +
          `• *Payment Status:* SUCCESS (PAID VIA RAZORPAY)\n` +
          `• *Razorpay Payment ID:* ${result.paymentId}\n` +
          `• *Date & Time:* ${nowStr}\n\n` +
          `⚡ *ACTION NEEDED:*\n` +
          `👉 Sir, kripya Razorpay dashboard me payment verify karke meri demo class seat confirm karein.`;

        const waUrl = `https://wa.me/91${studioInfo.phone}?text=${encodeURIComponent(formattedReceipt)}`;
        setLastWhatsAppUrl(waUrl);
        setStep('success');
      },
      onFailure: (errMsg) => {
        setIsProcessing(false);
        setErrorMessage(errMsg || 'Payment failed. Please try again.');
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100 animate-in fade-in zoom-in-95 duration-200 text-neutral-900 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0066FF] to-blue-700 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs tracking-wider uppercase backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              TRIAL DEMO CLASS
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 font-black text-xs">
              ₹49 ONLY
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Book Your Demo Class
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Experience 60 minutes of live studio training at Ramy&apos;s Dance Studio
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {step === 'form' ? (
            <>
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Student Details */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  1. Student Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Student Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="WhatsApp Number (10 digits) *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Day Selection (Monday to Sunday) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                    2. Select Day
                  </label>
                  <span className="text-[11px] text-neutral-500 font-medium">Mon to Sun Open</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {DEMO_DAYS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDay(d.id)}
                      className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                        selectedDay === d.id
                          ? 'bg-[#0066FF] text-white font-black shadow-md ring-2 ring-blue-300 scale-105'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-bold'
                      }`}
                    >
                      <span className="block text-xs">{d.short}</span>
                    </button>
                  ))}
                </div>
                {/* Optional specific date */}
                <div className="pt-1">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                    placeholder="Specific Date (Optional)"
                  />
                </div>
              </div>

              {/* Time Selection between 11 AM and 7 PM */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                    3. Select Time (11:00 AM to 7:00 PM)
                  </label>
                  <span className="text-[11px] text-neutral-500 font-medium">1-Hour Slot</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'border-[#0066FF] bg-blue-50/80 text-[#0066FF] shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{slot}</span>
                      {selectedTimeSlot === slot && (
                        <Check className="w-3.5 h-3.5 text-[#0066FF] stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Summary */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase">Trial Demo Pass</div>
                  <div className="text-xs text-neutral-600 mt-0.5">
                    60-min studio class with trainer
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-neutral-950 font-display">₹49</div>
                  <div className="text-[10px] text-emerald-600 font-extrabold uppercase">
                    Non-recurring
                  </div>
                </div>
              </div>

              {/* Bottom Book Your Demo Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleBookDemo}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0066FF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{isProcessing ? 'Connecting Gateway...' : 'BOOK YOUR DEMO — ₹49'}</span>
                </button>
                <p className="text-center text-[11px] text-neutral-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Secure via Razorpay (UPI, GPay, PhonePe, Cards)
                </p>
              </div>
            </>
          ) : (
            /* Success Screen with WhatsApp Confirmation */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold font-display text-neutral-900">
                Demo Booking Successful!
              </h3>
              <p className="text-neutral-600 text-sm max-w-sm mx-auto">
                Aapka ₹49 Trial Demo slot reserve ho gaya hai. Kripya WhatsApp par receipt send karke confirm karein.
              </p>

              {/* Booking Summary Card */}
              <div className="bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-200 space-y-2 text-xs text-neutral-700">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Student Name:</span>
                  <span className="font-bold text-neutral-900">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">WhatsApp:</span>
                  <span className="font-bold text-neutral-900">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Booking:</span>
                  <span className="font-bold text-blue-600">Studio Trial Demo Class</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Preferred Day:</span>
                  <span className="font-bold text-neutral-900">
                    {DEMO_DAYS.find((d) => d.id === selectedDay)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Time Slot:</span>
                  <span className="font-bold text-neutral-900">{selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-neutral-200">
                  <span className="text-neutral-500">Amount Paid:</span>
                  <span className="font-black text-emerald-600 text-sm">₹49 (Razorpay)</span>
                </div>
                {lastPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Payment ID:</span>
                    <span className="font-mono text-[11px] text-neutral-600">{lastPaymentId}</span>
                  </div>
                )}
              </div>

              {/* Confirmation on WhatsApp */}
              {lastWhatsAppUrl && (
                !hasSentWhatsApp ? (
                  <div className="pt-2">
                    <a
                      href={lastWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setHasSentWhatsApp(true)}
                      className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] hover:from-[#20ba59] hover:to-[#17a54f] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer border border-emerald-400"
                    >
                      <Send className="w-4 h-4 fill-white" />
                      <span>CONFIRM BOOKING ON WHATSAPP</span>
                    </a>
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>DONE</span>
                    </button>
                    <div>
                      <a
                        href={lastWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-500 hover:text-emerald-700 font-semibold underline"
                      >
                        Reopen WhatsApp message if needed
                      </a>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

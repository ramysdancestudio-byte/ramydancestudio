import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Phone, User, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { RealWhatsappIcon } from './BrandIcons';
import { studioInfo } from '../data/danceData';
import { CategoryItem } from '../data/categoriesData';

interface AutoEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: CategoryItem[];
}

const PROGRAM_OPTIONS = [
  'Kids Foundation Dance',
  'Bollywood & Ladies Batch',
  'Advance Professional Batch',
  'Gymnastics & Flexibility',
  'Wedding Choreography',
  '1-on-1 Private Class',
  'Other / General Inquiry',
];

const TIMING_OPTIONS = [
  'Morning (9:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 7:00 PM)',
  'Sunday / Weekend Batch',
  'Flexible / Any Slot',
];

export const AutoEnquiryModal: React.FC<AutoEnquiryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(PROGRAM_OPTIONS[0]);
  const [selectedTiming, setSelectedTiming] = useState(TIMING_OPTIONS[2]);
  const [ageGroup, setAgeGroup] = useState('Kids (4-14 yrs)');
  const [customNote, setCustomNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    if (!trimmedName) {
      setErrorMsg('Kripya apna naam enter karein (Please enter your name)');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMsg('Kripya 10-digit WhatsApp number enter karein');
      return;
    }

    // Format professional, structured WhatsApp inquiry message
    const formattedMessage =
      `📩 *NEW WEBSITE ADMISSION & BATCH ENQUIRY*\n` +
      `To: Ramy Sir / Admin (Ramy's Dance Studio)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Namaste Ramy Sir, maine website par quick inquiry form fill kiya hai. Kripya mujhe batch timings, admission process aur fees share karein.\n\n` +
      `👤 *STUDENT DETAILS:*\n` +
      `• *Name:* ${trimmedName}\n` +
      `• *WhatsApp Number:* +91 ${cleanPhone.slice(-10)}\n` +
      `• *Age Group:* ${ageGroup}\n\n` +
      `🎟️ *INTERESTED DANCE PROGRAM:*\n` +
      `• *Style:* ${selectedProgram}\n` +
      `• *Preferred Timing:* ${selectedTiming}\n` +
      (customNote.trim() ? `• *Questions / Notes:* ${customNote.trim()}\n` : '') +
      `\n⚡ *REQUEST:*\n` +
      `👉 Sir, kripya available batch seats aur trial demo class ki details WhatsApp par bhej dijiye!`;

    const whatsappUrl = `https://wa.me/${studioInfo.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;

    // Save inquiry to server records asynchronously
    try {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: {
            name: trimmedName,
            phone: cleanPhone,
            program: selectedProgram,
            plan: 'Website Quick Enquiry',
            batch: `${selectedTiming} (${ageGroup})`,
            fee: 'Enquiry / Pending',
            paymentStatus: 'ENQUIRY_WHATSAPP_SENT',
            isDemo: false,
          },
        }),
      }).catch(() => {});
    } catch {}

    setIsSubmitted(true);

    // Open WhatsApp in a new tab/app
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Gradient Accent */}
        <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white p-5 sm:p-6 pb-6">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-white/40"
            aria-label="Close Enquiry Form"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 id="enquiry-modal-title" className="text-xl sm:text-2xl font-black font-display tracking-tight text-white pr-8">
            Get Class Details & Fees Instantly
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            Connect directly with Ramy Sir & instructors for batch schedules, trial classes, and admission guidance.
          </p>
        </div>

        {isSubmitted ? (
          /* Submission Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Opening WhatsApp...
            </h3>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              Aapka enquiry message tayar hai aur WhatsApp open ho raha hai. WhatsApp par message send karke instant reply paayein!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
              >
                Close & Browse Website
              </button>
            </div>
          </div>
        ) : (
          /* Main Inquiry Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-left">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Student Name */}
            <div>
              <label htmlFor="enquiry-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Student / Parent Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                />
              </div>
            </div>

            {/* WhatsApp Mobile Number */}
            <div>
              <label htmlFor="enquiry-phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                WhatsApp Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                  +91
                </span>
                <input
                  id="enquiry-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors"
                />
              </div>
            </div>

            {/* Dance Program Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="enquiry-program" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Dance Program / Category
                </label>
                <select
                  id="enquiry-program"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 text-xs sm:text-sm text-neutral-900 bg-white transition-colors"
                >
                  {PROGRAM_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Group */}
              <div>
                <label htmlFor="enquiry-age" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Age Group
                </label>
                <select
                  id="enquiry-age"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 text-xs sm:text-sm text-neutral-900 bg-white transition-colors"
                >
                  <option value="Kids (4-10 yrs)">Kids (4-10 yrs)</option>
                  <option value="Teens (11-17 yrs)">Teens (11-17 yrs)</option>
                  <option value="Adults (18+ yrs)">Adults (18+ yrs)</option>
                  <option value="Ladies Special">Ladies Special</option>
                </select>
              </div>
            </div>

            {/* Preferred Timing */}
            <div>
              <label htmlFor="enquiry-timing" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Preferred Timing / Slot
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  id="enquiry-timing"
                  value={selectedTiming}
                  onChange={(e) => setSelectedTiming(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 text-xs sm:text-sm text-neutral-900 bg-white transition-colors"
                >
                  {TIMING_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Note / Message (Optional) */}
            <div>
              <label htmlFor="enquiry-note" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Any Question or Request? <span className="text-neutral-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <textarea
                  id="enquiry-note"
                  rows={2}
                  placeholder="e.g. Can I attend a trial class this Sunday?"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-neutral-300 focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit via WhatsApp Button */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer group"
              >
                <RealWhatsappIcon className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Send Enquiry on WhatsApp</span>
                <Send className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 px-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-neutral-800 transition-colors underline cursor-pointer"
                >
                  Explore website first
                </button>
                <a
                  href={`tel:${studioInfo.phone}`}
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-500" /> Direct Call: {studioInfo.phone}
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

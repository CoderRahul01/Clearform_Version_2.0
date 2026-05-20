import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiArrowDownSLine } from 'react-icons/ri';
import Topbar from '@/components/layout/Topbar';
import NotificationCenter from '@/features/forms/components/NotificationCenter';

const pageEase = [0.25, 0.1, 0.25, 1];

const FAQS = [
  'How do I share a form with respondents?',
  'Where can I see my form responses?',
  'Can I add logic to show or hide fields?',
  'How do I invite teammates to a workspace?',
  'Can I export responses to a spreadsheet?',
  'How do I set a form to close after a deadline?',
];

const FaqRow = ({ question, open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex flex-col border-b border-[#f0efeb] last:border-b-0 text-left cursor-pointer hover:bg-[#fafaf8] transition-colors"
  >
    <div className="flex items-center justify-between pl-[18px] pr-[18px] py-[14px] gap-3">
      <span className="text-[13px] font-medium text-[#111] leading-[normal]">
        {question}
      </span>
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2, ease: pageEase }}
        className="shrink-0 text-[#6b6966]"
      >
        <RiArrowDownSLine size={18} />
      </motion.span>
    </div>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: pageEase }}
          className="overflow-hidden"
        >
          <p className="px-[18px] pb-4 text-[12px] text-[#777] leading-[18px]">
            See the documentation or contact support for step-by-step guidance on this topic.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </button>
);

const HelpSupportPage = () => {
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <NotificationCenter />
      <div className="flex flex-col h-full min-h-0 overflow-hidden bg-[#f5f4f0]">
        <Topbar title="Help & Support" useFormsLoading={false} />
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-12">
          <div className="max-w-[910px] mx-auto flex flex-col gap-4">
            <h2 className="text-[22px] font-semibold text-[#111110] tracking-[-0.44px] leading-[normal]">
              Help & Support
            </h2>
            <p className="text-[13px] font-normal text-[#777] leading-[normal]">
              Answers to common questions, or reach out to us directly.
            </p>

            <div className="pt-7">
              <p className="text-[12px] font-semibold text-[#999] leading-[normal] mb-0">
                Frequently asked questions
              </p>
            </div>

            <div className="bg-white border border-[#e4e3df] rounded-[10px] overflow-hidden shadow-sm">
              {FAQS.map((q, i) => (
                <FaqRow
                  key={q}
                  question={q}
                  open={openId === i}
                  onToggle={() => setOpenId((id) => (id === i ? null : i))}
                />
              ))}
            </div>

            <div className="pt-7">
              <p className="text-[12px] font-semibold text-[#999] leading-[normal]">
                Get in touch
              </p>
            </div>

            <div className="bg-white border border-[#e4e3df] rounded-[10px] p-[19px] flex flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-[13px] font-semibold text-[#111110] leading-[normal] pt-0.5">
                  Email us
                </h3>
                <a
                  href="mailto:support@clearform.io"
                  className="bg-[#f5f4f0] border border-[#e4e3df] rounded-md px-[13px] py-[7px] text-[12px] font-medium text-[#111] hover:bg-[#eceae4] transition-colors"
                >
                  support@clearform.io
                </a>
              </div>
              <p className="text-[12px] font-normal text-[#777] leading-[18px]">
                Send us a message and we&apos;ll get back to you within one business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpSupportPage;

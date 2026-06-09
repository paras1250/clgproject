import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Perfect for getting started with AI chatbots.',
        badge: null,
        features: [
            { text: '1 Chatbot', included: true },
            { text: '100 Messages / month', included: true },
            { text: 'Basic Customization', included: true },
            { text: 'Email Support', included: true },
            { text: 'Analytics Dashboard', included: false },
            { text: 'Priority Support', included: false },
            { text: 'Custom Branding', included: false },
        ],
        cta: 'Get Started for Free',
        highlight: false,
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For growing businesses that need more power.',
        badge: 'Popular',
        features: [
            { text: '10 Chatbots', included: true },
            { text: '5,000 Messages / month', included: true },
            { text: 'Full Customization', included: true },
            { text: 'Priority Email Support', included: true },
            { text: 'Analytics Dashboard', included: true },
            { text: 'Priority Support', included: true },
            { text: 'Custom Branding', included: false },
        ],
        cta: 'Start Pro Plan',
        highlight: true,
    },
    {
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        description: 'For large teams with advanced needs.',
        badge: null,
        features: [
            { text: 'Unlimited Chatbots', included: true },
            { text: 'Unlimited Messages', included: true },
            { text: 'Full Customization', included: true },
            { text: 'Dedicated Support', included: true },
            { text: 'Advanced Analytics', included: true },
            { text: 'Priority Support', included: true },
            { text: 'Custom Branding', included: true },
        ],
        cta: 'Contact Sales',
        highlight: false,
    },
];

const faqs = [
    {
        question: 'Can I switch plans later?',
        answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
    },
    {
        question: 'What happens when I exceed my message limit?',
        answer: 'When you reach your message limit, your chatbot will stop responding until the next billing cycle. You can upgrade your plan to get more messages.',
    },
    {
        question: 'Do you offer refunds?',
        answer: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
    },
    {
        question: 'Can I use my own AI model?',
        answer: 'Enterprise plan users can integrate custom AI models. Contact our sales team for more information on custom integrations.',
    },
    {
        question: 'Is there a free trial for paid plans?',
        answer: 'Yes! All paid plans come with a 7-day free trial. No credit card required to start.',
    },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#182034] transition-colors"
            >
                <span className="font-semibold text-[#F1F5F9] font-inter">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-[#64748B]" /> : <ChevronDown size={20} className="text-[#64748B]" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-4 text-[#94A3B8] leading-relaxed font-inter">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default function Pricing() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return null;
}

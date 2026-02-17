import Head from 'next/head';
import { useState } from 'react';
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
        <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-[#F8FAFC]">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-[#64748B]" /> : <ChevronDown size={20} className="text-[#64748B]" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-4 text-[#94A3B8] leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#0F172A]">
            <Head>
                <title>Pricing - Conversio AI</title>
                <meta name="description" content="Choose the right plan for your AI chatbot needs." />
            </Head>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#F8FAFC] mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
                        Choose the plan that fits your needs. Start free and scale as you grow.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-[#1E293B] rounded-3xl border p-8 flex flex-col transition-all hover:shadow-lg ${plan.highlight
                                ? 'border-[#3B82F6] shadow-lg shadow-blue-500/10 scale-[1.02]'
                                : 'border-white/10'
                                }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-xs font-bold px-4 py-1 rounded-full">
                                    {plan.badge}
                                </span>
                            )}

                            <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{plan.name}</h3>
                            <p className="text-[#94A3B8] text-sm mb-6">{plan.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-[#F8FAFC]">{plan.price}</span>
                                <span className="text-[#64748B]">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check size={18} className="text-[#10B981] flex-shrink-0" />
                                        ) : (
                                            <X size={18} className="text-[#64748B] flex-shrink-0" />
                                        )}
                                        <span className={feature.included ? 'text-[#F8FAFC]' : 'text-[#64748B]'}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/login">
                                <button
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${plan.highlight
                                        ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-lg shadow-blue-500/25'
                                        : 'bg-white/5 text-[#F8FAFC] hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-[#F8FAFC] text-center mb-8">Feature Comparison</h2>
                    <div className="bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left px-6 py-4 font-semibold text-[#94A3B8]">Feature</th>
                                    <th className="text-center px-6 py-4 font-semibold text-[#94A3B8]">Free</th>
                                    <th className="text-center px-6 py-4 font-semibold text-[#94A3B8]">Pro</th>
                                    <th className="text-center px-6 py-4 font-semibold text-[#94A3B8]">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    ['Chatbots', '1', '10', 'Unlimited'],
                                    ['Messages / month', '100', '5,000', 'Unlimited'],
                                    ['Customization', 'Basic', 'Full', 'Full'],
                                    ['Analytics', false, true, true],
                                    ['Priority Support', false, true, true],
                                    ['Custom Branding', false, false, true],
                                    ['Dedicated Account Manager', false, false, true],
                                    ['API Access', false, true, true],
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#F8FAFC]">{row[0]}</td>
                                        {[row[1], row[2], row[3]].map((val, i) => (
                                            <td key={i} className="px-6 py-4 text-center">
                                                {typeof val === 'boolean' ? (
                                                    val ? <Check size={18} className="text-[#10B981] mx-auto" /> : <X size={18} className="text-[#64748B] mx-auto" />
                                                ) : (
                                                    <span className="text-[#94A3B8] font-medium">{val}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#F8FAFC] text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

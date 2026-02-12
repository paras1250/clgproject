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
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-[#0A0807]">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            {isOpen && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Head>
                <title>Pricing - Conversio AI</title>
                <meta name="description" content="Choose the right plan for your AI chatbot needs." />
            </Head>
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0A0807] mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Choose the plan that fits your needs. Start free and scale as you grow.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white rounded-3xl border p-8 flex flex-col transition-all hover:shadow-lg ${plan.highlight
                                    ? 'border-[#0A0807] shadow-md scale-[1.02]'
                                    : 'border-gray-200 shadow-sm'
                                }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0A0807] text-white text-xs font-bold px-4 py-1 rounded-full">
                                    {plan.badge}
                                </span>
                            )}

                            <h3 className="text-xl font-bold text-[#0A0807] mb-2">{plan.name}</h3>
                            <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-[#0A0807]">{plan.price}</span>
                                <span className="text-gray-500">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <Check size={18} className="text-green-500 flex-shrink-0" />
                                        ) : (
                                            <X size={18} className="text-gray-300 flex-shrink-0" />
                                        )}
                                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/login">
                                <button
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all ${plan.highlight
                                            ? 'bg-[#0A0807] text-white hover:opacity-90'
                                            : 'bg-gray-100 text-[#0A0807] hover:bg-gray-200'
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
                    <h2 className="text-2xl font-bold text-[#0A0807] text-center mb-8">Feature Comparison</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Feature</th>
                                    <th className="text-center px-6 py-4 font-semibold text-gray-700">Free</th>
                                    <th className="text-center px-6 py-4 font-semibold text-gray-700">Pro</th>
                                    <th className="text-center px-6 py-4 font-semibold text-gray-700">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
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
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-700">{row[0]}</td>
                                        {[row[1], row[2], row[3]].map((val, i) => (
                                            <td key={i} className="px-6 py-4 text-center">
                                                {typeof val === 'boolean' ? (
                                                    val ? <Check size={18} className="text-green-500 mx-auto" /> : <X size={18} className="text-gray-300 mx-auto" />
                                                ) : (
                                                    <span className="text-gray-600 font-medium">{val}</span>
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
                    <h2 className="text-2xl font-bold text-[#0A0807] text-center mb-8">Frequently Asked Questions</h2>
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

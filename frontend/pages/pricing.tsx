import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <Head>
                <title>Pricing - Noupe</title>
            </Head>
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h1>
                <p className="text-xl text-gray-500 mb-12">Choose the plan that's right for you.</p>

                <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm max-w-lg mx-auto">
                    <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold">Early Access</span>
                    <div className="mt-6 mb-2">
                        <span className="text-5xl font-bold">$0</span>
                        <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-gray-500 mb-8">Free until 2026</p>
                    <button className="w-full bg-[#0A0807] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all">Get Started for Free</button>
                </div>
            </div>
        </div>
    );
}

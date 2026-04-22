import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Calendar, User, ArrowRight, Sparkles, Clock, Search } from 'lucide-react';

const BlogCard = ({ category, title, excerpt, date, author, image, delay }: any) => (
    <div 
        className="premium-card group overflow-hidden flex flex-col h-full hover:-translate-y-2 transition-all duration-500 animate-fade-in"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="relative h-56 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent z-10 opacity-60" />
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-[#00F5D4]/20 border border-[#00F5D4]/30 backdrop-blur-md text-[#00F5D4] text-[10px] font-black uppercase tracking-widest">
                {category}
            </div>
        </div>
        
        <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-4 text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-4">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {date}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> 5 min read</span>
            </div>
            
            <h3 className="font-sora text-xl font-bold text-[#F1F5F9] mb-4 group-hover:text-[#00F5D4] transition-colors leading-tight">
                {title}
            </h3>
            
            <p className="text-[#94A3B8] text-sm leading-relaxed font-inter mb-8 line-clamp-3">
                {excerpt}
            </p>
            
            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#3A86FF] flex items-center justify-center text-[#0A0F1C] text-[10px] font-black">
                        {author.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-[#F1F5F9]">{author}</span>
                </div>
                <button className="text-[#00F5D4] hover:text-[#00D9C0] transition-all group/btn flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    Read More
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

export default function Blog() {
    const posts = [
        {
            category: "Product Update",
            title: "Introducing Gemini 1.5 Integration for Smarter Responses",
            excerpt: "Discover how we're leveraging the latest in LLM technology to make your chatbots more context-aware and accurate than ever before.",
            date: "Apr 20, 2026",
            author: "Sarah Chen",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            delay: 100
        },
        {
            category: "Best Practices",
            title: "5 Ways to Optimize Your Training Data for Better Accuracy",
            excerpt: "Learn the secrets to structuring your documentation and FAQs to ensure your AI assistant provides perfect answers every time.",
            date: "Apr 15, 2026",
            author: "Alex Rivera",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
            delay: 200
        },
        {
            category: "Case Study",
            title: "How TechFlow Reduced Support Tickets by 65% with Conversio",
            excerpt: "A deep dive into how a leading SaaS company implemented Conversio AI to automate their first-tier support effectively.",
            date: "Apr 08, 2026",
            author: "James Wilson",
            image: "https://images.unsplash.com/photo-1551288049-bbbda59dcfdf?auto=format&fit=crop&q=80&w=800",
            delay: 300
        },
        {
            category: "Industry News",
            title: "The Future of Customer Support: Why Human + AI is the Win",
            excerpt: "AI isn't here to replace your support team—it's here to empower them. Explore the future of collaborative customer service.",
            date: "Mar 28, 2026",
            author: "Sarah Chen",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            delay: 400
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1C] font-inter selection:bg-[#00F5D4]/30 selection:text-[#00F5D4]">
            <Head>
                <title>Blog - Conversio AI</title>
                <meta name="description" content="Stay updated with the latest in AI, customer support, and product updates." />
            </Head>

            <Navbar />

            <main className="relative pt-20 pb-32">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3A86FF]/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00F5D4]/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A86FF]/10 border border-[#3A86FF]/20 text-[#3A86FF] text-xs font-black uppercase tracking-widest mb-6">
                                <Sparkles size={14} />
                                Insights & Updates
                            </div>
                            <h1 className="font-sora text-4xl md:text-6xl font-black text-[#F1F5F9] mb-6 tracking-tight leading-tight">
                                Latest from the <span className="text-[#00F5D4]">blog.</span>
                            </h1>
                            <p className="text-lg text-[#94A3B8] leading-relaxed">
                                Expert advice on customer experience, AI training, and growing your business with automation.
                            </p>
                        </div>
                        
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#00F5D4] transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search articles..." 
                                className="w-full bg-[#121826]/80 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-[#00F5D4]/40 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Featured Post (Placeholder for first item style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                        {posts.slice(0, 2).map((post, i) => (
                            <BlogCard key={i} {...post} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice(2).map((post, i) => (
                            <BlogCard key={i + 2} {...post} />
                        ))}
                    </div>

                    {/* Newsletter */}
                    <div className="mt-32 p-12 rounded-[40px] bg-[#121826]/50 border border-white/[0.06] backdrop-blur-sm relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
                            <div>
                                <h2 className="font-sora text-3xl font-bold text-[#F1F5F9] mb-4">Subscribe to our newsletter</h2>
                                <p className="text-[#94A3B8]">Get the latest insights on AI and customer support delivered straight to your inbox.</p>
                            </div>
                            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="flex-1 bg-[#0A0F1C]/60 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#00F5D4]/40 outline-none transition-all font-medium"
                                />
                                <button className="px-8 py-4 rounded-2xl bg-[#00F5D4] text-[#0A0F1C] font-black hover:bg-[#00D9C0] transition-all shadow-lg shadow-[#00F5D4]/10">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[#64748B] text-sm">
                    <p>© 2026 Conversio AI. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="/features" className="hover:text-[#F1F5F9] transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-[#F1F5F9] transition-colors">Pricing</Link>
                        <Link href="/" className="hover:text-[#F1F5F9] transition-colors">Home</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

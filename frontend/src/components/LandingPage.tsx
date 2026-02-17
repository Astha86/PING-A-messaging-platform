'use client';

import React from 'react';
import Link from 'next/link';
import {
    MessageCircle,
    Shield,
    Zap,
    ArrowRight,
    Sparkles,
    Globe,
    Fingerprint,
    ZapIcon,
    CircleDot
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
            {/* Background Aura */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:3s]" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] backdrop-blur-2xl bg-black/40">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/50 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            <div className="relative w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center p-[1px]">
                                <div className="w-full h-full bg-black rounded-[0.9rem] flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white transition-colors">
                            Ping
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-neutral-400">
                        <a href="#features" className="hover:text-white transition-all">Features</a>
                        <a href="#security" className="hover:text-white transition-all">Security</a>
                        <Link
                            href="/login"
                            className="px-8 py-3 bg-white text-black rounded-full hover:bg-neutral-200 transition-all active:scale-95 font-semibold"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-8">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-indigo-400 text-xs font-semibold tracking-wide backdrop-blur-md mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>The next generation of messaging is here</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tight leading-[1.05]">
                        Seamlessly connected <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            in every moment.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-neutral-400 text-lg md:text-xl font-medium mb-16 leading-relaxed">
                        Beautifully designed, incredibly fast, and private by default.
                        Experience the messenger that adapts to your life, not the other way around.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link
                            href="/login"
                            className="group px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-lg transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95 flex items-center gap-3"
                        >
                            Start Chatting <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="px-10 py-5 bg-white/[0.05] border border-white/[0.08] text-white rounded-[2rem] font-bold text-lg hover:bg-white/[0.1] transition-all backdrop-blur-md">
                            Learn More
                        </button>
                    </div>

                    {/* Abstract Image Placeholder with Moving Slang */}
                    <div className="mt-24 w-full max-w-5xl aspect-video rounded-[3rem] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/[0.08] backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                        {/* Floating Slang Tags */}
                        <div className="absolute inset-0 pointer-events-none select-none">
                            {[
                                { text: 'hii', top: '15%', left: '15%', delay: '0s' },
                                { text: 'hey', top: '10%', left: '75%', delay: '1.2s' },
                                { text: 'wassup', top: '80%', left: '25%', delay: '2.5s' },
                                { text: 'slay', top: '70%', left: '80%', delay: '0.8s' },
                                { text: 'cool', top: '45%', left: '10%', delay: '3.2s' },
                                { text: 'vibe', top: '35%', left: '85%', delay: '1.7s' },
                                { text: 'huhh..', top: '85%', left: '60%', delay: '4.5s' },
                                { text: 'yoo', top: '12%', left: '45%', delay: '2.8s' },
                                { text: 'shhh', top: '65%', left: '15%', delay: '1.4s' },
                                { text: 'chitchat', top: '90%', left: '40%', delay: '3.8s' },
                                { text: 'bruhh', top: '25%', left: '80%', delay: '0.6s' },
                                { text: 'fr fr', top: '55%', left: '90%', delay: '2.2s' },
                                { text: 'uhmm', top: '5%', left: '30%', delay: '4.1s' },
                            ].map((tag, i) => (
                                <div
                                    key={i}
                                    style={{
                                        top: tag.top,
                                        left: tag.left,
                                        animationDelay: tag.delay,
                                        animationDuration: `${6 + (i % 4)}s`
                                    }}
                                    className="absolute animate-float"
                                >
                                    <div className="px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
                                        <span className="text-[11px] font-bold tracking-wider text-white/30 lowercase">
                                            {tag.text}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="w-32 h-32 bg-indigo-500/30 blur-3xl animate-pulse" />
                                <MessageCircle className="w-20 h-20 text-white absolute inset-0 m-auto group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-indigo-400 opacity-50" />
                        <div className="absolute bottom-20 right-40 w-3 h-3 rounded-full bg-purple-400 opacity-50" />
                        <div className="absolute top-1/2 right-10 w-1.5 h-1.5 rounded-full bg-pink-400 opacity-50" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-32 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Zap className="w-8 h-8 text-indigo-400" />,
                            title: "Blink Speed",
                            desc: "Under 50ms latency globally. Messages deliver as fast as you can think them."
                        },
                        {
                            icon: <Shield className="w-8 h-8 text-purple-400" />,
                            title: "Private Space",
                            desc: "State-of-the-art encryption ensures only you and your recipients can read messages."
                        },
                        {
                            icon: <Globe className="w-8 h-8 text-pink-400" />,
                            title: "Boundless",
                            desc: "Sync across all your devices instantly. Your history follows you wherever you go."
                        }
                    ].map((feat, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-500">
                            <div className="p-4 w-fit rounded-2xl bg-white/[0.05] mb-8 group-hover:scale-110 transition-transform duration-500">
                                {feat.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modern Bento Callout */}
            <section className="py-32 px-8 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 rounded-[4rem] border border-white/[0.1] p-16 relative overflow-hidden group">
                    <div className="relative z-10 max-w-2xl">
                        <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-6 block">Ready for something new?</span>
                        <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight leading-[1.1]">The conversation <br /> of tomorrow.</h2>
                        <p className="text-neutral-300 text-lg md:text-xl font-medium mb-12 opacity-80">
                            Join a community that values craft, speed, and privacy. Ping is more than an app—it's how we connect.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all active:scale-95"
                        >
                            Enter the network <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    {/* Background elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    <CircleDot className="absolute bottom-[-10%] right-[-5%] w-64 h-64 text-white/[0.03] rotate-12" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 px-8 border-t border-white/[0.05] bg-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold">Ping</span>
                        </div>
                        <p className="text-neutral-500 text-sm font-medium pr-10">
                            Modern messaging for modern people. Fast, private, and beautiful.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-neutral-400">Discover</h5>
                        <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">Downloads</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-neutral-400">Support</h5>
                        <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-neutral-400">Legal</h5>
                        <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-10 border-t border-white/[0.05] flex flex-col md:row items-center justify-between gap-6">
                    <p className="text-xs font-medium text-neutral-600 uppercase tracking-widest">© 2024 PING INC. DESIGNED TO CONNECT.</p>
                    <div className="flex items-center gap-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

'use client';

import AppContext, { user_service } from '@/src/context/AppContext';
import { ArrowRight, Loader2, Mail, MessageCircle } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import Loading from '@/src/components/Loading';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const { isAuth, loading } = useContext(AppContext)!;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${user_service}/api/v1/login`, { email });
            toast.success(data.message);
            router.push(`/verify?email=${email}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while sending OTP");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (isAuth) {
        redirect(`/chat`);
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aura */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />

            <div className="max-w-md w-full relative z-10 transition-all">
                {/* Logo & Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center space-x-3 group mb-12">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center p-[1px] group-hover:scale-105 transition-transform duration-500">
                            <div className="w-full h-full bg-black rounded-[0.9rem] flex items-center justify-center">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </Link>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Sign in to Ping</h1>
                    <p className="text-neutral-400 text-lg font-medium">
                        Enter your email to sign in or create an account.
                    </p>
                </div>

                {/* Elegant Form Card */}
                <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-sm font-semibold text-neutral-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-neutral-500 group-focus-within/input:text-indigo-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full pl-12 pr-6 py-5 bg-white/[0.02] border border-white/[0.1] rounded-2xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all font-medium"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Sending Code...</span>
                                </>
                            ) : (
                                <>
                                    <span>Continue with Email</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center mt-12 text-neutral-500 text-sm font-medium">
                    No password required. New users will <br /> automatically have an account created.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
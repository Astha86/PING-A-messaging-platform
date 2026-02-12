'use client';
import AppContext, { user_service } from '@/src/context/AppContext';
import { ArrowRight, Loader2, Mail } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import axios from 'axios';
import Loading from '@/src/components/Loading';
import { toast } from 'react-hot-toast';

const loginPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const { isAuth, loading } = useContext(AppContext)!;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const {data} = await axios.post(`${user_service}/api/v1/login`, { email });
            toast.success(data.message);
            router.push(`/verify?email=${email}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while sending OTP");
        } finally {
            setIsLoading(false);
        }
    };

    if(loading) {
        return <Loading />;
    }

    if(isAuth) {
        redirect(`/chat`);
        return null; // Return null to prevent rendering the component while redirecting
    }

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                        <Mail className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                        Welcome to PingApp
                    </h1>
                    <p className="text-gray-300 text-md">
                        Enter your email to start chatting with your friends!
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email Address
                        </label>
                    </div>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button 
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-200 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin" size={20} />
                                Sending OTP to your email...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <span>Send OTP</span>
                                <ArrowRight className="ml-2 w-5 h-5" size={20} />
                            </div>
                        )}
                    </button>
                </form>
            </div>

        </div>
    </div>
  )
}

export default loginPage
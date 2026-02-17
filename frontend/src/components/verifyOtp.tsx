'use client';

import axios from 'axios';
import { ArrowRight, Edit, Loader2, Lock, MessageCircle } from 'lucide-react';
import AppContext, { user_service } from '@/src/context/AppContext';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loading from './Loading';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const VerifyOtp = () => {
  const { isAuth, setIsAuth, setUser, loading, fetchChats, fetchUsers } = useContext(AppContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();


  const searchParams = useSearchParams(); // Hook to access URL search parameters
  const email: string = searchParams.get('email') || '';

  useEffect(() => {
    // Start the countdown timer for resending OTP
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdown);
          return 0;
        }
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(countdown);
  }, []);

  const handleOtpChange = (index: number, value: string): void => {
    if (/^\d*$/.test(value) && value.length <= 1) { // Only allow numeric input and max 1 digit
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(""); // Clear any existing error messages

      // Move focus to the next input field if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle key down event to allow moving back to the previous input field on Backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input field if Backspace is pressed and current field is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event to allow pasting the entire OTP at once
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pasteData)) { // Validate that the pasted data is a 6-digit number
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus(); // Move focus to the last input field after pasting
    } else {
      setError("Please paste a valid 6-digit OTP.");
    }
  };

  const handleVerify = async (otpValue: string): Promise<void> => {
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/verify-otp`, { email, otp: otpValue });
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      setOtp(Array(6).fill(""));
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed. Please try again.");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      handleVerify(otpValue);
    }
  }, [otp]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    handleVerify(otpValue);
  };

  // Handle resend OTP functionality
  const handleResendOtp = async (): Promise<void> => {
    if (timer > 0) return; // Prevent resending OTP if timer is still running

    setResendLoading(true);
    setError(""); // Clear any existing error messages

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, { email });
      toast.success(data.message);
      setTimer(60); // Reset the timer after resending OTP
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (isAuth) {
    redirect(`/chat`);
    return null; // Return null to prevent rendering the component while redirecting
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />

      <div className="max-w-md w-full relative z-10 transition-all">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-3 group mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center p-[1px] group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-black rounded-[0.9rem] flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </Link>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Check your email</h1>
          <p className="text-neutral-400 text-lg font-medium">
            Enter the 6-digit code we sent to <br /> <span className="text-indigo-400 font-semibold">{email}</span>
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 text-neutral-500 hover:text-white flex items-center justify-center mx-auto space-x-2 text-sm font-semibold transition-colors"
          >
            <Edit size={14} />
            <span>Change Email</span>
          </button>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl">
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-16 md:w-14 md:h-16 text-center text-3xl font-bold bg-white/[0.02] border border-white/[0.1] rounded-2xl text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
                  Authenticating...
                </p>
              </div>
            )}
          </form>

          <div className="mt-10 text-center">
            <p className="text-neutral-500 text-sm font-medium">
              Didn't receive the code?{' '}
              {timer > 0 ? (
                <span className="text-indigo-400">Resend in {timer}s</span>
              ) : (
                <button
                  className="text-white hover:text-indigo-400 font-bold transition-colors disabled:opacity-50"
                  disabled={resendLoading}
                  onClick={handleResendOtp}
                >
                  {resendLoading ? 'Resending...' : 'Resend Code'}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
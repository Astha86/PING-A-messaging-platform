'use client';
import axios from 'axios';
import { ArrowRight, Edit, Loader2, Lock } from 'lucide-react'
import AppContext, { user_service } from '@/src/context/AppContext';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import Loading from './Loading';
import { toast } from 'react-hot-toast';

const verifyOtp = () => {

  const {isAuth, setIsAuth, setUser, loading, fetchChats, fetchUsers} = useContext(AppContext)!;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // State to hold the OTP input
  const [error, setError] = useState<string>(""); // State to hold any error messages
  const [resendLoading, setResendLoading] = useState<boolean>(false); // State to manage resend OTP loading state
  const [timer, setTimer] = useState<number>(60); // State to manage the countdown timer for resending OTP
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]); // Ref to manage OTP input fields
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

  // console timer for resend OTP
  console.log(`Resend OTP in: ${timer} seconds`);

  // Handle OTP input change
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate OTP verification process
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      setIsLoading(false);
      return;
    }

    setError(""); // Clear any existing error messages
    setIsLoading(true);

    // Simulate an API call to verify the OTP
    try {
      const {data} = await axios.post(`${user_service}/api/v1/verify-otp`, { email, otp: otpValue });
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      setOtp(Array(6).fill("")); // Clear OTP input fields after successful verification
      inputRefs.current[0]?.focus(); // Move focus back to the first input field
      setUser(data.user);
      setIsAuth(true);
      fetchChats();
      fetchUsers();
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred while verifying the OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP functionality
  const handleResendOtp = async (): Promise<void> => {
    if (timer > 0) return; // Prevent resending OTP if timer is still running

    setResendLoading(true);
    setError(""); // Clear any existing error messages

    try {
      const {data} = await axios.post(`${user_service}/api/v1/login`, { email });
      toast.success(data.message);
      setTimer(60); // Reset the timer after resending OTP
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred while resending the OTP. Please try again.");
    } finally {
      setResendLoading(false);
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
              <Lock className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Verify your account
            </h1>
            <p className="text-gray-300 text-md">
              We have sent a 6-digit OTP to
            </p>
            <div className="flex items-center justify-center mt-2">
              <p className='text-blue-400 text-sm font-semibold'>
                {email}
              </p>
              <div  className="ml-2 text-blue-400 cursor-pointer" onClick={() => router.push(`/login`)}>
                <Edit size={16} />
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-between">
              <label className="block text-md font-medium text-gray-300 text-center w-full mb-4">
                Enter the 6-digit OTP below:
              </label>
              <div className="flex justify-center space-x-2">
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
                    className="w-12 h-12 text-center bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            </div>
            {
              error && <p className="text-red-500 text-sm text-center">{error}</p>
            }
            <button 
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-200 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" size={20} />
                  Verifying OTP...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Verify & Proceed</span>
                  <ArrowRight className="ml-2 w-5 h-5" size={20} />
                </div>
              )}
            </button>
          </form>

          {/* resend OTP section */}
          <div className="mt-6 text-center">
            <div className="text-gray-400 text-sm">
              Didn't receive the OTP?{" "}
              {timer > 0 ? (
                <span className="text-gray-500">Resend in {timer}s</span>
              ) : (
              <button
                className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                disabled={resendLoading}
                onClick={handleResendOtp}
              >
                {resendLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin" size={16} />
                    Resending...
                  </div>
                ) : (
                  "Resend OTP"
                )}
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default verifyOtp;
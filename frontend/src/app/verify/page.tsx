import Loading from "@/src/components/Loading";
import VerifyOtp from "@/src/components/verifyOtp";
import { Suspense } from "react";


const verifyPage = () => {

  return (
    <div>
      <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loading /></div>}>
        <VerifyOtp />
      </Suspense>
    </div>
  )
}

export default verifyPage
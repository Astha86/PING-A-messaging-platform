import Loading from "@/src/components/Loading";
import VerifyOtp from "@/src/components/verifyOtp";
import { Suspense } from "react";


const verifyPage = () => {

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <VerifyOtp />
      </Suspense>
    </div>
  )
}

export default verifyPage
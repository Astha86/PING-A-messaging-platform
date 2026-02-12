'use client';
import Loading from '@/src/components/Loading';
import AppContext from '@/src/context/AppContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react'

const page = () => {
  const {loading, isAuth} = useContext(AppContext)!;
  const router = useRouter();
  
  // Redirect to login page if not authenticated
  useEffect(() => {
    if(!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]); 

  // Show loading spinner while checking authentication status
  if(loading) {
    return <Loading />;
  }

  return (
    <div>Chat Page</div>
  )
}

export default page
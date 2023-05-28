import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useEffect, useState } from 'react';

import AuthForm from '../components/auth/auth-form';

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(async () => {
    const session = await getSession();

    if(session){
      router.replace('/');
    }
    else{
      setIsLoading(false);
    }
  })

  if(isLoading){
    return <p>Loading...</p>
  }

  return <AuthForm />;
}

export default AuthPage;

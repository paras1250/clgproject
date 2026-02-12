import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Cookies from 'js-cookie';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { token, user, error } = router.query;

    if (error) {
      // OAuth error - redirect to login
      router.push(`/login?error=${error}`);
      return;
    }

    if (token && user) {
      try {
        // Store token and user data
        Cookies.set('token', token as string, { expires: 7 });
        Cookies.set('user', user as string, { expires: 7 });

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('Error storing auth data:', err);
        router.push('/login?error=auth_failed');
      }
    } else {
      // Missing parameters - redirect to login
      router.push('/login?error=invalid_callback');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Authenticating... - Conversio AI</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
          <p className="text-gray-700">Please wait while we log you in</p>
        </div>
      </div>
    </>
  );
}


import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function SessionWarning() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const checkSession = () => {
      const token = Cookies.get('token');
      if (!token) return;

      try {
        // Decode JWT token to get expiry
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeLeft = expiryTime - currentTime;

        // Show warning if less than 10 minutes remaining
        if (timeLeft > 0 && timeLeft < 10 * 60 * 1000) {
          setShowWarning(true);
          setTimeRemaining(Math.floor(timeLeft / 1000 / 60)); // Convert to minutes
        } else if (timeLeft <= 0) {
          // Session expired
          Cookies.remove('token');
          router.push('/login?sessionExpired=true');
        } else {
          setShowWarning(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    // Check immediately
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  const handleExtendSession = () => {
    // In a real app, you'd refresh the token here
    // For now, just hide the warning
    setShowWarning(false);
    // Ideally, make an API call to refresh the token
    router.reload();
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-in">
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl shadow-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-gray-700 font-semibold mb-4">
              Your session will expire in approximately {timeRemaining} minute{timeRemaining !== 1 ? 's' : ''}. 
              Reload the page to extend your session or save your work.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExtendSession}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Reload Page
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-bold text-sm transition-all"
              >
                Logout
              </button>
              <button
                onClick={() => setShowWarning(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


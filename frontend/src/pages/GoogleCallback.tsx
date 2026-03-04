import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Google OAuth Callback Handler
 * This page receives the redirect from backend after Google authentication
 * Extracts token and user data from URL, stores them, and redirects to dashboard
 */

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract data from URL parameters
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    // ===== HANDLE ERRORS =====
    if (error) {
      console.error('Google OAuth error:', error);

      // Show specific error messages
      if (error === 'new_user_use_signup') {
        toast.error('Please create an account first using email signup!', {
          duration: 5000,
        });
      } else if (error === 'google_auth_failed') {
        toast.error('Google sign-in failed. Please try again.');
      } else if (error === 'authentication_failed') {
        toast.error('Authentication failed. Please try again.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }

      // Redirect to signin page after error
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      return;
    }

    // ===== HANDLE SUCCESS =====
    if (token && userStr) {
      try {
        // Parse user data from URL
        const user = JSON.parse(decodeURIComponent(userStr));

        console.log('✅ Google Sign-In successful!');
        console.log('User:', user.email);

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Calculate token expiry (7 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());

        // Show success message
        toast.success(`Welcome back, ${user.fullName}!`, {
          icon: '👋',
          duration: 3000,
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);

      } catch (err) {
        console.error('Failed to parse user data:', err);
        toast.error('Authentication error. Please try again.');
        navigate('/signin');
      }
    } else {
      // No token or user data - something went wrong
      console.error('Missing token or user data');
      toast.error('Authentication failed. Please try again.');
      navigate('/signin');
    }
  }, [searchParams, navigate]);

  // ===== LOADING UI =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
        {/* Animated Loading Spinner */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Signing you in...
        </h2>
        <p className="text-gray-500">
          Please wait while we complete your Google sign-in.
        </p>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);
  
  // If no token, show modal overlay with blur
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Navbar - Always visible */}
        <Navbar isLoggedIn={isLoggedIn} />

        {/* Main Content Area with Blur - FIXED HEIGHT */}
        <div className="flex-1 relative" style={{ minHeight: 'calc(100vh - 100px)' }}>
          
          {/* Blurred Background Content */}
          <div className="absolute inset-0 blur-sm brightness-75 pointer-events-none overflow-hidden">
            {children}
          </div>

          {/* Login Required Modal Overlay - CENTERED */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-md z-50 px-4">
            
            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 md:p-12 animate-scale-in">
              
              {/* Lock Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-10 h-10 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
                Login Required
              </h1>
              
              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed text-center">
                Please log in to access this page and unlock all features of Orato.
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                
                {/* Sign In Button */}
                <Link
                  to="/signin"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg no-underline text-center"
                >
                  Sign In
                </Link>

                {/* Sign Up Button */}
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-500 hover:bg-green-50 transition-all shadow-sm hover:shadow-md no-underline text-center"
                >
                  Create New Account
                </Link>

              </div>

              {/* Helper Text */}
              <p className="mt-6 text-sm text-gray-500 text-center">
                Already registered? Click <span className="font-semibold text-green-600">Sign In</span>
                <br />
                New user? Click <span className="font-semibold text-green-600">Create New Account</span>
              </p>

            </div>
          </div>
        </div>

        {/* Footer - Always visible */}
        <Footer />

        {/* Animation CSS */}
        <style>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // If token exists, show the protected page normally
  return <>{children}</>;
};

export default ProtectedRoute;
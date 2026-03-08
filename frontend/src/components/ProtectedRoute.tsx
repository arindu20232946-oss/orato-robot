import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If no token, show login prompt
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="text-center p-8 md:p-12 bg-white rounded-2xl shadow-2xl max-w-md w-full">
          
          {/* Lock Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Login Required
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please log in to access this page and unlock all features of Orato.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            
            {/* Sign In Button - For registered users */}
            <Link
              to="/signin"
              className="block w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg no-underline"
            >
              Sign In
            </Link>

            {/* Sign Up Button - For new users */}
            <Link
              to="/signup"
              className="block w-full px-6 py-3 bg-white text-green-600 font-semibold rounded-lg border-2 border-green-500 hover:bg-green-50 transition-all shadow-sm hover:shadow-md no-underline"
            >
              Create New Account
            </Link>

          </div>

          {/* Helper Text */}
          <p className="mt-6 text-sm text-gray-500">
            Already registered? Click <span className="font-semibold text-green-600">Sign In</span>
            <br />
            New user? Click <span className="font-semibold text-green-600">Create New Account</span>
          </p>

        </div>
      </div>
    );
  }

  // If token exists, show the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
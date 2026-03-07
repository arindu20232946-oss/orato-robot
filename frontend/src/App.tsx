import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page imports
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Setting from "./pages/Setting";
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PersonalInfo from "./pages/PersonalInfo";
import Assessment from "./pages/Assessment";
import AssessmentResults from "./pages/AssessmentResults";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleCallback from "./pages/GoogleCallback";
import { Toaster } from "react-hot-toast";
import Quiz from "./pages/Quiz";
import QuizDetail from "./pages/QuizDetail";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Authentication Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/assessment-results" element={<AssessmentResults />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/google/success" element={<GoogleCallback />} />

          {/* Protected Routes - After Login */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/account" element={<Account />} />
          <Route path="/setting" element={<Setting />} />
          
          {/* Quiz Routes */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:id" element={<QuizDetail />} />

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                    Page Not Found
                  </h2>
                  <p className="text-gray-500 mb-6">
                    The page you're looking for doesn't exist.
                  </p>
                  <a
                    href="/"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg no-underline"
                  >
                    Go to Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

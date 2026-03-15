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
import Quiz from "./pages/Quiz";
import QuizDetail from "./pages/QuizDetail";
import ListeningQuiz from "./pages/ListeningQuiz";
import ListeningDetail from "./pages/ListeningDetail";
import ReadingTask from "./pages/ReadingTask";
import ReadingDetail from "./pages/ReadingDetail";
import VisualCardsPage from "./pages/VisualCardsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import GrammarLevels from "./pages/GrammarLevels";
import GrammarQuiz from "./pages/GrammarQuiz";

import { Toaster } from "react-hot-toast";

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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          
          {/* Quiz Routes */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:id" element={<QuizDetail />} />

          {/* Listening Routes */}
          <Route 
            path="/listening" 
            element={
              <ProtectedRoute>
                <ListeningQuiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/listening/:id" 
            element={
              <ProtectedRoute>
                <ListeningDetail />
              </ProtectedRoute>
            } 
          />
          {/* Grammar Quiz Routes */}
          <Route 
            path="/grammar" 
            element={
              <ProtectedRoute>
                <GrammarLevels />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/grammar/:level" 
            element={
              <ProtectedRoute>
                <GrammarQuiz />
              </ProtectedRoute>
            } 
          />

          {/* Visual Cards */}
          <Route path="/visual-cards" element={<VisualCardsPage />} />

          <Route
            path="/reading"
            element={
            <ProtectedRoute>
            <ReadingTask />
            </ProtectedRoute>
          }
          />
          <Route
            path="/reading/:id"
            element={
            <ProtectedRoute>
            <ReadingDetail />
            </ProtectedRoute>
            }
          />

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

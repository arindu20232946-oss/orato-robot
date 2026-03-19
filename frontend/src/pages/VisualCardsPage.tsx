import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisualCards from "../components/VisualCards";

const VisualCardsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-gray-900">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <VisualCards />
      </main>
      <Footer />
    </div>
  );
};

export default VisualCardsPage;

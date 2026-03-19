// React
import React, { useState, useEffect } from "react";

// Layout
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/AccountPageBackground";

// Account Feature Sections
import ProfileSection from "../components/account/ProfileSection";
import LanguagesSection from "../components/account/LanguagesSection";
import GoalsSection from "../components/account/GoalsSection";
import AchievementSection from "../components/account/AchievementSection";

// Modals
import EditProfileModal from "../components/EditProfileModal";
import LanguageModal from "../components/account/LanguageModal";
import AddGoalController from "../components/account/AddGoalController";

// Services & Utilities
import API from "../services/api";
import toast from "react-hot-toast";


const Account: React.FC = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    // Load goals from backend
    API.get("/users/goals")
      .then((res) => {
        if (res.data?.goals) setGoals(res.data.goals);
      })
      .catch(() => {
        // silently fail — user may not be authenticated yet
      });
  }, []);


  // Write user to localStorage AND notify same-tab listeners (e.g. Navbar)
  const setUserStorage = (updatedUser: any) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));
  };

  const handleImageUpload = async (file: File) => {
    // 1️⃣ File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post(
        "/users/upload-profile-picture",
        formData
      );

      const updatedUser = response.data.user;

      // Update state + localStorage
      setUser(updatedUser);
      setUserStorage(updatedUser);

      toast.success("Profile picture updated successfully!");

    } catch (error: any) {
      console.error("UPLOAD ERROR:", error?.response?.data || error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Image must be under 10MB");
      }

    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setUploading(true);

      const response = await API.delete("/users/upload-profile-picture");
      const updatedUser = response.data.user;

      setUser(updatedUser);
      setUserStorage(updatedUser);

      toast.success("Profile picture removed!");
    } catch (error: any) {
      console.error("Remove profile picture error:", error?.response?.data || error);
      toast.error("Failed to remove profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };


  if (!user) {
    return <div className="p-10 text-center">Loading account...</div>;
  }



  const initials = user.fullName
    ? user.fullName
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
    : "U";


  return (
    <div className="page-wrapper">
      <Navbar isLoggedIn={true} />

      <PageBackground>
        <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

          {/* HEADER */}
          <div className="pb-8 mb-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-emerald-500/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Workspace</p>
            </div>
            <h1 className="text-4xl font-extrabold text-emerald-950 tracking-tight">
              Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">& Setting</span>
            </h1>
            <p className="mt-3 text-gray-400 font-medium text-lg max-w-2xl leading-relaxed">
              Curate your digital identity and fine-tune your language learning trajectory with precision.
            </p>
          </div>


          {/* PROFILE Section */}
          <ProfileSection
            user={user}
            uploading={uploading}
            initials={initials}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveProfilePicture}
            onEditClick={() => setIsEditOpen(true)}
          />

          {/* LANGUAGES SECTION */}
          <LanguagesSection
            user={user}
            onOpenLanguageModal={() => setIsLanguageOpen(true)}
          />

          {/* Learning Goals SECTION*/}
          <GoalsSection
            goals={goals}
            onOpenAddGoal={() => setIsAddGoalOpen(true)}
            setGoals={setGoals}
          />

          {/* ACHIEVEMENT BADGES */}
          <AchievementSection user={user} goals={goals} />

        </main>
      </PageBackground>

      <Footer />

      {isEditOpen && (
        <EditProfileModal
          onClose={() => setIsEditOpen(false)}
          onProfileUpdate={(updatedUser: any) => {
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }}
        />
      )}

      <AddGoalController
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        goals={goals}
        setGoals={setGoals}
      />

      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
      />

    </div>
  );


};


export default Account;


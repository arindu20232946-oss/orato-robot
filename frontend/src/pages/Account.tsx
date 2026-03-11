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
import EditGoalModal from "../components/account/EditGoalModal";
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
  const [editingGoal, setEditingGoal] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      setGoals([]);
    }
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
          <div className="pb-6 mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">My Account</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="mt-1.5 text-gray-400 text-base">
              Manage your profile, goals, and learning preferences
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
            onEditGoal={(goal) => setEditingGoal(goal)}
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

      <EditGoalModal
        goal={editingGoal}
        onClose={() => setEditingGoal(null)}
        setGoals={setGoals}
        setEditingGoal={setEditingGoal}
      />

    </div>
  );


};


export default Account;


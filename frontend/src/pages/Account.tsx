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

  // PROFILE PICTURE UPLOAD HANDLER
  const handleImageUpload = async (file: File) => {
    // 1️⃣ File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
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
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile picture updated successfully!");

    } catch (error: any) {
      console.error("UPLOAD ERROR:", error?.response?.data || error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Image must be under 5MB");
      }

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
          <div className="pb-6 mb-8 border-b border-gray-200">

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Account
            </h1>

            <p className="mt-2 text-gray-500 text-lg">
              Manage your profile and learning preferences
            </p>

          </div>

          {/* PROFILE Section */}
          <ProfileSection
            user={user}
            uploading={uploading}
            initials={initials}
            onImageUpload={handleImageUpload}
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


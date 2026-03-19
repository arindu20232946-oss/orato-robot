import React from "react";
import AddGoalModal from "../AddGoalModal";
import API from "../../services/api";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  goals: any[];
  setGoals: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddGoalController: React.FC<Props> = ({ isOpen, onClose, goals, setGoals }) => {
  if (!isOpen) return null;

  const existingTypes = goals.map((g) => g.type);

  const handleAdd = async (newGoal: { type: string; title: string; deadline: string }) => {
    if (goals.length >= 5) {
      toast.error("You can have at most 5 goals.");
      return;
    }
    if (existingTypes.includes(newGoal.type)) {
      toast.error("You already have a goal of this type.");
      return;
    }

    try {
      await API.post("/users/goals", newGoal);
      // Fetch fresh goals with live progress from the backend
      const fresh = await API.get("/users/goals");
      setGoals(fresh.data.goals);
      toast.success("Goal added successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add goal.");
    }
  };

  return <AddGoalModal onClose={onClose} onAdd={handleAdd} existingTypes={existingTypes} />;
};

export default AddGoalController;
import React from "react";
import AddGoalModal from "../AddGoalModal";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  goals: any[];
  setGoals: React.Dispatch<React.SetStateAction<any[]>>;
}

const AddGoalController: React.FC<Props> = ({
  isOpen,
  onClose,
  goals,
  setGoals,
}) => {
  if (!isOpen) return null;

  const handleAdd = (newGoal: any) => {
    if (goals.length >= 3) {
      toast.error("You can only add up to 3 goals.");
      return;
    }

    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        current: 0,
        ...newGoal,
      },
    ]);

    toast.success("Goal added successfully!");
    onClose();
  };

  return <AddGoalModal onClose={onClose} onAdd={handleAdd} />;
};

export default AddGoalController;
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getApiUrl } from "../../config/api";

const SkillForm = ({ skill, onSave, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const watchLevel = watch("level", 1);

  useEffect(() => {
    if (skill) {
      // Populate form with existing skill data
      reset({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon,
        order: skill.order,
      });
    } else {
      // Reset form for new skill
      reset({
        name: "",
        category: "",
        level: 1,
        icon: "",
        order: 0,
      });
    }
  }, [skill, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      const skillData = {
        ...data,
        level: parseInt(data.level),
        order: parseInt(data.order) || 0,
      };

      let response;
      if (skill) {
        // Update existing skill
        response = await axios.put(
          getApiUrl(`/api/skills/${skill.id}`),
          skillData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new skill
        response = await axios.post(getApiUrl("/api/skills"), skillData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving skill:", error);
      setError(error.response?.data?.error || "Failed to save skill");
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelText = (level) => {
    const levels = {
      1: "Beginner",
      2: "Basic",
      3: "Intermediate",
      4: "Advanced",
      5: "Expert",
    };
    return levels[level] || "Unknown";
  };

  const commonCategories = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Mobile",
    "Design",
    "Tools",
    "Languages",
    "Frameworks",
    "Other",
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Skill Name *
          </label>
          <input
            {...register("name", { required: "Skill name is required" })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., React, Node.js, Python"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {commonCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Level */}
        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Skill Level * - {getLevelText(parseInt(watchLevel))}
          </label>
          <input
            {...register("level", {
              required: "Level is required",
              min: { value: 1, message: "Level must be at least 1" },
              max: { value: 5, message: "Level must be at most 5" },
            })}
            type="range"
            min="1"
            max="5"
            step="1"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Beginner</span>
            <span>Basic</span>
            <span>Intermediate</span>
            <span>Advanced</span>
            <span>Expert</span>
          </div>
          {errors.level && (
            <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
          )}
        </div>

        {/* Icon */}
        <div>
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Icon (Emoji)
          </label>
          <input
            {...register("icon")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="⚛️ 🚀 💻 🎨"
            maxLength="2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional emoji to represent this skill
          </p>
        </div>

        {/* Order */}
        <div>
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Display Order
          </label>
          <input
            {...register("order")}
            type="number"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first within the category
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : skill ? (
              "Update Skill"
            ) : (
              "Create Skill"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;

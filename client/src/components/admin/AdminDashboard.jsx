import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import SkillsList from "./SkillsList";
import SkillForm from "./SkillForm";
import ExperienceList from "./ExperienceList";
import ExperienceForm from "./ExperienceForm";
import ProfileForm from "./ProfileForm";
import ContactManager from "./ContactManager";

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
    fetchExperiences();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(getApiUrl("/api/projects"));
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(getApiUrl("/api/skills"));
      if (response.data.success) {
        setSkills(response.data.skills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await axios.get(getApiUrl("/api/experience"));
      if (response.data.success) {
        setExperiences(response.data.experiences);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    onLogout();
  };

  const handleProjectSaved = () => {
    fetchProjects();
    setEditingProject(null);
    setActiveTab("projects");
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setActiveTab("add-project");
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(getApiUrl(`/api/projects/${projectId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  // Skills handlers
  const handleSkillSaved = () => {
    fetchSkills();
    setEditingSkill(null);
    setActiveTab("skills");
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setActiveTab("add-skill");
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(getApiUrl(`/api/skills/${skillId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill");
    }
  };

  // Experience handlers
  const handleExperienceSaved = () => {
    fetchExperiences();
    setEditingExperience(null);
    setActiveTab("experience");
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setActiveTab("add-experience");
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(getApiUrl(`/api/experience/${experienceId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "add-project", label: "Add Project", icon: "➕" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "add-skill", label: "Add Skill", icon: "➕" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "add-experience", label: "Add Experience", icon: "➕" },
    { id: "messages", label: "Messages", icon: "📧" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {admin.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "add-project") {
                    setEditingProject(null);
                  }
                  if (tab.id === "add-skill") {
                    setEditingSkill(null);
                  }
                  if (tab.id === "add-experience") {
                    setEditingExperience(null);
                  }
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === "profile" && <ProfileForm />}

          {activeTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Projects
                </h2>
                <button
                  onClick={() => setActiveTab("add-project")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add New Project
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ProjectList
                  projects={projects}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              )}
            </div>
          )}

          {activeTab === "add-project" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <ProjectForm
                project={editingProject}
                onSave={handleProjectSaved}
                onCancel={() => {
                  setEditingProject(null);
                  setActiveTab("projects");
                }}
              />
            </div>
          )}

          {activeTab === "skills" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Skills
                </h2>
                <button
                  onClick={() => setActiveTab("add-skill")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add New Skill
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <SkillsList
                  skills={skills}
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                />
              )}
            </div>
          )}

          {activeTab === "add-skill" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h2>
              <SkillForm
                skill={editingSkill}
                onSave={handleSkillSaved}
                onCancel={() => {
                  setEditingSkill(null);
                  setActiveTab("skills");
                }}
              />
            </div>
          )}

          {activeTab === "experience" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Manage Experience
                </h2>
                <button
                  onClick={() => setActiveTab("add-experience")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add New Experience
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ExperienceList
                  experiences={experiences}
                  onEdit={handleEditExperience}
                  onDelete={handleDeleteExperience}
                />
              )}
            </div>
          )}

          {activeTab === "add-experience" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </h2>
              <ExperienceForm
                experience={editingExperience}
                onSave={handleExperienceSaved}
                onCancel={() => {
                  setEditingExperience(null);
                  setActiveTab("experience");
                }}
              />
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <ContactManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { getApiUrl } from "../config/api";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch experience data
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(getApiUrl("/api/experience"));
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Sort experiences by start date (newest first)
            const sortedExperiences = data.experiences.sort((a, b) => {
              return new Date(b.startDate) - new Date(a.startDate);
            });
            setExperiences(sortedExperiences);
          }
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getTypeIcon = (type) => {
    return type === "work" ? "💼" : "🎓";
  };

  const getTypeColor = (type) => {
    return type === "work"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  // Separate work and education experiences
  const workExperiences = experiences.filter((exp) => exp.type === "work");
  const educationExperiences = experiences.filter((exp) => exp.type === "education");

  const ExperienceCard = ({ experience }) => (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 last:hidden"></div>
      
      {/* Timeline dot */}
      <div className="absolute left-2 top-2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full"></div>
      
      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6 ml-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(experience.type)}</span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {experience.title}
              </h3>
              <p className="text-lg font-medium text-blue-600">
                {experience.company}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(experience.type)}`}>
              {experience.type === "work" ? "Work" : "Education"}
            </span>
            {experience.current && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Current
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="font-medium">
            {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
          </span>
          {experience.location && (
            <>
              <span>•</span>
              <span>{experience.location}</span>
            </>
          )}
        </div>
        
        {experience.description && (
          <p className="text-gray-700 leading-relaxed">
            {experience.description}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading experience...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience & Education
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            My professional journey and educational background
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No experience added yet
            </h3>
            <p className="text-gray-500">
              Experience and education will appear here once added through the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Work Experience */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="mr-3">💼</span>
                Work Experience
              </h3>
              {workExperiences.length > 0 ? (
                <div className="relative">
                  {workExperiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No work experience added yet.
                </div>
              )}
            </div>

            {/* Education */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="mr-3">🎓</span>
                Education
              </h3>
              {educationExperiences.length > 0 ? (
                <div className="relative">
                  {educationExperiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No education records added yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;

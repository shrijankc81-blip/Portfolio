import { useState, useEffect } from "react";
import { getApiUrl } from "../config/api";

const About = () => {
  const [profile, setProfile] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(getApiUrl("/api/profile"));
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);
  const skills = [
    {
      category: "Frontend",
      items: [
        "React",
        "JavaScript",
        "TypeScript",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Vue.js",
        "Next.js",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "Python",
        "Django",
        "PostgreSQL",
        "MongoDB",
        "REST APIs",
        "GraphQL",
      ],
    },
    {
      category: "Tools & Others",
      items: [
        "Git",
        "Docker",
        "AWS",
        "Figma",
        "Photoshop",
        "Linux",
        "Agile",
        "Testing",
      ],
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Me
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get to know more about who I am, what I do, and what skills I have
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Personal Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {profile?.aboutTitle || "Get to know me!"}
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                {profile?.aboutDescription ||
                  "I'm a Full Stack Developer passionate about building exceptional digital experiences. I enjoy creating websites and web applications that not only look great but also provide seamless user experiences. With a background in both design and development, I bring a unique perspective to every project. I love the challenge of turning complex problems into simple, beautiful, and intuitive solutions."}
              </p>
              {profile?.bio && <p>{profile.bio}</p>}
            </div>

            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                Download Resume
              </button>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">My Skills</h3>
            <div className="space-y-6">
              {skills.map((skillGroup, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {skillGroup.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-700 font-medium">Projects Completed</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">3+</div>
            <div className="text-gray-700 font-medium">Years Experience</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
            <div className="text-gray-700 font-medium">Happy Clients</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-700 font-medium">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

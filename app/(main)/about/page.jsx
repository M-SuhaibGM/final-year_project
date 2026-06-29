export default function AboutPage() {
  const teamMembers = [
    {
      role: "Group Leader",
      name: "Shahzaib",
      roll: "5078",
    },
    {
      role: "Team Member",
      name: "Muhammad Sohaib",
      roll: "5076",
    },
    {
      role: "Team Member",
      name: "Rao Waleed Nisar",
      roll: "5009",
    },
  ];

  return (
    <div className="h-[90vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-3 sm:px-4 py-3">
      
      {/* Main Container */}
      <div className="relative w-full h-full max-w-7xl bg-white/80 backdrop-blur-lg border border-blue-100 shadow-2xl rounded-[35px] overflow-hidden grid lg:grid-cols-2">
        
        {/* Left Section */}
        <div className="relative p-5 sm:p-8 lg:p-10 flex flex-col justify-center overflow-hidden">
          
          {/* Blur Effects */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            
            {/* Badge */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold mb-3 animate-pulse">
              Final Year Project
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
              Meet Our <span className="text-blue-600">FYP Team</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Our Final Year Project represents dedication, teamwork, and
              innovation under the guidance of our respected supervisor.
            </p>

            {/* Team Cards */}
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group bg-white border border-blue-100 hover:border-blue-300 shadow-md hover:shadow-2xl rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold shadow-lg shrink-0">
                      {member.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-800">
                        {member.name}
                      </h2>

                      <p className="text-blue-600 font-medium text-xs sm:text-sm">
                        {member.role}
                      </p>

                      <p className="text-gray-500 text-xs sm:text-sm">
                        Roll No: {member.roll}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center p-5 sm:p-8">
          
          {/* Glow */}
          <div className="absolute w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

          {/* Card */}
          <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[30px] p-6 sm:p-8 text-center w-full max-w-sm hover:scale-105 transition-all duration-500">
            
            {/* Avatar */}
            <div className="relative mx-auto mb-5 w-fit">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-extrabold text-blue-600 shadow-2xl border-4 border-white animate-bounce">
                JD
              </div>

              <div className="absolute inset-0 rounded-full border-4 border-cyan-300 animate-ping"></div>
            </div>

            {/* Supervisor */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Dr. Javed Dogar
            </h2>

            <p className="text-blue-100 text-sm sm:text-base font-medium mb-4">
              Project Supervisor & Mentor
            </p>

            {/* Line */}
            <div className="w-20 h-1 bg-white/70 mx-auto rounded-full mb-4"></div>

            <p className="text-blue-50 leading-relaxed text-xs sm:text-sm">
              Guiding us with knowledge, motivation, and professional expertise
              throughout our Final Year Project journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
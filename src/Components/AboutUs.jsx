import React from 'react';

function AboutUs() {
  return (
    <div className="layout-content-container flex flex-col items-center w-full max-w-[960px] py-10 px-4">
      <h1 className="text-[#121416] text-[32px] font-bold leading-tight mb-6">About Us</h1>
      <p className="text-[#6a7581] text-lg leading-relaxed mb-4 text-center">
        Welcome to <strong>SkillMatch</strong>, your trusted platform for connecting talented freelancers—especially students—with clients seeking quality services. Launched with a vision to empower the next generation of professionals, we provide a seamless marketplace where skills meet opportunities.
      </p>
      <p className="text-[#6a7581] text-lg leading-relaxed mb-6 text-center">
        Our mission is to bridge the gap between education and employment, offering students a chance to gain real-world experience while helping clients find affordable, reliable talent. Whether you're a student looking to showcase your skills or a client in need of a project partner, SkillMatch is here to make it happen.
      </p>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="bg-[#f1f2f4] p-6 rounded-xl flex-1">
          <h3 className="text-[#121416] text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-[#6a7581] text-base">
            To create a global community where every student can turn their skills into success, and every client finds the perfect match for their needs.
          </p>
        </div>
        <div className="bg-[#f1f2f4] p-6 rounded-xl flex-1">
          <h3 className="text-[#121416] text-xl font-semibold mb-2">Our Values</h3>
          <p className="text-[#6a7581] text-base">
            Integrity, innovation, and inclusivity drive us to build a platform that benefits all users.
          </p>
        </div>
      </div>
      <p className="text-[#6a7581] text-lg leading-relaxed text-center">
        Founded in 2025, SkillMatch is committed to growing with our community. Join us today and be part of a movement that transforms skills into opportunities!
      </p>
    </div>
  );
}

export default AboutUs;
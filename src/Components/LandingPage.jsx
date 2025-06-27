import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  // Check login status using userData in localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isSignedIn = !!userData; // True if logged in, false otherwise

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f2f4] px-10 py-3">
        <div className="flex items-center gap-4 text-[#121416]">
          <div className="size-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em]">
            SkillMatch
          </h2>
        </div>
        {/* Commented-out header links remain unchanged */}
        {/* <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link className="text-[#121416] text-sm font-medium leading-normal" to="/about">About</Link>
            <Link className="text-[#121416] text-sm font-medium leading-normal" to="/contact">Contact</Link>
          </div>
          <Link to="/signup" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Sign Up</span>
          </Link>
          <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Log In</span>
          </Link>
        </div> */}
      </header>

      <main className="flex flex-1 items-center justify-center px-10 py-16 bg-gradient-to-b from-white to-[#f1f2f4]">
        <div className="text-center max-w-4xl">
          <h1 className="text-[#121416] text-5xl font-bold leading-tight tracking-[-0.015em] mb-6">
            Connect Talent with Opportunity
          </h1>
          <p className="text-[#6a7581] text-xl font-normal leading-relaxed mb-8">
            {isSignedIn
              ? `Welcome, ${userData.username}! Explore opportunities tailored to your skills.`
              : "SkillMatch empowers university and college students to showcase their skills, secure microjobs, and build portfolios—while connecting small businesses and individuals with reliable student talent."}
          </p>
          <div className="flex justify-center gap-6">
            {!isSignedIn && (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-[#c9daec] px-8 py-4 text-[#121416] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#a3c6e0] transition-colors"
              >
                Get Started
              </Link>
            )}
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-full bg-[#f1f2f4] px-8 py-4 text-[#121416] text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#d9dcdf] transition-colors"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </main>

      <section className="px-10 py-16 bg-white">
        <h2 className="text-[#121416] text-3xl font-bold text-center mb-12">
          Why Choose SkillMatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-[#f1f2f4] rounded-xl text-center">
            <h3 className="text-[#121416] text-xl font-semibold mb-4">
              Showcase Skills
            </h3>
            <p className="text-[#6a7581] text-base">
              Create a professional profile and upload your portfolio to stand
              out to employers.
            </p>
          </div>
          <div className="p-6 bg-[#f1f2f4] rounded-xl text-center">
            <h3 className="text-[#121416] text-xl font-semibold mb-4">
              Find Microjobs
            </h3>
            <p className="text-[#6a7581] text-base">
              Browse and apply for short-term gigs tailored to your skills and
              schedule.
            </p>
          </div>
          <div className="p-6 bg-[#f1f2f4] rounded-xl text-center">
            <h3 className="text-[#121416] text-xl font-semibold mb-4">
              Build Your Portfolio
            </h3>
            <p className="text-[#6a7581] text-base">
              Gain real-world experience and showcase completed projects to
              future employers.
            </p>
          </div>
        </div>
      </section>

      <section className="px-10 py-16 bg-[#f1f2f4]">
        <h2 className="text-[#121416] text-3xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <p className="text-[#6a7581] text-base italic mb-4">
              "SkillMatch helped me land my first freelance design gig—amazing
              platform!"
            </p>
            <p className="text-[#121416] font-semibold">
              - Jane Hope, Design Student
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <p className="text-[#6a7581] text-base italic mb-4">
              "Found a reliable coder for my startup project in just a
              day—highly recommend!"
            </p>
            <p className="text-[#121416] font-semibold">
              - John Nganga, Small Business Owner
            </p>
          </div>
        </div>
      </section>

      <section className="px-10 py-16 bg-[#c9daec] text-center">
        <h2 className="text-[#121416] text-3xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        {isSignedIn ? (
          <p className="text-[#6a7581] text-lg mb-8">
            You're all set, {userData.username}! Start exploring jobs or manage
            your profile.
          </p>
        ) : (
          <>
            <p className="text-[#6a7581] text-lg mb-8">
              Join SkillMatch today and unlock your potential or find the talent
              you need.
            </p>
            <form className="max-w-md mx-auto flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input w-full h-14 p-4 rounded-xl bg-white focus:outline-0 focus:ring-0 border-none placeholder:text-[#6a7581] text-base font-normal leading-normal"
              />
              {!isSignedIn && (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-[#121416] px-8 py-4 text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#0f1012] transition-colors"
                >
                  Join Now
                </Link>
              )}
            </form>
          </>
        )}
      </section>

      <footer className="border-t border-solid border-t-[#f1f2f4] px-10 py-6 text-center">
        <p className="text-[#6a7581] text-sm font-normal leading-normal">
          © {new Date().getFullYear()} SkillMatch. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;

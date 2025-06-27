import React, { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Contact form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <div className="layout-content-container flex flex-col items-center w-full max-w-[960px] py-10 px-4">
      <h1 className="text-[#121416] text-[32px] font-bold leading-tight mb-6">
        Contact Us
      </h1>
      <p className="text-[#6a7581] text-lg leading-relaxed mb-6 text-center">
        We’d love to hear from you! Whether you have a question, feedback, or
        need assistance, feel free to reach out. Our team is here to help.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex-1 bg-[#f1f2f4] p-6 rounded-xl">
          <h3 className="text-[#121416] text-xl font-semibold mb-4">
            Get in Touch
          </h3>
          <p className="text-[#6a7581] text-base mb-2">
            <strong>Email:</strong> support@skillmatch.com
          </p>
          <p className="text-[#6a7581] text-base mb-2">
            <strong>Phone:</strong> +1-800-SKILLMATCH
          </p>
          <p className="text-[#6a7581] text-base">
            <strong>Address:</strong> 123 Skill Street, Tech City, TC 12345
          </p>
        </div>

        <div className="flex-1">
          <h3 className="text-[#121416] text-xl font-semibold mb-4">
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="name"
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="email"
            />
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-24 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="off"
            />
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Landing = () => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="">
      <header className="py-4 bg-black sm:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between"></div>
        </div>
      </header>

      <section className="relative py-12 overflow-hidden bg-black sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="px-4 mx-auto relative sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16">
            <div>
              <h1 className="text-4xl font-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                AI-Powered Meeting Notes Summarizer & Sharer
              </h1>
              <p className="mt-4 text-lg font-normal text-gray-400 sm:mt-8">
                This project is a full-stack application that allows users to:
                Upload meeting transcripts. Provide a custom instruction (e.g.,
                &quot;Summarize in bullet points for executives&quot;). Generate
                AI-powered summaries using OpenAI’s free models. Edit the
                summary before finalizing. Share the summary via email.
              </p>

              <form
                action="#"
                method="POST"
                className="relative mt-8 rounded-full sm:mt-12"
              >
                <div className="flex justify-start mt-4 sm:mt-0">
                  <Link
                    href="/upload"
                    type="submit"
                    className="cursor-pointer inline-flex items-center justify-center w-full px-5 py-5 text-sm font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:opacity-90"
                  >
                    Get Started
                  </Link>
                </div>
              </form>

              <div className="mt-8 sm:mt-12"></div>
            </div>

            <div className="relative">
              <div className="absolute inset-0">
                <svg
                  className="blur-3xl filter opacity-70"
                  style={{ filter: "blur(64px)" }}
                  width="444"
                  height="536"
                  viewBox="0 0 444 536"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M225.919 112.719C343.98 64.6648 389.388 -70.487 437.442 47.574C485.496 165.635 253.266 481.381 135.205 529.435C17.1445 577.488 57.9596 339.654 9.9057 221.593C-38.1482 103.532 107.858 160.773 225.919 112.719Z"
                    fill="url(#gradient-bg)"
                  />
                  <defs>
                    <linearGradient
                      id="gradient-bg"
                      x1="82.7339"
                      y1="550.792"
                      x2="-39.945"
                      y2="118.965"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

             

              <img
                className="relative w-full max-w-md mx-auto"
                src="/photo.jpg"
                alt="Illustration"
                width={700}
                height={700}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

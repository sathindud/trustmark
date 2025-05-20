import React from "react";
import successIcon from "../../../assets/review_assets/success.png";

interface SuccessMessageProps {
  navigateTo: string;
}

function SuccessMessage({ navigateTo }: SuccessMessageProps) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-secondary-2">
      <div className="bg-white rounded-xl shadow-lg p-8 md:w-[30%] text-center">
        <img
          src={successIcon}
          alt="Success"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-primary-1 mb-2">
          Review Submitted Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for sharing your experience. Your review helps others make
          informed decisions.
        </p>
        <button
          className="bg-primary-1 text-white px-6 py-2 rounded-lg hover:bg-primary-1-hover transition duration-300 ease-in-out"
          onClick={() => (window.location.href = navigateTo)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SuccessMessage;

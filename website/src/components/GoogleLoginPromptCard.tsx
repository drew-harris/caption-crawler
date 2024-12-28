import { Constants } from "shared";

export const GoogleLoginPromptCard = () => {
  return (
    <div className="bg-white border border-tan-200 rounded-[4px] shadow-sm p-6 text-center my-4">
      <h2 className="text-2xl text-navy font-bold mb-4">
        Connect your Google account
      </h2>

      <p className="mb-4 text-balance text-gray-700">
        Get {Constants.BONUS_GOOGLE_VIDEOS} free video scans by connecting your
        Google account. Stay logged in across all your devices!
      </p>

      <a
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        href="/auth/login/google"
      >
        <img src="/google.svg" alt="" className="w-5 h-5 mr-2" />
        Sign in with Google
      </a>
    </div>
  );
};

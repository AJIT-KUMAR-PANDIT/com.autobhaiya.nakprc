import { useNavigate, useRouteError } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-extrabold text-emerald-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          {error?.statusText || "The auto number or page you're looking for doesn't exist."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            <Home size={18} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

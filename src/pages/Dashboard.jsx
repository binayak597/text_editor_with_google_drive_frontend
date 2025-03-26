import { useState, useEffect } from "react";
import TextEditor from "../components/TextEditor";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL (for first-time login)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");
    const storedToken = localStorage.getItem("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      // Remove token from URL
      window.history.replaceState({}, document.title, "/dashboard");
    }

    const token = tokenFromURL || storedToken;
    if (!token) {
      navigate("/"); 
      return;
    }

    // Fetch user profile
    axios
      .get("https://text-editor-with-google-drive-backend.onrender.com/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        console.log("Unauthorized access....");
        localStorage.removeItem("token"); // Clear invalid token
        navigate("/"); // Redirect to home
      });
  }, [navigate]);

  // Saving letter to Google Drive
  const handleSave = async (content) => {
    try {
      await axios.post(
        "https://text-editor-with-google-drive-backend.onrender.com/api/save-letter",
        { content, folderId: user?.folderId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Letter saved successfully!");
    } catch (error) {
      console.error("Error saving letter:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      {user ? (
        <>
          <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={handleLogout}>
            Logout
          </button>
          <TextEditor onSave={handleSave} />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;

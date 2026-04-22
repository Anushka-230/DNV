import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const useStudentProfile = () => {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/students");
        const mine = res.data.find(
          (s) => (s.userId?._id || s.userId) === user?.id
        );
        setStudentProfile(mine || null);
      } catch {
        setError("Could not load student profile");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  return { studentProfile, loading, error };
};

export default useStudentProfile;
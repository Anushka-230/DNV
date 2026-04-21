import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const useTeacherProfile = () => {
  const { user } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/teachers");
        const mine = res.data.find(
          (t) => (t.userId?._id || t.userId) === user?.id
        );
        setTeacherProfile(mine || null);
      } catch {
        setError("Could not load teacher profile");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  return { teacherProfile, loading, error };
};

export default useTeacherProfile;
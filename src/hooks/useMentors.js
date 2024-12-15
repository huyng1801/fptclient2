import { useState, useEffect } from 'react';
import UserService from '../services/UserService';

export const useMentors = (page = 1, size = 6) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const filter = { isMentor: true };
        const response = await UserService.getAllUsers(filter, { page, size });
        
        setMentors(response.items);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [page, size]);

  return { mentors, loading, error, totalPages };
};
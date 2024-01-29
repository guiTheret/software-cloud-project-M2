import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

interface User {
  id: number;
  name: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get<User[]>("/api/users");

      setUsers(data);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(JSON.stringify(error));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>loading..</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex flex-col gap-2">
        {users.length === 0 ? (
          <div>No users found</div>
        ) : (
          <>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-row gap-2 border-bottom-1"
              >
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.address}</div>
                <div>{user.city}</div>
                <div>{user.country}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

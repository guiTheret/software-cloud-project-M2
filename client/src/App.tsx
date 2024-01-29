import { useEffect, useState } from "react";

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

  const fetchUsers = async () => {
    setLoading(true);
    const url = "http://api-service:3000/user";
    console.log("URL is ", url);
    const res = await fetch(url);
    const { data } = await res.json();
    setUsers(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return <div>Loading... {import.meta.env.API_SERVICE_SERVICE_HOST}</div>;

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

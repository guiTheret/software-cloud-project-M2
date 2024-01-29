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
      const { data } = await axios.get<{ data: User[] }>(
        "http://34.159.72.192:3000/users"
      );
      setUsers(data.data);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>loading updated..</div>;

  if (error) return <div>{error}</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          borderBottom: "1px solid black",
        }}
      >
        {users.length === 0 ? (
          <div>No users found in databse</div>
        ) : (
          <>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "4px",
                  borderBottom: "1px solid black",
                  width: "100%",
                  padding: "4px",
                }}
              >
                <div style={{ width: "20%" }}>{user.name}</div>
                <div style={{ width: "30%" }}>{user.email}</div>
                <div style={{ width: "20%" }}>{user.address}</div>
                <div style={{ width: "20%" }}>{user.city}</div>
                <div style={{ width: "10%" }}>{user.country}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

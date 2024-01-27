import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const url = import.meta.env.VITE_API_URL + "/users";
    console.log(url);
    const res = await fetch(url);
    const { data } = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

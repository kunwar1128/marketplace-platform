import { apiFetch } from "../api/apiFetch";
import { useEffect, useState } from "react";

function AdminInbox({ user }) {
  const [messages, setMessages] = useState([]);
  if (user.role !== "admin") return;

  useEffect(() => {
    if (user.role !== "admin") return;

    async function getMessages() {
      const res = await apiFetch("/api/admin/messages");
      const data = await res.json();
      console.log(data.messages);
      setMessages(data.messages);
    }
    getMessages();
  }, [user.role]);

  return (
    <div>
      <h2>Welcome, {user.role}</h2>
      <p>Inbox coming next...</p>
      {messages.map((m) => (
        <p key={m.id}>
          Name: {m.name} and message: {m.message}
        </p>
      ))}
    </div>
  );
}

export default AdminInbox;

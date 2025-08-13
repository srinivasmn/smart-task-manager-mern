import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { motion } from "framer-motion";

const NOTIFICATIONS = gql`query { notifications { id message read } }`;
const MARK_READ = gql`mutation($id: ID!) { markNotificationRead(notificationId: $id) { id read } }`;

export default function NotificationBell() {
  const { data, refetch } = useQuery(NOTIFICATIONS);
  const [markRead] = useMutation(MARK_READ);
  const [open, setOpen] = useState(false);

  const handleRead = async (id) => {
    await markRead({ variables: { id } });
    refetch();
  };

  const unreadCount = data?.notifications.filter(n => !n.read).length || 0;

  return (
    <div className="relative">
      <button className="relative" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">{unreadCount}</span>
        )}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-2 bg-white text-black w-64 rounded shadow-lg">
          <ul>
            {data?.notifications.map((n) => (
              <li key={n.id} className={`p-2 border-b ${!n.read ? "bg-gray-100" : ""}`} onClick={() => handleRead(n.id)}>
                {n.message}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}

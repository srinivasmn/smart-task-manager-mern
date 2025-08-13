import { useState, useEffect } from "react";

export default function SyncBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return !online ? (
    <div className="bg-yellow-500 text-black p-2 text-center">Offline: Changes will sync when back online</div>
  ) : null;
}

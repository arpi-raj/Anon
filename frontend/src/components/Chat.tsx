import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { tokenState, idState } from "../functions/atoms";
import { useRecoilValue } from "recoil";
import { getChatableClients } from "../functions/helper";
import { motion } from "framer-motion";
import "../index.css";

const Chat = () => {
  const navigate = useNavigate();
  const token = useRecoilValue(tokenState);
  const id = useRecoilValue(idState);
  const [clients, setClients] = useState<{ id: number; userName: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatableClients = async () => {
      if (!id || !token) return;
      setLoading(true);
      try {
        const chatable = await getChatableClients(token, id);
        if (Array.isArray(chatable)) setClients(chatable);
        else console.error("Invalid data format received:", chatable);
      } catch (error) {
        console.error("Error fetching chatable clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatableClients();
  }, [id, token]);

  const handleNavigate = useCallback(
    (clientId: number) => navigate(`/chat/?id=${clientId}`),
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <div className="hidden sm:block w-64 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-blue-400">Chat App</h2>
        <p className="text-gray-400 mt-2">Find & connect with users.</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Chat
        </h1>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-gray-700 mb-4"></div>
                <div className="h-4 w-3/4 bg-gray-700 mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : clients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {clients.map((client) => (
              <motion.div
                key={client.id}
                onClick={() => handleNavigate(client.id)}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 cursor-pointer transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
                    {client.userName.charAt(0)}
                  </div>
                  <h2 className="text-lg font-semibold ml-3">
                    {client.userName}
                  </h2>
                </div>
                <p className="text-gray-400 text-sm">ID: {client.id}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-800 p-8 rounded-lg">
            <p className="text-gray-400">No chatable clients found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

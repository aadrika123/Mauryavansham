"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";

interface User {
  id: number;
  name: string;
  photo: string | null;
  email?: string;
  phone?: string;
  lastMessage?: string;
  city?: string;
  profession?: string;
  designation?: string;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
}

export default function MessengerPage() {
  const { data: session } = useSession();
  const currentUserId = Number(session?.user?.id);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [sending, setSending] = useState(false);

  // 🔹 Fetch connected users list (profile_connect where current user is receiver)
  useEffect(() => {
    if (!currentUserId) return;

    const fetchUsers = async () => {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();

      const profileConnects = data.filter(
        (n: any) =>
          n.type === "profile_connect" && n.receiverId === currentUserId
      );

      const uniqueSenders: User[] = [];
      const seen = new Map<number, string>();

      profileConnects.forEach((n: any) => {
        if (n.sender && !seen.has(n.sender.id)) {
          seen.set(n.sender.id, n.message);
          uniqueSenders.push({
            id: n.sender.id,
            name: n.sender.name,
            photo: n.sender.photo,
            lastMessage: n.message,
          });
        }
      });

      // Sort by most recent message
      uniqueSenders.sort((a, b) => {
        const timeA = new Date(
          profileConnects.find((n: any) => n.sender.id === a.id)?.createdAt
        ).getTime();
        const timeB = new Date(
          profileConnects.find((n: any) => n.sender.id === b.id)?.createdAt
        ).getTime();
        return timeB - timeA;
      });

      setUsers(uniqueSenders);
    };

    fetchUsers();
  }, [currentUserId]);

  // 🔹 When user clicked → fetch full profile details
  const handleUserClick = async (user: User) => {
    setSelectedUser(user);

    // Fetch user profile
    const res = await fetch(`/api/users/getUserByid/${user.id}`);
    const data = await res.json();
    setSelectedUserDetails(data.data);

    // 🔹 Check if already connected using /api/connections
    const connRes = await fetch(
      `/api/connections?user1Id=${currentUserId}&user2Id=${user.id}`
    );
    const connData = await connRes.json();
    setIsConnected(connData.connected);

    // 🔹 Fetch messages only if connected
    if (connData.connected) {
      fetchMessages(user.id);
    } else {
      setMessages([]);
    }
  };

  // 🔹 Fetch conversation
  const fetchMessages = async (userId: number) => {
    const res = await fetch(`/api/messages?userId=${userId}`);
    const data = await res.json();
    setMessages(data);
  };

  // 🔹 Auto-fetch messages every 4 seconds
  useEffect(() => {
    if (!selectedUser || !isConnected) return;

    const interval = setInterval(() => {
      fetchMessages(selectedUser.id);
    }, 5000); // every 5 seconds

    return () => clearInterval(interval); // clean up when unmounted or user changes
  }, [selectedUser, isConnected]);

  // 🔹 Send new message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    const msg: Message = {
      id: Date.now(),
      senderId: currentUserId,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedUser.id, text: newMessage }),
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, lastMessage: newMessage } : u
      )
    );
  };

  // 🔹 Connect Back using /api/connections
  const handleConnectBack = async () => {
    if (!selectedUser || !session?.user) return;

    setSending(true);

    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1Id: currentUserId,
          user2Id: selectedUser.id,
        }),
      });

      if (res.ok) {
        alert("Connection accepted!");
        setIsConnected(true);
        fetchMessages(selectedUser.id);

        // Update sidebar dynamically
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? { ...u, lastMessage: "You are now connected!" }
              : u
          )
        );
      } else {
        alert("Failed to accept connection");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex w-[900px] h-[500px] bg-white shadow-xl rounded-xl overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-72 h-[700px] bg-red-800 border-r overflow-y-auto">
        <h2 className="p-4 font-bold text-lg border-b text-white">Chats</h2>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user)}
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 bg-white ${
              selectedUser?.id === user.id ? "bg-gray-300" : ""
            }`}
          >
            <Image
              src={user.photo || "/default-avatar.png"}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-600 truncate w-40">
                {user.lastMessage || "No messages yet"}
              </p>
            </div>
          </div>
        ))}
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1 flex flex-col bg-white">
        {selectedUserDetails ? (
          <>
            {/* Profile Header (fixed height) */}
            <div className="flex items-center gap-3 p-4 border-b bg-gray-50 h-28">
              <Image
                src={selectedUserDetails.photo || "/default-avatar.png"}
                alt={selectedUserDetails.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h2 className="font-bold text-lg">
                  {selectedUserDetails.name}
                </h2>
                {selectedUserDetails.email && (
                  <p>Email: {selectedUserDetails.email}</p>
                )}
                {selectedUserDetails.phone && (
                  <p>Phone: {selectedUserDetails.phone}</p>
                )}
              </div>
              <div>
                {selectedUserDetails.city && (
                  <p>City: {selectedUserDetails.city}</p>
                )}
                {selectedUserDetails.profession && (
                  <p>
                    Profession:{" "}
                    {selectedUserDetails.profession ||
                      selectedUserDetails.designation}
                  </p>
                )}
              </div>
              {!isConnected && (
                <Button
                  className="ml-auto"
                  onClick={handleConnectBack}
                  disabled={sending}
                >
                  {sending ? "Connecting..." : "Connect Back"}
                </Button>
              )}
            </div>

            {/* Chat Window (smaller height) */}
            {isConnected ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[350px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-end ${
                        msg.senderId === currentUserId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="flex flex-col space-y-1">
                        <div
                          className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                            msg.senderId === currentUserId
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-200 text-black rounded-bl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-500 self-end">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // use 24-hour format; set to true for 12-hour
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 max-h-[350px]">
                Click "Connect Back" to start chatting
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 max-h-[350px]">
            Select a user to see details
          </div>
        )}
      </main>
    </div>
  );
}

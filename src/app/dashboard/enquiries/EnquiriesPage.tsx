"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";

interface User {
  // id: number;
  name: string;
  photo?: string;
  email?: string;
  address?: string;
  phone?: string;
  lastMessage?: string;
  city?: string;
  profession?: string;
  designation?: string;
  state?: string;
  userId?: any;
}

interface EnquiryMessage {
  id: number;
  senderUserId: number;
  receiverUserId: number;
  comment: string;
  enquireType: string;
  createdAt: string;
}

interface SidebarUser {
  userId: number;
  name: string;
  photo?: string;
  messages: EnquiryMessage[];
  latestMessage: string;
  latestCreatedAt: string;
  enquiryTypes: string[];
  email?: string;
  address?: string;
  phone?: string;
}

const QUERY_TYPES = ["education", "business", "health"];

export default function EnquiriesPage() {
  const { data: session } = useSession();
  const currentUserId = Number(session?.user?.id);

  const [sidebarUsers, setSidebarUsers] = useState<SidebarUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<EnquiryMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [queryType, setQueryType] = useState(QUERY_TYPES[0]);

  // 🔹 Fetch user details by ID
  const fetchUserDetails = async (userId: number) => {
    const res = await fetch(`/api/users/getUserByid/${userId}`);
    const data = await res.json();
    console.log(data);
    return data.data as User;
  };

  // 🔹 Fetch sidebar conversations & enrich with user details
  useEffect(() => {
    if (!currentUserId) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/enquiries");
        const messages: SidebarUser[] = await res.json(); // messages grouped by userId

        // Get unique userIds
        const userIds = messages.map((m) => m.userId);

        // Fetch details for each user
        const enrichedUsers = await Promise.all(
          userIds.map(async (id) => {
            const userDetails = await fetchUserDetails(id);
            const userMessages =
              messages.find((m) => m.userId === id)?.messages || [];
            return {
              userId: id,
              name: userDetails.name,
              photo: userDetails.photo,
              messages: userMessages,
              email: userDetails.email,
              address: userDetails.address,
              phone: userDetails.phone,
              latestMessage:
                userMessages[userMessages.length - 1]?.comment || "",
              latestCreatedAt:
                userMessages[userMessages.length - 1]?.createdAt || "",
              enquiryTypes: Array.from(
                new Set(userMessages.map((m) => m.enquireType))
              ),
            } as SidebarUser;
          })
        );

        setSidebarUsers(enrichedUsers);

        // Auto select first user
        if (enrichedUsers.length > 0 && !selectedUser) {
          handleUserClick(enrichedUsers[0], queryType);
        }
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  // 🔹 Fetch conversation from queryMessages API
  const fetchConversation = async (userId: number, type: string) => {
    try {
      const res = await fetch(
        `/api/queryMessages?userId=${userId}&queryType=${type}`
      );
      const data = await res.json();

      const mapped: EnquiryMessage[] = data.map((msg: any) => ({
        id: msg.id,
        senderUserId: msg.senderId,
        receiverUserId: msg.receiverId,
        comment: msg.text,
        enquireType: msg.queryType,
        createdAt: msg.createdAt,
      }));

      setConversation(
        mapped.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  // 🔹 Select a user
  const handleUserClick = (user: User, type: string = queryType) => {
    console.log(user);
    setSelectedUser(user);
    fetchConversation(user.userId, type);
  };

  // 🔹 Auto-refresh conversation every 5s
  useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
      fetchConversation(selectedUser.userId, queryType);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedUser, queryType]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageText = newMessage.trim();

    // Optimistic UI
    const tempMsg: EnquiryMessage = {
      id: Date.now(),
      senderUserId: currentUserId,
      receiverUserId: selectedUser.userId,
      comment: messageText,
      enquireType: queryType,
      createdAt: new Date().toISOString(),
    };

    setConversation((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const res = await fetch("/api/queryMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.userId,
          text: messageText,
          queryType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send message");
        return;
      }

      // Replace temporary message
      setConversation((prev) =>
        prev.map((m) =>
          m.id === tempMsg.id
            ? {
                id: data.id,
                senderUserId: data.senderId,
                receiverUserId: data.receiverId,
                comment: data.text,
                enquireType: data.queryType,
                createdAt: data.createdAt,
              }
            : m
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  const formatDateTime = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${String(d.getUTCDate()).padStart(2, "0")}-${String(
      d.getUTCMonth() + 1
    ).padStart(2, "0")}-${d.getUTCFullYear()} ${String(
      d.getUTCHours()
    ).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };
  console.log(selectedUser, "adassd");
  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-bold mb-2">Enquiries</h2>
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="w-full border rounded p-1 text-sm"
          >
            {QUERY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {sidebarUsers.map((user) => {
          const filteredMsg = user.messages
            .filter((m) => m.enquireType === queryType)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );

          return (
            <div
              key={user.userId}
              onClick={() => handleUserClick(user, queryType)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 ${
                selectedUser?.userId == user.userId ? "bg-gray-300" : ""
              }`}
            >
              <Image
                src={user.photo || "/default-avatar.png"}
                width={40}
                height={40}
                alt={user.name}
                className="rounded-full"
              />
              <div>
                <span className="font-semibold">{user.name}</span>
                <p className="text-xs text-gray-500 truncate w-40">
                  {filteredMsg[0]?.comment || "No messages yet"}
                </p>
                <p className="text-xs text-gray-500 truncate w-40 capitalize">
                  {filteredMsg.map((m) => m.enquireType).join(", ") ||
                    "No messages yet"}{" "}
                  query
                </p>
              </div>
            </div>
          );
        })}
      </aside>

      {/* CONVERSATION */}
      <main className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-gray-50 flex items-center gap-4">
              <Image
                src={selectedUser.photo || "/default-avatar.png"}
                width={60}
                height={60}
                alt={selectedUser.name}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <h2 className="font-bold text-lg">{selectedUser.name}</h2>
                {selectedUser.email && (
                  <p className="text-sm text-gray-700">{selectedUser.email}</p>
                )}
                {selectedUser.address && (
                  <p className="text-sm text-gray-700">
                    {selectedUser.address}
                  </p>
                )}
                {selectedUser.phone && (
                  <p className="text-sm text-gray-700">{selectedUser.phone}</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Banner for latest message */}
              <div className="flex justify-center">
                <div className="bg-yellow-100 text-gray-800 text-sm px-4 py-2 rounded-lg max-w-md text-center">
                  {sidebarUsers
                    .find((u) => u.userId == selectedUser.userId)
                    ?.messages.filter((m) => m.enquireType === queryType)
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )[0]?.comment || "No messages yet"}
                </div>
              </div>

              {conversation
                .filter((m) => m.enquireType == queryType)
                .map((msg) => {
                  const isSender = msg.senderUserId == currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                          isSender
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        <p className="text-sm capitalize">
                          {msg.comment || "No message"}
                        </p>
                        <span
                          className={`text-[10px] ${
                            isSender ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {formatDateTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your enquiry..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to see conversation
          </div>
        )}
      </main>
    </div>
  );
}

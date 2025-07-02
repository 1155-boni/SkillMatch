// MessagingTab.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  where,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function Messaging() {
  const user = JSON.parse(localStorage.getItem("userData"));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userSearch, setUserSearch] = useState("");

  const currentUserEmail = user?.email;

  useEffect(() => {
    const adminEmail = "admin@yourdomain.com"; // <-- Set your admin email here
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const loadedUsers = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== currentUserEmail && data.role !== "admin") {
          loadedUsers.push({ email: doc.id, ...data });
        }
      });
      setUsers(loadedUsers);
    });

    return () => unsubscribe();
  }, [currentUserEmail]);

  useEffect(() => {
    const typingDoc = doc(db, "typingStatus", `${currentUserEmail}`);
    const unsubscribe = onSnapshot(typingDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.to === selectedUser?.email) {
        setPartnerTyping(data.typing);
      } else {
        setPartnerTyping(false);
      }
    });
    return () => unsubscribe();
  }, [selectedUser, currentUserEmail]);

  useEffect(() => {
    if (!selectedUser) return;

    const convoId = [currentUserEmail, selectedUser.email].sort().join("|");
    const q = query(
      collection(db, "messages", convoId, "chat"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chat = [];
      snapshot.forEach((doc) => chat.push(doc.data()));
      setMessages(chat);

      // Mark all as read
      snapshot.docs.forEach(async (docSnap) => {
        const data = docSnap.data();
        if (data.receiver === currentUserEmail && !data.read) {
          await updateDoc(docSnap.ref, { read: true });
        }
      });
    });

    return () => unsubscribe();
  }, [selectedUser, currentUserEmail]);

  useEffect(() => {
    // Watch unread message count
    const unsubscribes = users.map((u) => {
      const convoId = [currentUserEmail, u.email].sort().join("|");
      const q = query(
        collection(db, "messages", convoId, "chat"),
        where("receiver", "==", currentUserEmail),
        where("read", "==", false)
      );

      return onSnapshot(q, (snapshot) => {
        setUnreadCounts((prev) => ({
          ...prev,
          [u.email]: snapshot.size,
        }));
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [users, currentUserEmail]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const convoId = [currentUserEmail, selectedUser.email].sort().join("|");
    const message = {
      sender: currentUserEmail,
      receiver: selectedUser.email,
      text: newMessage,
      timestamp: serverTimestamp(),
      read: false,
    };

    await addDoc(collection(db, "messages", convoId, "chat"), message);
    setNewMessage("");

    // Reset typing
    await setDoc(doc(db, "typingStatus", currentUserEmail), {
      to: selectedUser.email,
      typing: false,
    });
  };

  const handleTyping = async (e) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      await setDoc(doc(db, "typingStatus", currentUserEmail), {
        to: selectedUser?.email || "",
        typing: true,
      });

      setTimeout(async () => {
        setTyping(false);
        await setDoc(doc(db, "typingStatus", currentUserEmail), {
          to: selectedUser?.email || "",
          typing: false,
        });
      }, 2000);
    }
  };

  return (
    <div className="flex w-full max-w-4xl mx-auto h-[600px] bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#fafafa] border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Inbox</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <input
            type="text"
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full mb-2 px-3 py-2 rounded-full border border-gray-300 bg-white"
          />
          {users
            .filter((u) =>
              (u.username || u.email)
                .toLowerCase()
                .includes(userSearch.toLowerCase())
            )
            .map((u) => (
              <div
                key={u.email}
                className={`flex items-center gap-3 cursor-pointer px-4 py-3 transition ${
                  selectedUser?.email === u.email
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedUser(u)}
              >
                {u.profileImage ? (
                  <img
                    src={u.profileImage}
                    alt={u.username || u.email}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                    {u.username
                      ? u.username[0].toUpperCase()
                      : u.email[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <span
                    className={`block font-medium ${
                      unreadCounts[u.email] > 0
                        ? "font-bold text-black"
                        : "text-gray-700"
                    }`}
                  >
                    {u.username || u.email}
                  </span>
                </div>
                {unreadCounts[u.email] > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCounts[u.email]}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="w-2/3 flex flex-col h-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center">
          {selectedUser ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg mr-3">
                {selectedUser.username
                  ? selectedUser.username[0].toUpperCase()
                  : selectedUser.email[0].toUpperCase()}
              </div>
              <span className="font-bold text-lg">
                {selectedUser.username || selectedUser.email}
              </span>
            </>
          ) : (
            <span className="font-bold text-lg text-gray-400">
              Select a user
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2 bg-white">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] rounded-2xl px-4 py-2 text-base ${
                m.sender === currentUserEmail
                  ? "bg-blue-500 text-white self-end rounded-br-none"
                  : "bg-gray-200 text-gray-900 self-start rounded-bl-none"
              }`}
            >
              <p>{m.text}</p>
              <small className="block text-xs mt-1 opacity-70">
                {m.timestamp
                  ?.toDate()
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </small>
            </div>
          ))}
          {partnerTyping && (
            <p className="text-sm text-gray-400 italic self-start">Typing...</p>
          )}
        </div>
        {selectedUser && (
          <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
            <input
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type a message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              className="bg-gradient-to-br from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messaging;

"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layout";

// Define a User type
interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  address?: string;
  phone?: string;
}


const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageContent, setMessageContent] = useState<string>("");

  // Fetch users from the API
  const fetchUsers = async (searchTerm: string = "") => {
    try {
      const response = await fetch(
        `/api/users?searchTerm=${encodeURIComponent(searchTerm)}`
      );
      const usersData: User[] = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUnblock = async (userId: number, isBlocked: boolean) => {
    const role: "ADMIN" | "CUSTOMER" = isBlocked ? "CUSTOMER" : "ADMIN";
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      fetchUsers(searchTerm);
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleSendMessage = async (userId: number) => {
    try {
      await fetch(`/api/users/${userId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: messageContent }),
      });
      setMessageContent("");
      setSelectedUser(null);
      fetchUsers(searchTerm);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSearch = () => {
    fetchUsers(searchTerm);
  };

  const handleViewDetails = (userId: number) => {
    const user = users.find((u) => u.id === userId) ?? null;
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>

      {/* User Search Section */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Search Users</h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Search by name or email"
        />
        <button
          onClick={handleSearch}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Users List Section */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Users List</h2>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.role === "ADMIN" ? "Active" : "Blocked"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleViewDetails(user.id)}
                    className="mr-2 text-indigo-600 hover:underline"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      handleBlockUnblock(user.id, user.role === "CUSTOMER")
                    }
                    className="text-red-600 hover:underline"
                  >
                    {user.role === "CUSTOMER" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Pop-Up */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">User Details</h2>

            <button
              onClick={handleCloseDetails}
              className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-medium">
                User ID: {selectedUser.id}
              </h3>
              <p className="text-sm text-gray-600">Name: {selectedUser.name}</p>
              <p className="text-sm text-gray-600">
                Email: {selectedUser.email}
              </p>
              <p className="text-sm text-gray-600">
                Address: {selectedUser.address ?? "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {selectedUser.phone ?? "N/A"}
              </p>
            </div>

            <h3 className="mb-2 text-lg font-medium">Send Message</h3>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
              className="mb-4 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Type your message here..."
            ></textarea>
            <button
              onClick={() => selectedUser && handleSendMessage(selectedUser.id)}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementPage;

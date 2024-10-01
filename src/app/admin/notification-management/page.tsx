"use client";
import { useState, useEffect } from "react";
import type { SetStateAction } from "react";
import AdminLayout from "../layout";
import SelectWithSearch from "../components/SelectwithSearch";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Notification {
  id: number;
  userId: number;
  content: string;
  sentAt: string; // Assuming sentAt is a date string
}

const NotificationManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch users and notifications from the API
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch("/api/users");
        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);

        // Fetch notifications
        const notificationsResponse = await fetch("/api/notifications");
        const notificationsData: Notification[] =
          await notificationsResponse.json();
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSendNotification = async () => {
    if (selectedUser !== null && message.trim() !== "") {
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: selectedUser, content: message }),
        });

        // Refresh notifications list after sending
        const notificationsResponse = await fetch("/api/notifications");
        const notificationsData: Notification[] =
          await notificationsResponse.json();
        setNotifications(notificationsData);

        // Clear the form
        setMessage("");
        setSelectedUser(null);
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `/api/notifications?searchTerm=${encodeURIComponent(searchTerm)}`,
      );
      const notificationsData: Notification[] = await response.json();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error searching notifications:", error);
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Notification Management</h1>

      {/* Send Notification Section */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Send New Notification</h2>

        <div className="mb-4">
          <label
            htmlFor="user-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select User
          </label>
          <SelectWithSearch
            options={users.map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
            }))}
            selectedValue={selectedUser}
            onChange={(value: SetStateAction<number | null>) =>
              setSelectedUser(value)
            }
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
        </div>

        <button
          onClick={handleSendNotification}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Send Notification
        </button>
      </div>

      {/* Notifications List Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Sent Notifications</h2>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notifications"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Recipient</th>
              <th className="border px-4 py-2">Message</th>
              <th className="border px-4 py-2">Date Sent</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td className="border px-4 py-2">
                  {users.find((user) => user.id === notification.userId)
                    ?.name ?? "Unknown"}
                </td>
                <td className="border px-4 py-2">{notification.content}</td>
                <td className="border px-4 py-2">
                  {new Date(notification.sentAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default NotificationManagementPage;

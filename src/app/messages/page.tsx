"use client";
// src/app/messages/page.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '../_components/Header'; // Adjust the import path according to your project structure
import { Dialog } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { SessionProvider } from 'next-auth/react';


const messages = [
  // Example messages with dates and timestamps
  {
    date: '2024-09-13',
    messages: [
      { id: '1', content: 'Message 1 content here', timestamp: '12:45 PM', unread: true },
      { id: '2', content: 'Message 2 content here', timestamp: '1:30 PM', unread: false },
    ],
  },
  {
    date: '2024-09-12',
    messages: [
      { id: '3', content: 'Message 3 content here', timestamp: '9:00 AM', unread: true },
      { id: '4', content: 'Message 4 content here', timestamp: '3:15 PM', unread: false },
    ],
  },
];

const MessagesPage = () => {
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [scrolling, setScrolling] = useState<boolean>(false);

  const handleExpand = (id: string) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        // Load more messages when reaching bottom
        setScrolling(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* <SessionProvider></SessionProvider> */}
      <div className="p-6 mt-16"> {/* Add margin-top to avoid overlap with fixed header */}
        <h1 className="text-2xl font-bold text-center mb-6">Messages</h1>

        {messages.map((dateGroup) => (
          <div key={dateGroup.date} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{dateGroup.date}</h2>
            {dateGroup.messages.map((message) => (
              <div key={message.id} className="bg-white shadow-md rounded-lg p-4 mb-2 cursor-pointer">
                <div className="flex justify-between items-center" onClick={() => handleExpand(message.id)}>
                  <p className={`font-medium ${message.unread ? 'font-bold' : ''}`}>{message.content}</p>
                  <span className="text-sm text-gray-500">{message.timestamp}</span>
                </div>

                {expandedMessageId === message.id && (
                  <Dialog open={expandedMessageId === message.id} onClose={() => handleExpand('')}>
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="relative bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
                        <Dialog.Title className="text-lg font-semibold mb-4 flex justify-between items-center">
                          Message Details
                          <button
                            onClick={() => handleExpand('')}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label="Close"
                          >
                            <ChevronDownIcon className="w-6 h-6" />
                          </button>
                        </Dialog.Title>
                        <div className="overflow-y-auto max-h-80">
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;

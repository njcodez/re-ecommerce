// "use client";

// import { useState } from "react";
// import { useSession, SessionProvider } from "next-auth/react";

// const ProfilePageContent = () => {
//   const { data: session } = useSession();

//   // State for the form fields
//   const [name, setName] = useState(session?.user?.name ?? "");
//   const [address, setAddress] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
  
//   // State to control the snackbar visibility
//   const [showSnackbar, setShowSnackbar] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Simulate saving data (e.g., send to API)
//     setTimeout(() => {
//       // Show snackbar after saving
//       setShowSnackbar(true);

//       // Hide snackbar after 3 seconds
//       setTimeout(() => setShowSnackbar(false), 3000);
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen">
//       {/* Render the header */}

//       {/* Main content */}
//       <div className="container mx-auto p-6">
//         <h1 className="mb-6 text-center text-3xl font-bold">User Profile</h1>

//         {session ? (
//           <form
//             onSubmit={handleSubmit}
//             className="mx-auto max-w-lg space-y-6 rounded-lg bg-white p-6 shadow-lg"
//           >
//             {/* Gmail Address (non-editable) */}
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Gmail Address
//               </label>
//               <input
//                 type="text"
//                 value={session.user?.email ?? ""}
//                 disabled
//                 className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-600"
//               />
//             </div>

//             {/* Name */}
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="mt-2 w-full rounded-lg border border-gray-300 p-3"
//                 placeholder="Enter your name"
//               />
//             </div>

//             {/* Address */}
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="mt-2 w-full rounded-lg border border-gray-300 p-3"
//                 placeholder="Enter your address"
//               />
//             </div>

//             {/* Phone Number */}
//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="mt-2 w-full rounded-lg border border-gray-300 p-3"
//                 placeholder="Enter your phone number"
//               />
//             </div>

//             {/* Notice */}
//             <p className="text-xs text-gray-500">
//               This information will be used for delivery.
//             </p>

//             {/* Submit Button */}
//             <div className="text-center">
//               <button
//                 type="submit"
//                 className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         ) : (
//           <p className="text-center text-gray-500">
//             Please sign in to view your profile.
//           </p>
//         )}
//       </div>

//       {/* Snackbar (toast) */}
//       {showSnackbar && (
//         <div className="fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-lg bg-green-500 px-6 py-2 text-white shadow-md">
//           Saved Successfully!
//         </div>
//       )}
//     </div>
//   );
// };

// const ProfilePage = () => {
//   return (
//     <SessionProvider>
//       <ProfilePageContent />
//     </SessionProvider>
//   );
// };

// export default ProfilePage;

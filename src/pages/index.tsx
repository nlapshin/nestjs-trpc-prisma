"use client"

import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { data: users, refetch } = trpc.getUsers.useQuery();
  const addUser = trpc.addUser.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteUser = trpc.deleteUser.useMutation({
    onSuccess: () => refetch(),
  });

  const handleAddUser = () => {
    if (name && email) {
      addUser.mutate({ name, email });
      setName('');
      setEmail('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>
      <ul>
        {users?.map((user) => (
          <li key={user.id} className="flex justify-between items-center mb-2">
            <span>{user.name} ({user.email})</span>
            <button
              onClick={() => deleteUser.mutate({ id: user.id })}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

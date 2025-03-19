import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Ensure the correct import path

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

const AgentManagement = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth(); // Get the token

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/agents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(response.data);
    } catch (err) {
      setError('Failed to fetch agents. Please check authentication.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        'http://localhost:5000/api/agents',
        { name, email, mobile, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Agent created successfully');
      setName('');
      setEmail('');
      setMobile('');
      setPassword('');
      fetchAgents();
    } catch (err) {
      setError('Failed to create agent. Please check authentication.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Agent deleted successfully');
      fetchAgents();
    } catch (err) {
      setError('Failed to delete agent. Please check authentication.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Agent Management</h1>

      {error && <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md">{error}</div>}
      {success && <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <UserPlus className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Add New Agent</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
                Mobile
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="mobile"
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Agent
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Existing Agents</h2>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                  <p className="text-sm text-gray-500">{agent.mobile}</p>
                </div>
                <button
                  onClick={() => handleDelete(agent._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;

import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

interface Task {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
  assignedTo: string;
  status: 'pending' | 'completed';
}

interface Agent {
  _id: string;
  name: string;
  email: string;
}

const TaskDistribution = () => {
  const [file, setFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchTasks();
  }, []);

  // 🔐 Retrieve token from localStorage
  const token = localStorage.getItem('token');

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/agents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(response.data);
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/tasks/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Tasks uploaded and distributed successfully');
      setFile(null);
      fetchTasks();
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAuthError = (err: any) => {
    if (err.response?.status === 401) {
      setError('Session expired. Please log in again.');
      localStorage.removeItem('token');
      // Optionally, redirect to login
    } else {
      // setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Distribution</h1>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Upload className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Upload Tasks</h2>
          </div>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                CSV File
              </label>
              <input
                type="file"
                id="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!file || isUploading}
                className={`${
                  !file || isUploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {isUploading ? 'Uploading...' : 'Upload and Distribute'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <FileSpreadsheet className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Distributed Tasks</h2>
          </div>
          <div className="space-y-4">
            {agents.map((agent) => {
              const agentTasks = tasks.filter((task) => task.assignedTo === agent._id);
              return (
                <div key={agent._id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {agentTasks.length} tasks assigned
                  </p>
                  <div className="space-y-2">
                    {agentTasks.map((task) => (
                      <div
                        key={task._id}
                        className="text-sm p-2 bg-gray-50 rounded flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{task.firstName}</p>
                          <p className="text-gray-500">{task.phone}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDistribution;

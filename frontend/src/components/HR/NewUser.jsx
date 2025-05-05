import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Smartphone, Briefcase, Building, CheckCircle, AlertCircle } from 'lucide-react';

const NewUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    position: '',
    mobileNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/users', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
        position: '',
        mobileNumber: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-b from-indigo-50 to-white rounded-xl shadow-lg border border-indigo-100">
      <div className="flex items-center mb-8 pb-4 border-b border-indigo-100">
        <div className="bg-indigo-600 p-3 rounded-lg shadow-md">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h1 className="ml-4 text-2xl font-bold text-indigo-800">Create New User</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
          <p className="text-emerald-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-indigo-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-indigo-700">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-indigo-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-indigo-700">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                placeholder="+1234567890"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-indigo-700">
              Role
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR Manager</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-medium text-indigo-700">
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="Engineering"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-indigo-700">
              Position
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Software Developer"
                className="block w-full pl-10 pr-3 py-2 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 mt-4 border-t border-indigo-100">
          <button
            type="button"
            onClick={() => navigate('/hr-home')}
            className="px-5 py-2 border border-indigo-300 rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;
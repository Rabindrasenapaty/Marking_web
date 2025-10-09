import { useState, useEffect } from 'react';
import { juriesAPI, teamsAPI, configAPI, exportAPI, getCriteria, addCriteria, removeCriteria } from '../utils/api';
import AdminPanel from '../components/AdminPanel';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [juries, setJuries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [criteria, setCriteria] = useState([]);
  const [newCriteria, setNewCriteria] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdminAuthed') !== 'true') {
      navigate('/'); // or show a password prompt here
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
    fetchCriteria();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [juriesResponse, teamsResponse, configResponse] = await Promise.all([
        juriesAPI.getAll(),
        teamsAPI.getAll(),
        configAPI.get()
      ]);

      setJuries(juriesResponse.data);
      setTeams(teamsResponse.data);
      setConfig(configResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCriteria = async () => {
    const res = await getCriteria();
    setCriteria(res.data);
  };

  const handleAdd = async () => {

    if (newCriteria.trim() !== '') {
      const capitalized = newCriteria.trim().toUpperCase();
      await addCriteria(capitalized);
      setNewCriteria('');
      fetchCriteria();
    } else {
      toast.error('Please enter a valid criterion');
    }
  };


  const handleRemove = async (idx) => {
    await removeCriteria(idx);
    fetchCriteria();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getDashboardStats = () => {
    const submittedJuries = juries.filter(j => j.hasSubmitted).length;
    const pausedJuries = juries.filter(j => j.paused && !j.hasSubmitted).length;
    const pendingJuries = juries.length - submittedJuries - pausedJuries;

    return {
      totalJuries: juries.length,
      totalTeams: teams.length,
      submitted: submittedJuries,
      paused: pausedJuries,
      pending: pendingJuries,
      completionRate: juries.length > 0 ? Math.round((submittedJuries / juries.length) * 100) : 0
    };
  };

  const handleExportAll = () => {
    // This would create a ZIP file with all exports
    toast.success('Export all feature will be implemented soon!');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'juries', label: 'Manage Juries', icon: '👨‍⚖️' },
    { id: 'teams', label: 'Manage Teams', icon: '👥' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'exports', label: 'Export Data', icon: '📥' },
    { id: 'criteria', label: 'Criteria', icon: '🧾' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = getDashboardStats();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ⚙️ Admin Control Panel
              </h1>
              <p className="text-gray-600">
                Manage juries, teams, and system configuration
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={fetchData}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                🔄 Refresh
              </button>

              <button
                onClick={handleExportAll}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                📦 Export All
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('isAdminAuthed');
                  navigate('/');
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                🚪 Logout Admin
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                System Overview
              </h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Juries</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.totalJuries}</p>
                    </div>
                    <div className="text-4xl">👨‍⚖️</div>
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Teams</p>
                      <p className="text-3xl font-bold text-green-600">{stats.totalTeams}</p>
                    </div>
                    <div className="text-4xl">👥</div>
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
                    </div>
                    <div className="text-4xl">📈</div>
                  </div>
                </div>
              </div>

              {/* Progress Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
                  <div className="text-sm text-gray-600">✅ Submitted</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.paused}</div>
                  <div className="text-sm text-gray-600">⏸️ Paused</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">❌ Pending</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exports' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Export Options
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">📊 Leaderboard</h3>
                  <p className="text-gray-600 mb-4">
                    Export the current leaderboard with all team rankings and scores.
                  </p>
                  <button
                    onClick={() => exportAPI.leaderboardExcel()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full"
                  >
                    Download Leaderboard Excel
                  </button>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">👨‍⚖️ Jury Reports</h3>
                  <p className="text-gray-600 mb-4">
                    Export individual jury marking sheets for each jury panel.
                  </p>
                  <div className="space-y-2">
                    {juries.map((jury) => (
                      <button
                        key={jury._id}
                        onClick={() => exportAPI.juryExcel(jury.name)}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out w-full text-left"
                      >
                        📄 {jury.name} Report
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'juries' && (
            <div>


              {/* Jury management content here */}
            </div>
          )}

          {activeTab === 'teams' && (
            <div>


              {/* Team management content here */}
            </div>
          )}

          {activeTab === 'config' && (
            <div>


              {/* Configuration settings content here */}
            </div>
          )}

          {activeTab === 'criteria' && (
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                🧾 Criteria List
              </h2>

              {/* Criteria Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {criteria.length === 0 ? (
                  <p className="text-gray-400 col-span-full text-center">No criteria set yet.</p>
                ) : (
                  criteria.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <span className="text-gray-800 font-medium">{c}</span>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="ml-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors duration-200"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Criteria */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newCriteria}
                  onChange={e => setNewCriteria(e.target.value.toUpperCase())}
                  placeholder="Enter new criteria"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={handleAdd}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Criteria
                </button>
              </div>
            </div>
          )}


          {/* Other tab contents will be handled by AdminPanel component */}
          {activeTab !== 'dashboard' && activeTab !== 'exports' && activeTab !== 'criteria' && (
            <AdminPanel
              activeTab={activeTab}
              juries={juries}
              teams={teams}
              config={config}
              onDataUpdate={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
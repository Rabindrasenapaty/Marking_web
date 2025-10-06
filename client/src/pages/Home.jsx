import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { juriesAPI } from '../utils/api';
import JuryCard from '../components/JuryCard';

const Home = () => {
  const navigate = useNavigate();
  const [juries, setJuries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJuries();
  }, []);

  const fetchJuries = async () => {
    try {
      setLoading(true);
      const response = await juriesAPI.getAll();
      setJuries(response.data);
    } catch (error) {
      console.error('Failed to fetch juries:', error);
      setError('Failed to load juries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJurySelect = (juryName) => {
    navigate(`/jury/${encodeURIComponent(juryName)}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Marking System
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Please select your jury panel to begin marking
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 max-w-2xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>Instructions:</strong> Choose your jury name from the cards below to access 
            the marking interface. You can pause and resume your marking session at any time.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading juries...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchJuries}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Jury Selection */}
      {!loading && !error && (
        <>
          {juries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍⚖️</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">
                No Juries Available
              </h2>
              <p className="text-gray-500 mb-6">
                Please contact the administrator to set up jury panels.
              </p>
              <button
                onClick={() => navigate('/admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                Go to Admin Panel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {juries.map((jury) => (
                <JuryCard
                  key={jury._id}
                  jury={jury}
                  onSelect={handleJurySelect}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {juries.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Quick Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {juries.length}
              </div>
              <div className="text-sm text-gray-600">Total Juries</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {juries.filter(j => j.hasSubmitted).length}
              </div>
              <div className="text-sm text-gray-600">Submitted</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {juries.filter(j => j.paused && !j.hasSubmitted).length}
              </div>
              <div className="text-sm text-gray-600">Paused</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
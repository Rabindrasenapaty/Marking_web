import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const MarkingTable = ({ teams, initialMarks, onSave, disabled, saving, juryName }) => {
  const [marks, setMarks] = useState([]);

  // Criteria configuration (should come from config)
  const criteria = ['innovation', 'creativity', 'feasibility', 'presentation'];
  const maxMarks = 20;

  useEffect(() => {
    // Initialize marks with teams
    const initializedMarks = teams.map(team => {
      const existingMark = initialMarks.find(m => m.teamName === team.name);
      if (existingMark) {
        return existingMark;
      }
      
      return {
        teamName: team.name,
        criteria: {
          innovation: 0,
          creativity: 0,
          feasibility: 0,
          presentation: 0
        },
        total: 0
      };
    });
    
    setMarks(initializedMarks);
  }, [teams, initialMarks]);

  const calculateTotal = (criteriaMarks) => {
    return Object.values(criteriaMarks).reduce((sum, mark) => sum + (mark || 0), 0);
  };

  const handleMarkChange = (teamIndex, criterion, value) => {
    if (disabled) return;
    
    const numValue = Math.min(Math.max(0, parseInt(value) || 0), maxMarks);
    
    setMarks(prevMarks => {
      const newMarks = [...prevMarks];
      newMarks[teamIndex] = {
        ...newMarks[teamIndex],
        criteria: {
          ...newMarks[teamIndex].criteria,
          [criterion]: numValue
        }
      };
      newMarks[teamIndex].total = calculateTotal(newMarks[teamIndex].criteria);
      
      // Auto-save to localStorage
      localStorage.setItem(`marks_${juryName}`, JSON.stringify(newMarks));
      
      return newMarks;
    });
  };

  const handleSubmit = () => {
    if (disabled || saving) return;
    
    const isComplete = marks.every(mark => 
      Object.values(mark.criteria).every(value => value > 0)
    );
    
    if (!isComplete) {
      alert('Please complete marking for all teams and criteria before submitting.');
      return;
    }
    
    if (confirm('Are you sure you want to submit your marks? This action cannot be undone.')) {
      onSave(marks, true);
    }
  };

  const handleDraft = () => {
    if (disabled || saving) return;
    onSave(marks, false);
    alert('Draft saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-blue-800 text-sm">
          <strong>Instructions:</strong> Rate each team on a scale of 0-{maxMarks} for each criterion. 
          The total will be calculated automatically. Save drafts frequently and submit when complete.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              {criteria.map(criterion => (
                <th key={criterion} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {criterion}
                  <div className="text-xs font-normal text-gray-400">({maxMarks} max)</div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marks.map((mark, index) => (
              <tr key={mark.teamName} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {mark.teamName}
                </td>
                {criteria.map(criterion => (
                  <td key={criterion} className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      max={maxMarks}
                      value={mark.criteria[criterion] || ''}
                      onChange={(e) => handleMarkChange(index, criterion, e.target.value)}
                      disabled={disabled}
                      className={`w-16 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                      }`}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-lg text-blue-600">
                  {mark.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Teams: {marks.length} | 
          Completed: {marks.filter(m => Object.values(m.criteria).every(v => v > 0)).length} |
          Max possible total: {maxMarks * criteria.length}
        </div>
        
        <div className="flex space-x-3">
          {!disabled && (
            <>
              <button
                onClick={handleDraft}
                disabled={saving}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                {saving ? 'Saving...' : '💾 Save Draft'}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
              >
                {saving ? 'Submitting...' : '✅ Submit Final'}
              </button>
            </>
          )}
          
          {disabled && (
            <div className="text-green-600 font-medium">
              ✅ Marking Complete
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MarkingTable.propTypes = {
  teams: PropTypes.array.isRequired,
  initialMarks: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  juryName: PropTypes.string.isRequired,
};

export default MarkingTable;
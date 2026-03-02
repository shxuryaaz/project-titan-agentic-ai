import React, { useState, useEffect } from 'react';
import { leadAPI } from '../services/api';

function LeadPipeline() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('all');

  const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'not_qualified'];

  useEffect(() => {
    loadLeads();
  }, [selectedStage]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const stage = selectedStage === 'all' ? null : selectedStage;
      const response = await leadAPI.getAll(stage);
      setLeads(response.data.leads);
      setError(null);
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (leadId, newStage) => {
    try {
      await leadAPI.update(leadId, { stage: newStage });
      loadLeads();
    } catch (err) {
      alert('Failed to update lead stage');
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-indigo-100 text-indigo-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
      not_qualified: 'bg-orange-100 text-orange-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lead Pipeline</h2>

      {/* Stage Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStage('all')}
          className={`px-4 py-2 rounded-md ${
            selectedStage === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Stages
        </button>
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`px-4 py-2 rounded-md capitalize ${
              selectedStage === stage
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {stage.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No leads found
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStageColor(lead.stage)}`}>
                  {lead.stage.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {lead.company && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Company:</span> {lead.company}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Value:</span> ${lead.value?.toLocaleString() || 0}
                </p>
                {lead.source && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Source:</span> {lead.source}
                  </p>
                )}
              </div>

              {lead.notes && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {lead.notes}
                </p>
              )}

              <div className="border-t pt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Change Stage:
                </label>
                <select
                  value={lead.stage}
                  onChange={(e) => handleStageChange(lead.id, e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage} className="capitalize">
                      {stage.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeadPipeline;

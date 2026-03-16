import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import SearchFilter from './SearchFilter';
import { useCustomerSearch } from '../hooks/useCustomerSearch';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStats = useCustomerSearch(stats, searchTerm);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <SearchFilter value={searchTerm} onChange={setSearchTerm} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Customers
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {filteredStats?.customers?.total || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Customers
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {filteredStats?.customers?.active || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Leads
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {filteredStats?.leads?.total || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pipeline Value
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  ${filteredStats?.leads?.pipeline_value?.toLocaleString() || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leads by Stage */}
      {filteredStats?.leads?.by_stage && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Stage</h3>
          <div className="space-y-3">
            {Object.entries(filteredStats.leads.by_stage).map(([stage, count]) => (
              <div key={stage} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                  {stage}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(count / filteredStats.leads.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { analyticsAPI, searchCustomersByName } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (searchFilter.trim()) {
      const fetchSearchResults = async () => {
        try {
          const response = await searchCustomersByName(searchFilter);
          setSearchResults(response.data);
        } catch (err) {
          console.error('Failed to fetch search results', err);
          setSearchResults([]);
        }
      };
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchFilter]);

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

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
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
      <div className="mb-4">
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Search..."
          value={searchFilter}
          onChange={handleSearchChange}
        />
      </div>

      {searchFilter.trim() && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Search Results:</h3>
          <ul className="list-disc pl-5">
            {searchResults.map((customer) => (
              <li key={customer.id}>{customer.name}</li>
            ))}
          </ul>
        </div>
      )}

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
                  {stats?.customers?.total || 0}
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
                  {stats?.customers?.active || 0}
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
                  {stats?.leads?.total || 0}
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
                  ${stats?.leads?.pipeline_value?.toLocaleString() || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leads by Stage */}
      {stats?.leads?.by_stage && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Stage</h3>
          <div className="space-y-3">
            {Object.entries(stats.leads.by_stage).map(([stage, count]) => (
              <div key={stage} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                  {stage}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.leads.total) * 100}%` }}
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

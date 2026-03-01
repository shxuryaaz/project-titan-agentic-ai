import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import SearchFilter from './SearchFilter'; // Importing SearchFilter component
import useCustomerSearch from '../hooks/useCustomerSearch'; // Importing useCustomerSearch hook

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const { customers, searchLoading, searchError } = useCustomerSearch(searchTerm); // Using useCustomerSearch hook

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // If there's a search term, we don't need to load the entire dashboard
      setLoading(false);
    }
  }, [searchTerm, customers, searchLoading, searchError]);

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

  if (loading || searchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || searchError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || searchError}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <SearchFilter setSearchTerm={setSearchTerm} /> {/* Rendering SearchFilter component */}
      
      {/* Conditionally rendering stats or search results */}
      {!searchTerm ? (
        <>
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
        </>
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Results</h3>
          {customers.length > 0 ? (
            <ul>
              {customers.map((customer) => (
                <li key={customer.id} className="border-b border-gray-200 py-2">
                  {customer.name}
                </li>
              ))}
            </ul>
          ) : (
            <div>No customers found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
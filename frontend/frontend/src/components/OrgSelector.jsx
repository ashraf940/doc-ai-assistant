import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORGANIZATIONS } from '../graphql/queries';
import { SWITCH_ORG_MUTATION } from '../graphql/mutations';

function OrgSelector({ onOrgChange }) {
  const { data, loading, error } = useQuery(GET_ORGANIZATIONS);
  const [switchOrg, { loading: switching }] = useMutation(SWITCH_ORG_MUTATION);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const handleSwitch = async (orgId) => {
    try {
      const { data } = await switchOrg({ 
        variables: { orgId } 
      });
      
      if (data.switchActiveOrganization.ok) {
        setSelectedOrg(orgId);
        // Notify parent to refresh data
        onOrgChange();
      }
    } catch (err) {
      console.error('Failed to switch organization:', err);
      alert('Failed to switch organization');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="text-gray-600">Loading organizations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="text-red-600">Error loading organizations: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Select Organization
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {data?.organizations?.map((org) => (
          <button
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            disabled={switching}
            className={`px-4 py-2 rounded-lg transition ${
              selectedOrg === org.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {org.name}
          </button>
        ))}
      </div>
      
      {data?.organizations?.length === 0 && (
        <p className="text-gray-500 text-sm mt-2">
          No organizations found. Contact admin to get access.
        </p>
      )}
    </div>
  );
}

export default OrgSelector;
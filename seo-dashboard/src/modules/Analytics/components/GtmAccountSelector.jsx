// src/modules/Analytics/components/GtmAccountSelector.jsx
import React from 'react';

const GtmAccountSelector = ({
  accounts,
  selectedAccount,
  selectedContainer,
  onAccountChange,
  onContainerChange,
  loading,
  error
}) => {
  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    onAccountChange(accountId);
    const account = accounts.find(acc => acc.accountId === accountId);
    if (account && account.containers.length > 0) {
      onContainerChange(account.containers[0].containerId);
    } else {
      onContainerChange(null);
    }
  };

  const handleContainerChange = (e) => {
    onContainerChange(e.target.value);
  };

  const currentAccount = accounts.find(acc => acc.accountId === selectedAccount);
  const containers = currentAccount ? currentAccount.containers : [];

  if (loading) return <div className="text-gray-600 text-center py-4">Loading GTM accounts...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!accounts || accounts.length === 0) return <p className="text-gray-600 text-center py-4">No GTM accounts found or authorized.</p>;

  return (
    <div className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
      <h4 className="font-bold text-gray-700 mb-4 text-lg">Select GTM Container for Event Management:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="gtmAccountSelect" className="block text-gray-700 text-sm font-semibold mb-2">
            GTM Account:
          </label>
          <select
            id="gtmAccountSelect"
            value={selectedAccount || ''}
            onChange={handleAccountChange}
            className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account.accountId} value={account.accountId}>
                {account.name} ({account.accountId})
              </option>
            ))}
          </select>
        </div>

        {selectedAccount && containers.length > 0 && (
          <div>
            <label htmlFor="gtmContainerSelect" className="block text-gray-700 text-sm font-semibold mb-2">
              GTM Container:
            </label>
            <select
              id="gtmContainerSelect"
              value={selectedContainer || ''}
              onChange={handleContainerChange}
              className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Container</option>
              {containers.map(container => (
                <option key={container.containerId} value={container.containerId}>
                  {container.name} ({container.publicId})
                </option>
              ))}
            </select>
          </div>
        )}
        {!selectedAccount && <p className="text-sm text-gray-500 col-span-full mt-2">Please select a GTM account to see its containers.</p>}
        {selectedAccount && containers.length === 0 && <p className="text-sm text-gray-500 col-span-full mt-2">No containers found for this account. Ensure correct permissions in GTM.</p>}
      </div>
    </div>
  );
};

export default GtmAccountSelector;
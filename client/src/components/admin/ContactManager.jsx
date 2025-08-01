import { useState } from "react";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";

const ContactManager = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleUpdate = () => {
    // Trigger refresh of the contact list
    setRefreshTrigger(prev => prev + 1);
    // Optionally refresh the selected contact details
    if (selectedContact) {
      // You could fetch updated contact details here if needed
    }
  };

  const handleCloseDetail = () => {
    setSelectedContact(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600 mt-1">
              Manage and respond to contact form submissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1">
          <ContactList
            onSelectContact={handleSelectContact}
            selectedContactId={selectedContact?.id}
            key={refreshTrigger} // Force re-render when refreshTrigger changes
          />
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-1">
          <ContactDetail
            contact={selectedContact}
            onUpdate={handleUpdate}
            onClose={handleCloseDetail}
          />
        </div>
      </div>

      {/* Quick Actions */}
      {selectedContact && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <strong>Quick Actions for:</strong> {selectedContact.name} - {selectedContact.subject}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const mailtoLink = `mailto:${selectedContact.email}`;
                  window.open(mailtoLink);
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                📧 Email
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedContact.email);
                  alert("Email copied to clipboard!");
                }}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                📋 Copy Email
              </button>
              <button
                onClick={() => {
                  const text = `Name: ${selectedContact.name}\nEmail: ${selectedContact.email}\nSubject: ${selectedContact.subject}\nMessage: ${selectedContact.message}`;
                  navigator.clipboard.writeText(text);
                  alert("Message details copied to clipboard!");
                }}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                📋 Copy All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any message to view full details</li>
          <li>• Use status filters to organize messages</li>
          <li>• Quick Reply opens your default email client</li>
          <li>• Add admin notes to track your responses</li>
          <li>• Archive old messages to keep your inbox clean</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactManager;

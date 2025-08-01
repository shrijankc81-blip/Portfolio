import { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";

const ContactDetail = ({ contact, onUpdate, onClose }) => {
  const [adminNotes, setAdminNotes] = useState(contact?.adminNotes || "");
  const [saving, setSaving] = useState(false);

  if (!contact) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <div className="text-6xl mb-4">📧</div>
        <h3 className="text-lg font-medium mb-2">Select a Message</h3>
        <p>Choose a contact message from the list to view details</p>
      </div>
    );
  }

  const updateContactStatus = async (newStatus) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        getApiUrl(`/api/contact/${contact.id}`),
        { status: newStatus, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        getApiUrl(`/api/contact/${contact.id}`),
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "read": return "bg-gray-100 text-gray-800";
      case "replied": return "bg-green-100 text-green-800";
      case "archived": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{contact.subject}</h2>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>From:</strong> {contact.name} ({contact.email})</div>
              <div><strong>Received:</strong> {formatDate(contact.createdAt)}</div>
              {contact.repliedAt && (
                <div><strong>Replied:</strong> {formatDate(contact.repliedAt)}</div>
              )}
              {contact.ipAddress && (
                <div><strong>IP:</strong> {contact.ipAddress}</div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Message:</h3>
          <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-900">
            {contact.message}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Admin Notes:</h3>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add your notes about this message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={saveNotes}
            disabled={saving}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {contact.status === "new" && (
            <button
              onClick={() => updateContactStatus("read")}
              disabled={saving}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Mark as Read
            </button>
          )}
          
          {contact.status !== "replied" && (
            <button
              onClick={() => updateContactStatus("replied")}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Mark as Replied
            </button>
          )}
          
          {contact.status !== "archived" && (
            <button
              onClick={() => updateContactStatus("archived")}
              disabled={saving}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Archive
            </button>
          )}

          {/* Quick Reply Button */}
          <button
            onClick={() => {
              const subject = `Re: ${contact.subject}`;
              const body = `Hi ${contact.name},\n\nThank you for your message. \n\nBest regards,\nNirvan Maharjan`;
              const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
              window.open(mailtoLink);
              updateContactStatus("replied");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📧 Quick Reply
          </button>
        </div>
      </div>

      {/* Technical Info */}
      {contact.userAgent && (
        <div className="px-6 pb-6">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Technical Details</summary>
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
              <div><strong>User Agent:</strong> {contact.userAgent}</div>
              <div><strong>Message ID:</strong> {contact.id}</div>
              <div><strong>Created:</strong> {contact.createdAt}</div>
              <div><strong>Updated:</strong> {contact.updatedAt}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;

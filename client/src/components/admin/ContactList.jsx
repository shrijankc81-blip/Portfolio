import { useState, useEffect } from "react";
import axios from "axios";
import { getApiUrl } from "../../config/api";

const ContactList = ({ onSelectContact, selectedContactId }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const url = filter === "all" 
        ? getApiUrl("/api/contact")
        : getApiUrl(`/api/contact?status=${filter}`);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setContacts(response.data.contacts || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(getApiUrl("/api/contact/stats"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateContactStatus = async (contactId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        getApiUrl(`/api/contact/${contactId}`),
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error("Error updating contact status:", error);
    }
  };

  const deleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(getApiUrl(`/api/contact/${contactId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchContacts();
      fetchStats();
      if (selectedContactId === contactId) {
        onSelectContact(null);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Contact Messages</h2>
          <button
            onClick={fetchContacts}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total || 0}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.byStatus?.new || 0}</div>
            <div className="text-sm text-gray-500">New</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.byStatus?.read || 0}</div>
            <div className="text-sm text-gray-500">Read</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.byStatus?.replied || 0}</div>
            <div className="text-sm text-gray-500">Replied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.today || 0}</div>
            <div className="text-sm text-gray-500">Today</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {["all", "new", "read", "replied", "archived"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {error && (
          <div className="p-4 text-red-600 bg-red-50">
            {error}
          </div>
        )}

        {contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === "all" ? "No contact messages yet" : `No ${filter} messages`}
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedContactId === contact.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{contact.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(contact.createdAt)}</p>
                </div>
                
                <div className="flex gap-1 ml-2">
                  {contact.status === "new" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateContactStatus(contact.id, "read");
                      }}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                      title="Mark as Read"
                    >
                      Read
                    </button>
                  )}
                  {contact.status !== "replied" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateContactStatus(contact.id, "replied");
                      }}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      title="Mark as Replied"
                    >
                      Reply
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteContact(contact.id);
                    }}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactList;

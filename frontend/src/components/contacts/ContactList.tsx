import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Contact } from '../../types/Contact';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Contact[]>('/contacts/');
      setContacts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/contacts/${id}/`);
        fetchContacts();
      } catch (err) {
        setError('Failed to delete contact');
      }
    }
  };

  const handleEdit = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || ''
    });
    setShowForm(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContact?.id) {
        await api.put(`/contacts/${editingContact.id}/`, formData);
      } else {
        await api.post('/contacts/', formData);
      }
      fetchContacts();
      resetForm();
    } catch (err) {
      setError(`Failed to ${editingContact ? 'update' : 'add'} contact`);
    }
  };

  const resetForm = useCallback(() => {
    setShowForm(false);
    setEditingContact(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: ''
    });
  }, []);

  const toggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    if (showForm) {
      resetForm();
    }
  }, [showForm, resetForm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Contact Management
            </h1>
            <button
              onClick={toggleForm}
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              {showForm ? 'Cancel' : 'Add Contact'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {showForm && (
            <div className="bg-gray-50 p-8 rounded-lg mb-8 border border-gray-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                  >
                    {editingContact ? 'Update Contact' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No contacts found. Add some!</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Email:</span> {contact.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {contact.phone}
                      </p>
                      {contact.address && (
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Address:</span><br />
                          {contact.address}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => contact.id && handleDelete(contact.id)}
                        className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContactList);
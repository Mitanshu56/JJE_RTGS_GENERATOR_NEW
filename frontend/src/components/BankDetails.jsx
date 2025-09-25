import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BankDetails = () => {
    const [formData, setFormData] = useState({
        account_number: '',
        account_name: '',
        bank_name: '',
        branch_name: '',
        ifsc_code: '',
        swift_code: '',
        pan_number: '',
        mobile: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [hasDetails, setHasDetails] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        console.log('🔍 Fetching bank details...');
        console.log('🌐 API Base URL:', api.defaults.baseURL);
        
        try {
            const response = await api.get('/remitter/me');
            console.log('✅ Bank details response:', response.data);
            
            if (response.data) {
                const data = response.data;
                // Check if data is not null and has the required properties
                if (data && typeof data === 'object') {
                    console.log('📝 Setting form data with:', data);
                    setFormData({
                        account_number: data.account_number || '',
                        account_name: data.account_name || '',
                        bank_name: data.bank_name || '',
                        branch_name: data.branch_name || '',
                        ifsc_code: data.ifsc_code || '',
                        swift_code: data.swift_code || '',
                        pan_number: data.pan_number || '',
                        mobile: data.mobile || ''
                    });
                    setHasDetails(true);
                    console.log('✅ Bank details loaded successfully');
                } else {
                    // Data is null or invalid, treat as no bank details
                    console.log('⚠️ No bank details data received');
                    setHasDetails(false);
                    setEditing(true);
                }
            }
        } catch (error) {
            console.error('❌ Error fetching bank details:', error);
            console.log('📊 Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response && error.response.status === 404) {
                // No bank details found
                console.log('📭 No bank details found (404)');
                setHasDetails(false);
                setEditing(true);
            } else if (error.response?.status === 401) {
                console.log('🔐 Authentication required (401)');
                setMessage('Authentication required. Please log in again.');
            } else {
                console.error('Error fetching bank details:', error);
                setMessage('Error loading bank details');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('📤 Submitting bank details form...');
        console.log('📊 Form data:', formData);
        console.log('📝 Has existing details:', hasDetails);
        
        setLoading(true);
        setMessage('');

        try {
            let response;
            if (hasDetails) {
                console.log('🔄 Updating existing bank details via PUT');
                response = await api.put('/remitter/', formData);
            } else {
                console.log('🆕 Creating new bank details via POST');
                response = await api.post('/remitter/', formData);
            }

            console.log('✅ Bank details saved successfully:', response.data);

            if (response.data) {
                const data = response.data;
                // Safely set the form data with proper null checking
                if (data && typeof data === 'object') {
                    setFormData({
                        account_number: data.account_number || '',
                        account_name: data.account_name || '',
                        bank_name: data.bank_name || '',
                        branch_name: data.branch_name || '',
                        ifsc_code: data.ifsc_code || '',
                        swift_code: data.swift_code || '',
                        pan_number: data.pan_number || '',
                        mobile: data.mobile || ''
                    });
                }
                setHasDetails(true);
                setEditing(false);
                setMessage('Bank details saved successfully!');
            }
        } catch (error) {
            console.error('❌ Error saving bank details:', error);
            console.log('📊 Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response?.data?.detail) {
                // Handle validation errors from backend
                if (Array.isArray(error.response.data.detail)) {
                    const errorMessages = error.response.data.detail.map(err => err.msg || err.message || err).join(', ');
                    setMessage(`Validation Error: ${errorMessages}`);
                } else {
                    setMessage(`Error: ${error.response.data.detail}`);
                }
            } else if (error.response?.status === 401) {
                setMessage('Authentication required. Please log in again.');
            } else if (error.response?.status === 403) {
                setMessage('Access denied. Please check your permissions.');
            } else {
                setMessage('Error saving bank details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setEditing(true);
        setMessage('');
    };

    const handleCancel = () => {
        setEditing(false);
        setMessage('');
        // Reset form data to original values
        fetchBankDetails();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Bank Details</h2>
                {!editing && (
                    <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {hasDetails ? 'Edit Details' : 'Add Bank Details'}
                    </button>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-md mb-6 ${
                    message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            {/* Show message when no bank details exist and not editing */}
            {!hasDetails && !editing && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5a2 2 0 00-2 2v10a2 2 0 002 2h14m-5-2v2a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m-5 4h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Details Added</h3>
                    <p className="text-gray-500 mb-6">You haven't added your bank details yet. Click the "Add Bank Details" button above to get started.</p>
                </div>
            )}

            {/* Show form when editing or when has details */}
            {(editing || hasDetails) && (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="account_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name *
                        </label>
                        <input
                            type="text"
                            id="account_name"
                            name="account_name"
                            value={formData.account_name}
                            onChange={handleChange}
                            required
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter account holder name"
                        />
                    </div>

                    <div>
                        <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-2">
                            Account Number *
                        </label>
                        <input
                            type="text"
                            id="account_number"
                            name="account_number"
                            value={formData.account_number}
                            onChange={handleChange}
                            required
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter account number"
                        />
                    </div>

                    <div>
                        <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Name *
                        </label>
                        <input
                            type="text"
                            id="bank_name"
                            name="bank_name"
                            value={formData.bank_name}
                            onChange={handleChange}
                            required
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter bank name"
                        />
                    </div>

                    <div>
                        <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Name *
                        </label>
                        <input
                            type="text"
                            id="branch_name"
                            name="branch_name"
                            value={formData.branch_name}
                            onChange={handleChange}
                            required
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter branch name"
                        />
                    </div>

                    <div>
                        <label htmlFor="ifsc_code" className="block text-sm font-medium text-gray-700 mb-2">
                            IFSC Code *
                        </label>
                        <input
                            type="text"
                            id="ifsc_code"
                            name="ifsc_code"
                            value={formData.ifsc_code}
                            onChange={handleChange}
                            required
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter IFSC code"
                        />
                    </div>

                    <div>
                        <label htmlFor="swift_code" className="block text-sm font-medium text-gray-700 mb-2">
                            SWIFT Code
                        </label>
                        <input
                            type="text"
                            id="swift_code"
                            name="swift_code"
                            value={formData.swift_code}
                            onChange={handleChange}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter SWIFT code (optional)"
                        />
                    </div>

                    <div>
                        <label htmlFor="pan_number" className="block text-sm font-medium text-gray-700 mb-2">
                            PAN Number
                        </label>
                        <input
                            type="text"
                            id="pan_number"
                            name="pan_number"
                            value={formData.pan_number}
                            onChange={handleChange}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter PAN number"
                        />
                    </div>

                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                            placeholder="Enter mobile number"
                        />
                    </div>
                </div>

                {editing && (
                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : (hasDetails ? 'Update Details' : 'Save Details')}
                        </button>
                        
                        {hasDetails && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </form>
            )}
        </div>
    );
};

export default BankDetails;
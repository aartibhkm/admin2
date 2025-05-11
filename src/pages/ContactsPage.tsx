import React, { useEffect, useState } from 'react';
import { Search, Filter, MessageCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination
} from '../components/ui/Table';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

import { contactsApi, adminsApi } from '../utils/api';
import { Contact, ContactFilter, AdminUser } from '../types';
import { formatDateTime } from '../config';

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searching, setSearching] = useState('');
  
  const { register, handleSubmit, reset, watch } = useForm<ContactFilter>();
  const { register: registerReply, handleSubmit: handleSubmitReply } = useForm();
  const { register: registerAssign, handleSubmit: handleSubmitAssign, setValue: setAssignValue } = useForm();
  
  // Get current filters
  const isResolvedFilter = watch('isResolved');
  const assignedToFilter = watch('assignedTo');
  
  // Fetch contacts and admins data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [contactsData, adminsData] = await Promise.all([
          contactsApi.getAll(),
          adminsApi.getAll()
        ]);
        
        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setAdmins(adminsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  const onFilterSubmit = (filters: ContactFilter) => {
    let filtered = [...contacts];
    
    if (filters.isResolved !== undefined) {
      filtered = filtered.filter(contact => contact.isResolved === filters.isResolved);
    }
    
    if (filters.assignedTo) {
      if (filters.assignedTo === 'unassigned') {
        filtered = filtered.filter(contact => !contact.assignedTo);
      } else {
        filtered = filtered.filter(contact => 
          contact.assignedTo?._id === filters.assignedTo
        );
      }
    }
    
    setFilteredContacts(filtered);
    setCurrentPage(1);
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    reset();
    setFilteredContacts(contacts);
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Handle search
  useEffect(() => {
    if (searching) {
      const searchLower = searching.toLowerCase();
      const searched = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.subject.toLowerCase().includes(searchLower) ||
        contact.message.toLowerCase().includes(searchLower)
      );
      setFilteredContacts(searched);
      setCurrentPage(1);
    } else if (isResolvedFilter === undefined && !assignedToFilter) {
      setFilteredContacts(contacts);
    }
  }, [searching, contacts]);

  // Mark as resolved
  const markAsResolved = async (data: any) => {
    if (!selectedContact) return;
    
    try {
      const updatedContact = await contactsApi.resolve(
        selectedContact._id, 
        true,
        data.response || ''
      );
      
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact._id === updatedContact._id ? updatedContact : contact
        )
      );
      
      setFilteredContacts(prevContacts => 
        prevContacts.map(contact => 
          contact._id === updatedContact._id ? updatedContact : contact
        )
      );
      
      setShowReplyModal(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Assign to admin
  const assignToAdmin = async (data: any) => {
    if (!selectedContact) return;
    
    try {
      const updatedContact = await contactsApi.assign(
        selectedContact._id,
        data.adminId === 'unassigned' ? null : data.adminId
      );
      
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact._id === updatedContact._id ? updatedContact : contact
        )
      );
      
      setFilteredContacts(prevContacts => 
        prevContacts.map(contact => 
          contact._id === updatedContact._id ? updatedContact : contact
        )
      );
      
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error assigning contact:', error);
    }
  };

  // Get current page data
  const indexOfLastContact = currentPage * pageSize;
  const indexOfFirstContact = indexOfLastContact - pageSize;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Contact Messages</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Input
              placeholder="Search messages..."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
              className="pl-10 w-full"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter
          </Button>
        </div>
      </div>
      
      {/* Filters card */}
      {showFilters && (
        <Card className="mb-6 animate-slideDown">
          <CardHeader>
            <CardTitle>Filter Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onFilterSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Status"
                options={[
                  { label: 'All', value: '' },
                  { label: 'Resolved', value: 'true' },
                  { label: 'Unresolved', value: 'false' }
                ]}
                placeholder="Select status"
                {...register('isResolved', {
                  setValueAs: value => value === 'true' ? true : value === 'false' ? false : undefined
                })}
              />
              
              <Select
                label="Assigned To"
                options={[
                  { label: 'All', value: '' },
                  { label: 'Unassigned', value: 'unassigned' },
                  ...admins.map(admin => ({
                    label: admin.username,
                    value: admin._id
                  }))
                ]}
                placeholder="Select assignee"
                {...register('assignedTo')}
              />
              
              <div className="flex gap-2 md:col-span-2 justify-end">
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
                <Button type="submit">
                  Apply Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Contacts table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentContacts.length > 0 ? (
                    currentContacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell className="max-w-xs truncate">{contact.subject}</TableCell>
                        <TableCell>{formatDateTime(contact.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant={contact.isResolved ? 'green' : 'yellow'}>
                            {contact.isResolved ? 'Resolved' : 'Unresolved'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {contact.assignedTo ? (
                            contact.assignedTo.username
                          ) : (
                            <span className="text-gray-500 text-sm">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedContact(contact);
                                setShowDetailsModal(true);
                                if (contact.assignedTo) {
                                  setAssignValue('adminId', contact.assignedTo._id);
                                } else {
                                  setAssignValue('adminId', 'unassigned');
                                }
                              }}
                            >
                              View
                            </Button>
                            
                            {!contact.isResolved && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  setSelectedContact(contact);
                                  setShowReplyModal(true);
                                }}
                              >
                                <MessageCircle size={16} className="mr-1" /> Reply
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        No contact messages found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="p-4 border-t border-gray-100">
                <Pagination
                  totalCount={filteredContacts.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* View details modal */}
      {selectedContact && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Contact Message Details"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">From:</h4>
              <p>{selectedContact.name} ({selectedContact.email})</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Subject:</h4>
              <p>{selectedContact.subject}</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Message:</h4>
              <p className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
                {selectedContact.message}
              </p>
            </div>
            
            {selectedContact.response && (
              <div>
                <h4 className="font-semibold">Response:</h4>
                <p className="p-3 bg-blue-50 rounded border border-blue-200 whitespace-pre-wrap">
                  {selectedContact.response}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmitAssign(assignToAdmin)}>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2">Assign to:</h4>
                <div className="flex gap-2">
                  <Select
                    options={[
                      { label: 'Unassigned', value: 'unassigned' },
                      ...admins.map(admin => ({
                        label: admin.username,
                        value: admin._id
                      }))
                    ]}
                    fullWidth
                    {...registerAssign('adminId', { required: true })}
                  />
                  <Button type="submit">
                    Assign
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Reply modal */}
      {selectedContact && (
        <Modal
          isOpen={showReplyModal}
          onClose={() => setShowReplyModal(false)}
          title="Reply to Message"
          size="lg"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowReplyModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="reply-form" 
                leftIcon={<CheckCircle size={16} />}
              >
                Resolve & Send
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">From:</h4>
              <p>{selectedContact.name} ({selectedContact.email})</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Subject:</h4>
              <p>{selectedContact.subject}</p>
            </div>
            
            <div>
              <h4 className="font-semibold">Message:</h4>
              <p className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
                {selectedContact.message}
              </p>
            </div>
            
            <form id="reply-form" onSubmit={handleSubmitReply(markAsResolved)}>
              <div>
                <h4 className="font-semibold mb-2">Your Response:</h4>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Type your response here..."
                  {...registerReply('response', { required: true })}
                ></textarea>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactsPage;
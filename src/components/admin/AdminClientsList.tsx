
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil, Trash } from 'lucide-react';
import { getClientsWithBilling, deleteClient, Client } from '@/services/clientService';
import { toast } from 'sonner';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';
import { exportTableToCSV } from '@/utils/exportCsv';

const AdminClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);

  const fetchClients = async (start: string, end: string) => {
    try {
      const data = await getClientsWithBilling(start, end);
      setClients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
      setLoading(false);
    }
  };

  useEffect(() => {
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case 'week':
        startDate = startOfWeek(date);
        endDate = endOfWeek(date);
        break;
      case 'month':
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      default:
        startDate = date;
        endDate = date;
    }

    fetchClients(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
  }, [date, viewMode]);

  const handleAddClient = () => {
    navigate('/admin/clients/add');
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/admin/clients/${clientId}/edit`);
  };

  const handleDeleteClick = (clientId: string) => {
    setDeleteClientId(clientId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteClientId) {
      try {
        await deleteClient(deleteClientId);
        // Refresh client list
        fetchClients(format(date, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'));
        toast.success('Client deleted successfully');
      } catch (error) {
        toast.error('Failed to delete client');
      }
    }
    setDeleteClientId(null);
  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleExportCSV = () => {
    if (!clients.length) return;
    exportTableToCSV(
      'clients.csv',
      clients.map(client => ({
        name: client.name,
        username: client.username,
        status: client.isActive ? 'Active' : 'Inactive',
        billingTime: formatTime(client.billingMinutes || 0),
      })),
      [
        { label: 'Client Name', key: 'name' },
        { label: 'Username', key: 'username' },
        { label: 'Status', key: 'status' },
        { label: 'Billing Time', key: 'billingTime' },
      ]
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
          <div className="flex rounded-md overflow-hidden">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewAndUpdate(mode as 'day' | 'week' | 'month')}
                className={`px-3 py-1 ${viewMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 w-10 p-0">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddClient}>Add Client</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-50 border-b">
          <div className="p-4 font-semibold">Client Name</div>
          <div className="p-4 font-semibold">username</div>
          <div className="p-4 font-semibold">Status</div>
          <div className="p-4 font-semibold">Billing Time</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No clients found</div>
        ) : (
          clients.map(client => (
            <div key={client._id} className="grid grid-cols-5 border-b hover:bg-gray-50">
              <div className="p-4">{client.name}</div>
              <div className="p-4">{client.username}</div>
              <div className="p-4">
                <span className={`px-2 py-1 rounded text-sm ${client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-4">{client.billingMinutes}</div>
              <div className="p-4 space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditClient(client._id)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(client._id)}>
                  <Trash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteClientId}
        onCancel={() => setDeleteClientId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
      />
    </div>
  );
};

export default AdminClientsList;

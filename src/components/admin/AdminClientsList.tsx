
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil } from 'lucide-react';

// Mock clients data
const mockClients = [
  { id: '1', name: 'Acme Healthcare', billingTime: 320 }, // 05:20
  { id: '2', name: 'MediCorp Services', billingTime: 210 }, // 03:30
  { id: '3', name: 'HealthFirst Clinic', billingTime: 185 }, // 03:05
  { id: '4', name: 'Wellness Partners', billingTime: 145 }, // 02:25
];

const AdminClientsList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [clients, setClients] = useState(mockClients);

  const handleAddClient = () => {
    navigate('/admin/clients/add');
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/admin/clients/${clientId}/edit`);
  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    // In a real app, this would filter clients based on the selected view mode
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex space-x-2">
          <div className="flex rounded-md overflow-hidden">
            <button 
              onClick={() => setViewAndUpdate('day')}
              className={`px-3 py-1 ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setViewAndUpdate('week')}
              className={`px-3 py-1 ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewAndUpdate('month')}
              className={`px-3 py-1 ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
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
                onSelect={setDate}
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
          <div className="col-span-3 p-4 font-semibold">Client Name</div>
          <div className="p-4 font-semibold">Billing Time</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>
        
        {clients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No clients found</div>
        ) : (
          clients.map(client => (
            <div key={client.id} className="grid grid-cols-5 border-b hover:bg-gray-50">
              <div className="col-span-3 p-4">{client.name}</div>
              <div className="p-4">{formatTime(client.billingTime)}</div>
              <div className="p-4">
                <Button variant="ghost" size="sm" onClick={() => handleEditClient(client.id)}>
                  <Pencil size={16} className="mr-1" /> Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminClientsList;

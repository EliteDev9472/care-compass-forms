
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil } from 'lucide-react';

// Mock forms data
const mockForms = [
  { id: '1', name: 'Medical History Form', lastUpdated: '2023-04-15' },
  { id: '2', name: 'Patient Intake Form', lastUpdated: '2023-04-10' },
  { id: '3', name: 'Progress Notes', lastUpdated: '2023-04-05' },
  { id: '4', name: 'Treatment Plan Form', lastUpdated: '2023-03-28' },
];

const AdminFormsList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [forms, setForms] = useState(mockForms);

  const handleCreateForm = () => {
    navigate('/admin/forms/create');
  };

  const handleEditForm = (formId: string) => {
    navigate(`/admin/forms/${formId}/edit`);
  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    // In a real app, this would filter forms based on the selected view mode
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forms</h1>
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
        <Button onClick={handleCreateForm}>Create Form</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-50 border-b">
          <div className="col-span-3 p-4 font-semibold">Form Name</div>
          <div className="p-4 font-semibold">Last Updated</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>
        
        {forms.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No forms found</div>
        ) : (
          forms.map(form => (
            <div key={form.id} className="grid grid-cols-5 border-b hover:bg-gray-50">
              <div className="col-span-3 p-4">{form.name}</div>
              <div className="p-4">{form.lastUpdated}</div>
              <div className="p-4">
                <Button variant="ghost" size="sm" onClick={() => handleEditForm(form.id)}>
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

export default AdminFormsList;

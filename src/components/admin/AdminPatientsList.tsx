
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil } from 'lucide-react';

// Mock patients data
const mockPatients = [
  { id: '1', name: 'John Doe', clientName: 'Acme Healthcare', staffName: 'Dr. John Smith', billingTime: 45 },
  { id: '2', name: 'Jane Smith', clientName: 'MediCorp Services', staffName: 'Jane Johnson, NP', billingTime: 30 },
  { id: '3', name: 'Michael Johnson', clientName: 'HealthFirst Clinic', staffName: 'Robert Lee, PA', billingTime: 60 },
  { id: '4', name: 'Lisa Brown', clientName: 'Wellness Partners', staffName: 'Sara Taylor, RN', billingTime: 15 },
];

const AdminPatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [patients, setPatients] = useState(mockPatients);

  const handleAddPatient = () => {
    navigate('/admin/patients/add');
  };

  const handleEditPatient = (patientId: string) => {
    navigate(`/admin/patients/${patientId}/edit`);
  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    // In a real app, this would filter patients based on the selected view mode
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
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
        <Button onClick={handleAddPatient}>Add Patient</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          <div className="col-span-2 p-4 font-semibold">Patient Name</div>
          <div className="col-span-2 p-4 font-semibold">Client</div>
          <div className="p-4 font-semibold">Staff</div>
          <div className="p-4 font-semibold">Billing Time</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>
        
        {patients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found</div>
        ) : (
          patients.map(patient => (
            <div key={patient.id} className="grid grid-cols-7 border-b hover:bg-gray-50">
              <div className="col-span-2 p-4">{patient.name}</div>
              <div className="col-span-2 p-4">{patient.clientName}</div>
              <div className="p-4">{patient.staffName}</div>
              <div className="p-4">{formatTime(patient.billingTime)}</div>
              <div className="p-4">
                <Button variant="ghost" size="sm" onClick={() => handleEditPatient(patient.id)}>
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

export default AdminPatientsList;

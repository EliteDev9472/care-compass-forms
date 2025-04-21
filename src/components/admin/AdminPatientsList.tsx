
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Pencil, Trash } from 'lucide-react';
import { getAllPatients, deletePatient, Patient } from '@/services/patientService';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';

const AdminPatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const fetchPatients = async (start, end) => {
    try {
      const data = await getAllPatients(start, end);
      setPatients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
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

    fetchPatients(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
  }, [date, viewMode]);

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };


  const handleAddPatient = () => {
    navigate('/admin/patients/add');
  };

  const handleEditPatient = (patientId: string) => {
    navigate(`/admin/patients/${patientId}/edit`);
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      await deletePatient(patientId);
      toast.success('Patient deleted successfully');

      const currentDate = format(date, 'yyyy-MM-dd');
      await fetchPatients(currentDate, currentDate);
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex space-x-2">
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
                className="p-3 pointer-events-auto bg-white"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddPatient}>Add Patient</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 border-b">
          <div className="p-4 font-semibold">Patient Name</div>
          <div className="p-4 font-semibold">Billing Time</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found</div>
        ) : (
          patients.map(patient => (
            <div key={patient._id} className="grid grid-cols-3 border-b hover:bg-gray-50">
              <div className="p-4">{patient.name}</div>
              <div className="p-4">{patient.billingMinutes}</div>
              <div className="p-4 space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleEditPatient(patient._id)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePatient(patient._id)}>
                  <Trash className="h-4 w-4 mr-1" /> Delete
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

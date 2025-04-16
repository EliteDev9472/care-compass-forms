
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { fetchPatientsStart, fetchPatientsSuccess, setCurrentPatient } from '../../store/patientSlice';
import { Calendar } from '../../components/ui/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

// Mock patients data - this would come from an API in a real app
const mockPatients = [
  { id: '1', name: 'Patient1', clientId: '1', assignedStaffIds: ['3'], totalBillingTime: 65 }, // 01:05
  { id: '2', name: 'Patient2', clientId: '1', assignedStaffIds: ['3'], totalBillingTime: 165 }, // 02:45
  { id: '3', name: 'Patient3', clientId: '2', assignedStaffIds: ['3'], totalBillingTime: 213 }, // 03:33
  { id: '4', name: 'Patient4', clientId: '2', assignedStaffIds: ['3'], totalBillingTime: 263 }, // 04:23
];

const PatientsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const { patients, loading, error } = useAppSelector(state => state.patients);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    dispatch(fetchPatientsStart());
    
    // Simulate API call to fetch patients
    setTimeout(() => {
      // Filter patients based on staff ID for staff users
      const filteredPatients = user.role === 'staff'
        ? mockPatients.filter(patient => patient.assignedStaffIds.includes(user.id))
        : mockPatients.filter(patient => patient.clientId === user.id);
      
      dispatch(fetchPatientsSuccess(filteredPatients));
    }, 500);
  }, [dispatch, user]);
  
  useEffect(() => {
    if (patients.length === 0) {
      setFilteredPatients([]);
      return;
    }
    
    // For demonstration purposes, we'll just show all patients
    // In a real application, this would filter based on activity date
    setFilteredPatients(patients);
  }, [patients, date, viewMode]);
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  const handlePatientClick = (patient: any) => {
    dispatch(setCurrentPatient(patient));
    // Determine correct route based on user role
    const baseRoute = user?.role === 'client' ? '/client' : '/staff';
    navigate(`${baseRoute}/patients/${patient.id}/forms`);
  };
  
  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  if (loading) {
    return <div className="flex justify-center mt-8">Loading patients...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients of {user?.name}</h1>
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
      
      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-50 border-b">
          <div className="p-4 font-semibold">Patient Name</div>
          <div className="p-4 font-semibold">Billing Time</div>
        </div>
        
        {filteredPatients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found</div>
        ) : (
          filteredPatients.map(patient => (
            <div 
              key={patient.id}
              onClick={() => handlePatientClick(patient)}
              className="grid grid-cols-2 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div className="p-4">{patient.name}</div>
              <div className="p-4">{formatTime(patient.totalBillingTime)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientsList;

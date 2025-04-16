
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { 
  fetchFormsStart, 
  fetchFormsSuccess, 
  fetchFormsFailure,
  setCurrentForm
} from '../../store/patientSlice';
import { Calendar } from '../../components/ui/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

// Mock forms data - this would come from an API in a real app
const mockForms = [
  { 
    id: '1', 
    patientId: '1', 
    name: 'Template1', 
    type: 'Care Plan', 
    createdAt: '2023-04-01T10:00:00Z', 
    updatedAt: '2023-04-01T11:05:00Z', 
    billingTime: 65, // 01:05
    data: {} 
  },
  { 
    id: '2', 
    patientId: '1', 
    name: 'Template2', 
    type: 'Assessment', 
    createdAt: '2023-04-02T14:00:00Z', 
    updatedAt: '2023-04-02T16:45:00Z', 
    billingTime: 165, // 02:45
    data: {} 
  },
  { 
    id: '3', 
    patientId: '1', 
    name: 'Template3', 
    type: 'Progress Note', 
    createdAt: '2023-04-03T09:00:00Z', 
    updatedAt: '2023-04-03T12:33:00Z', 
    billingTime: 213, // 03:33
    data: {} 
  },
  { 
    id: '4', 
    patientId: '1', 
    name: 'Template4', 
    type: 'Medication Review', 
    createdAt: '2023-04-04T13:00:00Z', 
    updatedAt: '2023-04-04T17:23:00Z', 
    billingTime: 263, // 04:23
    data: {} 
  },
];

const PatientForms: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  
  const { currentPatient, forms, loading, error } = useAppSelector(state => state.patients);
  const [filteredForms, setFilteredForms] = useState<any[]>([]);
  
  useEffect(() => {
    if (!patientId) return;
    
    dispatch(fetchFormsStart());
    
    // Simulate API call to fetch forms for this patient
    setTimeout(() => {
      try {
        const patientForms = mockForms.filter(form => form.patientId === patientId);
        dispatch(fetchFormsSuccess(patientForms));
      } catch (err) {
        dispatch(fetchFormsFailure('Failed to fetch forms'));
      }
    }, 500);
  }, [dispatch, patientId]);

  useEffect(() => {
    if (forms.length === 0 || !date) return;
    
    let filtered = [];
    switch (viewMode) {
      case 'day':
        filtered = forms.filter(form => {
          const formDate = new Date(form.updatedAt);
          return formDate.toDateString() === date.toDateString();
        });
        break;
      case 'week':
        filtered = forms.filter(form => {
          const formDate = new Date(form.updatedAt);
          const weekStart = startOfWeek(date);
          const weekEnd = endOfWeek(date);
          return isWithinInterval(formDate, { start: weekStart, end: weekEnd });
        });
        break;
      case 'month':
        filtered = forms.filter(form => {
          const formDate = new Date(form.updatedAt);
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          return isWithinInterval(formDate, { start: monthStart, end: monthEnd });
        });
        break;
      default:
        filtered = forms;
    }
    setFilteredForms(filtered);
  }, [forms, date, viewMode]);
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  const handleFormClick = (form: any) => {
    dispatch(setCurrentForm(form));
    navigate(`/staff/patients/${patientId}/forms/${form.id}`);
  };
  
  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };
  
  if (loading) {
    return <div className="flex justify-center mt-8">Loading forms...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forms of {currentPatient?.name || patientId}</h1>
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
          <div className="p-4 font-semibold">Forms</div>
          <div className="p-4 font-semibold">Billing Time</div>
        </div>
        
        {filteredForms.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No forms found for this time period</div>
        ) : (
          filteredForms.map(form => (
            <div 
              key={form.id}
              onClick={() => handleFormClick(form)}
              className="grid grid-cols-2 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div className="p-4">{form.name}</div>
              <div className="p-4">{formatTime(form.billingTime)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientForms;

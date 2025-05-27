
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { getStaffPatientsForAdmin, StaffPatient } from '@/services/staffService';

interface AdminStaffPatientsListProps {
  staffId: string;
}

const AdminStaffPatientsList: React.FC<AdminStaffPatientsListProps> = ({ staffId }) => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState<string>('');
  const [patients, setPatients] = useState<StaffPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const fetchPatients = async (start: string, end: string) => {
    if (!staffId) return;

    setLoading(true);
    try {
      const response = await getStaffPatientsForAdmin(staffId, start, end);
      setPatients(response.patients);
      setStaffName(response.staffName);
    } catch (error) {
      toast.error('Failed to fetch patients');
      setPatients([]);
    }
    setLoading(false);
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
  }, [date, viewMode, staffId]);

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  const handlePatientClick = (patient: StaffPatient) => {
    navigate(`/admin/staff/${staffId}/patient/${patient._id}/forms`);
  };

  const handleBackToStaff = () => {
    navigate('/admin/staff');
  };

  if (loading && !patients.length) {
    return <div className="flex justify-center mt-8">Loading patients...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="outline" onClick={handleBackToStaff} className="mb-2">
            Back to Staff List
          </Button>
          <h1 className="text-2xl font-bold">Patients for {staffName}</h1>
        </div>
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
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className="p-3 pointer-events-auto bg-white"
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

        {patients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found</div>
        ) : (
          patients.map(patient => (
            <div
              key={patient._id}
              onClick={() => handlePatientClick(patient)}
              className="grid grid-cols-2 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div className="p-4">{patient.name}</div>
              <div className="p-4">{patient.billingMinutes}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStaffPatientsList;

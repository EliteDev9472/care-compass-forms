import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { getMyAssignedPatients, StaffPatient } from '../../services/staffService';
import { Calendar } from '../../components/ui/calendar';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Archive } from 'lucide-react';
import { toast } from 'sonner';
import { setCurrentPatient } from '@/store/patientSlice';
import { useDispatch } from 'react-redux';
import { getMyAssignedPatientsForClient } from '@/services/clientService';
import { exportTableToCSV } from '@/utils/exportCsv';

const PatientsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [patients, setPatients] = useState<StaffPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const fetchPatients = async (start, end) => {
    if (!user) return;

    setLoading(true);
    try {
      let response: StaffPatient[]
      if (user.role == 'staff') {
        response = await getMyAssignedPatients(start, end);
      }
      else if (user.role == 'client')
        response = await getMyAssignedPatientsForClient(start, end);
      setPatients(response);
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
  }, [date, viewMode]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handlePatientClick = (patient: StaffPatient) => {
    dispatch(setCurrentPatient(patient))
    if (user.role == 'staff')
      navigate(`/staff/patients/${patient._id}/forms`);
    else if (user.role == 'client')
      navigate(`/client/patients/${patient._id}/forms`);
  };

  const handleArchivePatient = async (patientId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent patient click navigation
    
    // Find the patient and set as current patient
    const patient = patients.find(p => p._id === patientId);
    if (patient) {
      dispatch(setCurrentPatient(patient));
    }
    
    // Navigate to forms page with archive mode and selected month
    const archiveMonth = format(date, 'yyyy-MM-dd');
    navigate(`/staff/patients/${patientId}/forms?mode=archive&month=${archiveMonth}`);
  };

  // const handleExportCSV = () => {
  //   if (!patients.length) return;
  //   exportTableToCSV(
  //     'patients.csv',
  //     patients,
  //     [
  //       { label: 'Patient Name', key: 'name' },
  //       { label: 'Billing Time', key: 'billingMinutes' }
  //     ]
  //   );
  // };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  if (loading) {
    return <div className="flex justify-center mt-8">Loading patients...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <div className="flex space-x-2">
          {/* {user.role == 'staff' && <Button variant="outline" onClick={handleExportCSV} className="h-10">
            Export CSV
          </Button>} */}
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
        <div className={`grid ${user.role === 'staff' ? 'grid-cols-3' : 'grid-cols-2'} bg-gray-50 border-b`}>
          <div className="p-4 font-semibold">Patient Name</div>
          {user.role == 'staff' && <div className="p-4 font-semibold">Billing Time</div>}
          {user.role == 'staff' && <div className="p-4 font-semibold">Actions</div>}
        </div>

        {patients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found</div>
        ) : (
          patients.map(patient => (
            <div
              key={patient._id}
              onClick={() => handlePatientClick(patient)}
              className={`grid ${user.role === 'staff' ? 'grid-cols-3' : 'grid-cols-2'} border-b hover:bg-gray-50 cursor-pointer`}
            >
              <div className="p-4">{patient.name}</div>
              {user.role == 'staff' && <div className="p-4">{patient.billingMinutes}</div>}
              {user.role == 'staff' && (
                <div className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleArchivePatient(patient._id, e)}
                    className="flex items-center gap-2"
                  >
                    <Archive size={16} />
                    Archive
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientsList;

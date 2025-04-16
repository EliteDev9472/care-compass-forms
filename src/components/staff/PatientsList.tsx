
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { fetchPatientsStart, fetchPatientsSuccess, setCurrentPatient } from '../../store/patientSlice';

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
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  const handlePatientClick = (patient: any) => {
    dispatch(setCurrentPatient(patient));
    navigate(`/staff/patients/${patient.id}/forms`);
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
        <button className="bg-gray-200 px-4 py-2 rounded">Calendar</button>
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


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { getAllPatients, deletePatient, Patient } from '@/services/patientService';
import { toast } from 'sonner';

const AdminPatientsList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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
      await fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button onClick={handleAddPatient}>Add Patient</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 border-b">
          <div className="p-4 font-semibold">Patient Name</div>
          <div className="p-4 font-semibold">Client</div>
          <div className="p-4 font-semibold">Assigned Staff</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No patients found</div>
        ) : (
          patients.map(patient => (
            <div key={patient._id} className="grid grid-cols-4 border-b hover:bg-gray-50">
              <div className="p-4">{patient.name}</div>
              <div className="p-4">{patient.client.name}</div>
              <div className="p-4">{patient.assignedStaff.name}</div>
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

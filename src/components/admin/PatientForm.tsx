
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  createPatient, 
  getPatient, 
  updatePatient, 
  PatientCreateData, 
  PatientUpdateData 
} from '@/services/patientService';
import { toast } from 'sonner';

interface PatientFormProps {
  mode?: 'add' | 'edit';
}

const PatientForm: React.FC<PatientFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [loading, setLoading] = useState(false);
  
  const [patientName, setPatientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    if (mode === 'edit' && patientId) {
      const fetchPatient = async () => {
        try {
          const data = await getPatient(patientId);
          setPatientData(data);
          setPatientName(data.name);
          setSelectedClientId(data.client._id);
          setSelectedStaffId(data.assignedStaff._id);
        } catch (error) {
          toast.error('Failed to load patient data');
          navigate('/admin/patients');
        }
      };
      fetchPatient();
    }
  }, [mode, patientId, navigate]);

  const handleSave = async () => {
    if (!patientName || (!patientId && (!selectedClientId || !selectedStaffId))) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'edit' && patientId) {
        const updateData: PatientUpdateData = {
          name: patientName,
          staffId: selectedStaffId
        };
        await updatePatient(patientId, updateData);
        toast.success('Patient updated successfully');
      } else {
        const createData: PatientCreateData = {
          name: patientName,
          clientId: selectedClientId,
          staffId: selectedStaffId
        };
        await createPatient(createData);
        toast.success('Patient created successfully');
      }
      navigate('/admin/patients');
    } catch (error) {
      toast.error(mode === 'edit' ? 'Failed to update patient' : 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
          <Input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            required
          />
        </div>

        {mode === 'add' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {patientData?.client && (
                  <SelectItem value={patientData.client._id}>
                    {patientData.client.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Staff *</label>
          <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {patientData?.assignedStaff && (
                <SelectItem value={patientData.assignedStaff._id}>
                  {patientData.assignedStaff.name}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/patients')}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !patientName || (!patientId && (!selectedClientId || !selectedStaffId))}
        >
          {loading ? 'Saving...' : 'Save Patient'}
        </Button>
      </div>
    </div>
  );
};

export default PatientForm;

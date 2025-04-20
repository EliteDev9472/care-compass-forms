
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Mock clients data
const mockClients = [
  { id: '1', name: 'Acme Healthcare' },
  { id: '2', name: 'MediCorp Services' },
  { id: '3', name: 'HealthFirst Clinic' },
  { id: '4', name: 'Wellness Partners' },
];

// Mock staff data
const mockStaff = [
  { id: '1', name: 'Dr. John Smith' },
  { id: '2', name: 'Jane Johnson, NP' },
  { id: '3', name: 'Robert Lee, PA' },
  { id: '4', name: 'Sara Taylor, RN' },
];


// Mock patient data (for edit mode)
const mockPatient = {
  id: '1',
  name: 'John Doe',
  username: 'jdoe',
  password: 'password123',
  enabled: true,
  clientId: '1',
  staffId: '1'
};

interface PatientFormProps {
  mode?: 'add' | 'edit';
}

const PatientForm: React.FC<PatientFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  // Initialize state with mock data if in edit mode
  const [patientName, setPatientName] = useState(mode === 'edit' && patientId === '1' ? mockPatient.name : '');
  const [enabled, setEnabled] = useState(mode === 'edit' && patientId === '1' ? mockPatient.enabled : true);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    mode === 'edit' && patientId === '1' ? mockPatient.staffId : ''
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(
    mode === 'edit' && patientId === '1' ? mockPatient.clientId : ''
  );


  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving patient:', {
      patientName,
      username,
      password,
      enabled,
      selectedStaffId
    });
    navigate('/admin/patients');
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
          <Input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
        </div>
        {mode === 'edit' && (
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={enabled}
                  onChange={() => setEnabled(!enabled)}
                />
                <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${enabled ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">
                {enabled ? 'Enabled' : 'Disabled'}
              </div>
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/patients')}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Patient
        </Button>
      </div>
    </div>
  );
};

export default PatientForm;

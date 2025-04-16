
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock clients data
const mockClients = [
  { id: '1', name: 'Acme Healthcare' },
  { id: '2', name: 'MediCorp Services' },
  { id: '3', name: 'HealthFirst Clinic' },
  { id: '4', name: 'Wellness Partners' },
];

// Mock staff data
const mockStaff = [
  { id: '1', name: 'Dr. John Smith', clientId: '1' },
  { id: '2', name: 'Jane Johnson, NP', clientId: '2' },
  { id: '3', name: 'Robert Lee, PA', clientId: '3' },
  { id: '4', name: 'Sara Taylor, RN', clientId: '4' },
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
  const [username, setUsername] = useState(mode === 'edit' && patientId === '1' ? mockPatient.username : '');
  const [password, setPassword] = useState(mode === 'edit' && patientId === '1' ? mockPatient.password : '');
  const [enabled, setEnabled] = useState(mode === 'edit' && patientId === '1' ? mockPatient.enabled : true);
  const [selectedClientId, setSelectedClientId] = useState<string>(
    mode === 'edit' && patientId === '1' ? mockPatient.clientId : ''
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    mode === 'edit' && patientId === '1' ? mockPatient.staffId : ''
  );

  // Filter staff based on selected client
  const filteredStaff = selectedClientId 
    ? mockStaff.filter(staff => staff.clientId === selectedClientId)
    : [];

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving patient:', { 
      patientName, 
      username, 
      password, 
      enabled, 
      selectedClientId, 
      selectedStaffId 
    });
    navigate('/admin/dashboard');
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Client</label>
          <select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setSelectedStaffId(''); // Reset staff selection when client changes
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Client</option>
            {mockClients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        {selectedClientId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Staff</label>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Staff</option>
              {filteredStaff.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
          </div>
        )}

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
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
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

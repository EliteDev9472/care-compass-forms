
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

// Mock patients data
const mockAllPatients = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Michael Johnson' },
  { id: '4', name: 'Lisa Brown' },
  { id: '5', name: 'David Wilson' },
];

// Mock staff data (for edit mode)
const mockStaff = {
  id: '1',
  name: 'Dr. John Smith',
  username: 'jsmith',
  password: 'password123',
  enabled: true,
  clientId: '1',
  assignedPatientIds: ['1', '3']
};

interface StaffFormProps {
  mode?: 'add' | 'edit';
}

const StaffForm: React.FC<StaffFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { staffId } = useParams();
  
  // Initialize state with mock data if in edit mode
  const [staffName, setStaffName] = useState(mode === 'edit' && staffId === '1' ? mockStaff.name : '');
  const [username, setUsername] = useState(mode === 'edit' && staffId === '1' ? mockStaff.username : '');
  const [password, setPassword] = useState(mode === 'edit' && staffId === '1' ? mockStaff.password : '');
  const [enabled, setEnabled] = useState(mode === 'edit' && staffId === '1' ? mockStaff.enabled : true);
  const [selectedClientId, setSelectedClientId] = useState<string>(
    mode === 'edit' && staffId === '1' ? mockStaff.clientId : ''
  );
  
  const [showPatientSelection, setShowPatientSelection] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>(
    mode === 'edit' && staffId === '1' ? mockStaff.assignedPatientIds : []
  );

  // Get selected and unselected patients
  const selectedPatients = mockAllPatients.filter(patient => selectedPatientIds.includes(patient.id));
  const unselectedPatients = mockAllPatients.filter(patient => !selectedPatientIds.includes(patient.id));

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving staff:', { 
      staffName, 
      username, 
      password, 
      enabled, 
      selectedClientId, 
      selectedPatientIds 
    });
    navigate('/admin/dashboard');
  };

  const handlePatientSelection = () => {
    setShowPatientSelection(!showPatientSelection);
  };

  const handleAddPatient = (patientId: string) => {
    setSelectedPatientIds([...selectedPatientIds, patientId]);
  };

  const handleRemovePatient = (patientId: string) => {
    setSelectedPatientIds(selectedPatientIds.filter(id => id !== patientId));
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Staff Name</label>
          <Input
            type="text"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            placeholder="Enter staff name"
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
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Button
            type="button"
            onClick={handlePatientSelection}
            variant={showPatientSelection ? "outline" : "default"}
          >
            {showPatientSelection ? 'Hide Patient Selection' : (mode === 'add' ? 'Add Patients' : 'Edit Patients')}
          </Button>
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

      {showPatientSelection && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Assign Patients to Staff</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Selected Patients</h4>
              <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                {selectedPatients.length === 0 ? (
                  <p className="text-gray-500 text-sm">No patients selected</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedPatients.map(patient => (
                      <li key={patient.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{patient.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemovePatient(patient.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Unselected Patients</h4>
              <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                {unselectedPatients.length === 0 ? (
                  <p className="text-gray-500 text-sm">No patients available</p>
                ) : (
                  <ul className="space-y-2">
                    {unselectedPatients.map(patient => (
                      <li key={patient.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{patient.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddPatient(patient.id)}
                        >
                          Add
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Staff
        </Button>
      </div>
    </div>
  );
};

export default StaffForm;

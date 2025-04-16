
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock staff data
const mockAllStaff = [
  { id: '1', name: 'Dr. John Smith' },
  { id: '2', name: 'Jane Johnson, NP' },
  { id: '3', name: 'Robert Lee, PA' },
  { id: '4', name: 'Sara Taylor, RN' },
  { id: '5', name: 'Michael Brown, PT' },
];

// Mock client data (for edit mode)
const mockClient = {
  id: '1',
  name: 'Acme Healthcare',
  username: 'acme',
  password: 'password123',
  enabled: true,
  assignedStaffIds: ['1', '3']
};

interface ClientFormProps {
  mode?: 'add' | 'edit';
}

const ClientForm: React.FC<ClientFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  
  // Initialize state with mock data if in edit mode
  const [clientName, setClientName] = useState(mode === 'edit' && clientId === '1' ? mockClient.name : '');
  const [username, setUsername] = useState(mode === 'edit' && clientId === '1' ? mockClient.username : '');
  const [password, setPassword] = useState(mode === 'edit' && clientId === '1' ? mockClient.password : '');
  const [enabled, setEnabled] = useState(mode === 'edit' && clientId === '1' ? mockClient.enabled : true);
  
  const [showStaffSelection, setShowStaffSelection] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(
    mode === 'edit' && clientId === '1' ? mockClient.assignedStaffIds : []
  );

  // Get selected and unselected staff
  const selectedStaff = mockAllStaff.filter(staff => selectedStaffIds.includes(staff.id));
  const unselectedStaff = mockAllStaff.filter(staff => !selectedStaffIds.includes(staff.id));

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving client:', { clientName, username, password, enabled, selectedStaffIds });
    navigate('/admin/dashboard');
  };

  const handleStaffSelection = () => {
    setShowStaffSelection(true);
  };

  const handleAddStaff = (staffId: string) => {
    setSelectedStaffIds([...selectedStaffIds, staffId]);
  };

  const handleRemoveStaff = (staffId: string) => {
    setSelectedStaffIds(selectedStaffIds.filter(id => id !== staffId));
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
          <Input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
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

      {!showStaffSelection ? (
        <div className="mb-6">
          <Button onClick={handleStaffSelection}>
            {mode === 'add' ? 'Add Staff' : 'Edit Staff'}
          </Button>
        </div>
      ) : (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Assign Staff to Client</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Selected Staff</h4>
              <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                {selectedStaff.length === 0 ? (
                  <p className="text-gray-500 text-sm">No staff selected</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedStaff.map(staff => (
                      <li key={staff.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{staff.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveStaff(staff.id)}
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
              <h4 className="font-medium mb-2">Unselected Staff</h4>
              <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                {unselectedStaff.length === 0 ? (
                  <p className="text-gray-500 text-sm">No staff available</p>
                ) : (
                  <ul className="space-y-2">
                    {unselectedStaff.map(staff => (
                      <li key={staff.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{staff.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddStaff(staff.id)}
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
          Save Client
        </Button>
      </div>
    </div>
  );
};

export default ClientForm;

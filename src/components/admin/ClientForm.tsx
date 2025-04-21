
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient, getClientForEdit, updateClient, ClientEditData } from '@/services/clientService';
import { toast } from 'sonner';

interface ClientFormProps {
  mode?: 'add' | 'edit';
}

const ClientForm: React.FC<ClientFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [clientName, setClientName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<ClientEditData | null>(null);

  const [showStaffSelection, setShowStaffSelection] = useState(false);
  // Only manage staffIds, no patientIds here
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'edit' && clientId) {
      const fetchClientData = async () => {
        try {
          const data = await getClientForEdit(clientId);
          setClientData(data);
          setClientName(data.name);
          setUsername(data.username);
          setEnabled(data.isActive);
          setSelectedStaffIds(data.assignedStaff.map(staff => staff._id));
        } catch (error) {
          toast.error('Failed to load client data');
          navigate('/admin/clients');
        }
      };
      fetchClientData();
    }
  }, [mode, clientId, navigate]);

  const handleSave = async () => {
    if (!clientName || !username || (mode === "add" && !password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'edit' && clientId) {
        await updateClient(clientId, {
          username,
          name: clientName,
          password: password || undefined,
          isActive: enabled,
          staffIds: selectedStaffIds,
        });
        toast.success('Client updated successfully');
      } else {
        await createClient({
          username,
          password,
          name: clientName,
          staffIds: selectedStaffIds,
        });
        toast.success('Client created successfully');
      }
      navigate('/admin/clients');
    } catch (error) {
      toast.error(mode === 'edit' ? 'Failed to update client' : 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelection = () => {
    setShowStaffSelection(true);
  };

  const handleAddStaff = (staffId: string) => {
    setSelectedStaffIds((ids) => [...ids, staffId]);
    setClientData((prev) =>
      prev
        ? {
            ...prev,
            assignedStaff: [
              ...prev.assignedStaff,
              ...prev.unassignedStaff.filter(staff => staff._id === staffId)
            ],
            unassignedStaff: prev.unassignedStaff.filter(staff => staff._id !== staffId)
          }
        : prev
    );
  };

  const handleRemoveStaff = (staffId: string) => {
    setSelectedStaffIds((ids) => ids.filter(id => id !== staffId));
    setClientData((prev) =>
      prev
        ? {
            ...prev,
            assignedStaff: prev.assignedStaff.filter(staff => staff._id !== staffId),
            unassignedStaff: [
              ...prev.unassignedStaff,
              ...prev.assignedStaff.filter(staff => staff._id === staffId)
            ]
          }
        : prev
    );
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
          <Input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password {mode === 'edit' ? '(Leave blank to keep current)' : '*'}
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required={mode === 'add'}
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
                {(clientData?.assignedStaff?.length ?? 0) === 0 ? (
                  <p className="text-gray-500 text-sm">No staff selected</p>
                ) : (
                  <ul className="space-y-2">
                    {clientData?.assignedStaff.map(staff => (
                      <li key={staff._id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{staff.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStaff(staff._id)}
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
              <h4 className="font-medium mb-2">Available Staff</h4>
              <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                {(clientData?.unassignedStaff?.length ?? 0) === 0 ? (
                  <p className="text-gray-500 text-sm">No staff available</p>
                ) : (
                  <ul className="space-y-2">
                    {clientData?.unassignedStaff.map(staff => (
                      <li key={staff._id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{staff.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddStaff(staff._id)}
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
        <Button variant="outline" onClick={() => navigate('/admin/clients')}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !clientName || !username || (mode === "add" && !password)}
        >
          {loading ? 'Saving...' : 'Save Client'}
        </Button>
      </div>
    </div>
  );
};

export default ClientForm;

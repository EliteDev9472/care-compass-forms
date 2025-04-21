
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createStaff,
  updateStaff,
  getStaff,
  StaffCreateData,
  StaffUpdateData,
  StaffEditData,
  getUnassignedPatientsForStaff
} from '@/services/staffService';
import { toast } from 'sonner';

interface StaffFormProps {
  mode?: 'add' | 'edit';
}

const StaffForm: React.FC<StaffFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { staffId } = useParams();

  const [staffName, setStaffName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [assignedPatients, setAssignedPatients] = useState<{ _id: string; name: string }[]>([]);
  const [unassignedPatients, setUnassignedPatients] = useState<{ _id: string; name: string }[]>([]);
  const [showPatientSelection, setShowPatientSelection] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'add') {
      getUnassignedPatientsForStaff()
        .then((data) => {
          setUnassignedPatients(data);
        })
        .catch(() => {
          toast.error('Failed to load unassigned patients');
        });
    }
    if (mode === 'edit' && staffId) {
      setLoading(true);
      getStaff(staffId)
        .then((data: StaffEditData) => {
          setStaffName(data.name || '');
          setUsername(data.username || '');
          setEnabled(data.isActive ?? true);
          setAssignedPatients(data.assignedPatients ?? []);
          setUnassignedPatients(data.unassignedPatients ?? []);
        })
        .catch(() => {
          toast.error('Failed to load staff data');
          navigate('/admin/staff');
        })
        .finally(() => setLoading(false));
    }
  }, [mode, staffId, navigate]);

  const handleSave = async () => {
    if (!staffName || !username || (mode === 'add' && !password)) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'edit' && staffId) {
        const staffData: StaffUpdateData = {
          username,
          name: staffName,
          isActive: enabled,
          patientIds: assignedPatients.map(patient => patient._id),
        };
        if (password) staffData.password = password;
        await updateStaff(staffId, staffData);
        toast.success('Staff updated successfully');
      } else {
        const staffData: StaffCreateData = {
          username,
          name: staffName,
          password,
          patientIds: unassignedPatients.map(patient => patient._id),
        };
        await createStaff(staffData);
        toast.success('Staff created successfully');
      }
      navigate('/admin/staff');
    } catch (error) {
      toast.error('Failed to save staff');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = (patient: { _id: string, name: string }) => {
    setAssignedPatients((prev) => [...prev, patient]);
    setUnassignedPatients(prev => [...prev].filter(id =>  id !== patient));
  };

  const handleRemovePatient = (patient: { _id: string, name: string }) => {
    setUnassignedPatients((prev) => [...prev, patient]);
    setAssignedPatients(prev => [...prev].filter(id =>  id !== patient));
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password{mode === 'edit' ? ' (leave blank to keep unchanged)' : ''}
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <div className="mb-4">
          <Button
            type="button"
            onClick={() => setShowPatientSelection((v) => !v)}
            variant={showPatientSelection ? 'outline' : 'default'}
          >
            {showPatientSelection ? 'Hide Patient Selection' : 'Edit Patients'}
          </Button>
        </div>
        {showPatientSelection && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Assign Patients to Staff</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Selected Patients</h4>
                <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                  {assignedPatients.length === 0 ? (
                    <p className="text-gray-500 text-sm">No patients selected</p>
                  ) : (
                    <ul className="space-y-2">
                      {assignedPatients.map((patient) => (
                        <li
                          key={patient._id}
                          className="flex justify-between items-center p-2 bg-white rounded shadow-sm"
                        >
                          <span>{patient.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePatient(patient)}
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
                <h4 className="font-medium mb-2">Available Patients</h4>
                <div className="border rounded-md p-4 bg-gray-50 min-h-[200px]">
                  {unassignedPatients.length === 0 ? (
                    <p className="text-gray-500 text-sm">No patients available</p>
                  ) : (
                    <ul className="space-y-2">
                      {unassignedPatients.map((patient) => (
                        <li
                          key={patient._id}
                          className="flex justify-between items-center p-2 bg-white rounded shadow-sm"
                        >
                          <span>{patient.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddPatient(patient)}
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
        {mode === 'edit' && (
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={enabled}
                  onChange={() => setEnabled((v) => !v)}
                />
                <div
                  className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                ></div>
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${enabled ? 'translate-x-6' : ''
                    }`}
                ></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">
                {enabled ? 'Enabled' : 'Disabled'}
              </div>
            </label>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/staff')}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !staffName || !username || (mode === 'add' && !password)}
        >
          {loading ? 'Saving...' : 'Save Staff'}
        </Button>
      </div>
    </div>
  );
};

export default StaffForm;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  getStaffPatientForms, 
  StaffPatientForm,
  getStaffAndPatientNames
} from '@/services/staffService';

interface AdminStaffPatientFormsProps {
  staffId: string;
  patientId: string;
}

const AdminStaffPatientForms: React.FC<AdminStaffPatientFormsProps> = ({ staffId, patientId }) => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<StaffPatientForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState({ staffName: '', patientName: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!staffId || !patientId) return;
      setLoading(true);
      
      try {
        const formsData = await getStaffPatientForms(staffId, patientId);
        setForms(formsData);
        
        const namesData = await getStaffAndPatientNames(staffId, patientId);
        setNames(namesData);
      } catch (error) {
        toast.error('Failed to fetch forms data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffId, patientId]);

  const handleBackToPatients = () => {
    navigate(`/admin/staff/${staffId}/patients`);
  };

  const handleViewForm = (formId: string) => {
    navigate(`/admin/staff/${staffId}/patient/${patientId}/form/${formId}`);
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={handleBackToPatients} className="mb-2">
          Back to Patients List
        </Button>
        <h1 className="text-2xl font-bold">
          Forms for Patient: {names.patientName} (Staff: {names.staffName})
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8">Loading forms...</div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b">
            <div className="p-4 font-semibold">Form Name</div>
            <div className="p-4 font-semibold">Status</div>
            <div className="p-4 font-semibold">Last Updated</div>
          </div>
          {forms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No forms available</div>
          ) : (
            forms.map(form => (
              <div
                key={form._id}
                onClick={() => handleViewForm(form._id)}
                className="grid grid-cols-3 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className="p-4">{form.title}</div>
                <div className="p-4">
                  {form.status === 'completed' ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="p-4">{new Date(form.updatedAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminStaffPatientForms;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import Layout from '../../components/layout/Layout';
import CareForm from '../../components/form/CareForm';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import { setCurrentForm } from '../../store/patientSlice';

// Mock form data - this would come from an API in a real app
const mockForm = {
  id: '1',
  patientId: '1',
  name: 'Template1',
  type: 'Care Plan',
  createdAt: '2023-04-01T10:00:00Z',
  updatedAt: '2023-04-01T11:05:00Z',
  billingTime: 65, // 01:05
  data: {
    healthGoals: 'Eat healthier',
    difficulties: 'Diet and nutrition',
    primaryDiagnosis: 'E11.9 - Type 2 diabetes mellitus without complications',
    secondaryDiagnosis: 'I10 - Essential (primary) hypertension',
    medications: 'Metformin 500mg twice daily, Lisinopril 10mg once daily',
    careObjectives: 'Improve blood sugar control, lose 10 pounds in 3 months',
    interventions: 'Weekly nutrition counseling, daily glucose monitoring',
    followUpSchedule: 'Weekly'
  }
};

const FormPage: React.FC = () => {
  const { patientId, formId } = useParams<{ patientId: string, formId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { currentForm } = useAppSelector(state => state.patients);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (formId === 'new') {
      // Creating a new form
      dispatch(setCurrentForm(null));
      setFormData({});
    } else if (formId) {
      // Fetch existing form - this would be an API call
      dispatch(setCurrentForm(mockForm));
      setFormData(mockForm.data);
    }
  }, [dispatch, formId]);
  
  const handleSaveForm = (data: Record<string, any>) => {
    // This would be an API call to save the form
    console.log('Saving form data:', data);
    
    // Redirect back to the forms list
    navigate(`/staff/patients/${patientId}/forms`);
  };
  
  return (
    <ProtectedRoute allowedRoles={['staff', 'client']}>
      <Layout>
        <CareForm 
          formId={formId || 'new'} 
          initialData={formData} 
          onSave={handleSaveForm} 
        />
      </Layout>
    </ProtectedRoute>
  );
};

export default FormPage;

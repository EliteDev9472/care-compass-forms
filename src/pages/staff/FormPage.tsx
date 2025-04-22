
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import Layout from '../../components/layout/Layout';
import CareForm from '../../components/form/CareForm';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import { setCurrentForm } from '../../store/patientSlice';
import { submitFormWithTimerSessions, getPatientFormsByTemplate } from '../../services/templateService';
import { resetTimer } from '../../store/timerSlice';
import { toast } from 'sonner';
import { loadICDCodes } from '../../store/icdCodesSlice';

const FormPage: React.FC = () => {
  const { patientId, formId } = useParams<{ patientId: string, formId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { currentForm } = useAppSelector(state => state.patients);
  const { timerSessions } = useAppSelector(state => state.timer);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Load ICD codes when page loads
    dispatch(loadICDCodes());
    
    const fetchFormData = async () => {
      if (formId === 'new') {
        // Creating a new form
        dispatch(setCurrentForm(null));
        setFormData({});
      } else if (formId && patientId) {
        try {
          // Find the form from the list of templates
          setLoading(true);
          const templates = await getPatientFormsByTemplate(patientId);
          const selectedTemplate = templates.find(template => template._id === formId);
          
          if (selectedTemplate) {
            // Transform template to match the current form structure expected by the app
            const initialData = selectedTemplate.submission?.data || {};
            
            const form = {
              id: selectedTemplate._id,
              patientId: patientId,
              name: selectedTemplate.name,
              type: selectedTemplate.name,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              billingTime: selectedTemplate.billingMinutes || 0,
              data: initialData,
              templateFields: selectedTemplate.fields,
              submission: selectedTemplate.submission
            };
            
            dispatch(setCurrentForm(form));
            setFormData(initialData);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching form data:', error);
          toast.error('Failed to fetch form data');
          setLoading(false);
        }
      }
    };
    
    fetchFormData();
  }, [dispatch, formId, patientId]);
  
  const handleSaveForm = async (data: Record<string, any>) => {
    if (!patientId || !formId) {
      toast.error('Missing patient or form information');
      return;
    }
    
    setLoading(true);
    
    try {
      // Submit the form with timer sessions
      await submitFormWithTimerSessions(
        patientId,
        formId,
        data,
        timerSessions
      );
      
      toast.success('Form saved successfully');
      
      // Reset timer after successful submission
      dispatch(resetTimer());
      
      // Redirect back to the forms list
      navigate(`/staff/patients/${patientId}/forms`);
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute allowedRoles={['staff', 'client']}>
      <Layout>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading form...</div>
          </div>
        ) : (
          <CareForm 
            formId={formId || 'new'} 
            initialData={formData} 
            onSave={handleSaveForm} 
          />
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default FormPage;

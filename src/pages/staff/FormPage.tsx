
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
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FormPage: React.FC = () => {
  const { patientId, formId } = useParams<{ patientId: string, formId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { timerSessions } = useAppSelector(state => state.timer);
  const [formData, setFormData] = useState<(string | boolean)[]>([]);
  const [submissionId, setSubmissioId] = useState('');
  const { user } = useAppSelector(state => state.auth);
  useEffect(() => {

    const fetchFormData = async () => {
      if (formId === 'new') {
        // Creating a new form
        dispatch(setCurrentForm(null));
        setFormData([]);
      } else if (formId && patientId) {
        try {
          // Find the form from the list of templates
          setLoading(true);
          const templates = await getPatientFormsByTemplate(patientId);
          const selectedTemplate = templates.find(template => template._id === formId);

          if (selectedTemplate) {
            // Transform template to match the current form structure expected by the app
            const initialData = selectedTemplate.submission?.data || [];

            const form = {
              id: selectedTemplate._id,
              patientId: patientId,
              name: selectedTemplate.name,
              type: selectedTemplate.name,
              createdAt: new Date().toString(),
              updatedAt: new Date().toString(),
              billingTime: selectedTemplate.billingMinutes || "00:00",
              data: initialData,
              templateFields: selectedTemplate.fields,
              submission: selectedTemplate.submission,
            };

            dispatch(setCurrentForm(form));
            setSubmissioId(selectedTemplate.submission?._id || null);
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

  const handleSaveForm = async (data: (string | boolean)[]) => {
    if (!patientId || !formId) {
      toast.error('Missing patient or form information');
      return;
    }

    if (!timerSessions.length) {
      toast.error('Please check timer');
      return;
    }
    setLoading(true);

    try {
      // Submit the form with timer sessions
      await submitFormWithTimerSessions(
        patientId,
        formId,
        data,
        timerSessions,
        submissionId
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
  const handleGoBack = () => {
    if (user?.role === 'staff') {
      navigate('/staff/patients');
    } else {
      navigate('/client');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['staff', 'client']}>
      <Layout>
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Patients
          </Button>
        </div>
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

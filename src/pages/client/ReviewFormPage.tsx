
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import Layout from '../../components/layout/Layout';
import CareForm from '../../components/form/CareForm';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import { setCurrentForm } from '../../store/patientSlice';
import { submitFormWithTimerSessions, getPatientFormsByTemplate, getPatientFormsByTemplateForClient } from '../../services/templateService';
import { resetTimer } from '../../store/timerSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReviewForm from '@/components/form/ReviewForm';

const ReviewFormPage: React.FC = () => {
    const { patientId, formId } = useParams<{ patientId: string, formId: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<(string | boolean)[]>([]);
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
                    const templates = await getPatientFormsByTemplateForClient(patientId);
                    const selectedTemplate = templates.find(template => template._id === formId);

                    if (selectedTemplate) {
                        const temp = selectedTemplate.template
                        // Transform template to match the current form structure expected by the app
                        const initialData = temp.submission?.data || [];

                        const form = {
                            id: temp._id,
                            patientId: patientId,
                            name: temp.name,
                            type: temp.name,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            billingTime: temp.billingMinutes || "00:00",
                            data: initialData,
                            templateFields: temp.fields,
                            submission: temp.submission,
                        };
                        // dispatch(setCurrentForm(form));
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


    const handleGoBack = () => {
        if (user?.role === 'staff') {
            navigate('/staff/patients');
        } else {
            navigate('/client');
        }
    };

    return (
        <ProtectedRoute allowedRoles={['client']}>
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
                    <ReviewForm
                        formId={formId || 'new'}
                        initialData={formData}
                    />
                )}
            </Layout>
        </ProtectedRoute>
    );
};

export default ReviewFormPage;

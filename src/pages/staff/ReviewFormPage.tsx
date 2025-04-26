
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import Layout from '../../components/layout/Layout';
import ReviewForm from '../../components/form/ReviewForm';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ReviewFormPage: React.FC = () => {
    const { patientId, formId } = useParams<{ patientId: string, formId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<(string | boolean)[]>([]);

    const handleGoBack = () => {
        navigate('/staff/patients');
    };

    const handleDownloadDoc = () => {
        const element = document.querySelector('.max-w-6xl');
        if (!element) return;

        const content = element.innerHTML;
        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'form.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <ProtectedRoute allowedRoles={['staff']}>
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
                    <Button onClick={handleDownloadDoc} className="mt-4">
                        Download DOC
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

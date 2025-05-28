
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import Layout from '../../components/layout/Layout';
import ReviewForm from '../../components/form/ReviewForm';
import ProtectedRoute from '../../components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
// import { saveAs } from 'file-saver';
// import htmlDocx from 'html-docx-js/dist/html-docx';

const ReviewFormPage: React.FC = () => {
    const { patientId, formId } = useParams<{ patientId: string, formId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<(string | boolean)[]>([]);
    const { user } = useAppSelector(state => state.auth);
    // State to track whether the export is triggeredasdfasd
    const [isExporting, setIsExporting] = useState(false);
    const handleGoBack = () => {
        if (user?.role === 'staff') {
            navigate('/staff/patients');
        }
        else if (user?.role == 'admin') {
            navigate('/admin/patients');
        }
        else {
            navigate('/client');
        }
    };

    const handleDownloadDoc = () => {
        if (isExporting) return;

        setIsExporting(true); // Mark as exporting

        const element = document.querySelector('.max-w-6xl');
        if (!element) return;

        const content = element.innerHTML;

        // Wrap the HTML content in Word-compatible format
        const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head><body>`;
        const footer = `</body></html>`;

        const sourceHTML = header + content + footer;

        // Create the Blob object for the .doc file
        const blob = new Blob([sourceHTML], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Trigger file download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'page_content.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the created object URL
        URL.revokeObjectURL(url);

        // Reset the exporting state after the export is done
        setIsExporting(false);
    };

    return (
        <ProtectedRoute allowedRoles={['staff', 'admin']}>
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

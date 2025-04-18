import React from 'react';
import Layout from '../../components/layout/Layout';
import ReviewForm from '../../components/form/ReviewForm';
import ProtectedRoute from '../../components/shared/ProtectedRoute';

const ReviewFormPage: React.FC = () => {
    return (
        <ProtectedRoute allowedRoles={['client']}>
            <Layout>
                <ReviewForm />
            </Layout>
        </ProtectedRoute>
    );
};

export default ReviewFormPage;
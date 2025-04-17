
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { setCurrentForm } from '../../store/patientSlice';

const ReviewForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector(state => state.patients);

  useEffect(() => {
    if (formId) {
      // In a real app, this would fetch from an API
      const mockForm = {
        id: formId,
        patientId: '1',
        name: 'Template1',
        type: 'Care Plan',
        createdAt: '2023-04-01T10:00:00Z',
        updatedAt: '2023-04-01T11:05:00Z',
        billingTime: 65,
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
      dispatch(setCurrentForm(mockForm));
    }
  }, [dispatch, formId]);

  if (!currentForm) {
    return <div className="p-6">Loading form...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">Patient Care Form Review</h1>
        <div className="text-sm text-gray-500 mb-4">
          Last updated: {new Date(currentForm.updatedAt).toLocaleString()}
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">1 - PATIENT'S GOALS OF CARE</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Health Goals</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.healthGoals}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulties</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.difficulties}</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2 - MEDICAL INFORMATION</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Diagnosis</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.primaryDiagnosis}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Diagnosis</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.secondaryDiagnosis}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medications</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.medications}</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3 - CARE PLAN</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Care Objectives</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.careObjectives}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Planned Interventions</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.interventions}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow-up Schedule</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{currentForm.data.followUpSchedule}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReviewForm;


import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import FormField from './FormField';

interface CareFormProps {
  formId: string;
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
}

// Define our form template
const formTemplate = {
  sections: [
    {
      title: "PATIENT'S GOALS OF CARE",
      fields: [
        {
          id: 'healthGoals',
          label: 'Health Goals',
          type: 'text' as const
        },
        {
          id: 'difficulties',
          label: 'What have you had difficulty with?',
          type: 'dropdown' as const,
          options: [
            'Medication management',
            'Physical activity',
            'Diet and nutrition',
            'Sleep',
            'Mental health',
            'Social support'
          ]
        }
      ]
    },
    {
      title: 'MEDICAL INFORMATION',
      fields: [
        {
          id: 'primaryDiagnosis',
          label: 'Primary Diagnosis (ICD Code)',
          type: 'icd' as const
        },
        {
          id: 'secondaryDiagnosis',
          label: 'Secondary Diagnosis (ICD Code)',
          type: 'icd' as const
        },
        {
          id: 'medications',
          label: 'Current Medications',
          type: 'text' as const
        }
      ]
    },
    {
      title: 'CARE PLAN',
      fields: [
        {
          id: 'careObjectives',
          label: 'Care Objectives',
          type: 'text' as const
        },
        {
          id: 'interventions',
          label: 'Planned Interventions',
          type: 'text' as const
        },
        {
          id: 'followUpSchedule',
          label: 'Follow-up Schedule',
          type: 'dropdown' as const,
          options: [
            'Weekly',
            'Bi-weekly',
            'Monthly',
            'As needed'
          ]
        }
      ]
    }
  ]
};

const CareForm: React.FC<CareFormProps> = ({ formId, initialData = {}, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const form = useAppSelector(state => 
    state.patients.forms.find(f => f.id === formId)
  );
  
  // Initialize form data from template if no initial data
  useEffect(() => {
    if (Object.keys(initialData).length === 0) {
      const defaultData: Record<string, any> = {};
      
      formTemplate.sections.forEach(section => {
        section.fields.forEach(field => {
          defaultData[field.id] = '';
        });
      });
      
      setFormData(defaultData);
    } else {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="max-w-4xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">Community Care Questionnaire</h1>
        <Timer formId={formId} />
      </div>
      
      <form onSubmit={handleSubmit}>
        {formTemplate.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{sectionIndex + 1} - {section.title}</h2>
            
            <div className="space-y-4">
              {section.fields.map((field) => (
                <FormField
                  key={field.id}
                  label={field.label}
                  type={field.type}
                  options={field.options}
                  value={formData[field.id] || ''}
                  onChange={(value) => handleFieldChange(field.id, value)}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareForm;

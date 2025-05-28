import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../../hooks/reduxHooks';
import Timer from '../timer/Timer';
import { AlignLeft, Type, User } from 'lucide-react';
import { FormField } from '@/services/templateService';
import { getPatientInfo } from '@/services/staffService';
import { useParams, useSearchParams } from 'react-router-dom';


interface ReviewFormProps {
  formId: string;
  initialData?: (string | boolean)[];
}

const ReviewForm: React.FC<ReviewFormProps> = ({ formId, initialData = [] }) => {
  const { patientId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<(string | boolean)[]>(initialData);
  const { currentForm } = useAppSelector(state =>
    state.patients
  );
  const [patientInfo, setPatientInfo] = useState<any>(null)
  const { user } = useAppSelector(state => state.auth)

  const [searchParams] = useSearchParams();
  const isArchiveMode = searchParams.get('mode') === 'archive';

  const fetchPatientInfo = async () => {
    const result = await getPatientInfo(patientId);
    setPatientInfo(result)
  }
  useEffect(() => {
    fetchPatientInfo();
    if (Object.keys(initialData).length === 0) {
      const defaultData: (string | boolean)[] = [];

      currentForm.templateFields.forEach(field => {
        if (field.type == 'checkbox')
          defaultData.push(false);
        else
          defaultData.push('');
      });

      setFormData(defaultData);
    } else {
      setFormData(initialData);
    }

  }, [initialData]);

  const renderFormElement = (element: FormField, index: number) => {
    const { type, label, options, scores, gridColumns } = element;

    switch (type) {
      case 'red-text':
        return (
          <div className="relative p-4 mb-4 bg-white" key={index}>
            <p className='pb-4 text-red-500'>{label}</p>
          </div>
        );

      case 'scored-radio':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>

            <div className="space-y-1">
              {options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {
                    currentForm.data[index] === option && <p>{currentForm.data[index]} (Score: {scores?.[idx] || 0})</p>
                  }

                </div>
              ))}
            </div>
          </div>
        );

      case 'score-sum':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <p>{currentForm.data[index]}</p>
            {/* <input
              type="text"
              value={currentForm.data[index] as string}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              disabled={true}
            /> */}
          </div>
        );

      case 'grid-input':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            {/* <p className='pb-4'>{label}</p> */}
            <div className={`grid grid-cols-${gridColumns || 2} gap-4`}>
              {options?.map((fieldLabel, idx) => (
                <table>
                  <tbody>
                    <tr>
                      <td>{fieldLabel}</td>
                      <td>{currentForm.data[index]}</td>
                    </tr>
                  </tbody>
                </table>
                // <div key={idx} className="space-y-2">
                //   <label className="text-sm text-gray-600">{fieldLabel}: {currentForm.data[index]}</label>
                //   {/* <input
                //     type="text"
                //     value={Array.isArray(currentForm.data[index]) ? currentForm.data[index][idx] : ''}
                //     className="w-full px-3 py-2 border border-gray-300 rounded-md"
                //     disabled={true}
                //   /> */}
                // </div>
              ))}
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="relative p-4 rounded-md mb-4 font-bold" key={index}>
            {label}
          </div>
        );

      case 'text-input':
        return (
          <div className="relative p-4 mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
          </div>
        );

      case 'text-field':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <p>{currentForm.data[index]}</p>
            {/* <input
              type="text"
              value={currentForm.data[index] as string}
              className="w-full px-3 py-2 border border-gray-300 rounded-md "
              placeholder="Enter Text"
              disabled={true}
            /> */}
          </div>
        );

      case 'icd-text':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <p>{currentForm.data[index]}</p>
            {/* <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={currentForm.data[index] as string}
              placeholder="Input ICD"
              disabled={true}
            /> */}
          </div>
        );

      case 'dropdown':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <p>{currentForm.data[index]}</p>
            {/* <select className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={currentForm.data[index] as string} disabled={true}>
              <option value=""> </option>
              {options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select> */}
          </div>
        );

      case 'checkbox':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <p>{currentForm.data[index] ? 'Yes' : 'No'}</p>
            {/* <div className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" checked={currentForm.data[index] as boolean} disabled={true} />
            </div> */}
          </div>
        );

      case 'radio':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <p>{currentForm.data[index]}</p>
            {/* <div className="space-y-1">
              {options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input type="radio" name={`radio_${index}`} className="h-4 w-4" checked={currentForm.data[index] == option} disabled={true} />
                  <span className="text-gray-500">{option}</span>
                </div>
              ))}
            </div> */}
          </div>
        );

      case 'rich-text':
        return (
          <div className="relative p-4 -md mb-4 bg-white" key={index}>
            <p className='pb-4'>{label}</p>
            <pre>{currentForm.data[index]}</pre>
            {/* <div className="border border-gray-300 rounded-md p-1 mb-1 bg-gray-100">
              <div className="flex space-x-1 border-b p-1">
                <button disabled className="p-1 text-gray-400"><Type size={16} /></button>
                <button disabled className="p-1 text-gray-400"><AlignLeft size={16} /></button>
              </div>
              <textarea className="w-full p-2 h-36 bg-white" placeholder='Rich text editor preview' value={currentForm.data[index] as string} disabled={true} />
            </div> */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white p-6 rounded-lg shadow-md">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-center mb-6">{currentForm.name}</h1>
        {user.role == 'admin' && !isArchiveMode && <h1 className="text-3xl font-bold text-center mb-6">{currentForm.billingTime}</h1>}
      </div>
      <form>
        <div>
          <p className='text-xl mr-4'>
            <span>Patient Name: </span> <span>   {patientInfo?.name}   </span>
            <span>CCM Status:</span> <span>    {patientInfo?.ccmStatus}   </span>
            <span>Patient Consent:</span> <span>    {patientInfo?.patientConsent == "true" ? "Yes" : "No"}   </span>
          </p>
        </div>
        <div>
          <p className='text-xl mr-4 mt-4'>
            <span>  Date of Birth:  </span> <span>   {patientInfo?.dateOfBirth?.slice(0, 10)}  </span>
            <span>  Primary Phone Number:  </span> <span>   {patientInfo?.phoneNumber}   </span>
          </p>
        </div>
        <div>
          <p className='text-xl mr-4 mt-4'>
            <span>  Street:  </span> <span>  {patientInfo?.street}</span>
            <span>  City/State/Zip:  </span> <span>  {patientInfo?.city}</span>
          </p>
        </div>
        <div className='mt-4'>
          <p className='text-xl'>
            {/* <span>  Billing Minutes:  </span> <span>  {currentForm.billingTime}  </span> */}
          </p>
        </div>
        <div className='my-4'>
          <p className='text-xl'>
            <span>  Note:  </span> <span className='bg-blue-50 px-4 pb-3'>  {patientInfo?.note}  </span>
          </p>
        </div>
        {console.log('------->', patientInfo)}
        <div className='my-4'>
          <p className='text-xl'>
            <span>  Insurance Pay:  </span> <span className=' px-4 pb-3'>  {patientInfo?.insurancePayer}  </span>
            <span>  Insurance Plan:  </span> <span className=' px-4 pb-3'>  {patientInfo?.insurancePlan}  </span>
            <span>  Payer ID:  </span> <span className=' px-4 pb-3'>  {patientInfo?.payerID}  </span>
            <span>  Group Number:  </span> <span className=' px-4 pb-3'>  {patientInfo?.groupNumber}  </span>
          </p>
        </div>
        {
          currentForm.templateFields.map((field, index) => {
            return renderFormElement(field, index)
          })
        }
      </form>
    </div >
  );
};

export default ReviewForm;

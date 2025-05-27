import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import {
  fetchFormsStart,
  fetchFormsSuccess,
  fetchFormsFailure,
  setCurrentForm
} from '../../store/patientSlice';
import { getPatientFormsByTemplate, FormTemplate, getPatientFormsByTemplateForClient } from '../../services/templateService';
import { Calendar } from '../../components/ui/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowLeft, Pencil, View } from 'lucide-react';
import { toast } from 'sonner';
import { exportTableToCSV } from '@/utils/exportCsv';
import { getClientName } from '@/services/staffService';

const PatientForms: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  // const { patientName } = useParams<{ patientName: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);

  const { currentPatient } = useAppSelector(state => state.patients);
  const { user } = useAppSelector(state => state.auth);

  const fetchTemplates = async (startDate?: string, endDate?: string) => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      dispatch(fetchFormsStart());
      let templates: FormTemplate[]
      if (user.role == 'staff') {
        templates = await getPatientFormsByTemplate(
          patientId,
          startDate,
          endDate
        );

      }

      else if (user.role == 'client')
        templates = await getPatientFormsByTemplateForClient(
          patientId,
          startDate,
          endDate
        );
      setFormTemplates(templates);

      dispatch(fetchFormsSuccess([])); // We're not using the old forms state anymore
      setLoading(false);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to fetch form templates');
      dispatch(fetchFormsFailure('Failed to fetch forms'));
      setLoading(false);
      toast.error('Failed to fetch form templates');
    }
  };

  useEffect(() => {
    if (!patientId) return;

    let startDate: string;
    let endDate: string;

    switch (viewMode) {
      case 'week':
        startDate = format(startOfWeek(date), 'yyyy-MM-dd');
        endDate = format(endOfWeek(date), 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(startOfMonth(date), 'yyyy-MM-dd');
        endDate = format(endOfMonth(date), 'yyyy-MM-dd');
        break;
      default:
        startDate = format(date, 'yyyy-MM-dd');
        endDate = format(date, 'yyyy-MM-dd');
    }

    fetchTemplates(startDate, endDate);
  }, [dispatch, patientId, date, viewMode]);

  const formatTime = (minutes: number): string => {
    if (!minutes) return '00:00';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleFormClick = (template: FormTemplate, type: string) => {
    let form
    // Transform template to match the current form structure expected by the app
    if (user.role == 'staff') {
      const formData = template.submission?.data || [];
      form = {
        id: template._id,
        patientId: patientId,
        name: template.name,
        type: template.name,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        billingTime: template.billingMinutes || "00:00",
        data: formData,
        templateFields: template.fields,
        submission: template.submission
      };
    }

    else if (user.role == 'client') {
      const temp = template.template
      const formData = template?.data || [];

      form = {
        id: template._id,
        patientId: patientId,
        name: temp.name,
        type: temp.name,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        billingTime: template.billingMinutes || "00:00",
        data: formData,
        templateFields: temp.fields,
        submission: temp.submission
      };
    }

    dispatch(setCurrentForm(form));

    if (user?.role === 'staff') {
      if (type == 'edit') {
        navigate(`/staff/patients/${patientId}/form/${template._id}/`);
      }
      else if (type == 'view')
        navigate(`/staff/patients/${patientId}/forms/${template._id}/review`);
    } else {
      navigate(`/client/patients/${patientId}/forms/${template._id}`);
    }
  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  const handleGoBack = () => {
    if (user?.role === 'staff') {
      navigate('/staff/patients');
    } else {
      navigate('/client');
    }
  };

  const handleExportCSV = async () => {
    if (!formTemplates.length) return;
    let client = {}
    if (user.role === 'staff') {
      try {
        client = await getClientName(patientId);
      }
      catch (error) {
        toast.error('Client should be assigned for this patient')
        return
        // toast.error(error.response.data.message)
      }

      let communityConditions = []
      let longConditions = []

      formTemplates.map((template, index) => {
        if (template.name == 'Community Care Plan') {
          let pushFlag = false
          if (!template.submission)
            return
          template.fields.map((field, k) => {
            if (field.label.indexOf('CHRONIC CONDITIONS') != -1) {
              pushFlag = true
            }
            if (pushFlag) {
              communityConditions.push(template.submission.data[k])
            }
            if (field.label.indexOf('Chronic Conditions') != -1) {
              pushFlag = false
            }
          })
        }

        if (template.name == 'Long Term Care Plan') {
          let pushFlag = false
          template.fields.map((field, k) => {
            if (!template.submission)
              return
            if (field.label.indexOf('CHRONIC CONDITIONS') != -1) {
              pushFlag = true
            }
            if (pushFlag) {
              longConditions.push(template.submission.data[k])
            }
            if (field.label.indexOf('Chronic Conditions') != -1) {
              pushFlag = false
            }
          })
        }
      })

      let filterCommunity = communityConditions.filter((_, index) => index % 2 === 1)
      const strfilterCommunity = filterCommunity.splice(0, 5).join('.')

      let filterLong = longConditions.filter((_, index) => index % 2 === 0)
      const strfilterLong = filterLong.splice(1, 5).join('.')

      const conditions = formTemplates.map((template, index) => {
        if (template.name == 'Community Care Plan')
          return strfilterCommunity

        if (template.name == 'Long Term Care Plan')
          return strfilterLong

        return ''
      })

      exportTableToCSV(
        'forms.csv',
        formTemplates.map((t, i) => ({
          name: t.name,
          // status: t.submission ? 'Submitted' : 'New',
          billingMinutes: t.billingMinutes,
          conditions: conditions[i]
        })),
        [
          { label: 'Form Name', key: 'name' },
          // { label: 'Status', key: 'status' },
          { label: 'Billing Time', key: 'billingMinutes' },
          { label: 'Conditions', key: 'conditions' }
        ],
        client['clientName'], currentPatient?.name, user.name
      );
    }
    // else if (user.role === 'client') {
    //   exportTableToCSV(
    //     'forms.csv',
    //     formTemplates.map(t => ({
    //       name: t.template?.name,
    //       status: t.data ? 'Submitted' : 'New',
    //       billingMinutes: t.billingMinutes
    //     })),
    //     [
    //       { label: 'Form Name', key: 'name' },
    //       { label: 'Status', key: 'status' },
    //       { label: 'Billing Time', key: 'billingMinutes' }
    //     ]
    //   );
    // }
  };

  if (loading) {
    return <div className="flex justify-center mt-8">Loading forms...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Button>

        {user.role == 'staff' && <Button variant="outline" onClick={handleExportCSV}>
          Export CSV
        </Button>}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forms of {currentPatient?.name || patientId}</h1>
        <div className="flex space-x-2">
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setViewAndUpdate('day')}
              className={`px-3 py-1 ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Day
            </button>
            <button
              onClick={() => setViewAndUpdate('week')}
              className={`px-3 py-1 ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewAndUpdate('month')}
              className={`px-3 py-1 ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Month
            </button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-10 w-10 p-0">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className={`grid grid-cols-${user.role == 'staff' ? 4 : 2} bg-gray-50 border-b`}>
          {
            user.role == 'staff' ?
              <div className={`p-4 font-semibold col-span-2`}>Forms</div>
              : <div className={`p-4 font-semibold col-span-1`}>Forms</div>
          }
          {user.role == 'staff' && <div className="p-4 font-semibold col-span-1">Billing Time</div>}
          {user.role == 'staff' && <div className="p-4 font-semibold col-span-1">Actions</div>}
        </div>
        {formTemplates.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No forms found for this time period</div>
        ) : (
          user.role == 'staff' ?
            formTemplates.map(template => (
              <div
                key={template._id}

                className="grid grid-cols-4 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className={`p-4 col-span-${user.role == 'staff' ? 2 : 1}`}>
                  {template.name}
                  {template.submission ? <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Submitted</span> :
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">New</span>}
                </div>
                <div className="p-4 col-span-1">{template.billingMinutes}</div>
                <div className="p-4 col-span-1 flex justify-left align-middle">
                  <Button variant="ghost" size="sm" onClick={() => handleFormClick(template, 'edit')}>
                    <Pencil size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormClick(template, 'view')}
                  >
                    <View size={16} className="mr-1" /> View
                  </Button>
                </div>
              </div>
            )) :
            formTemplates.map(template => (
              <div
                key={template.template._id}
                onClick={() => handleFormClick(template, '')}
                className="grid grid-cols-2 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className="p-4">
                  {template.template.name}
                  {template.data ? <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Submitted</span> :
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">New</span>}
                </div>
                {/* <div className="p-4">{template.billingMinutes}</div> */}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default PatientForms;

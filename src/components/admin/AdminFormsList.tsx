
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil, Trash } from 'lucide-react';
import { deleteTemplate, FormTemplate } from '@/services/templateService';
import { getAllTemplates } from '@/services/templateService';
import { toast } from 'sonner';

const AdminFormsList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getAllTemplates();
        setForms(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load forms');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCreateForm = () => {
    navigate('/admin/forms/create');
  };

  const handleEditForm = (formId: string) => {
    navigate(`/admin/forms/${formId}/edit`);
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteTemplate(formId)
      toast.success("Template created successfully");

      const data = await getAllTemplates();
      setForms(data);

    }
    catch (e) {
      toast.error("Failed")
    }

  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    // In a real app, this would filter forms based on the selected view mode
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forms</h1>
        {/* <div className="flex space-x-2">
          <div className="flex rounded-md overflow-hidden">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewAndUpdate(mode as 'day' | 'week' | 'month')}
                className={`px-3 py-1 ${viewMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
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
        </div> */}
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleCreateForm}>Create Form</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-50 border-b">
          <div className="col-span-3 p-4 font-semibold">Form Name</div>
          {/* <div className="p-4 font-semibold">Last Updated</div> */}
          <div className="p-4 font-semibold">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading forms...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : forms.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No forms found</div>
        ) : (
          forms.map((form, index) => (
            <div key={index} className="grid grid-cols-5 border-b hover:bg-gray-50">
              <div className="col-span-3 p-4">{form.name}</div>
              <div className="flex items-center p-4">
                <Button variant="ghost" size="sm" onClick={() => handleEditForm(form._id)}>
                  <Pencil size={16} className="mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteForm(form._id)}>
                  <Trash size={16} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFormsList;

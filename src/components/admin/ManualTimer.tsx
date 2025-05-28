import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppDispatch } from '@/hooks/reduxHooks';
import { addTimer, getAllTimer } from '@/services/timerService';
import { formatDate } from 'date-fns';

interface FormTemplate {
  _id: string;
  name: string;
  submission?: {
    _id: string;
    timerSessions: any[];
  } | null;
}

interface StaffPatient {
  _id: string;
  name: string;
  formTemplates: FormTemplate[];
}

interface Staff {
  _id: string;
  name: string;
  assignedPatients: StaffPatient[];
}


const ManualTimer: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [minutes, setMinutes] = useState<number>(0);
  const [patients, setPatients] = useState<StaffPatient[]>([]);
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [note, setNote] = useState<string>('');

  // Fetch staffs and their patients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timerData = await getAllTimer();
        setStaffs(timerData?.staffs);
      } catch (error) {
        console.error('Error fetching timer data:', error);
        toast.error('Failed to load staff data');
      }
    };

    fetchData();
  }, []);

  // Handle staff selection and set their patients
  const handleStaffChange = (staffId: string) => {
    const selectedStaff = staffs.find(staff => staff._id === staffId);
    if (selectedStaff) {
      setSelectedStaff(staffId);
      setSelectedPatient('');
      setSelectedForm('');
      setPatients(selectedStaff.assignedPatients);
    }
  };

  // Handle patient selection and set available forms
  const handlePatientChange = (patientId: string) => {
    const selectedPatient = patients.find(patient => patient._id === patientId);
    if (selectedPatient) {
      setSelectedPatient(patientId);
      setSelectedForm('');
      setForms(selectedPatient.formTemplates);
    }
  };

  // Submit the manual timer entry
  const handleSubmit = async () => {
    if (!selectedStaff || !selectedPatient || !selectedForm || !minutes) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const selectedFormData = forms.find(form => form._id === selectedForm);
      if (!selectedFormData) {
        throw new Error('Form not found');
      }

      await addTimer({
        staffId: selectedStaff,
        submissionId: selectedFormData?.submission?._id || '',
        patientId: selectedPatient,
        templateId: selectedForm,
        manualTimer: [{
          date: selectedDate,
          billingMinutes: minutes,
          note: note
        }]
      })

      toast.success('Timer entry added successfully');

      // Clear form
      setMinutes(0);
    } catch (error) {
      console.error('Error adding timer:', error);
      toast.error('Failed to add timer entry');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Manual Time Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
              <Select value={selectedStaff} onValueChange={handleStaffChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffs.map(staff => (
                    <SelectItem key={staff._id} value={staff._id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <Select
                value={selectedPatient}
                onValueChange={handlePatientChange}
                disabled={!selectedStaff}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient._id} value={patient._id}>{patient.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
              <Select
                value={selectedForm}
                onValueChange={setSelectedForm}
                disabled={!selectedPatient}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  {forms.map(form => (
                    <SelectItem
                      key={form._id}
                      value={form._id}
                    // disabled={!form.submission} // Disable if no submission exists
                    >
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
              <Input
                type="number"
                min="1"
                value={minutes || ''}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                placeholder="Enter time in minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Input
                type="string"
                value={note || ''}
                onChange={(e) => setNote(e.target.value || '')}
                placeholder="Enter note for manual time"
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={!selectedStaff || !selectedPatient || !selectedForm || minutes <= 0}
              >
                Add Time
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualTimer;
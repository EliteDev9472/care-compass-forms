
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
import { Staff, StaffPatient, getAllStaffs } from '@/services/staffService';
import { addTimerSession } from '@/store/timerSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';

const ManualTimer: React.FC = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [minutes, setMinutes] = useState<number>(0);
  const [patients, setPatients] = useState<StaffPatient[]>([]);
  const [forms, setForms] = useState<{_id: string, name: string}[]>([]);
  const dispatch = useAppDispatch();

  // Fetch staffs on component mount
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const staffsData = await getAllStaffs();
        setStaffs(staffsData);
      } catch (error) {
        console.error('Error fetching staffs:', error);
        toast.error('Failed to load staff data');
      }
    };

    fetchStaffs();
  }, []);

  // Handle staff selection and fetch their patients
  const handleStaffChange = async (staffId: string) => {
    setSelectedStaff(staffId);
    setSelectedPatient('');
    setSelectedForm('');
    
    try {
      // In a real app, you would fetch patients assigned to this staff
      const selectedStaffData = staffs.find(staff => staff._id === staffId);
      if (selectedStaffData) {
        // Mock patient data for now
        setPatients([
          { _id: 'patient1', name: 'Patient 1', billingMinutes: 0 },
          { _id: 'patient2', name: 'Patient 2', billingMinutes: 0 },
        ]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patient data');
    }
  };

  // Handle patient selection and fetch available forms
  const handlePatientChange = (patientId: string) => {
    setSelectedPatient(patientId);
    setSelectedForm('');
    
    // Mock form data
    setForms([
      { _id: 'form1', name: 'Assessment Form' },
      { _id: 'form2', name: 'Progress Note' },
      { _id: 'form3', name: 'Treatment Plan' },
    ]);
  };

  // Submit the manual timer entry
  const handleSubmit = () => {
    if (!selectedStaff || !selectedPatient || !selectedForm || !minutes) {
      toast.error('Please fill in all fields');
      return;
    }

    const selectedDateTime = new Date(selectedDate);
    
    // Create timer session
    const timerSession = {
      startedAt: selectedDateTime.toString(),
      stoppedAt: new Date(selectedDateTime.getTime() + minutes * 60000).toString(),
      durationMinutes: minutes
    };

    // In a real application, you would save this to your backend
    dispatch(addTimerSession(timerSession));
    
    toast.success('Timer entry added successfully');
    
    // Clear form
    setMinutes(0);
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
                    <SelectItem key={form._id} value={form._id}>{form.name}</SelectItem>
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
                min="0"
                value={minutes || ''} 
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)} 
                placeholder="Enter time in minutes" 
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={!selectedStaff || !selectedPatient || !selectedForm || minutes <= 0}
              >
                Add Time Entry
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualTimer;

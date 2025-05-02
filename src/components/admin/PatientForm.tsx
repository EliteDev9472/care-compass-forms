
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  createPatient, 
  getPatient, 
  updatePatient, 
  PatientCreateData, 
  PatientUpdateData 
} from '@/services/patientService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PatientFormProps {
  mode?: 'add' | 'edit';
}

const PatientForm: React.FC<PatientFormProps> = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [patientName, setPatientName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [ccmStatus, setCcmStatus] = useState<'Simple' | 'Complex' | ''>('');
  const [patientConsent, setPatientConsent] = useState<boolean | undefined>(undefined);
  
  const [patientData, setPatientData] = useState<any>(null);

  useEffect(() => {
    if (mode === 'edit' && patientId) {
      const fetchPatient = async () => {
        try {
          const data = await getPatient(patientId);
          setPatientData(data);
          setPatientName(data.name || '');
          setDateOfBirth(data.dateOfBirth ? new Date(data.dateOfBirth) : undefined);
          setGender(data.gender || '');
          setPhoneNumber(data.phoneNumber || '');
          setAddress(data.address || '');
          setNote(data.note || '');
          setCcmStatus(data.ccmStatus || '');
          setPatientConsent(data.patientConsent);
        } catch (error) {
          toast.error('Failed to load patient data');
          navigate('/admin/patients');
        }
      };
      fetchPatient();
    }
  }, [mode, patientId, navigate]);

  const handleSave = async () => {
    if (!patientName) {
      toast.error('Please fill in the patient name');
      return;
    }

    try {
      setLoading(true);
      
      const patientData = {
        name: patientName,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : undefined,
        gender,
        phoneNumber,
        address,
        note,
        ccmStatus: ccmStatus as 'Simple' | 'Complex' | undefined,
        patientConsent
      };
      
      if (mode === 'edit' && patientId) {
        await updatePatient(patientId, patientData as PatientUpdateData);
        toast.success('Patient updated successfully');
      } else {
        await createPatient(patientData as PatientCreateData);
        toast.success('Patient created successfully');
      }
      navigate('/admin/patients');
    } catch (error) {
      toast.error(mode === 'edit' ? 'Failed to update patient' : 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
          <Input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={setDateOfBirth}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone Number</label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add notes about the patient"
            className="bg-blue-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CCM Status</label>
          <Select value={ccmStatus} onValueChange={(value: 'Simple' | 'Complex') => setCcmStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select CCM status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Simple">Simple</SelectItem>
              <SelectItem value="Complex">Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Patient Consent</label>
          <RadioGroup 
            defaultValue={patientConsent === true ? "yes" : patientConsent === false ? "no" : undefined} 
            onValueChange={(value) => setPatientConsent(value === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="consent-yes" />
              <Label htmlFor="consent-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="consent-no" />
              <Label htmlFor="consent-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {patientData && patientData.billingMinutes !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
            <div className="p-2 border rounded bg-gray-50">
              {patientData.billingMinutes}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/patients')}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !patientName}
        >
          {loading ? 'Saving...' : 'Save Patient'}
        </Button>
      </div>
    </div>
  );
};

export default PatientForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
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
  updatePatientBillingMinutes,
  PatientCreateData,
  PatientUpdateData,
  BillingHistoryItem
} from '@/services/patientService';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Styles for the calendar
import { Value } from '@radix-ui/react-select';

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
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [note, setNote] = useState('');
  const [ccmStatus, setCcmStatus] = useState<'Simple' | 'Complex' | ''>('');
  const [patientConsent, setPatientConsent] = useState<string>('');

  // Billing Minutes
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [minutesInput, setMinutesInput] = useState<number>(0);
  const [billingMinutes, setBillingMinutes] = useState(5);

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
          // setAddress(data.address || '');
          setCity(data.city || '');
          setStreet(data.street || '')
          setNote(data.note || '');
          setCcmStatus(data.ccmStatus || '');
          setPatientConsent(data.patientConsent);
          setBillingMinutes(data.billingMinutes || 0);

          // Initialize billing history if available
          if (data.billingHistory && Array.isArray(data.billingHistory)) {
            setBillingHistory(data.billingHistory);
          }
        } catch (error) {
          toast.error("Failed to load patient data");
          navigate('/admin/patients');
        }
      };
      fetchPatient();
    }
  }, [mode, patientId, navigate]);

  // Validation
  const validateFields = () => {
    if (!patientName) {
      toast.warning("Please fill in the patient name");
      return false;
    }
    if (!dateOfBirth) {
      toast.warning("Please fill in the patient's date of birth");
      return false;
    }
    if (!gender) {
      toast.warning("Please select the patient's gender");
      return false;
    }
    if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      toast.warning("Please enter a valid phone number");
      return false;
    }
    if (ccmStatus === '') {
      toast.warning("Please select the CCM status");
      return false;
    }
    if (patientConsent === undefined) {
      toast.warning("Please select the patient's consent");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    console.log(city, street)
    if (!validateFields()) {
      return;
    }

    try {
      setLoading(true);

      const patientData = {
        name: patientName,
        dateOfBirth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : undefined,
        gender,
        phoneNumber,
        city,
        street,
        note,
        ccmStatus: ccmStatus as 'Simple' | 'Complex' | undefined,
        patientConsent
      };

      if (mode === 'edit' && patientId) {
        await updatePatient(patientId, patientData as PatientUpdateData);
        toast.success("Patient updated successfully");
      } else {
        await createPatient(patientData as PatientCreateData);
        toast.success("Patient created successfully");
      }
      navigate('/admin/patients');
    } catch (error) {
      toast.error(
        mode === 'edit' ? 'Failed to update patient' : 'Failed to create patient',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddBillingMinutes = async () => {
    if (!patientId || minutesInput <= 0) {
      toast.warning("Please enter a valid number of minutes");
      return;
    }

    try {
      setLoading(true);
      const dateString = format(selectedDate, 'yyyy-MM-dd');

      // Check if there's already an entry for this date
      const existingEntryIndex = billingHistory.findIndex(
        item => item.date === dateString
      );

      // Update API
      const updatedPatient = await updatePatientBillingMinutes(patientId, dateString, minutesInput);

      // Update state
      if (existingEntryIndex >= 0) {
        // Update existing entry
        const updatedHistory = [...billingHistory];
        updatedHistory[existingEntryIndex].minutes = minutesInput;
        setBillingHistory(updatedHistory);
      } else {
        // Add new entry
        setBillingHistory([...billingHistory, { date: dateString, minutes: minutesInput }]);
      }

      // Update total minutes if available from API response
      if (updatedPatient && updatedPatient.billingMinutes) {
        setBillingMinutes(updatedPatient.billingMinutes);
      } else {
        // Fallback to calculating it from our local state
        const total = [...billingHistory, { date: dateString, minutes: minutesInput }]
          .reduce((sum, item) => sum + item.minutes, 0);
        setBillingMinutes(total);
      }

      setMinutesInput(0);
      toast.success("Billing minutes updated successfully");
    } catch (error) {
      toast.error("Failed to update billing minutes");
    } finally {
      setLoading(false);
    }
  };

  const onChangeMinutes = (value: string) => {
    const initialBillingMinutes = 5;
    setBillingMinutes(parseInt(value) ? initialBillingMinutes + parseInt(value) : initialBillingMinutes);
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
          <Input type='date' defaultValue={dateOfBirth && format(dateOfBirth, 'yyyy-MM-dd')} onChange={(e) => setDateOfBirth(new Date(e.target.value))} />
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

        {/* <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div> */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
          <Input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Enter Street"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">City, State, Zip</label>
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City, State, Zip"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Consent</label>
          <Select value={patientConsent} onValueChange={(value: 'true' | 'false') => setPatientConsent(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Patient Consent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Patient Consent</label>
          <RadioGroup
            defaultValue={patientConsent == "true" ? "yes" : patientConsent == "false" ? "no" : undefined}
            onValueChange={(value) => setPatientConsent(value == "yes")}
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
        </div> */}
      </div>

      <div className="flex justify-end space-x-4 mt-6">
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

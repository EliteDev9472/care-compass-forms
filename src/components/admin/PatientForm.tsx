
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
  const [patientConsent, setPatientConsent] = useState<boolean | undefined>(undefined);

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
          setAddress(data.address || '');
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

  const handleSave = async () => {
    if (!patientName) {
      toast.warning("Please fill in the patient name");
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

  const handleDeleteBillingEntry = async (date: string) => {
    if (!patientId) return;

    try {
      setLoading(true);
      // Call API with 0 minutes to remove the entry
      const updatedPatient = await updatePatientBillingMinutes(patientId, date, 0);

      // Update local state
      const updatedHistory = billingHistory.filter(item => item.date !== date);
      setBillingHistory(updatedHistory);

      // Update total billing minutes
      if (updatedPatient && updatedPatient.billingMinutes !== undefined) {
        setBillingMinutes(updatedPatient.billingMinutes);
      } else {
        const total = updatedHistory.reduce((sum, item) => sum + item.minutes, 0);
        setBillingMinutes(total);
      }

      toast.success("Billing entry removed successfully");
    } catch (error) {
      toast.error("Failed to remove billing entry");
    } finally {
      setLoading(false);
    }
  };

  // const renderBillingHistory = () => {
  //   if (!billingHistory.length) {
  //     return <div className="text-gray-500 italic">No billing history available.</div>;
  //   }

  //   return (
  //     <div className="mt-2 space-y-2">
  //       {billingHistory.map((entry, index) => (
  //         <div key={entry._id || index} className="flex items-center justify-between p-2 border rounded bg-gray-50">
  //           <div>
  //             <span className="font-medium">{entry.date}</span>: {entry.minutes} minutes
  //           </div>
  //           <Button
  //             variant="ghost"
  //             size="sm"
  //             onClick={() => handleDeleteBillingEntry(entry.date)}
  //             className="text-red-500"
  //           >
  //             <Trash className="h-4 w-4" />
  //           </Button>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const onChangeMinutes = (value: string) => {
    const initialBillingMinutes = 5
    setBillingMinutes(parseInt(value) ? initialBillingMinutes + parseInt(value) : initialBillingMinutes)
  }

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
      </div>

      {/* {mode === 'edit' && patientId && (
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Billing Minutes</h3>

          <div className="flex items-end gap-4 mb-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
              <Input
                type="text"
                // value={minutesInput.toString()}
                onChange={(e) => onChangeMinutes(e.target.value)}
                className="w-24"
              />
            </div>

            <Button
              onClick={handleAddBillingMinutes}
              disabled={loading || minutesInput <= 0}
              className="mb-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Billing Minutes</label>
            <div className="p-2 border rounded bg-gray-100 font-medium">
              {billingMinutes} minutes
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing History</label>
            {renderBillingHistory()}
          </div>
        </div>
      )} */}

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

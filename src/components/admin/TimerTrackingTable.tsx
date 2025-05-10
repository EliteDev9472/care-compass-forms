
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAppSelector } from '@/hooks/reduxHooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TimerSession } from '@/store/timerSlice';
import { Staff, getAllStaffs } from '@/services/staffService';
import { getAllPatients } from '@/services/patientService';
import { toast } from 'sonner';

interface TimerTrackingRecord extends TimerSession {
  id: string;
  staffName: string;
  patientName: string;
  formName: string;
}

const TimerTrackingTable: React.FC = () => {
  const [timerRecords, setTimerRecords] = useState<TimerTrackingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TimerTrackingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMinutes, setEditingMinutes] = useState(0);
  const timerSessions = useAppSelector(state => state.timer.timerSessions);
  
  useEffect(() => {
    // Fetch the necessary data to populate the table
    const fetchData = async () => {
      try {
        // In a real application, you would fetch this from your backend
        // For now, we'll mock some data using the timer sessions from Redux
        const staffData = await getAllStaffs();
        const patientData = await getAllPatients();
        
        // Map timer sessions to display records
        const mockRecords: TimerTrackingRecord[] = timerSessions.map((session, index) => {
          // Randomly select a staff and patient for demo purposes
          const randomStaffIndex = Math.floor(Math.random() * staffData.length);
          const randomPatientIndex = Math.floor(Math.random() * patientData.length);
          const staff = staffData[randomStaffIndex] || { name: 'Unknown Staff', _id: 'staff' + index };
          const patient = patientData[randomPatientIndex] || { name: 'Unknown Patient', _id: 'patient' + index };
          
          return {
            ...session,
            id: `timer-${index}`,
            staffName: staff.name,
            patientName: patient.name,
            formName: ['Assessment Form', 'Progress Note', 'Treatment Plan'][Math.floor(Math.random() * 3)],
          };
        });
        
        setTimerRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load timer tracking data');
      }
    };
    
    fetchData();
  }, [timerSessions]);
  
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRecords(timerRecords);
    } else {
      const filtered = timerRecords.filter(record => 
        record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.formName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, timerRecords]);
  
  const handleEditClick = (record: TimerTrackingRecord) => {
    setEditingId(record.id);
    setEditingMinutes(record.durationMinutes);
  };
  
  const handleSaveEdit = (record: TimerTrackingRecord) => {
    try {
      // In a real application, you would update this in your backend
      setTimerRecords(timerRecords.map(item => 
        item.id === record.id 
          ? { ...item, durationMinutes: editingMinutes } 
          : item
      ));
      
      toast.success('Minutes updated successfully');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating minutes:', error);
      toast.error('Failed to update minutes');
    }
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Timer Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search by staff, patient, or form..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-center">Minutes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>{record.staffName}</TableCell>
                    <TableCell>{record.patientName}</TableCell>
                    <TableCell>{record.formName}</TableCell>
                    <TableCell>{format(new Date(record.startedAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>{format(new Date(record.stoppedAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell className="text-center">
                      {editingId === record.id ? (
                        <Input
                          type="number"
                          value={editingMinutes}
                          onChange={(e) => setEditingMinutes(Number(e.target.value))}
                          className="w-20 text-center inline-block"
                          min="1"
                        />
                      ) : (
                        record.durationMinutes
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === record.id ? (
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveEdit(record)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(record)}
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No timer records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerTrackingTable;

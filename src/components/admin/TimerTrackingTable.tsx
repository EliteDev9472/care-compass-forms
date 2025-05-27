
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { getAllTracking, TimerTrackingRecord } from '@/services/timerService';
import { format } from 'date-fns'

const TimerTrackingTable: React.FC = () => {
  const [timerRecords, setTimerRecords] = useState<TimerTrackingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TimerTrackingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch the necessary data to populate the table
    const fetchData = async () => {
      try {
        const result = await getAllTracking();
        setTimerRecords(result)
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load timer tracking data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredRecords(timerRecords);
    } else {
      const filtered = timerRecords.filter(record =>
        record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.templateTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, timerRecords]);


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
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Billing Minutes</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead>Added At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>
                    <TableCell>{record.staffName}</TableCell>
                    <TableCell>{record.patientName}</TableCell>
                    <TableCell>{record.templateTitle}</TableCell>
                    <TableCell>{record.date.substring(0, 10)}</TableCell>
                    <TableCell>{record.billingMinutes}</TableCell>
                    <TableCell>{record.note}</TableCell>
                    <TableCell>{record.addedByName}</TableCell>
                    <TableCell>{record.addedAt.substring(0, 10)}</TableCell>
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

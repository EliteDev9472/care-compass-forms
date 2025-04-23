
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pencil, Trash2 } from 'lucide-react';
import { getAllStaffs, deleteStaff, Staff } from '@/services/staffService';
import { toast } from 'sonner';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';
import { exportTableToCSV } from '@/utils/exportCsv';

const AdminStaffList: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteStaffId, setDeleteStaffId] = useState<string | null>(null);

  function getDateRange(): { start: string, end: string } {
    const d = date || new Date();
    let start: Date, end: Date;
    switch (viewMode) {
      case 'week':
        start = startOfWeek(d, { weekStartsOn: 1 });
        end = endOfWeek(d, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(d);
        end = endOfMonth(d);
        break;
      default:
        start = startOfDay(d);
        end = endOfDay(d);
    }
    return { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') };
  }

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const range = getDateRange();
      const staffList: Staff[] = await getAllStaffs(range.start, range.end);
      setStaff(staffList);
    } catch {
      toast.error('Failed to fetch staff');
      setStaff([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, viewMode]);

  const handleAddStaff = () => {
    navigate('/admin/staff/add');
  };

  const handleEditStaff = (staffId: string) => {
    navigate(`/admin/staff/${staffId}/edit`);
  };

  const handleDeleteClick = (staffId: string) => {
    setDeleteStaffId(staffId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteStaffId) {
      try {
        await deleteStaff(deleteStaffId);
        // Refresh staff list
        fetchStaffs();
        toast.success('Staff deleted successfully');
      } catch (error) {
        toast.error('Failed to delete staff');
      }
    }
    setDeleteStaffId(null);
  };

  const setViewAndUpdate = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor((minutes || 0) / 60);
    const mins = (minutes || 0) % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleExportCSV = () => {
    if (!staff.length) return;
    exportTableToCSV(
      'staff.csv',
      staff.map(staffMember => ({
        name: staffMember.name,
        username: staffMember.username,
        billingTime: formatTime(staffMember.billingMinutes || 0),
        status: staffMember.isActive ? 'Active' : 'Inactive',
      })),
      [
        { label: 'Staff Name', key: 'name' },
        { label: 'Username', key: 'username' },
        { label: 'Billing Time', key: 'billingTime' },
        { label: 'Status', key: 'status' },
      ]
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
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
                <span className="sr-only">Toggle calendar</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  className="h-4 w-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
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

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddStaff}>Add Staff</Button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
        <div className="grid grid-cols-5 bg-gray-50 border-b">
          <div className="p-4 font-semibold">Staff Name</div>
          <div className="p-4 font-semibold">Username</div>
          <div className="p-4 font-semibold">Billing Time</div>
          <div className="p-4 font-semibold">Status</div>
          <div className="p-4 font-semibold">Actions</div>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : staff.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No staff found</div>
        ) : (
          staff.map((staffMember) => (
            <div key={staffMember._id} className="grid grid-cols-5 border-b hover:bg-gray-50">
              <div className="p-4">{staffMember.name}</div>
              <div className="p-4">{staffMember.username}</div>
              <div className="p-4">{formatTime(staffMember.billingMinutes || 0)}</div>
              <div className="p-4">
                {staffMember.isActive ? (
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">Active</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-medium">Inactive</span>
                )}
              </div>
              <div className="p-4 flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleEditStaff(staffMember._id)}>
                  <Pencil size={16} className="mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(staffMember._id)}
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteStaffId}
        onCancel={() => setDeleteStaffId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
      />
    </div>
  );
};

export default AdminStaffList;

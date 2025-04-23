import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { exportTableToCSV } from '@/utils/exportCsv';

// Mock data
const mockForms = [
  { id: '1', name: 'Template1' },
  { id: '2', name: 'Template2' },
  { id: '3', name: 'Template3' },
  { id: '4', name: 'Template4' },
];

const mockClients = [
  { id: '1', name: 'Client1', totalBillingTime: 65 },
  { id: '2', name: 'Client2', totalBillingTime: 125 },
  { id: '3', name: 'Client3', totalBillingTime: 180 },
];

const mockStaff = [
  { id: '1', name: 'Staff1', totalBillingTime: 65 },
  { id: '2', name: 'Staff2', totalBillingTime: 165 },
  { id: '3', name: 'Staff3', totalBillingTime: 213 },
  { id: '4', name: 'Staff4', totalBillingTime: 263 },
];

const mockPatients = [
  { id: '1', name: 'Patient1', totalBillingTime: 65 },
  { id: '2', name: 'Patient2', totalBillingTime: 123 },
  { id: '3', name: 'Patient3', totalBillingTime: 213 },
  { id: '4', name: 'Patient4', totalBillingTime: 183 },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("forms");
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  const handleCreateForm = () => {
    navigate('/admin/forms/create');
  };
  
  const handleEditForm = (formId: string) => {
    navigate(`/admin/forms/${formId}/edit`);
  };
  
  const handleAddClient = () => {
    navigate('/admin/clients/add');
  };
  
  const handleEditClient = (clientId: string) => {
    navigate(`/admin/clients/${clientId}/edit`);
  };
  
  const handleAddStaff = () => {
    navigate('/admin/staff/add');
  };
  
  const handleEditStaff = (staffId: string) => {
    navigate(`/admin/staff/${staffId}/edit`);
  };
  
  const handleAddPatient = () => {
    navigate('/admin/patients/add');
  };
  
  const handleEditPatient = (patientId: string) => {
    navigate(`/admin/patients/${patientId}/edit`);
  };
  
  const handleClientsExportCSV = () => {
    exportTableToCSV(
      'clients.csv',
      mockClients,
      [
        { label: 'Client Name', key: 'name' },
        { label: 'Billing Time', key: 'totalBillingTime' }
      ]
    );
  };
  
  const handleStaffExportCSV = () => {
    exportTableToCSV(
      'staffs.csv',
      mockStaff,
      [
        { label: 'Staff Name', key: 'name' },
        { label: 'Billing Time', key: 'totalBillingTime' }
      ]
    );
  };
  
  const handlePatientsExportCSV = () => {
    exportTableToCSV(
      'patients.csv',
      mockPatients,
      [
        { label: 'Patient Name', key: 'name' },
        { label: 'Billing Time', key: 'totalBillingTime' }
      ]
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tabs defaultValue="forms" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="staff">Staffs</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forms" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Templates</h2>
            <Button onClick={handleCreateForm}>+ Create Form</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{form.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" onClick={() => handleEditForm(form.id)}>
                      EDIT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Clients</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClientsExportCSV}>
                Export CSV
              </Button>
              <Button onClick={handleAddClient}>+ Add Client</Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Billing Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{formatTime(client.totalBillingTime)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" onClick={() => handleEditClient(client.id)}>
                      EDIT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Staff</h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleStaffExportCSV}>
                Export CSV
              </Button>
              <Button onClick={handleAddStaff}>+ Add Staff</Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Billing Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{formatTime(staff.totalBillingTime)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" onClick={() => handleEditStaff(staff.id)}>
                      EDIT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="patients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Patients</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePatientsExportCSV}>
                Export CSV
              </Button>
              <Button onClick={handleAddPatient}>+ Add Patient</Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Billing Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{formatTime(patient.totalBillingTime)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">ADD</Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient.id)}>
                        EDIT
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

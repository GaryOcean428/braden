
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LeadsCard from '@/components/admin/SiteEditor/LeadsCard';
import ClientsCard from '@/components/admin/SiteEditor/ClientsCard';
import StaffCard from '@/components/admin/SiteEditor/StaffCard';
import TasksCard from '@/components/admin/SiteEditor/TasksCard';
import EmailsCard from '@/components/admin/SiteEditor/EmailsCard';
import { useSiteEditorData } from '@/hooks/admin/useSiteEditorData';

const SiteEditor: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    leads,
    clients,
    staff,
    tasks,
    emails,
    handleAddLead,
    handleAddClient,
    handleAddStaff,
    handleAddTask,
    handleAddEmail,
  } = useSiteEditorData();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Site Editor</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeadsCard leads={leads} onAddLead={handleAddLead} />
        <ClientsCard clients={clients} onAddClient={handleAddClient} />
        <StaffCard staff={staff} onAddStaff={handleAddStaff} />
        <TasksCard tasks={tasks} onAddTask={handleAddTask} />
        <EmailsCard emails={emails} onAddEmail={handleAddEmail} />
      </div>
      {/* Optionally, handle loading state with a loader/spinner or overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ab233a]" />
        </div>
      )}
    </div>
  );
};

export default SiteEditor;

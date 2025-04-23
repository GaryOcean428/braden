
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Since there's no tasks table in the database, we'll use mock data
  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockTasks: Task[] = [
        { id: '1', title: 'Complete Project', description: 'Finish the project by Friday', status: 'In Progress' },
        { id: '2', title: 'Client Meeting', description: 'Meet with client to discuss requirements', status: 'Completed' }
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    try {
      const newTaskItem: Task = {
        id: `${tasks.length + 1}`,
        ...newTask
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask({ title: '', description: '', status: '' });
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ab233a]">Manage Tasks</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="mb-2"
            />
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="mb-2"
            />
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="mb-2"
            />
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;

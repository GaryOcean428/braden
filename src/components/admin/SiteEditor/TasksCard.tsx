import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface TasksCardProps {
  tasks: Task[];
  onAddTask: () => void;
}

const TasksCard: React.FC<TasksCardProps> = ({ tasks, onAddTask }) => (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={onAddTask}>Add Task</Button>
    </CardContent>
    <CardContent>
      <h3 className="text-lg font-medium mb-2">Logo and Favicon</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <input type="file" accept="image/*" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Favicon</label>
          <input type="file" accept="image/*" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TasksCard;

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('kanbanTasks');
    return saved ? JSON.parse(saved) : {
      todo: [],
      inProgress: [],
      review: [],
      done: []
    };
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumn = e.dataTransfer.getData('sourceColumn');
    
    if (sourceColumn === targetColumn) return;

    const task = tasks[sourceColumn].find(t => t.id === taskId);
    
    setTasks(prev => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter(t => t.id !== taskId),
      [targetColumn]: [...prev[targetColumn], task]
    }));
  };

  const addTask = () => {
    if (!newTask.title) return;
    
    const task = {
      id: Date.now().toString(),
      ...newTask,
      created: new Date().toISOString()
    };

    setTasks(prev => ({
      ...prev,
      todo: [...prev.todo, task]
    }));

    setNewTask({ title: '', assignee: '', description: '' });
  };

  const sendReminder = (task) => {
    console.log(`Sending reminder to ${task.assignee} about task: ${task.title}`);
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' }
  ];

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Task</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Task Title"
            value={newTask.title}
            onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
          />
          <Input
            placeholder="Assignee Email"
            type="email"
            value={newTask.assignee}
            onChange={e => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
          />
          <Input
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
          />
          <Button onClick={addTask}>Add Task</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className={`${column.color} p-4 rounded-lg min-h-64`}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, column.id)}
          >
            <h3 className="font-bold mb-4">{column.title}</h3>
            {tasks[column.id].map(task => (
              <Card
                key={task.id}
                draggable
                onDragStart={e => handleDragStart(e, task.id, column.id)}
                className="mb-2 cursor-move"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      
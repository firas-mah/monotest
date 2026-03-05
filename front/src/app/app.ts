import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task } from './models/task';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Task Manager');
  
  tasks = signal<Task[]>([]);
  newTask: Task = { title: '', description: '', completed: false };
  editingTask: Task | null = null;
  showForm = signal(false);

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  createTask() {
    if (this.newTask.title.trim()) {
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.newTask = { title: '', description: '', completed: false };
          this.showForm.set(false);
        },
        error: (err) => console.error('Error creating task:', err)
      });
    }
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  toggleCompleted(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Error updating task:', err)
    });
  }

  startEdit(task: Task) {
    this.editingTask = { ...task };
  }

  updateTask() {
    if (this.editingTask && this.editingTask.id) {
      this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
        next: () => {
          this.loadTasks();
          this.editingTask = null;
        },
        error: (err) => console.error('Error updating task:', err)
      });
    }
  }

  cancelEdit() {
    this.editingTask = null;
  }

  toggleForm() {
    this.showForm.update(v => !v);
  }
}

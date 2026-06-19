import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../types';
import { taskService } from '../services/taskService';

interface TaskState {
  items: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  items: [],
  loading: false,
};

// --- Thunks Asíncronos ---

export const loadTasks = createAsyncThunk<Task[]>(
  'tasks/loadTasks',
  async () => {
    return await taskService.getTasks();
  }
);

export const addTaskAsync = createAsyncThunk<Task, Omit<Task, 'id'>>(
  'tasks/addTaskAsync',
  async (taskData) => {
    return await taskService.addTask(taskData);
  }
);

export const updateTaskAsync = createAsyncThunk<Task, Task>(
  'tasks/updateTaskAsync',
  async (updatedTask) => {
    await taskService.updateTask(updatedTask);
    return updatedTask;
  }
);

export const deleteTaskAsync = createAsyncThunk<string, string>(
  'tasks/deleteTaskAsync',
  async (taskId) => {
    await taskService.deleteTask(taskId);
    return taskId;
  }
);

// --- Slice ---

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // loadTasks
    builder.addCase(loadTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadTasks.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(loadTasks.rejected, (state) => {
      state.loading = false;
    });

    // addTaskAsync
    builder.addCase(addTaskAsync.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // updateTaskAsync
    builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // deleteTaskAsync
    builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    });
  },
});

export default taskSlice.reducer;

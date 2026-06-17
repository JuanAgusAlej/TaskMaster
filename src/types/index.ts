export interface AssignedContact {
  id: string;
  name: string;
  phoneNumber?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reminderTime: string;
  reminderConfig?: string;
  completed: boolean;
  assignedContact?: AssignedContact;
  imageUri?: string;
}

export interface User {
  username: string;
  password: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddTask: { taskId?: string };
  TaskDetail: { taskId: string; fromTab?: 'in_progress' | 'completed' };
};

import { Task } from '../../types';

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetail: (task: Task) => void;
}

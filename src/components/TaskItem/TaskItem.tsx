import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CustomButton } from '../CustomButton/CustomButton';
import { styles } from './style';
import { TaskItemProps } from './types';

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetail
}) => {
  const [showActions, setShowActions] = useState(false);

  const {container, checkboxContainer, checkbox, checkboxChecked, checkmark, textContainer, title, titleCompleted, body, actionsContainer, actionBtn, deleteBtn, actionIcon, mainContent} = styles

  return (
    <View style={container}>
      <View style={mainContent}>
        {!task.completed && (
          <TouchableOpacity 
            style={checkboxContainer} 
            onPress={() => onToggleComplete(task)}
            activeOpacity={0.7}
          >
            <View style={[checkbox, task.completed && checkboxChecked]}>
              {task.completed && <Text style={checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={textContainer} 
          onPress={() => {
            if (task.completed) {
              onViewDetail(task);
            } else {
              setShowActions(!showActions);
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={[title, task.completed && titleCompleted]} numberOfLines={1}>
            {task.title || 'Tarea sin título'}
          </Text>
          <Text style={body} numberOfLines={1}>
            {task.description || 'Sin descripción'}
          </Text>
        </TouchableOpacity>

      </View>

      {!task.completed && showActions && (
        <View style={actionsContainer}>
          <CustomButton 
            onPress={() => onViewDetail(task)} 
            variant="icon" 
            icon={<Text style={actionIcon}>👁</Text>} 
            style={actionBtn}
          />
          <CustomButton 
            onPress={() => onEdit(task)} 
            variant="icon" 
            icon={<Text style={actionIcon}>✏</Text>} 
            style={actionBtn}
          />
          <CustomButton 
            onPress={() => onDelete(task)} 
            variant="icon" 
            icon={<Text style={actionIcon}>✕</Text>} 
            style={[actionBtn, deleteBtn]}
          />
        </View>
      )}
    </View>
  );
};



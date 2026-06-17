import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { taskService } from '../../services/taskService';
import { Task} from '../../types';
import { COLORS } from '../../constants/theme';
import { styles } from './style';

import { NavigationProp, TaskDetailRouteProp } from './types';

export const TaskDetailScreen = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId, fromTab } = route.params;

  const { centerContainer, errorText, container, header, backButton, backButtonText, content, title, divider, description, infoBox, infoTitle, infoText, statusBox, statusTitle, completedStaticBox, statusIcon, completedStaticText, statusBtn, detailImage } = styles;

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      const loadedTask = await taskService.getTaskById(taskId);
      setTask(loadedTask);
      setLoading(false);
    };
    loadTask();
  }, [taskId]);

  const handleToggleComplete = async () => {
    if (!task) return;
    
    const updatedTask = { ...task, completed: !task.completed };
    await taskService.updateTask(updatedTask);
    setTask(updatedTask);
  };

  if (loading) {
    return (
      <View style={centerContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={centerContainer}>
        <Text style={errorText}>Tarea no encontrada</Text>
        <CustomButton title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={container}>
      <View style={header}>
        <CustomButton
           title="← Volver"
           onPress={() => navigation.goBack()}
           variant="outline"
           style={backButton}
           textStyle={backButtonText}
        />
      </View>

      <ScrollView contentContainerStyle={content}>
        <Text style={title}>{task.title}</Text>
        <View style={divider} />
        
        <Text style={description}>
          {task.description || 'No hay descripción.'}
        </Text>
        
        <View style={infoBox}>
          <Text style={infoTitle}>🔔 Recordatorio:</Text>
          <Text style={infoText}>
            {task.reminderConfig || new Date(task.reminderTime).toLocaleString()}
          </Text>
        </View>

        {task.assignedContact && (
          <View style={infoBox}>
            <Text style={infoTitle}>👤 Responsable:</Text>
            <Text style={infoText}>{task.assignedContact.name}</Text>
            {task.assignedContact.phoneNumber && (
              <Text style={infoText}>📞 {task.assignedContact.phoneNumber}</Text>
            )}
          </View>
        )}

        {task.imageUri && (
          <View style={infoBox}>
            <Text style={infoTitle}>📷 Imagen adjunta</Text>
          </View>
        )}

        <View style={statusBox}>
           <Text style={statusTitle}>Estado:</Text>
           {fromTab === 'completed' ? (
             <View style={[statusBtn, completedStaticBox]}>
               <Text style={[statusIcon, { color: COLORS.background }]}>☑</Text>
               <Text style={completedStaticText}>Completada</Text>
             </View>
           ) : (
             <CustomButton 
               title={task.completed ? 'Completada' : 'En Progreso'}
               onPress={handleToggleComplete}
               variant={task.completed ? 'primary' : 'outline'}
               style={statusBtn}
               icon={<Text style={[statusIcon, task.completed && { color: COLORS.background }]}>
                 {task.completed ? '☑' : '☐'}
               </Text>}
             />
           )}
        </View>
      </ScrollView>
    </View>
  );
};

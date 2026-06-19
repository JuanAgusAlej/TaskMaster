import React, { useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { TaskItem } from '../../components/TaskItem/TaskItem';
import { TaskItemSkeleton } from '../../components/TaskItemSkeleton/TaskItemSkeleton';
import { TabSelector } from '../../components/TabSelector/TabSelector';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadTasks, deleteTaskAsync, updateTaskAsync } from '../../store/taskSlice';
import { logoutAsync } from '../../store/authSlice';
import { Task } from '../../types';
import { COLORS } from '../../constants/theme';
import { styles } from './style';

import { NavigationProp } from './types';

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(s => s.tasks.items);
  const tasksLoading = useAppSelector(s => s.tasks.loading);
  const username = useAppSelector(s => s.auth.user) ?? '';

  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed'>('in_progress');
  const [tabSwitching, setTabSwitching] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'delete' | 'complete'>('delete');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const navigation = useNavigation<NavigationProp>();

  const { container, header, userInfo, username: usernameStyle, userEmail, headerActions, headerBtn, headerIcon, divider, centerContent, listContainer, emptyText } = styles;

  useFocusEffect(
    useCallback(() => {
      dispatch(loadTasks());
    }, [dispatch])
  );

  const handleTabChange = (tab: 'in_progress' | 'completed') => {
    setTabSwitching(true);
    setActiveTab(tab);
    setTimeout(() => {
      setTabSwitching(false);
    }, 500);
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setModalType('delete');
    setModalVisible(true);
  };

  const openCompleteModal = (task: Task) => {
    setSelectedTask(task);
    setModalType('complete');
    setModalVisible(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedTask) return;

    setModalVisible(false);
    
    if (modalType === 'delete') {
      await dispatch(deleteTaskAsync(selectedTask.id));
    } else if (modalType === 'complete') {
      const updatedTask = { ...selectedTask, completed: !selectedTask.completed };
      await dispatch(updateTaskAsync(updatedTask));
    }
  };

  const filteredTasks = tasks.filter(task => 
    activeTab === 'in_progress' ? !task.completed : task.completed
  );

  const showSkeleton = tasksLoading || tabSwitching;

  return (
    <View style={container}>
      <View style={header}>
        <View style={userInfo}>
          <Text style={usernameStyle}>{username || 'User'}</Text>
          <Text style={userEmail}>{username}@taskmaster.com</Text>
        </View>
        <View style={headerActions}>
          <CustomButton
            onPress={() => navigation.navigate('AddTask', {})}
            variant="icon"
            icon={<Ionicons name="add" size={24} color={COLORS.accent} />}
            style={headerBtn}
          />
          <CustomButton
            onPress={handleLogout}
            variant="icon"
            icon={<Ionicons name="log-out-outline" size={24} color={COLORS.accent} />}
            style={headerBtn}
          />
        </View>
      </View>
      <View style={divider} />

      <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />

      {showSkeleton ? (
        <View style={[listContainer, { paddingTop: 20 }]}>
          <TaskItemSkeleton />
          <TaskItemSkeleton />
          <TaskItemSkeleton />
          <TaskItemSkeleton />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listContainer}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggleComplete={openCompleteModal}
              onDelete={openDeleteModal}
              onEdit={(task) => navigation.navigate('AddTask', { taskId: task.id })}
              onViewDetail={(task) => navigation.navigate('TaskDetail', { taskId: task.id, fromTab: activeTab })}
            />
          )}
          ListEmptyComponent={
            <View style={centerContent}>
              <Text style={emptyText}>No hay tareas</Text>
            </View>
          }
        />
      )}

      <ConfirmModal
        visible={modalVisible}
        message={modalType === 'delete' ? '¿Eliminar esta tarea?' : (selectedTask?.completed ? '¿Marcar como incompleta?' : '¿Marcar como completada?')}
        onConfirm={handleConfirmAction}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};


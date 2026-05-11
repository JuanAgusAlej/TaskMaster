import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { taskService } from '../../services/taskService';
import { notificationService } from '../../services/notificationService';
import { styles } from './style';

import { NavigationProp, AddTaskRouteProp } from './types';
import { COLORS } from '../../constants/theme';

export const AddTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [reminderType, setReminderType] = useState<'hoy' | 'otro_dia'>('hoy');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('10');
  
  const [reminderDate, setReminderDate] = useState(new Date(Date.now() + 10000));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddTaskRouteProp>();
  const taskId = route.params?.taskId;

  const { container, header, backButton, backButtonText, headerTitle, placeholder, formContainer, titleInput, descriptionInput, reminderInfo, reminderText, pickerRow, dateBtn, dateBtnText, footer, footerBtn, radioContainer, radioOption, radioCircle, radioInner, radioText, durationContainer, durationInputGroup, durationInput, durationLabel } = styles;

  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        setIsEditMode(true);
        const task = await taskService.getTaskById(taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          
          if (task.reminderConfig && (task.reminderConfig.includes('h') || task.reminderConfig.includes('min') || task.reminderConfig.includes('seg'))) {
            setReminderType('hoy');
            const remaining = new Date(task.reminderTime).getTime() - Date.now();
            if (remaining > 0) {
              const h = Math.floor(remaining / 3600000);
              const m = Math.floor((remaining % 3600000) / 60000);
              const s = Math.floor((remaining % 60000) / 1000);
              setHours(h.toString());
              setMinutes(m.toString());
              setSeconds(s.toString());
            } else {
              setHours('0'); setMinutes('0'); setSeconds('0');
            }
          } else {
            setReminderType('otro_dia');
            setReminderDate(new Date(task.reminderTime));
          }
        }
      }
    };
    loadTask();
    
    notificationService.registerForPushNotifications();
  }, [taskId]);

  const handleSave = async () => {
    if (!title.trim()) return;

    let finalReminderTime = reminderDate;
    let finalReminderConfig = '';

    if (reminderType === 'hoy') {
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;
      
      const durationMs = (h * 3600000) + (m * 60000) + (s * 1000);
      if (durationMs <= 0) {
        Alert.alert('Error', 'La duración debe ser mayor a 0 segundos.');
        return;
      }
      finalReminderTime = new Date(Date.now() + durationMs);
      
      const parts = [];
      if (h > 0) parts.push(`${h}h`);
      if (m > 0) parts.push(`${m}min`);
      if (s > 0) parts.push(`${s}seg`);
      
      finalReminderConfig = parts.length > 0 ? parts.join(' ') : '0seg';
    } else {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const selected = new Date(reminderDate);
      selected.setHours(0, 0, 0, 0);
      
      if (selected <= now) {
        Alert.alert('Error', 'Debes seleccionar un día a futuro (mañana en adelante).');
        return;
      }
      finalReminderTime = reminderDate;
      finalReminderConfig = reminderDate.toLocaleString();
    }

    setLoading(true);
    try {
      if (isEditMode && taskId) {
        const existingTask = await taskService.getTaskById(taskId);
        if (existingTask) {
          const updatedTask = {
            ...existingTask,
            title,
            description,
            reminderTime: finalReminderTime.toISOString(),
            reminderConfig: finalReminderConfig,
          };
          await taskService.updateTask(updatedTask);
          await notificationService.scheduleTaskReminder(updatedTask, finalReminderTime);
        }
      } else {
        const newTask = await taskService.addTask({
          title,
          description,
          reminderTime: finalReminderTime.toISOString(),
          reminderConfig: finalReminderConfig,
          completed: false,
        });
        await notificationService.scheduleTaskReminder(newTask, finalReminderTime);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(reminderDate);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setReminderDate(newDate);
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDate = new Date(reminderDate);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), selectedDate.getSeconds());
      setReminderDate(newDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={header}>
        <CustomButton
           title="← Volver"
           onPress={() => navigation.goBack()}
           variant="outline"
           style={backButton}
           textStyle={backButtonText}
        />
        <Text style={headerTitle}>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</Text>
        <View style={placeholder} />
      </View>

      <ScrollView contentContainerStyle={formContainer}>
        <TextInput
          style={titleInput}
          placeholder="Título..."
          placeholderTextColor={COLORS.textSecondary}
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={descriptionInput}
          placeholder="Descripción..."
          placeholderTextColor={COLORS.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

          <View style={reminderInfo}>
             <Text style={reminderText}>🔔 Configurar Recordatorio:</Text>
             
             <View style={radioContainer}>
               <TouchableOpacity style={radioOption} onPress={() => setReminderType('hoy')} activeOpacity={0.8}>
                 <View style={radioCircle}>
                   {reminderType === 'hoy' && <View style={radioInner} />}
                 </View>
                 <Text style={radioText}>Hoy (Temporizador)</Text>
               </TouchableOpacity>

               <TouchableOpacity style={radioOption} onPress={() => setReminderType('otro_dia')} activeOpacity={0.8}>
                 <View style={radioCircle}>
                   {reminderType === 'otro_dia' && <View style={radioInner} />}
                 </View>
                 <Text style={radioText}>Seleccionar día</Text>
               </TouchableOpacity>
             </View>

             {reminderType === 'hoy' ? (
               <View style={durationContainer}>
                 <View style={durationInputGroup}>
                   <TextInput style={durationInput} value={hours} onChangeText={setHours} keyboardType="numeric" maxLength={2} />
                   <Text style={durationLabel}>h</Text>
                 </View>
                 <View style={durationInputGroup}>
                   <TextInput style={durationInput} value={minutes} onChangeText={setMinutes} keyboardType="numeric" maxLength={2} />
                   <Text style={durationLabel}>min</Text>
                 </View>
                 <View style={durationInputGroup}>
                   <TextInput style={durationInput} value={seconds} onChangeText={setSeconds} keyboardType="numeric" maxLength={2} />
                   <Text style={durationLabel}>seg</Text>
                 </View>
               </View>
             ) : (
               <>
                 <View style={pickerRow}>
                   <TouchableOpacity onPress={() => setShowDatePicker(true)} style={dateBtn}>
                     <Text style={dateBtnText}>{reminderDate.toLocaleDateString()}</Text>
                   </TouchableOpacity>
                   
                   <TouchableOpacity onPress={() => setShowTimePicker(true)} style={dateBtn}>
                     <Text style={dateBtnText}>{reminderDate.toLocaleTimeString()}</Text>
                   </TouchableOpacity>
                 </View>

                 {showDatePicker && (
                    <DateTimePicker
                      value={reminderDate}
                      mode="date"
                      display="default"
                      minimumDate={new Date(Date.now() + 86400000)} // Mañana
                      onChange={onDateChange}
                    />
                 )}
                 {showTimePicker && (
                    <DateTimePicker
                      value={reminderDate}
                      mode="time"
                      display="default"
                      onChange={onTimeChange}
                    />
                 )}
               </>
             )}
          </View>
      </ScrollView>

      <View style={footer}>
        <CustomButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={footerBtn}
        />
        <CustomButton
          title="Guardar"
          onPress={handleSave}
          loading={loading}
          style={footerBtn}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

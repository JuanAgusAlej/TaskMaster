import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { ContactPickerModal } from '../../components/ContactPickerModal/ContactPickerModal';
import { LocationPickerModal } from '../../components/LocationPickerModal/LocationPickerModal';
import { taskService } from '../../services/taskService';
import { notificationService } from '../../services/notificationService';
import { calendarService } from '../../services/calendarService';
import { styles } from './style';

import { NavigationProp, AddTaskRouteProp } from './types';
import { AssignedContact, LocationData } from '../../types';
import { COLORS } from '../../constants/theme';

export const AddTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [assignedContact, setAssignedContact] = useState<AssignedContact | null>(null);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [location, setLocation] = useState<LocationData | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
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

  const { container, header, backButton, backButtonText, headerTitle, placeholder, formContainer, titleInput, descriptionInput, reminderInfo, reminderText, pickerRow, dateBtn, dateBtnText, footer, footerBtn, radioContainer, radioOption, radioCircle, radioInner, radioText, durationContainer, durationInputGroup, durationInput, durationLabel, contactSection, contactSelectBtn, contactSelectBtnText, contactChip, contactChipInfo, contactChipName, contactChipPhone, removeContactBtn, removeContactBtnText, imageSection, imageBtnRow, imageBtn, imageBtnText, imagePreviewContainer, imagePreview, removeImageBtn, removeImageBtnText, imageHint, locationSection, locationBtn, locationBtnText, locationChip, locationChipText, removeLocationBtn, removeLocationBtnText } = styles;

  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        setIsEditMode(true);
        const task = await taskService.getTaskById(taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          if (task.assignedContact) {
            setAssignedContact(task.assignedContact);
          }
          if (task.imageUri) {
            setImageUri(task.imageUri);
          }
          if (task.location) {
            setLocation(task.location);
          }
          
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

  const launchCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara para tomar una foto.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara.');
    }
  };

  const launchGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar una imagen.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería.');
    }
  };

  const confirmAndRun = (action: () => Promise<void>) => {
    if (imageUri) {
      Alert.alert(
        'Reemplazar imagen',
        'Ya tenés una imagen adjunta. ¿Querés reemplazarla?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reemplazar', style: 'destructive', onPress: () => action() },
        ]
      );
    } else {
      action();
    }
  };

  const handleTakePhoto = () => confirmAndRun(launchCamera);
  const handlePickFromGallery = () => confirmAndRun(launchGallery);

  const handleOpenLocationPicker = () => {
    setShowLocationPicker(true);
  };

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
      // Construir título y notas enriquecidas para el evento de calendario
      const calendarTitle = `TaskMaster - ${title}`;
      const notesParts: string[] = [];
      if (description) notesParts.push(`📝 ${description}`);
      if (assignedContact) {
        let contactLine = `👤 Responsable: ${assignedContact.name}`;
        if (assignedContact.phoneNumber) contactLine += ` (${assignedContact.phoneNumber})`;
        notesParts.push(contactLine);
      }
      if (location) {
        const locationLine = location.address
          ? `📍 Ubicación: ${location.address}`
          : `📍 Ubicación: Lat ${location.latitude.toFixed(4)}, Lng ${location.longitude.toFixed(4)}`;
        notesParts.push(locationLine);
      }
      const calendarNotes = notesParts.join('\n');

      if (isEditMode && taskId) {
        const existingTask = await taskService.getTaskById(taskId);
        if (existingTask) {
          let eventId = existingTask.calendarEventId;
          try {
            if (reminderType === 'otro_dia') {
              if (eventId) {
                await calendarService.updateEvent(eventId, calendarTitle, finalReminderTime.toISOString(), calendarNotes);
              } else {
                const newEventId = await calendarService.createEvent(calendarTitle, finalReminderTime.toISOString(), calendarNotes);
                if (newEventId) eventId = newEventId;
              }
            } else {
              if (eventId) {
                await calendarService.deleteEvent(eventId);
                eventId = undefined;
              }
            }
          } catch (calErr) {
            console.error('Error syncing with native calendar:', calErr);
          }

          const updatedTask = {
            ...existingTask,
            title,
            description,
            reminderTime: finalReminderTime.toISOString(),
            reminderConfig: finalReminderConfig,
            assignedContact: assignedContact ?? undefined,
            imageUri: imageUri ?? undefined,
            location: location ?? undefined,
            calendarEventId: eventId,
          };
          await taskService.updateTask(updatedTask);
          await notificationService.scheduleTaskReminder(updatedTask, finalReminderTime);
        }
      } else {
        let eventId: string | undefined = undefined;
        if (reminderType === 'otro_dia') {
          try {
            const newEventId = await calendarService.createEvent(calendarTitle, finalReminderTime.toISOString(), calendarNotes);
            if (newEventId) {
              eventId = newEventId;
            }
          } catch (calErr) {
            console.error('Error creating event in native calendar:', calErr);
          }
        }

        const newTask = await taskService.addTask({
          title,
          description,
          reminderTime: finalReminderTime.toISOString(),
          reminderConfig: finalReminderConfig,
          completed: false,
          assignedContact: assignedContact ?? undefined,
          imageUri: imageUri ?? undefined,
          location: location ?? undefined,
          calendarEventId: eventId,
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

        <View style={imageSection}>
          <Text style={reminderText}>📷 Imagen adjunta:</Text>
          <Text style={imageHint}>Solo se permite una imagen por tarea.</Text>
          <View style={imageBtnRow}>
            <TouchableOpacity style={imageBtn} onPress={handleTakePhoto} activeOpacity={0.7}>
              <Text style={imageBtnText}>📸 Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={imageBtn} onPress={handlePickFromGallery} activeOpacity={0.7}>
              <Text style={imageBtnText}>🖼️ Galería</Text>
            </TouchableOpacity>
          </View>
          {imageUri && (
            <View style={imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={imagePreview} />
              <TouchableOpacity
                style={removeImageBtn}
                onPress={() => setImageUri(null)}
                activeOpacity={0.7}
              >
                <Text style={removeImageBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={locationSection}>
          <Text style={reminderText}>📍 Ubicación:</Text>
          {location ? (
            <TouchableOpacity 
              style={locationChip} 
              onPress={handleOpenLocationPicker}
              activeOpacity={0.7}
            >
              <Text style={locationChipText} numberOfLines={2}>
                {location.address || `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`}
              </Text>
              <TouchableOpacity
                style={removeLocationBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  setLocation(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={removeLocationBtnText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={locationBtn}
              onPress={handleOpenLocationPicker}
              activeOpacity={0.7}
            >
              <Text style={locationBtnText}>Seleccionar Ubicación</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={contactSection}>
          <Text style={reminderText}>👤 Responsable:</Text>
          {assignedContact ? (
            <View style={contactChip}>
              <View style={contactChipInfo}>
                <Text style={contactChipName}>{assignedContact.name}</Text>
                {assignedContact.phoneNumber && (
                  <Text style={contactChipPhone}>{assignedContact.phoneNumber}</Text>
                )}
              </View>
              <TouchableOpacity
                style={removeContactBtn}
                onPress={() => setAssignedContact(null)}
                activeOpacity={0.7}
              >
                <Text style={removeContactBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={contactSelectBtn}
              onPress={() => setShowContactPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={contactSelectBtnText}>Seleccionar Responsable</Text>
            </TouchableOpacity>
          )}
        </View>

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

      <ContactPickerModal
        visible={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        onSelect={(contact) => {
          setAssignedContact(contact);
          setShowContactPicker(false);
        }}
      />

      <LocationPickerModal
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        initialLocation={location}
        onSelect={(loc) => {
          setLocation(loc);
          setShowLocationPicker(false);
        }}
      />
    </KeyboardAvoidingView>
  );
};

import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute} from '@react-navigation/native';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateTaskAsync } from '../../store/taskSlice';
import { COLORS } from '../../constants/theme';
import { styles } from './style';

import { NavigationProp, TaskDetailRouteProp } from './types';

export const TaskDetailScreen = () => {
  const dispatch = useAppDispatch();
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId, fromTab } = route.params;

  const task = useAppSelector(s => s.tasks.items.find(t => t.id === taskId) ?? null);

  const { centerContainer, errorText, container, header, backButton, backButtonText, content, title, divider, description, infoBox, infoTitle, infoText, statusBox, statusTitle, completedStaticBox, statusIcon, completedStaticText, statusBtn, detailImage, mapContainer, map, locationAddress } = styles;

  const handleToggleComplete = () => {
    if (!task) return;
    
    const updatedTask = { ...task, completed: !task.completed };
    dispatch(updateTaskAsync(updatedTask));
  };

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

        {task.location && (
          <View style={infoBox}>
            <Text style={infoTitle}>📍 Ubicación:</Text>
            {task.location.address ? (
              <Text style={locationAddress}>{task.location.address}</Text>
            ) : null}
            <View style={mapContainer}>
              <MapView
                style={map}
                initialRegion={{
                  latitude: task.location.latitude,
                  longitude: task.location.longitude,
                  latitudeDelta: 0.00922,
                  longitudeDelta: 0.00421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: task.location.latitude,
                    longitude: task.location.longitude,
                  }}
                  title={task.title}
                  description={task.location.address || 'Ubicación'}
                />
              </MapView>
            </View>
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


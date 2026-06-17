import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert, Keyboard } from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from './style';
import { LocationPickerModalProps } from './types';
import { CustomButton } from '../CustomButton/CustomButton';
import { COLORS } from '../../constants/theme';

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  initialLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const {
    overlay, container, header, headerTitle, closeBtn, closeBtnText,
    searchRow, searchInput, searchBtn, searchBtnText, mapContainer, map,
    loadingContainer, footer, footerBtn,
  } = styles;

  const getCleanAddress = (addr: Location.LocationGeocodedAddress): string => {
    const streetInfo = addr.street
      ? `${addr.street}${addr.streetNumber ? ' ' + addr.streetNumber : ''}`
      : addr.name || '';
    return [streetInfo, addr.city, addr.region].filter(Boolean).join(', ');
  };

  const handleReverseGeocode = async (lat: number, lng: number) => {
    try {
      const addressResult = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (addressResult && addressResult.length > 0) {
        const addrText = getCleanAddress(addressResult[0]);
        setSelectedAddress(addrText);
        setSearchQuery(addrText);
      } else {
        setSelectedAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        setSearchQuery(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setSelectedAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      setSearchQuery(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    }
  };

  const initializeLocation = useCallback(async () => {
    setLoading(true);
    try {
      if (initialLocation) {
        const coords = { latitude: initialLocation.latitude, longitude: initialLocation.longitude };
        setMarkerCoords(coords);
        setSelectedAddress(initialLocation.address || '');
        setSearchQuery(initialLocation.address || '');
        setRegion({
          ...coords,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permiso denegado',
            'Se necesita acceso a la ubicación para centrar el mapa. Podés buscar ubicaciones escribiendo en la barra superior.'
          );
          // Default center (e.g. Buenos Aires, Argentina)
          const defaultCoords = { latitude: -34.6037, longitude: -58.3816 };
          setRegion({
            ...defaultCoords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setMarkerCoords(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
        await handleReverseGeocode(coords.latitude, coords.longitude);
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación actual del dispositivo.');
      // Default center fallback
      const defaultCoords = { latitude: -34.6037, longitude: -58.3816 };
      setRegion({
        ...defaultCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } finally {
      setLoading(false);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (visible) {
      initializeLocation();
    } else {
      setSearchQuery('');
      setMarkerCoords(null);
      setSelectedAddress('');
      setRegion(undefined);
    }
  }, [visible, initializeLocation]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        const coords = { latitude, longitude };
        setMarkerCoords(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
        await handleReverseGeocode(latitude, longitude);
      } else {
        Alert.alert('Sin resultados', 'No se encontró la dirección ingresada.');
      }
    } catch (error) {
      console.error('Error geocoding search:', error);
      Alert.alert('Error', 'Hubo un problema al buscar la dirección.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const coords = e.nativeEvent.coordinate;
    setMarkerCoords(coords);
    await handleReverseGeocode(coords.latitude, coords.longitude);
  };

  const handleConfirm = () => {
    if (!markerCoords) {
      Alert.alert('Ubicación requerida', 'Por favor seleccioná una ubicación en el mapa.');
      return;
    }
    onSelect({
      latitude: markerCoords.latitude,
      longitude: markerCoords.longitude,
      address: selectedAddress || searchQuery,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={overlay}>
        <View style={container}>
          <View style={header}>
            <Text style={headerTitle}>Seleccionar Ubicación</Text>
            <TouchableOpacity style={closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={searchRow}>
            <TextInput
              style={searchInput}
              placeholder="Buscar dirección (ej: Obelisco, BsAs)..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              autoCorrect={false}
              returnKeyType="search"
            />
            <TouchableOpacity style={searchBtn} onPress={handleSearch} activeOpacity={0.7}>
              <Text style={searchBtnText}>Buscar</Text>
            </TouchableOpacity>
          </View>

          <View style={mapContainer}>
            {region && (
              <MapView
                style={map}
                region={region}
                onRegionChangeComplete={(r) => setRegion(r)}
                onPress={handleMapPress}
              >
                {markerCoords && (
                  <Marker
                    coordinate={markerCoords}
                    title="Ubicación seleccionada"
                    description={selectedAddress}
                  />
                )}
              </MapView>
            )}
            {loading && (
              <View style={loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
              </View>
            )}
          </View>

          <View style={footer}>
            <CustomButton
              title="Cancelar"
              onPress={onClose}
              variant="outline"
              style={footerBtn}
            />
            <CustomButton
              title="Confirmar"
              onPress={handleConfirm}
              style={footerBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

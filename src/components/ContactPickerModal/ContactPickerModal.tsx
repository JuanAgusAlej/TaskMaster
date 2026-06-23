import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { styles } from './style';
import { ContactPickerModalProps } from './types';
import { AssignedContact } from '../../types';
import { COLORS } from '../../constants/theme';

interface ContactListItem {
  id: string;
  name: string;
  phoneNumber?: string;
}

export const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    overlay, container, header, headerTitle, closeBtn, closeBtnText,
    searchContainer, searchInput, listContainer, contactItem, contactAvatar,
    avatarText, contactInfo, contactName, contactPhone, emptyContainer,
    emptyText, loadingContainer,
  } = styles;

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Para asignar un responsable, necesitamos acceso a tus contactos. Podés habilitarlo desde la configuración del dispositivo.',
          [{ text: 'Entendido', onPress: onClose }]
        );
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });

      const mapped: ContactListItem[] = data
        .filter((c) => c.name)
        .map((c) => ({
          id: c.id ?? c.name ?? '',
          name: c.name ?? 'Sin nombre',
          phoneNumber: c.phoneNumbers?.[0]?.number,
        }));

      setContacts(mapped);
      setFilteredContacts(mapped);
    } catch (error) {
      console.error('Error al cargar contactos:', error);
      Alert.alert('Error', 'No se pudieron cargar los contactos.');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      loadContacts();
    } else {
      setContacts([]);
      setFilteredContacts([]);
    }
  }, [visible, loadContacts]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredContacts(
        contacts.filter((c) => c.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, contacts]);

  const handleSelect = (contact: ContactListItem) => {
    const assigned: AssignedContact = {
      id: contact.id,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
    };
    onSelect(assigned);
  };

  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const renderContactItem = ({ item }: { item: ContactListItem }) => (
    <TouchableOpacity style={contactItem} onPress={() => handleSelect(item)} activeOpacity={0.7}>
      <View style={contactAvatar}>
        <Text style={avatarText}>{getInitial(item.name)}</Text>
      </View>
      <View style={contactInfo}>
        <Text style={contactName}>{item.name}</Text>
        {item.phoneNumber && (
          <Text style={contactPhone}>{item.phoneNumber}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={overlay}>
        <View style={container}>
          <View style={header}>
            <Text style={headerTitle}>Seleccionar Responsable</Text>
            <TouchableOpacity style={closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={searchContainer}>
            <TextInput
              style={searchInput}
              placeholder="Buscar contacto..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
          </View>

          {loading ? (
            <View style={loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              contentContainerStyle={listContainer}
              ListEmptyComponent={
                <View style={emptyContainer}>
                  <Text style={emptyText}>
                    {searchQuery ? 'No se encontraron contactos' : 'No hay contactos disponibles'}
                  </Text>
                </View>
              }
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

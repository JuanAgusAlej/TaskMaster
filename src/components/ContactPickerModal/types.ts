import { AssignedContact } from '../../types';

export interface ContactPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (contact: AssignedContact) => void;
}

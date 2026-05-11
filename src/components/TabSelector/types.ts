export interface TabSelectorProps {
  activeTab: 'in_progress' | 'completed';
  onTabChange: (tab: 'in_progress' | 'completed') => void;
}

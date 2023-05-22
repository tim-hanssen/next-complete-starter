import { useContext } from 'react';
import { PopupContext } from '@/context/popup-context';

export default function usePopup() {
  const context = useContext(PopupContext);

  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }

  return context;
}

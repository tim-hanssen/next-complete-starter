import React from 'react';
import DefaultPopup from '@/components/default-popup';

const PopupContext = React.createContext();

function PopupProvider({ children }) {
  const [popup, setPopup] = React.useState(false);

  const openPopup = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  };

  const togglePopup = () => {
    setPopup(!popup);
  };

  return (
    <PopupContext.Provider
      value={{ popup, openPopup, closePopup, togglePopup }}
    >
      {children}
      {popup && <DefaultPopup onClose={closePopup} />}
    </PopupContext.Provider>
  );
}

export { PopupProvider, PopupContext };

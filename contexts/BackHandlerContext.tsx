import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

interface BackHandlerContextType {
  backPressCount: number;
  setBackPressCount: (count: number) => void;
}

const BackHandlerContext = createContext<BackHandlerContextType | undefined>(undefined);

export const useBackHandler = () => {
  const context = useContext(BackHandlerContext);
  if (!context) {
    throw new Error('useBackHandler must be used within BackHandlerProvider');
  }
  return context;
};

interface BackHandlerProviderProps {
  children: ReactNode;
}

export const BackHandlerProvider: React.FC<BackHandlerProviderProps> = ({ children }) => {
  const [backPressCount, setBackPressCount] = useState(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressCount === 0) {
        // Primera presión: mostrar mensaje y aumentar contador
        setBackPressCount(1);
        
        // Resetear el contador después de 2 segundos
        setTimeout(() => {
          setBackPressCount(0);
        }, 2000);
        
        return true; // Prevenir comportamiento por defecto
      } else if (backPressCount === 1) {
        // Segunda presión: salir de la app
        BackHandler.exitApp();
        return true;
      }
      
      return true;
    });

    return () => backHandler.remove();
  }, [backPressCount]);

  return (
    <BackHandlerContext.Provider value={{ backPressCount, setBackPressCount }}>
      {children}
    </BackHandlerContext.Provider>
  );
};

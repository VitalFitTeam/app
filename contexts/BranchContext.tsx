import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

/* --------------------------------------------------------------------------
   INTERFACES
   -------------------------------------------------------------------------- */
export interface Branch {
  branch_id: string; // Ajustado a branch_id según convención del SDK
  name: string;
  address?: string;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  selectedBranchId: string | null;
  isLoading: boolean;
  error: string | null;
  selectBranch: (branchId: string) => Promise<void>;
  refreshBranches: () => Promise<void>;
}

/* --------------------------------------------------------------------------
   CONTEXTO
   -------------------------------------------------------------------------- */
const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch debe ser usado dentro de un BranchProvider');
  }
  return context;
};

/* --------------------------------------------------------------------------
   PROVIDER
   -------------------------------------------------------------------------- */
interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider: React.FC<BranchProviderProps> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar sucursales y recuperar selección guardada
  const loadBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return; // No hay token, no podemos cargar
      }

      // 1. Obtener sucursales desde la API
      // Usando endpoint público que no requiere permisos especiales
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await vitalFitApi.public.getBranchMap(token);
      
      console.log('🔍 [BranchContext] Respuesta completa de getBranchMap:', JSON.stringify(response, null, 2));
      
      // Ajustar según la estructura de respuesta real. Asumimos data o data.data
      const branchList: Branch[] = Array.isArray(response) ? response : (response.data || []);

      console.log('🔍 [BranchContext] Lista de sucursales procesada:', branchList);
      console.log('🔍 [BranchContext] Cantidad de sucursales:', branchList.length);

      setBranches(branchList);

      // 2. Recuperar selección previa
      const savedBranchId = await AsyncStorage.getItem('selected_branch_id');

      if (savedBranchId && branchList.some(b => b.branch_id === savedBranchId)) {
        setSelectedBranchId(savedBranchId);
        console.log('✅ [BranchContext] Sucursal guardada restaurada:', savedBranchId);
      } else if (branchList.length > 0) {
        // Seleccionar la primera por defecto si no hay guardada o no existe
        const firstBranchId = branchList[0].branch_id;
        setSelectedBranchId(firstBranchId);
        await AsyncStorage.setItem('selected_branch_id', firstBranchId);
        console.log('✅ [BranchContext] Primera sucursal seleccionada por defecto:', firstBranchId);
      } else {
        console.warn('⚠️ [BranchContext] No hay sucursales disponibles');
      }

    } catch (err: unknown) {
      console.error('Error cargando sucursales:', err);
      if (isAPIError(err)) {
        setError(err.message || 'Error al obtener sucursales');
      } else {
        setError('Error de conexión o inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  // Función para seleccionar sucursal manualmente
  const selectBranch = async (branchId: string) => {
    const branchExists = branches.find(b => b.branch_id === branchId);
    if (branchExists) {
      setSelectedBranchId(branchId);
      await AsyncStorage.setItem('selected_branch_id', branchId);
    }
  };

  // Valor computado de la sucursal actual
  const selectedBranch = branches.find(b => b.branch_id === selectedBranchId) || null;

  const value = {
    branches,
    selectedBranch,
    selectedBranchId,
    isLoading,
    error,
    selectBranch,
    refreshBranches: loadBranches
  };

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
};

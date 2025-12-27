import { ThemedText } from '@/components/themed-text';
import { useBranch } from '@/contexts/BranchContext';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { BuildingStorefrontIcon, CheckIcon, ChevronDownIcon, XMarkIcon } from 'react-native-heroicons/outline';

export function BranchSelector() {
  const { branches, selectedBranch, selectBranch, isLoading } = useBranch();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = async (branchId: string) => {
    await selectBranch(branchId);
    setModalVisible(false);
  };

  if (isLoading && branches.length === 0) {
    return (
      <View className="flex-row items-center px-4 py-2 bg-neutral-100 rounded-full">
        <ActivityIndicator size="small" color="#F27F2A" />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center bg-white border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm"
        style={{ elevation: 2 }}
      >
        <BuildingStorefrontIcon size={16} color="#F27F2A" />
        <ThemedText className="mx-2 text-sm font-semibold text-neutral-800">
          {selectedBranch ? selectedBranch.name : 'Seleccionar sede'}
        </ThemedText>
        <ChevronDownIcon size={14} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={20} className="flex-1 justify-center items-center bg-black/30">
          <View className="w-11/12 max-w-sm bg-white rounded-2xl p-4 shadow-xl overflow-hidden">
            <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-neutral-100">
              <ThemedText className="text-lg font-bold text-neutral-900">
                Selecciona tu sede
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 bg-neutral-100 rounded-full">
                <XMarkIcon size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={branches}
              keyExtractor={(item) => item.branch_id}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => {
                const isSelected = selectedBranch?.branch_id === item.branch_id;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item.branch_id)}
                    className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${
                      isSelected 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-white border-neutral-100'
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                        isSelected ? 'bg-orange-100' : 'bg-neutral-100'
                      }`}>
                         <BuildingStorefrontIcon size={16} color={isSelected ? '#F27F2A' : '#6B7280'} />
                      </View>
                      <View className="flex-1">
                         <ThemedText className={`font-semibold ${isSelected ? 'text-orange-700' : 'text-neutral-800'}`}>
                           {item.name}
                         </ThemedText>
                         {item.address && (
                           <ThemedText className="text-xs text-neutral-500" numberOfLines={1}>
                             {item.address}
                           </ThemedText>
                         )}
                      </View>
                    </View>
                    {isSelected && <CheckIcon size={20} color="#F27F2A" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

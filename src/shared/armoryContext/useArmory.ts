import { useContext } from 'react';
import { ArmoryContext } from './ArmoryContext';

export const useArmory = () => {
  const context = useContext(ArmoryContext);
  if (!context) throw new Error(`useArmory Requires ArmoryProvider`);
  return context;
};


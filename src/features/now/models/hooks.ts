import { useStore } from 'effector-react';
import { $now } from './store';

export const useNow = () => useStore($now);

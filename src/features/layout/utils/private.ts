import { createHistoryContext } from 'features/history-manager';

export interface ModalData {
  id: string;
  params?: object;
}

export const ModalHistoryContext = createHistoryContext<ModalData>();

import { ReactNode } from 'react';
import { createValueContext } from 'features/context-manager';

export const ModalValueContext = createValueContext<ReactNode>();
export const PopoutValueContext = createValueContext<ReactNode>();
export const SnackbarValueContext = createValueContext<ReactNode>();

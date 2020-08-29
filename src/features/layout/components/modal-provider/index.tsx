import React, { FC } from 'react';
import { HistoryProvider } from 'features/history-manager';
import { ModalData, ModalHistoryContext } from '../../utils/private';

interface Props {
  onClose: () => void;
}

type ModalProps = Props & ModalData;

export const ModalProvider: FC<ModalProps> = ({
  id,
  params,
  onClose,
  children,
}) => (
  <HistoryProvider
    onClose={onClose}
    ctx={ModalHistoryContext}
    initial={{ id, params: params }}
  >
    {children}
  </HistoryProvider>
);

type ModalHocProps<P> = Omit<P, keyof ModalProps> & ModalProps;

export const modal: <P>(Component: FC<P>) => FC<ModalHocProps<P>> = (
  Component
) => ({ id, params, onClose, ...props }) => (
  <ModalProvider onClose={onClose} id={id} params={params}>
    <Component {...(props as any)} />
  </ModalProvider>
);

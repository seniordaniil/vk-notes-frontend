import { ApolloClient, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from 'lib/apollo';
import { initParams } from 'features/router';
import axios from 'axios';

export const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_API}`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          notes: offsetLimitPagination(['folderId']),
          folders: offsetLimitPagination(),
          members: offsetLimitPagination(['id']),
        },
      },
      FolderRelDto: {
        keyFields: ['folderId', 'userId'],
      },
      NoteDto: {
        fields: {
          title: {
            keyArgs: [],
          },
        },
      },
    },
  }),
  headers: {
    Auth:
      process.env.NODE_ENV !== 'production' && process.env.REACT_APP_TOKEN
        ? process.env.REACT_APP_TOKEN
        : initParams,
  },
  connectToDevTools: process.env.NODE_ENV !== 'production',
});

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BASE_URL: string;
    readonly REACT_APP_API: string;
    readonly REACT_APP_ID: string;
    readonly REACT_APP_GROUP_ID: string;
    readonly REACT_APP_ALBUM: string;
    readonly REACT_APP_TOKEN: string;
    readonly REACT_APP_GID: string;
  }
}

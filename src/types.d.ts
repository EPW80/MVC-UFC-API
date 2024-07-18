// src/types.d.ts
export {};

declare global {
  interface Window {
    api: {
      send: (channel: string, data: any) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
      on: (channel: string, func: (...args: any[]) => void) => void;
      getJsonData: () => Promise<any>;
      getFighterData: (url: string) => Promise<any>; // Add the getFighterData method
      getEventData: (url: string) => Promise<any>; // Add the getEventData method
    };
  }
}

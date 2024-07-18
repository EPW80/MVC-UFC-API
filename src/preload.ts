import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, data: any) => ipcRenderer.send(channel, data),
  invoke: (channel: string, data?: any) => ipcRenderer.invoke(channel, data),
  on: (channel: string, func: (...args: any[]) => void) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  getJsonData: async () => ipcRenderer.invoke("get-json-data"),
  getFighterData: async (url: string) => ipcRenderer.invoke("get-fighter-data", url),
  getEventData: async (url: string) => ipcRenderer.invoke("get-event-data", url), // Ensure this method is exposed
});

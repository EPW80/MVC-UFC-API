import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { FighterModel } from "./models/FighterModel";
import { EventModel } from "./models/EventModel";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Use preload script if needed
      contextIsolation: true, // Recommended for security
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("closed", () => {
    app.quit();
  });

  // Handle IPC request to get fighter data
  ipcMain.handle("get-fighter-data", async (event, url) => {
    const fighter = await FighterModel.parseSherdogFighter(url);
    return fighter;
  });

  // Handle IPC request to get event data
  ipcMain.handle("get-event-data", async (event, url) => {
    const eventData = await EventModel.parseEvent(url);
    return eventData;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

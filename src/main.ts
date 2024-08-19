import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { FighterModel } from "./models/FighterModel";
import { EventModel } from "./models/EventModel";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000, // Increased width for better display
    height: 700,
    minWidth: 800, // Set a minimum width
    minHeight: 600, // Set a minimum height
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("closed", () => {
    app.quit();
  });

  // Open dev tools by default in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // Handle IPC request to get fighter data
  ipcMain.handle("get-fighter-data", async (event, url) => {
    try {
      const fighter = await FighterModel.parseSherdogFighter(url);
      return fighter;
    } catch (error) {
      console.error("Failed to fetch fighter data:", error);
      return { error: "Failed to fetch fighter data" };
    }
  });

  // Handle IPC request to get event data
  ipcMain.handle("get-event-data", async (event, url) => {
    try {
      const eventData = await EventModel.parseEvent(url);
      return eventData;
    } catch (error) {
      console.error("Failed to fetch event data:", error);
      return { error: "Failed to fetch event data" };
    }
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

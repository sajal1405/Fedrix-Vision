const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: "#000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const baseUrl = process.env.DESKTOP_BASE_URL || "http://localhost:3000";

  const dashboardRoutes = {
    main: `${baseUrl}/dashboard`,
    kanban: `${baseUrl}/dashboard/kanban`,
    calendar: `${baseUrl}/dashboard/calendar`,
    blog: `${baseUrl}/dashboard/blog`,
    agent: `${baseUrl}/dashboard/agent`,
    users: `${baseUrl}/dashboard/users`,
    profile: `${baseUrl}/dashboard/profile`,
    settings: `${baseUrl}/dashboard/settings`,
  };

  // Load the main dashboard route by default
  mainWindow.loadURL(dashboardRoutes.main);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

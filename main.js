const { app, Menu, Tray, dialog, globalShortcut } = require("electron");
const path = require("path");
const GestureService = require("./GestureService");

let service, tray;
const trayUrls = [
    path.join(__dirname, "./assets/images/app.ico"),
    path.join(__dirname, "./assets/images/app-gray.ico"),
];
let trayUrl = trayUrls[0];
const menuTemplate = [
    {
        id: "toggle",
        label: "暂停",
        click: () => app.toggle(),
    },
    {
        label: "退出",
        click: () => app.quit(),
    },
];
app.toggle = () => {
    if (!service || !tray) {
        return console.error("服务未启动");
    }

    if (app.isActive) {
        service.pause();
        menuTemplate[0].label = "激活";
        trayUrl = trayUrls[1];
        app.isActive = false;
    } else {
        service.active();
        menuTemplate[0].label = "暂停";
        trayUrl = trayUrls[0];
        app.isActive = true;
    }
    tray.setImage(trayUrl);
    tray.setContextMenu(Menu.buildFromTemplate(menuTemplate));
};

app.on("ready", () => {
    service = new GestureService();
    tray = new Tray(trayUrl);

    tray.setToolTip("PointGesture");
    tray.setContextMenu(Menu.buildFromTemplate(menuTemplate));
    service.start();
    globalShortcut.register("Shift+Alt+P", function () {
        app.toggle();
    });

    app.isActive = true;
});

app.on("will-quit", () => {
    service.stop();
    globalShortcut.unregisterAll();
});

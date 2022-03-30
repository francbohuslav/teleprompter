import express = require("express");
import cors from "cors";
import { CachedFs } from "dropbox-fs";
import { Response } from "express-serve-static-core";
import fs from "fs";
import http from "http";
import { Container } from "injector";
import { Server } from "socket.io";
import { IBaseResponse } from "../common/ajax-interfaces";
import { ClientToServerEvents, IPersistanceSettings, ServerToClientEvents } from "../common/isocket";
import { delay } from "../common/utils";
import { IMiddleWare, IServerAction, IServerMethod, IServerMethodOptions } from "./iserver";
import { ProjectConfigurer } from "./project-config";
const json = require("body-parser").json;
import path = require("path");

const distFolder = "/../../../dist";
const container = new Container();
const cachedFs = new CachedFs(null, "/userdata", path.join(__dirname, "../../../userdata"));
container.bindValue("cachedFs", cachedFs);

const projectConfigurer = container.resolveClass(ProjectConfigurer);

const app = express();
app.use(cors());
app.use(json());

function sendError(res: Response, ex: any) {
    console.log(ex);
    res.status(400);
    const errorStructure: any = {
        message: ex.message,
        statusText: ex.response?.statusText,
        stack: ex.response?.data || ex.stack,
    };
    res.send(JSON.stringify(errorStructure, null, 2));
}

const methods: IServerMethod[] = [m("get", "/server/get-text", (_req, _res) => cachedFs.readFile("text.txt"))];

const processRequest = (method: IServerAction, _options: IServerMethodOptions) => async (req: express.Request, res: express.Response) => {
    try {
        const dataResult = await method(req, res);
        const result: IBaseResponse<unknown> = {
            data: dataResult,
        };
        const outputData = JSON.stringify(result, null, 2);
        if (res.headersSent) {
            res.end(outputData);
        } else {
            res.send(outputData);
        }
    } catch (ex) {
        sendError(res, ex);
    }
};

methods.forEach((method) => {
    const postOrGet = (app as any)[method.method].bind(app);
    if (method.authorization) {
        postOrGet(method.path, method.authorization, processRequest(method.action, method.options));
    } else {
        postOrGet(method.path, processRequest(method.action, method.options));
    }
});

app.get("/page/*", async (req, res) => {
    try {
        const content = fs.readFileSync(path.join(__dirname, `${distFolder}/web/index.html`), { encoding: "utf-8" });
        res.send(content);
    } catch (ex) {
        sendError(res, ex);
    }
});

app.use(express.static(__dirname + `${distFolder}/web`));
const port = process.env.PORT || 83;
const httpServer = http.createServer(app);

httpServer.listen(port, () => {
    console.log("HTTP Server running on port " + port);
});

(async () => {
    let projectConfig = await projectConfigurer.getProjectConfig();
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
    io.on("connection", async (socket) => {
        console.log("a user connected");
        await delay(1000);
        console.log("setSettings", projectConfig.settings);
        socket.emit("setSettings", projectConfig.settings);

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("setSettings", (settings: IPersistanceSettings) => {
            console.log("setSettings", settings);
            socket.broadcast.emit("setSettings", settings);
            projectConfig = { ...projectConfig, settings };
            projectConfigurer.setProjectConfig(projectConfig);
        });
        socket.on("shiftMargin", (amount: number) => {
            console.log("shiftMargin", amount);
            socket.broadcast.emit("shiftMargin", amount);
        });
        socket.on("error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });
})();

function m(method: string, path: string, action: IServerAction, authorization?: IMiddleWare, options?: IServerMethodOptions): IServerMethod {
    return {
        action,
        method,
        path,
        authorization,
        options: options || {},
    };
}

import express = require("express");

export type IServerAction = (req: express.Request, res: express.Response) => any;
export type IMiddleWare = (req: Request, res: Response, next: () => void) => void;

export interface IServerMethodOptions {
    formatOutput?: boolean;
}

export interface IServerMethod {
    method: string;
    path: string;
    action: IServerAction;
    authorization: IMiddleWare;
    options: IServerMethodOptions;
}

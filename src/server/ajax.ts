import { IBaseResponse } from "../common/ajax-interfaces";

export class Ajax {
    constructor() {}

    public async post<T>(url: string, data = {}, throwException: boolean = false): Promise<IBaseResponse<T>> {
        const response = await fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await this.processResult<T>(response, throwException);
    }

    public async postFormData<T>(url: string, formData: FormData): Promise<IBaseResponse<T>> {
        return new Promise((resolve) => {
            const request = new XMLHttpRequest();
            request.open("POST", url);
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    resolve(request.response);
                }
            };
            request.send(formData);
        });
    }

    public async get<T>(url: string): Promise<IBaseResponse<T>> {
        const response = await fetch(url, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await this.processResult<T>(response, false);
    }

    private async processResult<T>(response: Response, throwException: boolean): Promise<IBaseResponse<T>> {
        const text = await response.text();
        const json: IBaseResponse<T> = JSON.parse(text);
        json.isOk = response.ok;
        if (!json.isOk) {
            if (throwException) {
                throw json;
            }
        }
        return json;
    }
}

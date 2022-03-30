export interface IBaseResponse<T> {
    message?: string;
    stack?: string;
    statusText?: string;
    /**
     * Is set in ajax
     */
    isOk?: boolean;
    data: T;
}

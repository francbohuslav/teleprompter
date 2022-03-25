export function delay(timeout: number) {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(null);
        }, timeout);
    });
}

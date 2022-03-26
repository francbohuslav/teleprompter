export interface ServerToClientEvents {
    shiftMargin: (amount: number) => void;
    setSettings: (size: IPersistanceSettings) => void;
}

export interface ClientToServerEvents {
    shiftMargin: (amount: number) => void;
    setSettings: (size: IPersistanceSettings) => void;
}

export interface IPersistanceSettings {
    speed: number;
    fontSize: number;
    paused: boolean;
    size: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
}

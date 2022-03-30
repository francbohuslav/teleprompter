import { LinearProgress, Slider, Typography } from "@mui/material";
import { styled } from "@mui/system";
import NoSleep from "nosleep.js";
import * as React from "react";
import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, IPersistanceSettings, ServerToClientEvents } from "../../common/isocket";
import { Ajax } from "../../server/ajax";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const noSleep = new NoSleep();

document.addEventListener(
    "click",
    function enableNoSleep() {
        document.removeEventListener("click", enableNoSleep, false);
        noSleep.enable();
    },
    false
);

const MainBlock = styled("div")({
    position: "absolute",
    backgroundColor: "black",
    color: "white",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
});

const Container = styled("div")({
    position: "absolute",
    left: "40vw",
    right: "40vw",
    top: "40vh",
    bottom: "40vh",
    border: "1px solid #333",
    padding: "5px",
    overflow: "hidden",
    wordBreak: "break-word",
    background: "black",
});

const TextBlock = styled("div")({ fontFamily: "Tahoma", transition: "margin-top 1s", transitionTimingFunction: "linear", transform: "scale(-1,1)" });
const ajax = new Ajax();

export const Screen = () => {
    let timer: NodeJS.Timeout = null;
    const [text, setText] = useState<string>(null);
    const [marginTop, setMarginTop] = useState(100); //25vh dopocitat
    const [settings, setSettings] = useState<IPersistanceSettings>(null);
    const textBlockRef = React.useRef();

    React.useEffect(() => {
        if (!text) {
            loadText();
        }
        socket.on("setSettings", setSettings);
        socket.on("shiftMargin", (amount) => {
            setMarginTop((marginTop) => marginTop + amount);
        });
        return () => {
            clearTimeout(timer);
            socket.off("setSettings");
            socket.off("shiftMargin");
        };
    });

    let isEnd = false;
    let percents = 0;
    if (textBlockRef.current) {
        const height = (textBlockRef.current as HTMLDivElement).clientHeight;
        percents = Math.max(0, Math.min(100, (-marginTop / height) * 100));
        if (height + marginTop < 0) {
            isEnd = true;
        }
    }
    if (!isEnd && settings?.speed && !settings?.paused) {
        timer = setTimeout(() => {
            setMarginTop(marginTop - settings.speed);
        }, 300);
    }

    const loadText = async () => {
        const res = await ajax.get<string>("/server/get-text");
        if (res.isOk) {
            setText(res.data);
        } else {
            throw res.message;
        }
    };

    const emitSettings = (settingsPart: Partial<IPersistanceSettings>) => {
        const newSettings = { ...settings, ...settingsPart };
        socket.emit("setSettings", newSettings);
        setSettings(newSettings);
    };

    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        if (e.shiftKey) {
            const amount = e.deltaY > 0 ? -10 : 10;
            setMarginTop(marginTop + amount);
            socket.emit("shiftMargin", amount);
        } else if (settings.speed) {
            const coef = e.deltaY > 0 ? 1.1 : 1 / 1.1;
            const newSpeed = Math.round(Math.max(0, Math.min(10, settings.speed * coef)) * 100) / 100;
            if (newSpeed != settings.speed) {
                emitSettings({ speed: newSpeed });
            }
        }
    };

    const onHorizontalSize = (_e: Event, value: any, _thump: number) => {
        const newSize = {
            ...settings.size,
            left: value[0],
            right: value[1],
        };
        emitSettings({ size: newSize });
    };

    const onVerticalSize = (_e: Event, value: any, _thump: number) => {
        const newSize = {
            ...settings.size,
            bottom: value[0],
            top: value[1],
        };
        emitSettings({ size: newSize });
    };

    const onFontSize = (_e: Event, value: any, _thump: number) => {
        emitSettings({ fontSize: value });
    };

    const onKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === " ") {
            emitSettings({ paused: !settings.paused });
        }
    };

    return settings ? (
        <MainBlock tabIndex={0} onWheel={onWheel} onKeyUp={onKeyUp}>
            <Slider sx={{ margin: "0px 2vw 0", width: "96vw" }} value={[settings.size.left, settings.size.right]} onChange={onHorizontalSize} />
            <Slider
                orientation="vertical"
                sx={{ position: "absolute", right: "0px", top: "2vh", height: "96vh" }}
                value={[settings.size.bottom, settings.size.top]}
                onChange={onVerticalSize}
            />
            <Typography sx={{ position: "absolute", bottom: "5px", left: "5px", width: "90vw" }}>
                Speed: {settings.speed.toFixed(1)}
                <br />
                Margin top: {Math.round(marginTop)}
                <br />
                noSleep: {noSleep.isEnabled ? "ON" : "off"}
                <br />
                Font size:{" "}
                <Slider size="small" sx={{ width: "90px" }} max={60} min={5} value={settings.fontSize} onChange={onFontSize} valueLabelDisplay="auto" />{" "}
                {settings.fontSize}
                <br />
                SPACE: pause
                <br />
                Wheel changes speed
                <br />
                SHIFT + sheel scrolls text,
            </Typography>
            <Container
                sx={{
                    top: 100 - settings.size.top + "vh",
                    left: settings.size.left + "vw",
                    right: 100 - settings.size.right + "vw",
                    bottom: settings.size.bottom + "vh",
                }}
            >
                <TextBlock
                    ref={textBlockRef}
                    sx={{
                        marginTop: Math.round(marginTop) + "px",
                        fontSize: settings.fontSize + "px",
                    }}
                >
                    {text.split("\n").map((line, i) => (
                        <div key={i} style={{ borderBottom: "1px solid gray" }}>
                            {line}
                        </div>
                    ))}
                </TextBlock>
                <LinearProgress sx={{ position: "absolute", left: 0, right: 0, top: 0, height: 3 }} value={percents} variant="determinate" />
            </Container>
        </MainBlock>
    ) : (
        <div></div>
    );
};

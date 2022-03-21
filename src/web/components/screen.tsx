import { styled } from "@mui/system";
import * as React from "react";
import { useState } from "react";

const MainBlock = styled("div")({
    position: "absolute",
    backgroundColor: "black",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
});

const Container = styled("div")({
    position: "absolute",
    left: "25vw",
    right: "25vw",
    top: "25vh",
    bottom: "25vh",
    border: "1px solid #333",
    padding: "5px",
    overflow: "hidden",
});

const TextBlock = styled("div")({
    fontFamily: "Tahoma",
    color: "white",
    fontSize: "20px",
    transition: "margin-top 1s",
    transitionTimingFunction: "linear",
});

export const Screen = () => {
    const [marginTop, setMarginTop] = useState(0);
    const textBlockRef = React.useRef();

    let isEnd = false;
    if (textBlockRef.current) {
        const height = (textBlockRef.current as HTMLDivElement).clientHeight;
        if (height + marginTop < 0) {
            isEnd = true;
        }
    }
    if (!isEnd) {
        setTimeout(() => {
            setMarginTop(marginTop - 20);
        }, 1000);
    }
    return (
        <MainBlock>
            <Container>
                <TextBlock
                    ref={textBlockRef}
                    sx={{
                        marginTop: marginTop + "px",
                    }}
                >
                    {"text  fsd fs fasdfsdfs f sdf sdff ".repeat(50)}
                </TextBlock>
            </Container>
        </MainBlock>
    );
};

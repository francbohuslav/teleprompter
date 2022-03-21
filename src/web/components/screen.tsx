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
    border: "1px solid gray",
    overflow: "hidden",
});

const TextBlock = styled("div")({
    fontFamily: "Tahoma",
    color: "white",
    fontSize: "20px",
});

export const Screen = () => {
    const [marginTop, setMarginTop] = useState(0);
    setTimeout(() => {
        setMarginTop(marginTop - 1);
    }, 100);
    return (
        <MainBlock>
            <Container>
                <TextBlock
                    sx={{
                        marginTop: marginTop + "px",
                    }}
                >
                    {"text  fsd fs fasdfsdfs f sdf sdff ".repeat(100)}
                </TextBlock>
            </Container>
        </MainBlock>
    );
};

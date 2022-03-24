import { LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";
import * as React from "react";
import { useState } from "react";

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
});

const TextBlock = styled("div")({ fontFamily: "Tahoma", transition: "margin-top 1s", transitionTimingFunction: "linear" });

let timer = null;
export const Screen = () => {
    const [marginTop, setMarginTop] = useState(100); //25vh dopocitat
    const [speed, setSpeed] = useState(4);
    const textBlockRef = React.useRef();

    let isEnd = false;
    let percents = 0;
    if (textBlockRef.current) {
        const height = (textBlockRef.current as HTMLDivElement).clientHeight;
        percents = Math.max(0, Math.min(100, (-marginTop / height) * 100));
        if (height + marginTop < 0) {
            isEnd = true;
        }
    }
    if (!isEnd) {
        timer = setTimeout(() => {
            setMarginTop(marginTop - speed);
        }, 300);
    }

    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        if (e.shiftKey) {
            clearTimeout(timer);
            setMarginTop(marginTop + (e.deltaY > 0 ? -10 : 10));
        } else {
            const coef = e.deltaY > 0 ? 1.1 : 1 / 1.1;
            const newSpeed = Math.max(0, Math.min(10, speed * coef));
            if (newSpeed != speed) {
                clearTimeout(timer);
                setSpeed(newSpeed);
            }
        }
    };

    return (
        <MainBlock onWheel={onWheel}>
            <Typography>
                Speed: {speed.toFixed(1)}
                <br />
                Margin top: {Math.round(marginTop)}
                <br />
                Percents: {percents.toFixed(0)}
                <br />
                Wheel changes speed
                <br />
                SHIFT + sheel scrolls text
            </Typography>
            <Container>
                <TextBlock
                    ref={textBlockRef}
                    sx={{
                        marginTop: Math.round(marginTop) + "px",
                    }}
                >
                    Ahoj hubenouri, doufam ze se vam dari a uspesne se blizite k cilove postave. Mame uz brezen a moc mesicu nam do leta nezbyva. Ale i za ty
                    tri zbyvajici mesice se da jeste lecos stihnout. Tak hlavne odolat pokuseni, byt disciplinovany a drzet se pravidel. S tim ja mam prave
                    trochu problem, zvlast ted v zaveru. Teda aspoň doufám, že jsem už v závěru. Reknete ze jsem v závěru, řekněte to prosím `bulet`. Zasekl
                    jsem se tesne nad 80kily a moc se tomu nechce dolu. Mozna to je tim, ze vice resim cviceni, a tak doufam, ze to je nabiranim svalove hmoty.
                    Centimetry v pase by ale vlastne meli klesat dal a ty se tak loudajiiiii. No jo no, usnul jsem na vavrinech, trochu `citit se urazene`. Je
                    to rok, co jsem zacal a jde to tak jednoduse. Hubnouci pravidla, ktera na tomto kanale prezenuji, jsem si na sobe overil, osvojil a kdyz ma
                    clovek motivaci a disciplinu, tak to jde samo. Staci dodrzovat pravidla, zbytecne nebloudit do zakazanych mist spajsky, necistit si zuby
                    majonezou a funguje to. No a prave disciplina je muj nejvetsi problem. Sladke je moje achilova pata. Idealni je nekupovat zaporacke
                    potraviny vubec a domu je nenosit. Ale to se lehko rekne, kdyz nebydlite sami a sladke nastrahy cihaji v kazem koute (zvlášť když si je tam
                    sami před tím dáte s`edive)` . Ale já na to přišel. Koupim si krabici, do ni zamknu všechny sladkosti a klic hodim putinoj do trenek. Kdyz
                    se k sladkému nedostanu, nemohu sejít z cesty. NEchci ale v tomhle videu mluvit o motivaci, to jsem uz lehce nastinil ve videu “7 důvodů,
                    proč nehubnes” `dodat jako kkartu youtube.` Dnes zminim jen cast toho co mi pomaha a to je zaobirat se hubnutim nebo cvicenim pokud mozno
                    denne, sbirat informace, sledovat pokroky uspesnejsich lidi, ktery to uz zvladli. JE asi na mne videt, ze se mi to dostalo pod kuzi a ze tim
                    ziju, (a otravuju tim i ostatni na yotube `sedive`). Stane se z toho vlastne zivotni styl. Ale u mne je to fakt potreba. Cim vice se
                    nejakemu tematu venuju, tim vice se snazim naplnit pozadovane cile. Informaci o hubnuti a cviceni je na internetu tuna a problemem neni je
                    najit, ale vzit si z toho jen ty spravne. Ty co jsou pravdive, prokazane studiemi. Bohuzel i v dnesni vedecky pokrocile dobe jeste nevime
                    vse o lidskem tele, nechapeme vsechny reakce tela na ruzne podnety a taky nejsme vsichni stejni. A tak na internetu najdete spoustu ruznych
                    nazoru a musite si spravne vybrat cemu z toho verit. Bohuzel v hubnuti existuje spoustu mytu a dezinformaci, ktere se jsou tak moc
                    rozsirene, ze tomu lidi stale veri. Jako ze pri hubnuti je dulezite nejist sladke, nejist po 6 hodine, ze snidane je nejdulezitejsi jidlo
                    dne nebo ze piti napoju s umelymi sladily zpusobuje rakovinu.
                </TextBlock>
                <LinearProgress sx={{ position: "absolute", left: 0, right: 0, top: 0, height: 3 }} value={percents} variant="determinate" />
            </Container>
        </MainBlock>
    );
};

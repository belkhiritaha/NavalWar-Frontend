import { useState } from "react";
import { hoverModes } from "./Player.js";

import ListGroup from 'react-bootstrap/ListGroup';

function HUD(props) {
    const [isShown, setIsShown] = useState(true);

    function Crosshair() {
        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "20px",
                    height: "20px",
                    border: "1px solid white",
                    borderRadius: "50%",
                    transition: "opacity 0.2s",
                    color: "white",
                    zIndex: 1000
                }}
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
            />
        );
    }

    function ShipsMenu(props) {
        return (
            <ListGroup as="ul" style={{zIndex: 1000, position: "absolute", top: "50%", left: "0%", transform: "translate(0%, -50%)", color:"white"}}>
                {Object.keys(hoverModes).map((mode, index) => {
                    if (index > 0 && props.ships[index - 1]){
                        const ship = props.ships[index - 1];
                        let bgColor = props.hoverMode === index ? "lightblue" : "transparent";
                        bgColor = ship.isSetup ? "#FFCCCB" : bgColor;
                        const color = ship.isSetup ? "red" : "lightgreen";
                        return (
                            <ListGroup.Item as="li" key={index} style={{backgroundColor: bgColor, color: color}}>{mode}</ListGroup.Item>
                        );}})}
            </ListGroup>
        );
    }

    return (
        <>
            <Crosshair />
            <ShipsMenu hoverMode={props.hoverMode} ships={props.ships} />
        </>
    );

}

export default HUD;
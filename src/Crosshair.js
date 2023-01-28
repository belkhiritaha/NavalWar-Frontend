import { useState } from "react";

function Crosshair() {
    const [isShown, setIsShown] = useState(true);

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

export default Crosshair;
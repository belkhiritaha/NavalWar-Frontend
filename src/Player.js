import Camera from './Camera.js';

function Player(props){
    const player = {movementFunction: playerMovement};

    props.camera.position.z = 5;


    function playerMovement() {
        var input = document.addEventListener("keydown", function (event) {
            console.log(event.keyCode);
            if (event.keyCode == 81) {
              props.camera.position.y -= 0.1;
            }
            if (event.keyCode == 83) {
              props.camera.position.x += 0.1;
            }
            if (event.keyCode == 90) {
              props.camera.position.x -= 0.1;
            }
            if (event.keyCode == 68) {
              props.camera.position.y += 0.1;
            }
          });
    }

    return player;
}

export default Player;
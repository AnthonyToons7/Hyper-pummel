let haveEvents = 'GamepadEvent' in window;
let haveWebkitEvents = 'WebKitGamepadEvent' in window;
let controllers = {};
let timeoutId;

// make the requestAnimationFrame available to all browsers
let rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; 
  let container = document.createElement("div");
  let t = document.createElement("h1");

  // detect what controller is plugged in and show it
  container.id = `controller${gamepad.index}`;
  t.textContent = "Gamepad = "+gamepad.id;
  container.appendChild(t);

  let buttons_container = document.createElement("div");
  buttons_container.className = "buttons";

  // make a button visible for each button the controller has
  for (let i=0; i<gamepad.buttons.length; i++) {
    let span = document.createElement("span");
    span.className = "button";
    //e.id = "b" + i;
    span.innerHTML = i;
    buttons_container.appendChild(span);
  }
  container.appendChild(buttons_container);

  // create a meter for the sticks
  let axes_container = document.createElement("div");
  axes_container.className = "axes";
  for (i=0; i<gamepad.axes.length; i++) {
    meter = document.createElement("meter");
    meter.className = "axis";
    //e.id = "a" + i;
    meter.setAttribute("min", "-1");
    meter.setAttribute("max", "1");
    meter.setAttribute("value", "0");
    meter.innerHTML = i;
    axes_container.appendChild(meter);
  }
  container.appendChild(axes_container);
  document.getElementById("start").style.display = "none";
  document.body.appendChild(container);
  rAF(updateStatus);
}

// disconnecting the controller
function disconnecthandler(e) {
  removegamepad(e.gamepad);
}
// removing the controller
function removegamepad(gamepad) {
  let d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    let controller = controllers[j];
    let d = document.getElementById("controller" + j);
    let buttons = d.getElementsByClassName("button");
    for (let i=0; i<controller.buttons.length; i++) {
      let b = buttons[i];
      let val = controller.buttons[i];
      let pressed = val == 1.0;
      let touched = false;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }
        val = val.value;
      }

      // add a class to the container of the button that is pressed
      let pct = Math.round(val * 100) + "%";
      b.style.backgroundSize = pct + " " + pct;
      b.className = "button";
      if (pressed) {
        b.className += " pressed";
        connScriptHandler(i);
      }
      if (touched) {
        b.className += " touched";
      }
    }
    
    let axes = d.getElementsByClassName("axis");
    // Store axis values
    let axesValues = []; 
    
    for (let i = 0; i < controller.axes.length; i++) {
      let a = axes[i];
      let axisValue = controller.axes[i].toFixed(4);
      a.innerHTML = i + ": " + axisValue;
      a.setAttribute("value", axisValue);
    //   if (axisValue !=0){
    //     axesValues.push(parseFloat(axisValue));
    //     apiHandler(axesValues);
    //   }
    }
    
  }
  rAF(updateStatus);
}

function scangamepads() {
  let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  // check f something is connected every .5s
  setInterval(scangamepads, 500);
}
let width = 50;
let height = 5;
let spin = false;
let bounce = false;
let expand = false;
let resizeConfirm = false;
let clearConfirm = false;

function renderInitialDisplay() {
  let display = document.getElementById("display");

  //make sure there are no children
  var child = display.lastElementChild;
  while (child) {
    display.removeChild(child);
    child = display.lastElementChild;
  }

  for (i = 0; i < height; i++) {
    let rowElement = document.createElement("div");
    rowElement.className = "row";
    rowElement.id = "row-" + i;
    display.appendChild(rowElement);
    for (e = 0; e < width; e++) {
      let dotElement = document.createElement("div");
      dotElement.className = "dot off";
      dotElement.id = "dot-" + (e + (width * i));
      dotElement.addEventListener("click", (e) => {
        if (e.target.className.includes("on")) {
          e.target.className = "dot off"
        } else {
          e.target.className = "dot on"
        }
      })
      rowElement.appendChild(dotElement);
    }
  }
}

function createExpression(index, wide, tall) {
  let outputx = "";
  let outputy = "";
  //keep track of how many parentheses we should actually have at the end
  //this doesn't really matter, it just prevents it from looking stupid
  let activeCount = 0;

  for(let i=0; i<index.length; i++) {
    if(index[i] == 1) {
      if (activeCount > 398) {
        return "Error: Your image must contain less than 400 active lasers. Please reduce the laser count."
      }
      outputx = outputx + "if(index == "+activeCount.toString()+","+(((i%wide)+0.5)-(parseInt(tall)/2)).toString()+","
      outputy = outputy + "if(index == "+activeCount.toString()+","+((Math.floor(i/wide)+0.5)-(parseInt(wide)/2)).toString()+","
      activeCount++
    }
  }

  outputx = outputx + "0"
  outputy = outputy + "0"

  for(let i=0;i<activeCount;i++) {
    outputx = outputx + ")"
    outputy = outputy + ")"
  }

  baseString = "x' = (" + outputx + ");<br><br>y' = (-" + outputy + ");<br><br>h = 0;<br>s = 1;<br>v = if(index < " + (activeCount + 1) + ",1,0);"

  if(spin) {
    baseString = baseString + "<br>xf = x'<br>yf = y'<br><br>xr = projectionTime;<br>yr = projectionTime;<br>zr = projectionTime;<br><br>xz = xf*cos(zr)-yf*sin(zr);<br>yz = xf*sin(zr)+yf*cos(zr);<br><br>x' = xz*cos(yr)+sin(yr)*yz*sin(xr);<br>y' = yz*cos(xr);<br>"
  }

  if(bounce) {
    baseString = baseString + "<br>y' = y' - 10 + abs(15cos(projectionTime*3))"
  }

  if(expand) {
    baseString = baseString + "<br>y' = y' * abs(cos(projectionTime))*2)<br>x' = x' * abs(cos(projectionTime))*2)"
  }

  return baseString
}

function setup() {
  renderInitialDisplay();
  document.getElementById("resize").addEventListener("click", (e) => {
    if(resizeConfirm) {
      width = Number(document.getElementById("wsize").value);
      height = Number(document.getElementById("hsize").value);
      renderInitialDisplay();
      resizeConfirm = false;
      document.getElementById("resize").innerText="Resize"
    } else {
      resizeConfirm = true;
      document.getElementById("resize").innerText="Are you sure?"
      setTimeout(() => {
        resizeConfirm = false;
        document.getElementById("resize").innerText="Resize"
      }, 2500)
    }
  })
  document.getElementById("clear").addEventListener("click", () => {
    if(clearConfirm) {
      renderInitialDisplay()
      clearConfirm = false;
      document.getElementById("clear").innerText="Clear"
    } else {
      clearConfirm = true;
      document.getElementById("clear").innerText="Are you sure?"
      setTimeout(() => {
        clearConfirm = false;
        document.getElementById("clear").innerText="Clear"
      }, 2500)
    }
  })
  document.getElementById("export").addEventListener("click", () => {
    let value = ""
    for (i = 0; i < width * height; i++) {
      if (document.getElementById("dot-" + i).className.includes("on")) {
        value = value + "1"
      } else {
        value = value + "0"
      }
    }
    document.getElementById("output").innerHTML = createExpression(value, width, height);
  })
  document.getElementById("enable-spin").addEventListener("click", (e) => {
    if (e.target.className.includes("ticked")) {
      e.target.className = "checkbox off"
      spin = false;
    } else {
      e.target.className = "checkbox ticked"
      spin = true;
    }
  })
  document.getElementById("enable-bounce").addEventListener("click", (e) => {
    if (e.target.className.includes("ticked")) {
      e.target.className = "checkbox off"
      bounce = false;
    } else {
      e.target.className = "checkbox ticked"
      bounce = true;
    }
  })
  document.getElementById("enable-expand").addEventListener("click", (e) => {
    if (e.target.className.includes("ticked")) {
      e.target.className = "checkbox off"
      expand = false;
    } else {
      e.target.className = "checkbox ticked"
      expand = true;
    }
  })
  document.getElementById("copy").addEventListener("click", (e) => {
    window.copyToClipboard(document.getElementById("output").innerText);
  })
}

setup()

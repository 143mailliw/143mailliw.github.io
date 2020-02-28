let width = 50;
let height = 5;
let spin = false;

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
  let outputv = "";
  //keep track of used indexes
  let indexWorkaround = [];
  //keep track of how many parentheses we should actually have at the end
  //this doesn't really matter, it just prevents it from looking stupid
  let activeCount = 0;

  for(let i=0; i<index.length; i++) {
    if(index[i] == 1) {
      workingIndex = i%400
      if(indexWorkaround.includes(i%400)) {
        let loopcount = 0
        while(indexWorkaround.includes(workingIndex%400)) {
          if(loopcount == 400) {
            return "Error: Reached maximum loop count. Please reduce your pixel usage. (Max activated pixels: 400)"
          }
          workingIndex++
          loopcount++
        }
      }
      outputx = outputx + "if(index == "+workingIndex.toString()+","+(((i%wide)+0.5)-(parseInt(height)/2)).toString()+","
      outputy = outputy + "if(index == "+workingIndex.toString()+","+((Math.floor(i/wide)+0.5)-(parseInt(wide)/2)).toString()+","
      outputv = outputv + "index == "+workingIndex.toString()+" || "
      indexWorkaround.push(workingIndex)
      activeCount++
    }
  }

  outputx = outputx + "0"
  outputy = outputy + "0"
  outputv = outputv.substr(0,outputv.length-4) + ",1,0);";

  for(let i=0;i<activeCount;i++) {
    outputx = outputx + ")"
    outputy = outputy + ")"
  }

  baseString = "x' = (" + outputx + ");<br><br>y' = (-" + outputy + ");<br><br>h = 0;<br>s = 1;<br>v = if(" + outputv

  if(spin) {
    baseString = baseString + "<br>xf = x'<br>yf = y'<br><br>xr = projectionTime;<br>yr = projectionTime;<br>zr = projectionTime;<br><br>xz = xf*cos(zr)-yf*sin(zr);<br>yz = xf*sin(zr)+yf*cos(zr);<br><br>x' = xz*cos(yr)+sin(yr)*yz*sin(xr);<br>y' = yz*cos(xr);<br>"
  }
  return baseString
}

function setup() {
  renderInitialDisplay();
  document.getElementById("resize").addEventListener("click", (e) => {
    width = Number(document.getElementById("wsize").value);
    height = Number(document.getElementById("hsize").value);
    renderInitialDisplay();
  })
  document.getElementById("clear").addEventListener("click", renderInitialDisplay)
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
  document.getElementById("enable").addEventListener("click", (e) => {
        if (e.target.className.includes("on")) {
          e.target.className = "dot off"
          spin = false;
        } else {
          e.target.className = "dot on"
          spin = true;
        }
      })
}

setup()

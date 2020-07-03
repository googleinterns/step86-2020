
// can be used for milstone 2
export function addBreakpoint(){

    document.querySelectorAll(".js-line-number").forEach(node => {
     document.getElementById(node.getAttribute("id")).onclick = changeColor;
    });
}

export function changeColor(){

  document.querySelectorAll(".js-line-number").forEach(node => {
  document.getElementById(node.getAttribute("id")).style.color = "blue";
  document.getElementById(node.getAttribute("id")).style.backgroundColor = " #77a1ee";
  });

}
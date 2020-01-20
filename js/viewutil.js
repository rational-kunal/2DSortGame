
function newNode(classList, size) {
    const node = document.createElement('div');
    node.classList = classList;
    node.style.width = size;
    node.style.height = size;
    
    return node;
}

function offsetOf(node) {
    return [node.offsetLeft, node.offsetTop]
}

function updateOffsetOf(node, top, left) {
    node.style.top = top + "px";
    node.style.left = left + "px";
    // console.log(top, left, node.style.top);
}

function reposition(pNode, cNode) {
    updateOffsetOf(cNode, ...offsetOf(pNode));
}

function animateItemDiv(item, fromNode, toNode) {
    // const [fromLeft, fromTop] = offsetOf(fromNode);
    const [toLeft, toTop] = offsetOf(toNode);
  
    // console.log(toLeft, toTop);
  
    // document.getElementById("app").removeChild(item);
    item.classList.add("circle");
    item.style.top = toTop + "px";
    item.style.left = toLeft + "px";
    setTimeout(() => {
      item.classList.remove("circle");
    }, 250);
    // item.classList.add("circle");
    // document.getElementById("app").appendChild(item);
    // requestAnimationFrame(()=>{
    //   item.classList.remove("circle");
    // })
  }
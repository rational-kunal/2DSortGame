
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
}

function reposition(pNode, cNode) {
    updateOffsetOf(cNode, ...offsetOf(pNode));
}

function animateItemDiv(item, toNode) {
    const [toLeft, toTop] = offsetOf(toNode);

    item.classList.add("circle");
    item.style.top = toTop + "px";
    item.style.left = toLeft + "px";
    setTimeout(() => {
        item.classList.remove("circle");
    }, CIRCLE_ANIM_DURATION);
}
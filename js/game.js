
class Game {
    constructor(nRowCol) {
        this.logicalPause = false;

        this.totalMoves = 0;

        this.nRowCol = nRowCol;

        this.pathManager = new PathManager(nRowCol);

        this.gameContainerNode = newNode("game-container", SIZE + "px");

        this.itemContainerNodeMatrix = [];
        for (let r = 0; r < nRowCol; r++) {
            this.itemContainerNodeMatrix.push([]);
            for (let c = 0; c < nRowCol; c++) {
                this.itemContainerNodeMatrix[r].push(newNode("item-container", SIZE / nRowCol - 2 + "px"));
                this.gameContainerNode.appendChild(this.itemContainerNodeMatrix[r][c]);
            }
        }

        this.initialNodeMatrix = [];
        this.itemNodeMatrix = [];
        for (let r = 0; r < nRowCol; r++) {
            this.itemNodeMatrix.push([]);
            this.initialNodeMatrix.push([]);
            for (let c = 0; c < nRowCol; c++) {
                this.itemNodeMatrix[r].push(newNode("item", SIZE / nRowCol - 2 + "px"));
                this.initialNodeMatrix[r][c] = this.itemNodeMatrix[r][c];
            }
        }
        this.itemNodeMatrix[this.nRowCol - 1][this.nRowCol - 1].style.opacity = 0;
        this.initialNodeMatrix[this.nRowCol - 1][this.nRowCol - 1] = this.itemNodeMatrix[this.nRowCol - 1][this.nRowCol - 1];
    }

    render(parentNode) {
        parentNode.appendChild(this.gameContainerNode);

        for (let r = 0; r < this.nRowCol; r++) {
            for (let c = 0; c < this.nRowCol; c++) {
                if (!((r === this.nRowCol - 1) && (c === this.nRowCol - 1))) {
                    reposition(this.itemContainerNodeMatrix[c][r], this.itemNodeMatrix[c][r]);
                    this.itemNodeMatrix[c][r].append(r * this.nRowCol + c + 1);
                    parentNode.appendChild(this.itemNodeMatrix[c][r]);
                }
            }
        }
        reposition(this.itemContainerNodeMatrix[this.nRowCol - 1][this.nRowCol - 1], this.itemNodeMatrix[this.nRowCol - 1][this.nRowCol - 1]);
        parentNode.appendChild(this.itemNodeMatrix[this.nRowCol - 1][this.nRowCol - 1]);
    }

    getItemNodeFromItemNodeMatrix([x, y]) {
        return this.itemNodeMatrix[y][x];
    }

    getContainerNodeFromItemContainerNodeMatrix([x, y]) {
        return this.itemContainerNodeMatrix[x][y];
    }

    exchangeItemWithAnimation(positionFirst, positionSecond) {
        animateItemDiv(
            this.getItemNodeFromItemNodeMatrix(positionFirst),
            this.getContainerNodeFromItemContainerNodeMatrix(positionSecond)
        );
        animateItemDiv(
            this.getItemNodeFromItemNodeMatrix(positionSecond),
            this.getContainerNodeFromItemContainerNodeMatrix(positionFirst)
        );
        var temp = this.itemNodeMatrix[positionFirst[1]][positionFirst[0]];
        this.itemNodeMatrix[positionFirst[1]][positionFirst[0]] = this.itemNodeMatrix[positionSecond[1]][positionSecond[0]];
        this.itemNodeMatrix[positionSecond[1]][positionSecond[0]] = temp;
    }

    randomize(steps) {
        const positionQ = this.pathManager.randomizePath(steps);

        positionQ.forEach(([positionFirst, positionSecond]) => {
            this.exchangeItemWithAnimation(positionFirst, positionSecond);
        });
    }

    autosolve() {
        let solution = this.pathManager.log;
        var delay = 0;
        for (let i = solution.length - 2; i > -1; i -= 1) {
            setTimeout(() => {
                let positionFirst = solution[i];
                let positionSecond = solution[i + 1];
                this.exchangeItemWithAnimation(positionFirst, positionSecond);
            }, delay += AUTOSOLVE_DELAY)
        }
        setTimeout(() => {
            this.logicalPause = false;
            this.pathManager.undo = 0;
        }, delay);

        this.pathManager.resetBlank();
    }

    move(direction) {
        if (this.pathManager.canMove(direction)) {
            const positionFirst = this.pathManager.posBlank;
            const positionSecond = this.pathManager.move(direction);

            this.exchangeItemWithAnimation(positionFirst, positionSecond);

            this.totalMoves += 1;

            return true;
        }

        return false;
    }

    undo() {
        if (this.pathManager.undo > 0) {
            const positionFirst = [...this.pathManager.posBlank];
            const positionSecond = this.pathManager.doUndo();

            this.exchangeItemWithAnimation(positionFirst, positionSecond);
        }
    }
}
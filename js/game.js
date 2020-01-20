
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
class PathManager {
    constructor(nRowCol) {
        this.nRowCol = nRowCol;
        this.posBlank = [nRowCol-1, nRowCol-1];
        this.log = [this.posBlank];
        this.undo = 0;
    }

    canMove(direction) {
        return this.availableSteps(...this.posBlank).includes(direction);
    }

    move(direction) {
        let newPos;
        switch (direction) {
            case RIGHT:
                newPos = [this.posBlank[0], this.posBlank[1]+1];
                break;
            case LEFT:
                newPos = [this.posBlank[0], this.posBlank[1]-1];
                break;
            case UP:
                newPos = [this.posBlank[0]-1, this.posBlank[1]];
                break;
            case DOWN:
                newPos = [this.posBlank[0]+1, this.posBlank[1]];
                break;
        }

        this.posBlank = newPos;
        this.log.push(this.posBlank);
        this.undo+=1;
        if(this.undo>5) this.undo=5;
        return newPos;
    }

    doUndo() {
        this.undo-=1;
        this.log.pop();
        this.posBlank = this.log[this.log.length-1];
        return this.posBlank;
    }

    availableSteps(x, y) {
        var temp = x;
        x = y;
        y = temp;
        if(x===0) {
            if(y===0) return [RIGHT, DOWN];
            if(y===this.nRowCol-1) return [RIGHT, UP];
            return [RIGHT, UP, DOWN];
        }
        if(x===this.nRowCol-1) {
            if(y===0) return [LEFT, DOWN];
            if(y===this.nRowCol-1) return [LEFT, UP];
            return [LEFT, UP, DOWN];
        }
        if(y===0) return [LEFT, RIGHT, DOWN];
        if(y===this.nRowCol-1) return [LEFT, RIGHT, UP]
        return [LEFT, RIGHT, UP, DOWN];
    }

    newPositionForBlank() {
        const direction = randomEleFromArray(this.availableSteps(...this.posBlank));
        let newPos;
        switch (direction) {
            case RIGHT:
                newPos = [this.posBlank[0], this.posBlank[1]+1];
                break;
            case LEFT:
                newPos = [this.posBlank[0], this.posBlank[1]-1];
                break;
            case UP:
                newPos = [this.posBlank[0]-1, this.posBlank[1]];
                break;
            case DOWN:
                newPos = [this.posBlank[0]+1, this.posBlank[1]];
                break;
        }

        return newPos;
    }

    randomizePath(steps) {
        let positionQ = [];
        let positionMatrix = [];
        for(let x=0; x<this.nRowCol; x++) {
            positionMatrix.push([]);
            for(let y=0; y<this.nRowCol; y++) {
                positionMatrix[x].push([x, y]);
            }
        }

        for(let count=0; count<steps; count++) {
            let newPos = this.newPositionForBlank();
            positionMatrix[newPos[0]][newPos[1]] = this.posBlank;
            positionMatrix[this.posBlank[0]][this.posBlank[1]] = newPos;
            positionQ.push([newPos, [...this.posBlank]]);
            this.posBlank = newPos;
            // console.log(this.log);
            this.log.push([...this.posBlank]);
        }

        return positionQ;
    }
}

class Game {
    constructor(nRowCol) {
        this.logicalPause = false;

        this.totalMoves = 0;

        this.nRowCol = nRowCol;

        this.pathManager = new PathManager(nRowCol);

        this.gameContainerNode = newNode("game-container", SIZE + "px");

        this.itemContainerNodeMatrix = [];
        for(let r=0; r<nRowCol; r++) {
            this.itemContainerNodeMatrix.push([]);
            for(let c=0; c<nRowCol; c++) {
                this.itemContainerNodeMatrix[r].push(newNode("item-container",  SIZE/nRowCol-2 + "px"));
                this.gameContainerNode.appendChild(this.itemContainerNodeMatrix[r][c]);
            }
        }

        this.itemNodeMatrix = [];
        for(let r=0; r<nRowCol; r++) {
            this.itemNodeMatrix.push([]);
            for(let c=0; c<nRowCol; c++) {
                this.itemNodeMatrix[r].push(newNode("item",  SIZE/nRowCol-2 + "px"));
            }
        }
        this.itemNodeMatrix[this.nRowCol-1][this.nRowCol-1].style.backgroundColor = "#492540";
    }

    render(parentNode) {
        parentNode.appendChild(this.gameContainerNode);
        
        for(let r=0; r<this.nRowCol; r++) {
            for(let c=0; c<this.nRowCol; c++) {
                if (!((r===this.nRowCol-1) && (c===this.nRowCol-1))) {
                    reposition(this.itemContainerNodeMatrix[c][r], this.itemNodeMatrix[c][r]);
                    this.itemNodeMatrix[c][r].append(r*this.nRowCol + c + 1);
                    parentNode.appendChild(this.itemNodeMatrix[c][r]);
                }
            }
        }
        reposition(this.itemContainerNodeMatrix[this.nRowCol-1][this.nRowCol-1], this.itemNodeMatrix[this.nRowCol-1][this.nRowCol-1]);
        parentNode.appendChild(this.itemNodeMatrix[this.nRowCol-1][this.nRowCol-1]);
    }

    exchangeItemWithAnimation(positionFirst, positionSecond) {
        animateItemDiv(
            this.itemNodeMatrix[positionFirst[1]][positionFirst[0]],
            null,
            this.itemContainerNodeMatrix[positionSecond[0]][positionSecond[1]]
        );
        animateItemDiv(
            this.itemNodeMatrix[positionSecond[1]][positionSecond[0]],
            null,
            this.itemContainerNodeMatrix[positionFirst[0]][positionFirst[1]]
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
        for (let i=solution.length-2; i>-1; i-=1) {
            setTimeout(()=>{
                let positionFirst = solution[i];
                let positionSecond = solution[i+1];
                this.exchangeItemWithAnimation(positionFirst, positionSecond);
            }, delay+=800)
        }
        setTimeout(()=>{
            this.logicalPause = false;
            this.pathManager.undo = 0;
        }, delay);
    }

    move(direction) {
        if(this.pathManager.canMove(direction)) {
            const positionFirst = this.pathManager.posBlank;
            const positionSecond = this.pathManager.move(direction);

            this.exchangeItemWithAnimation(positionFirst, positionSecond);

            this.totalMoves += 1;
        }
    }

    undo() {
        if(this.pathManager.undo > 0) {
            const positionFirst = [...this.pathManager.posBlank];
            const positionSecond = this.pathManager.doUndo();

            this.exchangeItemWithAnimation(positionFirst, positionSecond);
        }
    }
}
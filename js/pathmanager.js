
class PathManager {
    constructor(nRowCol) {
        this.nRowCol = nRowCol;
        this.posBlank = [nRowCol - 1, nRowCol - 1];
        this.log = [this.posBlank];
        this.undo = 0;
    }

    resetBlank() {
        this.posBlank = [this.nRowCol - 1, this.nRowCol - 1];
    }

    canMove(direction) {
        return this.availableSteps(...this.posBlank).includes(direction);
    }

    move(direction) {
        let newPos;
        switch (direction) {
            case RIGHT:
                newPos = [this.posBlank[0], this.posBlank[1] + 1];
                break;
            case LEFT:
                newPos = [this.posBlank[0], this.posBlank[1] - 1];
                break;
            case UP:
                newPos = [this.posBlank[0] - 1, this.posBlank[1]];
                break;
            case DOWN:
                newPos = [this.posBlank[0] + 1, this.posBlank[1]];
                break;
        }

        this.posBlank = newPos;
        this.log.push(this.posBlank);
        this.undo += 1;
        if (this.undo > 5) this.undo = 5;
        return newPos;
    }

    doUndo() {
        this.undo -= 1;
        this.log.pop();
        this.posBlank = this.log[this.log.length - 1];
        return this.posBlank;
    }

    availableSteps(x, y) {
        var temp = x;
        x = y;
        y = temp;
        if (x === 0) {
            if (y === 0) return [RIGHT, DOWN];
            if (y === this.nRowCol - 1) return [RIGHT, UP];
            return [RIGHT, UP, DOWN];
        }
        if (x === this.nRowCol - 1) {
            if (y === 0) return [LEFT, DOWN];
            if (y === this.nRowCol - 1) return [LEFT, UP];
            return [LEFT, UP, DOWN];
        }
        if (y === 0) return [LEFT, RIGHT, DOWN];
        if (y === this.nRowCol - 1) return [LEFT, RIGHT, UP]
        return [LEFT, RIGHT, UP, DOWN];
    }

    newPositionForBlank() {
        const direction = randomEleFromArray(this.availableSteps(...this.posBlank));
        let newPos;
        switch (direction) {
            case RIGHT:
                newPos = [this.posBlank[0], this.posBlank[1] + 1];
                break;
            case LEFT:
                newPos = [this.posBlank[0], this.posBlank[1] - 1];
                break;
            case UP:
                newPos = [this.posBlank[0] - 1, this.posBlank[1]];
                break;
            case DOWN:
                newPos = [this.posBlank[0] + 1, this.posBlank[1]];
                break;
        }

        return newPos;
    }

    randomizePath(steps) {
        let positionQ = [];
        let positionMatrix = [];
        for (let x = 0; x < this.nRowCol; x++) {
            positionMatrix.push([]);
            for (let y = 0; y < this.nRowCol; y++) {
                positionMatrix[x].push([x, y]);
            }
        }

        for (let count = 0; count < steps; count++) {
            let newPos = this.newPositionForBlank();
            positionMatrix[newPos[0]][newPos[1]] = this.posBlank;
            positionMatrix[this.posBlank[0]][this.posBlank[1]] = newPos;
            positionQ.push([newPos, [...this.posBlank]]);
            this.posBlank = newPos;
            this.log.push([...this.posBlank]);
        }

        return positionQ;
    }
}

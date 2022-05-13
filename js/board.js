/**
 *
 * by littlefean
 */
class Board {

    constructor(w, h, bindEle) {
        this.width = w;
        this.height = h;
        this.isGameOver = false;
        this.arr = [];

        this.score = 0;  // 游戏分数
        this.mergeScore = 0;  // 合并分数

        /**
         * 存放新地点集合，
         * 类型： [[pos, pos, pos...], [pos, pos, pos...], ...]
         * pos: [y, x]
         * @type {*[]}
         */
        this.newTurnHistoryList = [];
        this.fxList = [];  // 特效队列
        /**
         * 游戏设定
         */
        this.settings = {
            addCount: 2,  // 一次性会添加多少个数字？
            initNumber: 1,  // 初始数字
            negNumberRate: 0.1,  // 出现负数字的概率
            NaNRate: 0.05,  // NaN 出现概率

            infinityRate: 0.01,  // 出现无穷的概率
            nullRate: 0.01,  // 出现null的概率
            undefinedRate: 0.01,  // 出现未定义的概率

        }
        this.bindEle = bindEle;
        this.boardEle = bindEle.querySelector(".gameBoard");
        this.scoreEle = bindEle.querySelector("#score");
        this.mergeScoreEle = bindEle.querySelector("#mergeScore");

        for (let y = 0; y < this.height; y++) {
            let line = [];
            for (let x = 0; x < this.width; x++) {
                line.push(0);
            }
            this.arr.push(line);
        }

        this.refresh();
    }

    // 更新分数
    upDateScore() {
        let res = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (isNaN(this.arr[y][x])) {
                    continue;
                }
                if (this.arr[y][x] === Infinity) {
                    continue;
                }
                res += this.arr[y][x] ** 3;
            }
        }
        this.score = res;
    }

    /**
     * 更新显示
     */
    refresh() {
        if (this.isGameOver) {
            return;
        }
        this.upDateScore();
        this.scoreEle.innerText = this.score.toString();
        this.mergeScoreEle.innerText = this.mergeScore.toString();

        this.bindEle.removeChild(this.boardEle);
        let boardElement = newDiv("gameBoard");
        // 动态设置宽度
        boardElement.style.width = ((50 + 5) * this.width).toString() + "px";

        // this.boardEle.innerHTML = "";
        // 添加棋盘总局特效
        // this.boardEle.animationName = "";
        while (this.fxList.length > 0) {
            // this.boardEle.style.animationName = this.fxList.pop();
            boardElement.style.animationName = this.fxList.pop();
        }

        for (let y = 0; y < this.height; y++) {
            let lineEle = newDiv("line");
            for (let x = 0; x < this.width; x++) {
                let boxEle = newDiv("box");

                // 如果这个位置不是空气，是实体
                if (this.arr[y][x] !== 0) {
                    boxEle.innerText = this.arr[y][x];

                    // 设置这个颜色
                    if (this.arr[y][x] === null) {
                        boxEle.classList.add("nullBox");
                        boxEle.innerText = "null";
                    }
                    if (this.arr[y][x] === undefined) {
                        boxEle.classList.add("undefinedBox");
                    } else if (isNaN(this.arr[y][x])) {
                        boxEle.classList.add("NaNBox");
                    } else if (this.arr[y][x] === Infinity) {
                        boxEle.classList.add("InfBox");
                        boxEle.innerText = "∞";
                    } else if (this.arr[y][x] < 0) {
                        boxEle.style.backgroundColor = getColorStr(this.arr[y][x]);
                        boxEle.style.color = "white";
                    } else {
                        boxEle.style.backgroundColor = getColorStr(this.arr[y][x]);
                    }
                    // 如果这个还是个新添加进来的
                    {
                        let posSet = this.newTurnHistoryList[this.newTurnHistoryList.length - 1];
                        if (this.newTurnHistoryList.length > 0) {
                            for (let pos of posSet) {
                                if (pos[0] === y && pos[1] === x) {
                                    boxEle.style.animation = "newBox 0.2s";
                                }
                            }
                        }

                    }
                    boxEle.style.outline = "none";
                }
                lineEle.appendChild(boxEle);
            }
            boardElement.appendChild(lineEle);
        }
        this.boardEle = boardElement;
        this.bindEle.appendChild(boardElement);
    }

    // 在xy位置生成按照规则随机生成数字
    crateNumber(x, y) {
        if (Math.random() < this.settings.negNumberRate) {
            // 生成负数的数字
            this.arr[y][x] = -this.settings.initNumber;
            return;
        }
        if (Math.random() < this.settings.NaNRate) {
            // 生成NaN
            this.arr[y][x] = NaN;
            return;
        }
        if (Math.random() < this.settings.nullRate) {
            this.arr[y][x] = null;
            return;
        }
        if (Math.random() < this.settings.nullRate) {
            this.arr[y][x] = undefined;
            return;
        }
        // 生成正常的数字
        this.arr[y][x] = this.settings.initNumber;
    }

    /**
     * 新一轮随机添加数字
     * 只更新内部数据列表，没有更新显示
     * 可能会导致gameOver
     */
    newTurn() {
        // 检测失败
        let locList = [];  // 先收集所有可以放置的点
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.arr[y][x] === 0) {
                    locList.push([y, x]);
                }
            }
        }
        if (locList.length < this.settings.addCount) {
            // 失败
            this.isGameOver = true;
        } else {
            let putLocList = choice(locList, this.settings.addCount);  // [pos, pos..]
            this.newTurnHistoryList.push(putLocList);
            for (let loc of putLocList) {
                this.crateNumber(loc[1], loc[0]);

            }
        }
    }

    clearNaN() {
        for (let y = 0; y < this.width; y++) {
            for (let x = 0; x < this.height; x++) {
                if (isNaN(this.arr[y][x]) && this.arr[y][x] !== undefined) {
                    this.arr[y][x] = 0;
                }
            }
        }
    }

    clearValue(value) {
        for (let y = 0; y < this.width; y++) {
            for (let x = 0; x < this.height; x++) {
                if (this.arr[y][x] === value) {
                    this.arr[y][x] = 0;
                }
            }
        }
    }

    // a, b 两个值是否能够合并
    isMergeAble(a, b) {
        if (a === null || b === null) {
            return false;
        }
        if (a === undefined && b === undefined) {
            return true;
        }
        if (isNaN(a) || isNaN(b)) {
            return false;
        }
        if (typeof a === "number" && typeof b === "number") {
            if (Math.abs(a) === Math.abs(b)) {
                return true;
            }
        }
    }

    /**
     * 返回两个数值相加的结果, 提前自行判断是否能相加
     * @param a
     * @param b
     */
    merge(a, b) {
        this.mergeScore++;
        if (a === undefined && b === undefined) {

            // 触发清除所有NaN的操作
            this.clearNaN();
            // 增加一个闪光特效
            this.fxList.push("flash");

            this.score += 50000;
            return Infinity;

        }
        if (a === Infinity && b === Infinity) {
            // 清除所有NULL操作
            this.score += 1000_0000;
            this.fxList.push("boom");
            this.clearValue(null);
            for (let i = 0; i < 10; i++) {
                this.clearValue(2 ** i);
                this.clearValue(-(2 ** i));
            }
            return null;
        }
        return a + b;
    }

    // 向左合并一行序列，返回合并后的结果，传入的line对象请使用备份了的
    // [ .... <- ... ]
    mergeLineLeft(line) {
        for (let i = 0; i < Math.ceil(Math.log2(line.length)); i++) {
            for (let x = 0; x < line.length; x++) {
                if (line[x] === null) {
                    continue;
                }
                // x 为被合并入的数字
                if (line[x] === 0) {
                    // 如果当前这个数字是0，则向右侧寻找第一个非零数字并拉过来
                    for (let xi = x + 1; xi < line.length; xi++) {
                        if (line[xi] === null) {
                            break;
                        }
                        if (line[xi] !== 0) {
                            line[x] = line[xi]
                            line[xi] = 0;
                            break;
                        }
                    }
                } else {
                    for (let xi = x + 1; xi < line.length; xi++) {
                        // xi 为与之合并的数字检测
                        if (line[xi] === null) {
                            break;
                        }
                        if (line[xi] !== 0) {
                            if (this.isMergeAble(line[xi], line[x])) {
                                line[x] = this.merge(line[xi], line[x]);
                                line[xi] = 0;
                                break;
                            }
                            break;
                        }
                    }
                }

            }
        }
    }

    // 获取一列数据成一个列表 顺序从上往下
    getCol(x) {
        let res = [];
        for (let y = 0; y < this.height; y++) {
            res.push(this.arr[y][x]);
        }
        return res;
    }

    setCol(x, arr) {
        for (let y = 0; y < this.height; y++) {
            this.arr[y][x] = arr[y];
        }
    }

    /**
     * 移动合并
     * @param dir 方向
     */
    move(dir) {
        switch (dir) {
            case "left":
                for (let y = 0; y < this.height; y++) {
                    let line = this.arr[y];
                    this.mergeLineLeft(line);
                }
                break;
            case "right":
                for (let y = 0; y < this.height; y++) {
                    let line = reverse(this.arr[y]);
                    this.mergeLineLeft(line);
                    this.arr[y] = reverse(line);
                }
                break;
            case "top":
                for (let x = 0; x < this.width; x++) {
                    let line = this.getCol(x);
                    this.mergeLineLeft(line);
                    this.setCol(x, line);
                }
                break;
            case "down":
                for (let x = 0; x < this.width; x++) {
                    let line = reverse(this.getCol(x));
                    this.mergeLineLeft(line);
                    this.setCol(x, reverse(line));
                }
                break;
        }
    }
}

function getColorStr(num) {
    let flag = 1;
    if (num < 0) {
        flag = -1;
    }
    let level = Math.log2(Math.abs(num)) * flag;
    return `rgb(${100 + level * 20}, ${255 + level * 10}, ${180 - level * 2})`;
}

// 在主界面生成一些方块
{
    let ele = document.querySelector("#showNumberBlock");
    for (let i = 10; i >= 1; i--) {
        let b = newDiv("box");
        let n = 2 ** i;
        b.innerText = `-${n}`;
        b.style.backgroundColor = getColorStr(-n);
        b.style.color = "white";
        ele.appendChild(b);
    }
    for (let i = 0; i <= 10; i++) {
        let b = newDiv("box");
        let n = 2 ** i;
        b.innerText = `${n}`;
        b.style.backgroundColor = getColorStr(n);
        ele.appendChild(b);
    }
}

/**
 * 新建一个div
 * @param className
 * @returns {HTMLDivElement}
 */
function newDiv(className) {
    let res = document.createElement("div");
    res.classList.add(className);
    return res;
}

/**
 * 随机从数组中取出n个元素
 * @param arr 数组
 * @param count
 * @returns {*}
 */
function choice(arr, count) {
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

// 生成一个拷贝后的翻转了的数组
function reverse(arr) {
    let res = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        res.push(arr[i]);
    }
    return res;
}

// let bbb = [1, 0, 0, NaN, Infinity, null, undefined, 23];
// console.log(reverse(bbb));

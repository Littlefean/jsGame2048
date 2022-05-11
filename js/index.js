/**
 *
 * by littlefean
 */
function startGame() {
    let mode = document.querySelector("#modeEle").value;

    let gameBoardEle = document.querySelector(".gameRange");
    let w = +document.querySelector("#widthEle").value;
    let h = +document.querySelector("#heightEle").value;
    let b = new Board(w, h, gameBoardEle);
    b.settings.negNumberRate = +document.querySelector("#negRateEle").value / 100;
    b.settings.NaNRate = +document.querySelector("#NaNRateEle").value / 100;
    b.settings.addCount = +document.querySelector("#countEle").value;
    b.settings.nullRate = +document.querySelector("#nullRateEle").value / 100;
    b.settings.undefinedRate = +document.querySelector("#undefinedRateEle").value / 100;

    function opUp() {
        b.move("top");
        b.newTurn();
        b.refresh();
    }

    function opDown() {
        b.move("down");
        b.newTurn();
        b.refresh();
    }

    function opLeft() {
        b.move("left");
        b.newTurn();
        b.refresh();
    }

    function opRight() {
        b.move("right");
        b.newTurn();
        b.refresh();
    }

    // 添加按键控制效果
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            opUp();
        } else if (e.key === "ArrowDown") {
            opDown();
        } else if (e.key === "ArrowLeft") {
            opLeft();
        } else if (e.key === "ArrowRight") {
            opRight();
        }
    })
    document.querySelector("#left").addEventListener("click", () => {
        opLeft();
    });

    document.querySelector("#right").addEventListener("click", () => {
        opRight();
    });

    document.querySelector("#top").addEventListener("click", () => {
        opUp();
    });
    document.querySelector("#down").addEventListener("click", () => {
        opDown();
    });
    // 添加鼠标滑动控制效果
    let mouseDownLoc = {x: 0, y: 0};
    let mouseUpLoc = {x: 0, y: 0};

    gameBoardEle.addEventListener("mousedown", (e) => {
        // console.log("mousedown", e);
        gameBoardEle.style.backgroundColor = "gray";
        mouseDownLoc.x = e.screenX;
        mouseDownLoc.y = e.screenY;
    });
    gameBoardEle.addEventListener("mouseup", (e) => {
        // console.log("onmouseover", e);
        gameBoardEle.style.backgroundColor = "transparent";
        mouseUpLoc.x = e.screenX;
        mouseUpLoc.y = e.screenY;
        let dx = mouseUpLoc.x - mouseDownLoc.x;
        let dy = mouseUpLoc.y - mouseDownLoc.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                opRight();
            } else {
                opLeft();
            }
        } else {
            if (dy > 0) {
                opDown();
            } else {
                opUp();
            }
        }
    });


    function randomMove() {
        let n = Math.random();
        if (n < 0.25) {
            b.move("left");
        } else if (n < 0.5) {
            b.move("right");
        } else if (n < 0.75) {
            b.move("top");
        } else {
            b.move("down");
        }
        b.refresh();
    }

    function autoPlay() {
        let i = 0;
        setInterval(() => {
            i++;
            if (i % 2 === 0) {
                randomMove()
            } else {
                b.newTurn();
                b.refresh();
            }
        }, 5);
    }

    if (mode === "ai") {
        autoPlay();
    }
}

window.onload = function () {
    document.onkeydown = function (e) {
        e.preventDefault();
    }
    document.querySelector("#playEle").addEventListener("click", () => {
        startGame();
    });
}

let specifications = {
    try_counter: 1,
    check: null,
    level: 1,
    characteristic: function (health, damage, speed) {
        document.getElementById("health").innerHTML = "Health: " + health;
        document.getElementById("damage").innerHTML = "Damage: " + damage;
        document.getElementById("speed").innerHTML = "Speed: " + speed;
    },
};

function level_caller(level, map) {
    specifications.check = null;
    specifications.try_counter++;
    specifications.level = level;
    document.getElementById("menu").style.display = "None";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    gameManager.loadAll(ctx, map);
    gameManager.play(ctx);
}

function add_res(try_counter, score, level) {
    // создаем строку
    let table_row = document.getElementById("Result_table").insertRow(try_counter);
    // создаем ячейки
    let try_cell = table_row.insertCell(0);
    let levelCell = table_row.insertCell(1);
    let score_cell = table_row.insertCell(2);
    // вставляем данные
    try_cell.appendChild(document.createTextNode(try_counter));
    levelCell.appendChild(document.createTextNode(level));
    score_cell.appendChild(document.createTextNode(score));
}
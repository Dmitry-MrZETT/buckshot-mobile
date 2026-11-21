let dealerHP, playerHP, maxHP;
let shotgun = [];
let checkReady = false;
let turn = true;
let choice = false;
let current;
let dealerCuffed = false;
let playerCuffed = false;
let sawUsed = false;
let playerTurn = false;
let dealerKnown = [];
let smartness = 0.8;
let cur;
let attempts = 0;
let games = 0;
let wins = 0;
let blanks = 0;
let lives = 0;
let nextcheck = 'player';
const consoleText = document.getElementById('console');
const dealerBtn = document.getElementById('dealer');
const playerBtn = document.getElementById('player');
const shotgunBtn = document.getElementById('shotgun');
const dealerHPtext = document.getElementById('dealer-hp');
const playerHPtext = document.getElementById('player-hp');
const gamesText = document.getElementById('text1');
const winsText = document.getElementById('text2');
const roundsText = document.getElementById('text3');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const st = 1000;

let playerItems;
let dealerItems;

const cout = (line) => {
    consoleText.textContent = line;
}

const cout2 = async (line) => {
    line = String(line);
    let n = line.length;
    let l = "";
    for (let i = 0; i < n; i++)
    {
        l += line[i];
        await sleep(10);
        cout(l);
    }
    await sleep(st);
}

const smart = () => {
    return Math.random() <= smartness;
}

const check = async (next) => {
    if (dealerHP <= 0)
    {
        wins++;
        await cout2('Дилер мёртв...');
        await sleep(10000);
        start();
        return;
    }
    else if (playerHP <= 0)
    {
        await cout2('Игрок мёртв...');
        await sleep(10000);
        start();
        return;
    }
    if (next === 'player' && playerCuffed === true)
    {
        playerCuffed = false;
        await cout2('Игрок в наручниках...');
        next = 'dealer';
    }
    else if (next === 'dealer' && dealerCuffed === true)
    {
        dealerCuffed = false;
        await cout('Дилер в наручниках...');
        next = 'player';
    }
    if (shotgun.length === 0)
    {
        await cout2('Патронов больше нет...')
        nextcheck = next;
        await load();
    }
    else
    {
        if (next === 'player')
        {
            await cout2('Ход игрока.');
            playerTurn = true;
        }
        else dealerTurn();
    }
}

const update = () => {
    dealerHPtext.textContent = dealerHP;
    playerHPtext.textContent = playerHP;
    gamesText.textContent = `Игр: ${games}`;
    winsText.textContent = `Побед: ${wins}`;
    roundsText.textContent = `${lives}/${blanks}`;
}

const start = async () => {
    games++;
    await cout2('Начали!');
    dealerHP = Math.floor(Math.random() * 3) + 2;
    playerHP = dealerHP;
    maxHP = dealerHP;
    dealerItems = [null, null, null, null, null, null, null, null];
    playerItems = [null, null, null, null, null, null, null, null];
    for (let i = 0; i < 8; i++)
    {
        let btn = document.getElementById(`dealer-${i + 1}`);
        btn.innerHTML = "";
        btn = document.getElementById(`player-${i + 1}`);
        btn.innerHTML = "";
    }
    await cout2(`Здоровья: ${dealerHP}`);
    update();
    giveItems();
}

const load = async () => {
    await cout2('Заряжаем...');
    lives = Math.floor(Math.random() * 4) + 1;
    blanks = Math.floor(Math.random() * 4) + 1;
    update();
    shotgun = [];
    dealerKnown = [];
    for (let i = 0; i < lives; i++)
    {
        shotgun.push(1);
        dealerKnown.push(null);
    }
    for (let i = 0; i < blanks; i++)
    {
        shotgun.push(0);
        dealerKnown.push(null);
    }
    for (let i = shotgun.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shotgun[i], shotgun[j]] = [shotgun[j], shotgun[i]];
    }
    await cout2(`Боевых: ${lives} Холостых: ${blanks} (Нажми на себя, чтоб продолжить)`);
    checkReady = true;
}

const giveItems = async () => {
    await cout2('Выдаём предметы...');
    let n = Math.floor(Math.random() * 3) + 2;
    await cout2(`Предметов: ${n}`);
    for (let i = 0; i < n; i++)
    {
        let item;
        let itemn = Math.floor(Math.random() * 5);
        if (itemn === 0) itemn = 'beer';
        else if (itemn === 1) itemn = 'cig';
        else if (itemn === 2) itemn = 'glass';
        else if (itemn === 3) itemn = 'cuffs';
        else if (itemn === 4) itemn = 'saw';
        let emptySlot = dealerItems.indexOf(null);
        if (emptySlot === -1)
        {
            await cout2('Места нет!');
            break;
        }
        dealerItems[emptySlot] = itemn;
        let btn = document.getElementById(`dealer-${emptySlot + 1}`);
        btn.innerHTML = `<img src="assets/${itemn}.png">`;
    }
    for (let i = 0; i < n; i++)
    {
        let item;
        let itemn = Math.floor(Math.random() * 5);
        if (itemn === 0) itemn = 'beer';
        else if (itemn === 1) itemn = 'cig';
        else if (itemn === 2) itemn = 'glass';
        else if (itemn === 3) itemn = 'cuffs';
        else if (itemn === 4) itemn = 'saw';
        let emptySlot = playerItems.indexOf(null);
        if (emptySlot === -1)
        {
            await cout2('Места нет!');
            break;
        }
        playerItems[emptySlot] = itemn;
        let btn = document.getElementById(`player-${emptySlot + 1}`);
        btn.innerHTML = `<img src="assets/${itemn}.png">`;
    }
    load();
}

const shoot = async (user, target) => {
    current = shotgun.shift();
    if (user === 'player')
    {
        if (target === 'dealer')
        {
            if (current === 1)
            {
                if (sawUsed === true)
                {
                    await cout2('Дилер получает двойной урон!');
                    dealerHP -= 2;
                }
                else
                {
                    await cout2('Дилер получает урон!');
                    dealerHP--;
                }
                update();   
            }
            else
            {
                await cout2('Пусто!');               
            }
            await check('dealer');
        }
        else if (target === 'player')
        {
            if (current === 1)
            {
                if (sawUsed === true)
                {
                    await cout2('Игрок решил покончить с собой...');
                    playerHP -= 2;
                }
                else
                {
                    await cout2('Игрок выстрелил в себя...');
                    playerHP--;
                }
                update();
                await check('dealer');
            }
            else
            {
                
                await cout2('Пусто!');
                await cout2('Игрок сохраняет ход.');
                await check('player');
            }
        }
    }
    else if (user === 'dealer')
    {
        if (target === 'dealer')
        {
            await cout2('Дилер стреляет в себя...');
            if (current === 1)
            {
                if (sawUsed === true)
                {
                    await cout2('Дилер совершает самоубийство...');
                    dealerHP -= 2;
                }
                else
                {
                    await cout2('Боевой...');
                    dealerHP--;
                }
                update();
                await check('player');
            }
            else
            {
                await cout2('Пусто!');
                await cout2('Дилер сохраняет ход!')
                await check('dealer');
            }
        }
        else if (target === 'player')
        {
            await cout2('Дилер стреляет в игрока...');
            if (current === 1)
            {
                if (sawUsed === true)
                {
                    await cout2('Игрок получает двойной урон!');
                    playerHP -= 2;
                }
                else
                {
                    await cout2('Игрок получает урон');
                    playerHP--;
                }
                update();
                
            }
            else
            {
                await cout2('Пусто!');
            }
            await check('player');
        }
    }
    if (sawUsed === true) sawUsed = false;
}

const useItem = async (index, user) => {
    let inventory = (user === 'player') ? playerItems : dealerItems;
    let itemn = inventory[index];
    if (itemn === null) return;
     if (itemn === 'cig')
     {
        if (user === 'player')
        {
            await cout2('Игрок затягивается сигаретой...');
            if (playerHP < maxHP)
            {
                playerHP++;
                await cout2('...и восстанавливает 1 ХП!');
            }
            else
            {
                await cout2('Но у него уже максимальное ХП!');
                await cout2('ЛОХ!');
            }
        }
        else
        {
            await cout2('Дилер нервно курит...');
            if (dealerHP < maxHP)
            {
                await cout2('...и восстанавливает 1 ХП!');
                dealerHP++;
            }
            else
            {
                await cout2('Но у него уже максимальное ХП!');
                await cout2('ЛОХ!');
            }
        }
        update();
     }
     else if (itemn === 'beer')
     {
        if (user === 'player') await cout2('Игрок тянется к пиву...');
        else await cout2('Дилер решает прибухнуть...');
        await cout2('Патрон вылетает из патронника...');
        let dis = shotgun.shift();
        if (dis === 1) await cout2('БОЕВОЙ');
        else await cout2('ХОЛОСТОЙ');
     }
     else if (itemn === 'glass')
     {
        if (user === 'dealer')
        {
            await cout2('Дилер тянется за лупой...');
            await cout2('Дилер что-то понял');
        }
        else
        {
            await cout2('Игрок берётся за лупу...');
            if (shotgun[0] === 1) await cout2('БОЕВОЙ');
            else await cout2('ХОЛОСТОЙ');
        }
     }
     else if (itemn === 'saw')
     {
        if (user === 'player') await cout2('Игрок зачем-то обрезает ствол...');
        else await cout2('Дилер выполняет обрезание...');
        sawUsed = true;
     }
     else if (itemn === 'cuffs')
     {
        if (user === 'player')
        {
            await cout2('Игрок заковывает дилера в наручники...');
            dealerCuffed = true;
        }
        else
        {
            await cout2('Дилер заковывает игрока');
            playerCuffed = true;
        } 
     }
}

const use = async (itemn) => {
    if (!dealerItems.includes(itemn)) return;
    let itemIndex = dealerItems.indexOf(itemn);
    let btn = document.getElementById(`dealer-${itemIndex + 1}`);
    btn.innerHTML = "";
    await useItem(itemIndex, 'dealer');
    dealerItems[itemIndex] = null;
}

const dealerTurn = async () => {
    if (shotgun.length === 0)
    {
        await cout2('ошибка: при ходе дилера дробовик пуст');
        return;
    }
    if (dealerCuffed === true)
    {
        dealerCuffed = false;
        await cout2('Дилер в наручниках.');
        await cout2('Ход игрока');
        playerTurn = 1;
        return;
    }
    await cout2('Ход дилера');
    cur = dealerKnown[0];
    //await cout2(cur);
    let shotgunSum = 0;
    for (let i = 0; i < shotgun.length; i++)
    {
        shotgunSum += shotgun[i];
    }
    let shotgunAverage = shotgunSum / shotgun.length;
    //await cout(shotgunAverage);
    if (cur === null) //использование лупы
    {
        if (smart()) await use('glass');
    }
    else
    {
        if (!smart()) await use('glass');
    }
    if (dealerItems.includes('beer')) 
    {
        if (cur === null) //использование пива
        {
            if (smart())
            {
                await use('beer');
                return await dealerTurn();
            }
        }
        else
        {
            if (!smart())
            {
                await use('beer');
                return await dealerTurn();
            }
        }   
    }
    if (playerHP < maxHP) //использование сигарет
    {
        if (smart()) await use('cig');
    }
    else
    {
        if (!smart()) await use('cig');
    }
    if (playerCuffed === false) //использование наручников
    {
        if (smart()) await use('cuffs');
    }
    if (cur === 1) //использование пилы и стрельба
    {
        if (smart()) await use('saw');
        if (smart()) await shoot('dealer', 'player');
        else  await shoot('dealer', 'dealer');
    }
    else if (cur === 0)
    {
        if (!smart()) await use('saw');
        if (smart()) await shoot('dealer', 'dealer');
        else await shoot('dealer', 'player');
    }
    else if (cur === null)
    {
        if (smart()) await use('beer');
        if (shotgunAverage >= 0.5)
        {
            if (Math.random >= 0.5) await use('cig');
            await shoot('dealer', 'player');
        }
        else
        {
            if (!smart()) await use('cig');
            await shoot('dealer', 'dealer');
        }
    }
}

shotgunBtn.addEventListener('click', async () => {
    if (playerTurn === false) return;
    playerTurn = false;
    choice = true;
    await cout2('В кого стрелять будем?');
})

dealerBtn.addEventListener('click', async () => {
    if (choice === false) return;
    choice = false;
    await cout2('Стреляем в дилера');
    await sleep(st);
    await shoot('player', 'dealer');
})

playerBtn.addEventListener('click', async () => {
    if (checkReady === true)
    {
        checkReady = false;
        if (nextcheck === 'player')
        {
            await cout2('Ход игрока.');
            playerTurn = true;
        }
        else dealerTurn();
    }
    if (choice === false) return;
    choice = false;
    await cout2('Стреляем в себя');
    await sleep(st);
    await shoot('player', 'player');
})

for (let i = 0; i < 4; i++)
{
    let btn = document.getElementById(`player-${i + 1}`);
    if (btn) {
        btn.addEventListener('click', () => {
            if (playerTurn === false) return;
            useItem(i, 'player');
            playerItems[i] = null;
            btn.innerHTML = "";
        })
    }
}

update();
start();




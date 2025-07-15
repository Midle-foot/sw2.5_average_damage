window.runSimulation = function () {
  const power = Number(document.getElementById("power").value);
  const critical = Number(document.getElementById("critical").value);
  const damage = Number(document.getElementById("damage").value);
  const special = Number(document.getElementById("special").value);
  const ray = Number(document.getElementById("ray").value);
  const trials = Number(document.getElementById("trials").value);
  const threshold = Number(document.getElementById("threshold").value);

  const k_power = {
    0:  [0,0,0,1,2,2,3,3,4,4],
    1:  [0,0,0,1,2,2,3,3,4,4],
    2:  [0,0,0,1,2,3,4,4,4,4],
    3:  [0,0,1,1,2,3,4,4,4,5],
    4:  [0,0,1,2,2,3,4,4,5,5],
    5:  [0,1,1,2,2,3,4,5,5,5],
    6:  [,,,,,,,,,],
    7:  [,,,,,,,,,],
    8:  [,,,,,,,,,],
    9:  [,,,,,,,,,],
    10: [,,,,,,,,,],
    11: [,,,,,,,,,],
    12: [,,,,,,,,,],
    13: [1,2,3,3,4,4,5,6,7,7],
    28: [2,3,4,6,6,8,9,9,10,10],
    43: [4,6,7,8,9,10,11,12,13,14]
  };

  let result = "";

  if (!(power in k_power)) {
    result = "威力表は 0, 13, 28, 43 のいずれかを入力してください。";
    document.getElementById("result").textContent = result;
    return;
  }
  if (critical < 3 || critical > 13) {
    result = "クリティカル値は3〜13の範囲で入力してください。";
    document.getElementById("result").textContent = result;
    return;
  }
  if (special < 0 || special > 2) {
    result = "必殺は0〜2の範囲で入力してください。";
    document.getElementById("result").textContent = result;
    return;
  }
  if (ray < 0 || ray > 3) {
    result = "クリレイは0〜3の範囲で入力してください。";
    document.getElementById("result").textContent = result;
    return;
  }
  if (trials < 1) {
    result = "試行回数は1以上の整数を入力してください。";
    document.getElementById("result").textContent = result;
    return;
  }

  result += `威力表 = ${power}\n`;
  result += `C値 = ${critical}\n`;
  result += `追加D = ${damage}\n`;
  result += `必殺 = ${special}\n`;
  result += `クリレイ = ${ray}\n`;
  result += `試行回数 = ${trials}\n`;
  result += `しきい値 = ${threshold}\n\n`;

  let valueMax = 0;
  let damageAll = 0;
  let countMax = 0;
  let overThresholdCount = 0;

  for (let n = 0; n < trials; n++) {
    let count = 0;
    let dice = 100;
    let valueOnce = 0;

    while (dice >= critical) {
      dice = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);

      if (dice === 2) {
        count++;
        break;
      }

      if (count === 0 && ray >= 1) {
        dice += ray;
      }

      dice += special;
      if (dice >= 13) dice = 12;

      const value = k_power[power][dice - 3];
      valueOnce += value;
      damageAll += value;

      if (valueMax < valueOnce) {
        valueMax = valueOnce;
        countMax = count;
      }

      count++;
    }

    valueOnce += damage;
    if (valueOnce >= threshold) {
      overThresholdCount++;
    }
  }

  const avgDamage = damageAll / trials + damage;
  const probability = (overThresholdCount / trials * 100).toFixed(2);

  result += `平均ダメージ = ${avgDamage.toFixed(3)}\n`;
  result += `最大ダメージ = ${valueMax}\n`;
  result += `最大回転数 = ${countMax}\n`;
  result += `→ ${threshold} 以上の確率 = ${probability} %\n`;

  document.getElementById("result").textContent = result;
}

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
    6:  [0,1,1,2,3,3,4,5,5,5],
    7:  [0,1,1,2,3,4,4,5,5,6],
    8:  [0,1,2,2,3,4,4,5,6,6],
    9:  [0,1,2,3,3,4,4,5,6,7],
    10: [1,1,2,3,3,4,5,6,6,7],
    11: [1,2,2,3,3,4,5,6,6,7],
    12: [1,2,3,3,4,4,5,6,7,7],
    13: [1,2,3,3,4,4,5,6,7,7],
    14: [1,2,3,4,4,4,5,6,7,8],
    15: [1,2,3,4,4,5,5,6,7,8],
    16: [1,2,3,4,4,5,6,7,7,8],
    17: [1,2,3,4,5,5,6,7,7,8],
    18: [1,2,3,4,5,6,6,7,7,8],
    19: [1,2,3,4,5,6,7,7,8,9],
    20: [1,2,3,4,5,6,7,8,9,10],
    21: [1,2,3,4,6,6,7,8,9,10],
    22: [1,2,3,5,6,6,7,8,9,10],
    23: [2,2,3,5,6,7,7,8,9,10],
    24: [2,3,4,5,6,7,7,8,9,10],
    25: [2,3,4,5,6,7,8,8,9,10],
    26: [2,3,4,5,6,8,8,9,9,10],
    27: [2,3,4,6,6,8,8,9,9,10],
    28: [2,3,4,6,6,8,9,9,10,10],
    29: [2,3,4,6,7,8,9,9,10,10],
    30: [2,4,4,6,7,8,9,10,10,10],
    31: [2,4,5,6,7,8,9,10,10,11],
    32: [3,4,5,6,7,8,10,10,10,11],
    33: [3,4,5,6,8,8,10,10,10,11],
    34: [3,4,5,6,8,9,10,10,11,11],
    35: [3,4,5,7,8,9,10,10,11,12],  
    36: [3,5,5,7,8,9,10,11,11,12],
    37: [3,5,6,7,8,9,10,11,12,12],
    38: [3,5,6,7,8,10,10,11,12,13],
    39: [4,5,6,7,8,10,11,11,12,13],
    40: [4,5,6,7,9,10,11,11,12,13],
    41: [4,6,6,7,9,10,11,12,12,13],
    42: [4,6,7,7,9,10,11,12,13,13],
    43: [4,6,7,8,9,10,11,12,13,14]
    43: [4,6,7,8,9,10,11,12,13,14],
    44: [4,6,7,8,10,10,11,12,13,14],
    45: [4,6,7,9,10,10,11,12,13,14],
    46: [4,6,7,9,10,10,12,13,13,14],
    47: [4,6,7,9,10,11,12,13,13,15],
    48: [4,6,7,9,10,12,12,13,14,15],
    49: [4,6,7,10,10,12,12,13,14,15],
    50: [4,6,8,10,10,12,12,13,15,15]
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

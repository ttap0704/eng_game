const arr = [
  { word: "사과", mean: "apple" },
  { word: "더하기", mean: "add" },
  { word: "컵", mean: "cup" },
  { word: "마우스", mean: "mouse" },
];

const answer = [];
let question = [];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function getEmptyArray(leng) {
  let arr = [];
  for (i = 0; i < leng; i++) {
    arr.push("*");
  }

  return arr;
}

function makeQuestionArray(arr, random_keys_arr, max) {
  let quetion_arr = arr;``
  for (let i = 0, leng = arr.length; i < leng; i++) {

  }
  quetion_arr.unshift(getEmptyArray(max));
  quetion_arr.push(getEmptyArray(max));
  console.log(quetion_arr);
  return arr;
}

function init(arr, max) {
  const random_keys_arr = shuffle([...Array(arr.length * 2).keys()]);
  question = makeQuestionArray(arr, random_keys_arr, max);

  const wrap = document.getElementById("wrap");

  for (let i = 0, leng = question.length; i < leng; i++) {
    const x = question[i];
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0, jleng = x.length; j < jleng; j++) {
      const y = x[j];
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.innerHTML = y;

      row.append(cell);
      if (y != "*") {
        cell.classList.add("target");
        cell.addEventListener("click", () => {
          onClickTarget(i, j);
        });
      }
    }

    wrap.append(row);
  }
}

function onClickTarget(x, y) {
  const target = question[x][y];
  answer.push(target);
  console.log(answer, x, y);
}

init(arr, 4);

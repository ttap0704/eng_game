const arr = [
  { word: "사과", mean: "apple" },
  { word: "더하기", mean: "add" },
  { word: "컵", mean: "cup" },
  { word: "마우스", mean: "mouse" },
  { word: "남자", mean: "man" },
  { word: "여자", mean: "woman" },
  { word: "소년", mean: "boy" },
  { word: "소녀", mean: "girl" },
  { word: "가족", mean: "family" },
  { word: "집", mean: "home" },
  { word: "가다", mean: "go" },
  { word: "뒤", mean: "back" },
];

let answer = [];
let answer_ids = [];
let answer_coordinate = [];
let question = [
  ["*", "*", "*", "*", "*", "*"],
  ["*", "home", "cup", "family", "*", "*"],
  ["*", "남자", "girl", "mouse", "컵", "*"],
  ["*", "가다", "go", "add", "boy", "*"],
  ["*", "woman", "가족", "apple", "man", "*"],
  ["*", "back", "집", "소녀", "소년", "*"],
  ["*", "더하기", "뒤", "마우스", "여자", "*"],
  ["*", "*", "*", "*", "*", "*"],
];

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
  for (i = 0; i < leng + 2; i++) {
    arr.push("*");
  }

  return arr;
}

function makeQuestionArray(arr, random_keys_arr, max) {
  let quetion_arr = [];
  for (let i = 0, leng = arr.length / 2; i < leng; i++) {
    let row = [];
    for (let j = 0, jleng = max + 2; j < jleng; j++) {
      if (j == 0 || j == max + 1) {
        row.push("*");
      } else {
        const cur_idx = random_keys_arr[j - 1 + i * max];
        const target = arr[Math.abs(Math.ceil(cur_idx / 2 - 0.5))];
        if (cur_idx % 2 == 0) {
          row.push(target.word);
        } else {
          row.push(target.mean);
        }
      }
    }
    quetion_arr.push(row);
  }
  quetion_arr.unshift(getEmptyArray(max));
  quetion_arr.push(getEmptyArray(max));
  return quetion_arr;
}

function checkAnswer() {
  const check_item = arr.find((item) => {
    return (
      (item.word == answer[0] && item.mean == answer[1]) ||
      (item.word == answer[1] && item.mean == answer[0])
    );
  });

  if (check_item) return true;
  else return false;
}

function findCourse() {
  const first_answer =
    question[answer_coordinate[0][0]][answer_coordinate[0][1]];
  const second_answer =
    question[answer_coordinate[1][0]][answer_coordinate[1][1]];

  const first_x = answer_coordinate[0][0];
  const first_y = answer_coordinate[0][1];
  const second_x = answer_coordinate[1][0];
  const second_y = answer_coordinate[1][1];

  console.log(first_x, first_y);

  const around = {
    first_left: question[first_x][first_y - 1],
    first_up: question[first_x - 1][first_y],
    first_right: question[first_x][first_y + 1],
    first_down: question[first_x + 1][first_y],
    second_left: question[second_x][second_y - 1],
    second_up: question[second_x - 1][second_y],
    second_right: question[second_x][second_y + 1],
    second_down: question[second_x + 1][second_y],
  };

  const dir_arr = ["left", "up", "right", "down"];
  const num_arr = ["first", "second"];

  const change_dir_arr = [];
  if (first_x < second_x) {
    change_dir_arr.push("down");
  } else if (first_x > second_x) {
    change_dir_arr.push("up");
  } else {
    change_dir_arr.push(null);
  }

  if (first_y < second_y) {
    change_dir_arr.push("right");
  } else if (first_y > second_y) {
    change_dir_arr.push("left");
  } else {
    change_dir_arr.push(null);
  }

  console.log(change_dir_arr)

  for (const dir1 of dir_arr) {
    for (const dir2 of dir_arr) {
      // 붙어있는 정답 체크
      const check_near_item = arr.find((item) => {
        return (
          (around[`first_${dir1}`] == item.mean &&
            around[`second_${dir2}`] == item.word) ||
          (around[`first_${dir1}`] == item.word &&
            around[`second_${dir2}`] == item.mean)
        );
      });
      if (check_near_item) {
        setRightAnswer();
        return;
      }
    }

    if (around[`first_${dir1}`] == "*") {
      let x_move = 1;
      let y_move = 1;
      let check_cnt = 0;
      let change_dir_cnt = 0;
      let target_dir = dir1;
      let target = around[`first_${dir1}`];
      let right_answer = false;
      let checked_answer = "";

      let target_x = first_x;
      let target_y = first_y;
      while (!right_answer) {
        if (target_dir == "left") {
          target_y = first_y - y_move;
        } else if (target_dir == "up") {
          target_x = first_x - x_move;
        } else if (target_dir == "right") {
          target_y = first_y + y_move;
        } else if (target_dir == "down") {
          target_x = first_x + x_move;
        }
        
        if (question[target_x]) {
          target = question[target_x][target_y];

          if (
            question[target_x][target_y - 1]
            // second_answer == question[target_x][target_y - 1]
          )
            // checked_answer = question[target_x][target_y - 1];
            console.log(question[target_x][target_y - 1]);
          if (
            question[target_x - 1] &&
            question[target_x - 1][target_y]
            // second_answer == question[target_x - 1][target_y]
          )
            // checked_answer = question[target_x - 1][target_y];
            console.log(question[target_x - 1][target_y]);
          if (
            question[target_x][target_y + 1]
            // second_answer == question[target_x][target_y + 1]
          )
            // checked_answer = question[target_x][target_y + 1];
            console.log(question[target_x][target_y + 1]);
          if (
            question[target_x + 1] &&
            question[target_x + 1][target_y]
            // second_answer == question[target_x + 1][target_y]
          )
            // checked_answer = question[target_x + 1][target_y];
            console.log(question[target_x + 1][target_y]);

          if (checked_answer.length > 0) {
            console.log(checked_answer);
            right_answer = true;
          }
          if (check_cnt > 100) right_answer = true;
          if (["left", "right"].includes(target_dir)) {
            y_move++;
          } else {
            x_move++;
          }
        } else {
          change_dir_cnt++;
          if (["left", "right"].includes(target_dir)) {
            target_dir = change_dir_arr[0];
          } else {
            target_dir = change_dir_arr[1];
          }

          if (!target_dir) break;
          if (change_dir_cnt > 5) {
            right_answer = true;
          }
        }
        check_cnt++;
      }
    }
  }
}

function setRightAnswer() {
  alert("정답입니다!");
  question[answer_coordinate[0][0]][answer_coordinate[0][1]] = "*";
  question[answer_coordinate[1][0]][answer_coordinate[1][1]] = "*";
  setQuestion();
}

function setQuestion() {
  const wrap = document.getElementById("wrap");
  wrap.innerHTML = "";
  for (let i = 0, leng = question.length; i < leng; i++) {
    const x = question[i];
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0, jleng = x.length; j < jleng; j++) {
      const y = x[j];
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", `question_${j + i * x.length}`);
      cell.innerHTML = y;

      row.append(cell);
      if (y != "*") {
        cell.classList.add("target");
        cell.addEventListener("click", () => {
          onClickTarget(i, j, j + i * x.length);
        });
      }
    }

    wrap.append(row);
  }
}

function init(arr, max) {
  const random_keys_arr = shuffle([...Array(arr.length * 2).keys()]);
  // question = makeQuestionArray(arr, random_keys_arr, max);
  setQuestion();
}

function onClickTarget(x, y, question_number) {
  const target = question[x][y];
  if (answer.includes(target)) {
    alert("같은 영역은 선택할 수 없습니다.");
    return;
  }

  answer.push(target);
  answer_ids.push(question_number);
  answer_coordinate.push([x, y]);

  const el = document.getElementById(`question_${question_number}`);
  el.style.border = "1px solid red";

  setTimeout(() => {
    if (answer.length == 2) {
      const check = checkAnswer();
      if (check) {
        findCourse();
      } else {
        alert("정답이 아닙니다.");
      }

      answer = [];
      answer_coordinate = [];
      for (const number of answer_ids) {
        const before = document.getElementById(`question_${number}`);
        before.style.border = 0;
      }
    }
  }, 0);
}

init(arr, 4);

const arr = [
  {word: "사과", mean: "apple"},
  {word: "더하기", mean: "add"},
  {word: "컵", mean: "cup"},
  {word: "마우스", mean: "mouse"},
  {word: "남자", mean: "man"},
  {word: "여자", mean: "woman"},
  {word: "소년", mean: "boy"},
  {word: "소녀", mean: "girl"},
  {word: "가족", mean: "family"},
  {word: "집", mean: "home"},
  {word: "가다", mean: "go"},
  {word: "뒤", mean: "back"},
];

let answer = [];
let answer_arr = [];
let answer_ids = [];
let answer_coordinate = [];
let question = [];
let question_answer_ar = [];
let ok_cnt = 0;

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
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
        const target_idx = Math.abs(Math.ceil(cur_idx / 2 - 0.5));
        const target = arr[target_idx];

        if (cur_idx % 2 == 0) {
          const find_mean_idx = answer_arr.findIndex((item) => item.mean == target.mean);
          if (find_mean_idx >= 0) {
            answer_arr[find_mean_idx].word_idx = [i + 1, j];
          } else {
            answer_arr.push({...target, word_idx: [i + 1, j]});
          }
          row.push(target.word);
        } else {
          const find_word_idx = answer_arr.findIndex((item) => item.word == target.word);
          if (find_word_idx >= 0) {
            answer_arr[find_word_idx].mean_idx = [i + 1, j];
          } else {
            answer_arr.push({...target, mean_idx: [i + 1, j]});
          }
          row.push(target.mean);
        }
      }
    }
    quetion_arr.push(row);
  }

  quetion_arr.unshift(getEmptyArray(max));
  quetion_arr.push(getEmptyArray(max));
  return {quetion_arr, answer_arr};
}

function checkPossibleQuetions(tmp_question, check_arr) {
  let possible_cnt = 0;
  const answer_arr = check_arr.map((item) => [[...item.word_idx], [...item.mean_idx]]);

  for (const idx_arr of answer_arr) {
    const possible_res = findCourse(idx_arr[0][0], idx_arr[0][1], 0, 0, tmp_question, idx_arr[1][0], idx_arr[1][1]);
    if (possible_res) {
      console.log(possible_res);
      possible_cnt++;
    }
  }

  return possible_cnt;
}

function checkAnswer() {
  const check_item = arr.find((item) => {
    return (item.word == answer[0] && item.mean == answer[1]) || (item.word == answer[1] && item.mean == answer[0]);
  });

  if (check_item) return true;
  else return false;
}

function setRightAnswer() {
  alert("정답입니다!");
  ok_cnt++;
  question[answer_coordinate[0][0]][answer_coordinate[0][1]] = "*";
  question[answer_coordinate[1][0]][answer_coordinate[1][1]] = "*";
  check_count = checkPossibleQuetions(question, answer_arr);
  console.log(check_count);
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
  let check_count = 0;
  // const random_keys_arr = shuffle([...Array(arr.length * 2).keys()]);
  // const question_res = makeQuestionArray(arr, random_keys_arr, max);
  // question = question_res.quetion_arr;
  while (!(check_count > 3)) {
    const random_keys_arr = shuffle([...Array(arr.length * 2).keys()]);
    const question_res = makeQuestionArray(arr, random_keys_arr, max);
    question = question_res.quetion_arr;
    const check_arr = question_res.answer_arr;
    check_count = checkPossibleQuetions(question, check_arr);
  }
  setQuestion();
}

function findCourse(next_x, next_y, direction, trun_num, tmp_question, second_x, second_y, dir_arr) {
  const second_answer_x = second_x ? second_x : answer_coordinate[1][0];
  const second_answer_y = second_y ? second_y : answer_coordinate[1][1];
  const target_question = tmp_question ? tmp_question : question;
  if (trun_num > 2) {
    return false;
  } else {
    if (0 <= next_x && next_x < question.length && 0 <= next_y && next_y < question[0].length) {
      if (direction == 0) {
        right_answer = findCourse(next_x, next_y + 1, 1, trun_num, tmp_question, second_x, second_y, [
          `${next_x}_${next_y}_right`,
        ]);
        if (right_answer) {
          return right_answer;
        }
        right_answer = findCourse(next_x, next_y - 1, 2, trun_num, tmp_question, second_x, second_y, [
          `${next_x}_${next_y}_left`,
        ]);
        if (right_answer) {
          return right_answer;
        }
        right_answer = findCourse(next_x + 1, next_y, 3, trun_num, tmp_question, second_x, second_y, [
          `${next_x}_${next_y}_down`,
        ]);
        if (right_answer) {
          return right_answer;
        }
        right_answer = findCourse(next_x - 1, next_y, 4, trun_num, tmp_question, second_x, second_y, [
          `${next_x}_${next_y}_up`,
        ]);
        if (right_answer) {
          return right_answer;
        }
        return false;
      } else if (direction == 1) {
        if (target_question[next_x][next_y] == "*") {
          right_answer = findCourse(next_x, next_y + 1, 1, trun_num, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_right`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x + 1, next_y, 3, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_down`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x - 1, next_y, 4, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_up`,
          ]);
          if (right_answer) {
            return right_answer;
          }
          return false;
        } else if (target_question[second_answer_x][second_answer_y] == target_question[next_x][next_y]) {
          return dir_arr;
        }
      } else if (direction == 2) {
        if (target_question[next_x][next_y] == "*") {
          right_answer = findCourse(next_x, next_y - 1, 2, trun_num, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_left`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x + 1, next_y, 3, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_down`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x - 1, next_y, 4, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_up`,
          ]);
          if (right_answer) {
            return right_answer;
          }
          return false;
        } else if (target_question[second_answer_x][second_answer_y] == target_question[next_x][next_y]) {
          return dir_arr;
        }
      } else if (direction == 3) {
        if (target_question[next_x][next_y] == "*") {
          right_answer = findCourse(next_x, next_y + 1, 1, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_right`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x, next_y - 1, 2, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_left`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x + 1, next_y, 3, trun_num, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_down`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          return false;
        } else if (target_question[second_answer_x][second_answer_y] == target_question[next_x][next_y]) {
          return dir_arr;
        }
      } else if (direction == 4) {
        if (target_question[next_x][next_y] == "*") {
          right_answer = findCourse(next_x, next_y + 1, 1, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_right`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x, next_y - 1, 2, trun_num + 1, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_left`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          right_answer = findCourse(next_x - 1, next_y, 4, trun_num, tmp_question, second_x, second_y, [
            ...dir_arr,
            `${next_x}_${next_y}_up`,
          ]);
          if (right_answer) {
            return right_answer;
          }

          return false;
        } else if (target_question[second_answer_x][second_answer_y] == target_question[next_x][next_y]) {
          return dir_arr;
        }
      }
    } else {
      return false;
    }
  }
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
  el.style.border = "1.5px solid red";

  setTimeout(() => {
    if (answer.length == 2) {
      const check = checkAnswer();
      if (check) {
        const target_x = answer_coordinate[0][0];
        const target_y = answer_coordinate[0][1];
        // next_x, next_y, direction, trun_num;
        const check_answer = findCourse(target_x, target_y, 0, 0);
        console.log(check_answer);
        if (check_answer) {
          setRightAnswer();
        }
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

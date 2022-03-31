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
let answer_arr = [];
let answer_ids = [];
let answer_coordinate = [];
let question = [];
let ok_cnt = 0;

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
        const target_idx = Math.abs(Math.ceil(cur_idx / 2 - 0.5));
        const target = arr[target_idx];

        if (cur_idx % 2 == 0) {
          const find_mean_idx = answer_arr.findIndex(
            (item) => item.mean == target.mean
          );
          if (find_mean_idx >= 0) {
            answer_arr[find_mean_idx].word_idx = [i + 1, j];
          } else {
            answer_arr.push({ ...target, word_idx: [i + 1, j] });
          }
          row.push(target.word);
        } else {
          const find_word_idx = answer_arr.findIndex(
            (item) => item.word == target.word
          );
          if (find_word_idx >= 0) {
            answer_arr[find_word_idx].mean_idx = [i + 1, j];
          } else {
            answer_arr.push({ ...target, mean_idx: [i + 1, j] });
          }
          row.push(target.mean);
        }
      }
    }
    quetion_arr.push(row);
  }

  quetion_arr.unshift(getEmptyArray(max));
  quetion_arr.push(getEmptyArray(max));
  return { quetion_arr, answer_arr };
}

function checkPossibleQuetions(check_arr) {
  let possible_cnt = 0;
  const answer_arr = check_arr.map((item) => [
    [...item.word_idx],
    [...item.mean_idx],
  ]);

  for (const idx_arr of answer_arr) {
    const possible_res = findCourse(idx_arr);
    if (possible_res) possible_cnt++;
  }

  return possible_cnt;
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

function checkLine(dir, t_x, t_y, f_x, f_y, s_x, s_y) {
  let next_dir = '';
  if (['left', 'right'].includes(dir)) {
    if (f_x > s_x) next_dir = "up";
    else if (f_x < s_x) next_dir = "down";

    if (next_dir == 'up') {
      for (let i = t_x; i <= s_x; i++) {
        if (question[i] && question[i][t_y] != '*') return false;
      }
    } else if (next_dir == 'down') {
      for (let i = t_x; i >= s_x; i--) {
        if (question[i] && question[i][t_y] != '*') return false;
      }
    }
  } else if (['up', 'down'].includes(dir)) {
    if (f_y > s_y) next_dir = 'left'
    else if (f_y < s_y) next_dir = 'right'

    if (next_dir == 'left') {
      for (let i = t_y; i >= s_y; i--) {
        if (question[t_x][i] && question[t_x][i] != '*') return false;
      }
    } else if (next_dir == 'right') {
      for (let i = t_y; i <= s_y; i++) {
        if (question[t_x][i] && question[t_x][i] != '*') return false;
      }
    }
  }

  return true;
}

function findCourse(check_arr) {
  const target_coordinate = check_arr ? check_arr : answer_coordinate;

  const first_answer =
    question[target_coordinate[0][0]][target_coordinate[0][1]];
  const second_answer =
    question[target_coordinate[1][0]][target_coordinate[1][1]];

  let first_x = target_coordinate[0][0];
  let first_y = target_coordinate[0][1];
  let second_x = target_coordinate[1][0];
  let second_y = target_coordinate[1][1];

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

  for (const dir1 of dir_arr) {
    let course_arr = [];
    if (
      [second_x - 1, second_x + 1, second_x].includes(first_x) &&
      [second_y - 1, second_x + 1, second_y].includes(first_y)
    ) {
      // 붙어있는 정답 체크
      const check_near_item = arr.find((item) => {
        return (
          ([
            around["first_left"],
            around["first_up"],
            around["first_right"],
            around["first_down"],
          ].includes(item.word) &&
            first_answer == item.mean) ||
          ([
            around["first_left"],
            around["first_up"],
            around["first_right"],
            around["first_down"],
          ].includes(item.mean) &&
            first_answer == item.word)
        );
      });
      if (check_near_item) {
        if (check_arr) {
          return true;
        } else {
          setRightAnswer();
        }
        return;
      }
    }
    console.log(question.length, question[0].length);

    // for (const target_num of ["first", "second"]) {
    let target = around[`first_${dir1}`];
    if (target == "*") {
      let x_move = 0;
      let y_move = 0;
      let check_cnt = 0;
      let change_dir_cnt = 0;
      let target_dir = dir1;
      let changed_dir = "";
      let right_answer = false;

      let target_x = first_x;
      let target_y = first_y;

      let check_border_x = false;
      let check_border_y = false;
      if ([1, question.length - 2].includes(second_x)) {
        check_border_x = true;
      }
      if ([1, question[0].length - 2].includes(second_y)) {
        check_border_y = true;
      }

      while (!right_answer) {
        let checked_answer = "";
        if (["left", "right"].includes(target_dir)) {
          y_move++;
        } else {
          x_move++;
        }

        let need_change = false;

        if (target_dir == "left") {
          if (target_y == second_y && checkLine(target_dir, target_x, target_y, first_x, first_y, second_x, second_y)) {
            console.log(`need_change`, 'left')
            need_change = true;
          }
          target_y = first_y - y_move;
        } else if (target_dir == "up") {
          if (target_x == second_x && checkLine(target_dir, target_x, target_y, first_x, first_y, second_x, second_y)) {
            console.log(`need_change`, 'up')
            need_change = true;
          }
          target_x = first_x - x_move;
        } else if (target_dir == "right") {
          if (target_y == second_y && checkLine(target_dir, target_x, target_y, first_x, first_y, second_x, second_y)) {
            console.log(`need_change`, 'right')
            need_change = true;
          }
          target_y = first_y + y_move;
        } else if (target_dir == "down") {
          if (target_x == second_x && checkLine(target_dir, target_x, target_y, first_x, first_y, second_x, second_y)) {
            console.log(`need_change`, 'down')
            need_change = true;
          }
          target_x = first_x + x_move;
        }

        console.log(dir1, target_dir, target_x, target_y, second_x, second_y, x_move, y_move);
        if (
          !need_change &&
          question[target_x] &&
          question[target_x][target_y] &&
          question[target_x][target_y] == "*"
        ) {
          target = question[target_x][target_y];

          if (dir1 == target_dir) {
            course_arr.push({ x: target_x, y: target_y, dir: dir1 });
          } else {
            const check_idx = course_arr.findIndex(
              (item) => item.dir == `${dir1}_${target_dir}`
            );
            if (check_idx >= 0) {
              course_arr.push({
                x: target_x,
                y: target_y,
                dir: target_dir,
              });
            } else {
              course_arr.push({
                x: target_x,
                y: target_y,
                dir: `${dir1}_${target_dir}`,
              });
            }
          }

          let answer_dir = "";

          if (change_dir_cnt < 2) {
            if (
              question[target_x][target_y - 1] &&
              second_answer == question[target_x][target_y - 1]
            ) {
              answer_dir = "left";
              checked_answer = question[target_x][target_y - 1];
            }

            if (
              question[target_x - 1] &&
              question[target_x - 1][target_y] &&
              second_answer == question[target_x - 1][target_y]
            ) {
              answer_dir = "up";
              checked_answer = question[target_x - 1][target_y];
            }

            if (
              question[target_x][target_y + 1] &&
              second_answer == question[target_x][target_y + 1]
            ) {
              answer_dir = "right";
              checked_answer = question[target_x][target_y + 1];
            }

            if (
              question[target_x + 1] &&
              question[target_x + 1][target_y] &&
              second_answer == question[target_x + 1][target_y]
            ) {
              answer_dir = "down";
              checked_answer = question[target_x + 1][target_y];
            }
          } else {
            if (question[target_x][target_y] != "*") {
              answer_dir = target_dir;
              checked_answer = question[target_x][target_y];
            }
          }

          if (checked_answer.length > 0) {
            if (change_dir_cnt <= 2) {
              if (check_arr) {
                console.log(check_arr);
                return true;
              } else {
                course_arr.push({
                  x: target_x,
                  y: target_y,
                  dir: `${target_dir}_${answer_dir}`,
                });

                right_answer = true;
                setRightAnswer();
                console.log(course_arr, checked_answer, change_dir_cnt);
                return;
              }
            } else {
              right_answer = true;
              console.log(course_arr, checked_answer, change_dir_cnt, "??");
              break;
            }
          }
        } else {
          change_dir_cnt++;

          if (["left", "right"].includes(target_dir)) {
            if (target_dir == "left") {
              if (target_y < 0) target_y++;
            } else if (target_dir == "right") {
              if (target_y > question[0].length - 1) target_y--;
            }
            if (target_x > second_x) {
              target_dir = "up";
            } else if (target_x < second_x) {
              target_dir = "down";
            }

          } else if (["up", "down"].includes(target_dir)) {
            if (target_dir == "up") {
              if (target_x < 0) target_x++;
            } else if (target_dir == "down") {
              if (target_x > question.length - 1) target_x--;
            }
            if (target_y > second_y) {
              target_dir = "left";
            } else if (target_y < second_y) {
              target_dir = "right";
            }
          }

          if (!target_dir) break;
        }
        if (check_cnt > 20) {
          right_answer = true;
        }
        check_cnt++;
      }
    }
    // }
  }

  if (check_arr) return false;
}

function setRightAnswer() {
  alert("정답입니다!");
  ok_cnt++;
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
  console.log(wrap)
  let check_count = 0;
  while (!(check_count > 3)) {
    const random_keys_arr = shuffle([...Array(arr.length * 2).keys()]);
    const question_res = makeQuestionArray(arr, random_keys_arr, max);
    question = question_res.quetion_arr;
    const check_arr = question_res.answer_arr;
    check_count = checkPossibleQuetions(check_arr);
  }
  console.log(check_count);
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
  el.style.border = "1.5px solid red";

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

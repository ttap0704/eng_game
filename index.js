// 게임 진행
// 1. 선이 이동할 수 있는 경로의
// 2. 맞는 뜻, 단어를 클릭하여 정답을 맞춤
// 3. 더 이상 맞출 수 있는 정답이 없을 경우, 또는 모든 문제를 맞출 경우 처음부터 다시 시작

// 게임 규칙
// 1. 선은 2번 이상 꺾을 수 없음
// 2. 붙어 있는 맞는 뜻, 단어는 정답으로 인정

// 알고리즘 설명 (함수)
// ** shuffle **
//  - 문제의 수만큼 랜덤 수를 만들어 배열로 반환
// ** makeQuestionArray **
//  - shuffle에서 받은 배열을 토대로 문제를 랜덤으로 만듬
//  - 각 첫 번째, 마지막 열과 행은 *로 표기됨
//  - 여기서 *은 이동할 수 있는 경로
// ** checkPossibleQuetions **
//  - 만든 문제를 검증하여 맞출 수 있는 경우의 수를 반환
//  - 처음 문제를 만들 때, 초기에 맞출 수 있는 정답의 수를 정하여, 문제를 재설정 하는데 사용
//  - 문제를 맞출 때 마다 검증하여, 맞출 수 있는 문제의 수를 알 수 있음
// ** checkAnswer **
//  - 첫 번째, 두 번째 클릭한 단어와 뜻이 정답인지 체크하는 함수
// ** findCourse **
//  - 정답의 경로를 찾는 함수
//  - [오른쪽, 왼쪽, 아래, 위] 순서대로 탐색하여, 해당 지점이 '*'일 시, 자신을 다시 호출하는 재귀함수
//    - 다시 호출할 때 x, y값을 새롭게 전달하여 자동으로 다음 지점을 방문할 수 있도록 설정
//    - 해당 지점이 '*'이라면 계속 탐색, 아니라면 정답 유무를 판단하여
//    - 정답이라면 이동 경로 배열을 반환, 아니라면 false를 반환
//    - 세 번이상 꺾일 경우에도 false를 반환
//    - 각 경로에서 하나라도 이동 경로를 반환한다면 정답으로 인정, 아니라면 false를 반환하여 정답 실패 처리
//  - 경로가 있으면 바로 반환하기 때문에, 최단 경로는 보장할 수 없음
// ** setRightAnswer **
//  - findCourse에서 경로를 반환 했을 시, view에 이동 한 경로를 출력해 줌
//  - 경로 출력 후 해당 지점을 *로 치환하고 새로운 문제 배열을 반환하여 문제를 재설정

// 6x4 or 4x6
// 처음 설정 > 3
const words_arr_6_4 = [
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

// 6x6
// 처음 설정 > 7
const words_arr_6_6 = [
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
  {word: "핸드폰", mean: "phone"},
  {word: "커피", mean: "coffee"},
  {word: "의자", mean: "chair"},
  {word: "침대", mean: "bed"},
  {word: "코트", mean: "coat"},
  {word: "바지", mean: "pants"},
];

// 8x6 or 6x8
// 처음 설정 > 9
const words_arr_8_6 = [
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
  {word: "핸드폰", mean: "phone"},
  {word: "커피", mean: "coffee"},
  {word: "의자", mean: "chair"},
  {word: "침대", mean: "bed"},
  {word: "코트", mean: "coat"},
  {word: "바지", mean: "pants"},
  {word: "신발", mean: "shoes"},
  {word: "냉장고", mean: "refrigerator"},
  {word: "강아지", mean: "dog"},
  {word: "고양이", mean: "cat"},
  {word: "대통령", mean: "president"},
  {word: "병원", mean: "hospital"},
];

const total_words = {
  1: {
    words: words_arr_6_4,
    x: 6,
    y: 4,
  },
  2: {
    words: words_arr_6_6,
    x: 6,
    y: 6,
  },
  3: {
    words: words_arr_8_6,
    x: 8,
    y: 6,
  },
};

function onClickLevel(level) {
  const words_arr = total_words[level].words;
  const x = total_words[level].x;
  const y = total_words[level].y;
  init(words_arr, y, x);
}

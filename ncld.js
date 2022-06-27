"use strict";
const months=['Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const week=['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
let year; // текущий год календаря, отображаемый в таблице ("старый" год)
let thisYear = true;
let tooltipElem;
const dates = {yearly:[{day:"01-01",desc:"Новый год",begin:1700},
                       {day:"02-23",desc:"День Советской армии",begin:1922},
                       {day:"03-08",desc:"Женский день",begin:1918},
                       {day:"05-01",desc:"Мир, май, труд!",begin:1918},
                       {day:"05-09",desc:"День победы",begin:1945},
                       {day:"06-12",desc:"День России",begin:1992},
                       {day:"11-04",desc:"День народного единства",begin:2005},
                       {day:"11-07",desc:"Великая октябрьская социалистическая революция",begin:1918,end:2004}],
		once:[{date:"1492-10-12",desc:"Дата открытия Америки"},
      {date:"1961-04-12",desc:"Первый полёт человека в космос"},
      {date:"1980-07-19",desc:"День открытия московской олимпиады XXII"},
      {date:"1991-08-19",desc:"День начала ГКЧП"}]};

// Объект "сегодня"
const thisDay = {
  today: new Date(),

// Показать сегодняшнюю дату
  showToday: function () {
    this.today = new Date();
    const month = this.today.getMonth() + 1,
        day = this.today.getDate(),
        mt = document.getElementById("mon" + month).children[0]; // таблица текущего месяца
    let row = this.today.getDay();
    if (row === 0) row = 7;
    row--;
    let cell = mt.rows[row].cells[Math.floor((day + 5 - row) / 7)];
    cell.innerHTML = `<span title="Вы здесь!">${cell.innerHTML}</span>`;
    this.multik(cell);
  },

// Подсветить элемент
  multik: function (elem) {
    let x = 0;
    setInterval(() => {
          let y = Math.sin(x) + 1;
          let y2 = -Math.sin(x) + 1;
          elem.style.backgroundColor = "rgb(" + Math.round(y * 127) + "," + Math.round(127 + y * 64) + ",255)";
          elem.style.color = "rgb(0," + Math.round(127 + y2 * 64) + "," + Math.round(y * 32) + ")";
          x += 0.1;
        },
        100);
  }
}

const refreshButton = {
  button: null,
  tipText: "Обновить календарь",
// реакция на нажатие кнопки "обновить календарь"
  press: function () {
    this.hide();
    year = getYear();
    updateCalendar();
    thisYear = true;
  },
  show: function () {
    this.button.style.visibility = "visible"; // показать кнопку обновления
    this.button.parentNode.title = this.tipText; // показать подсказку
  },
  hide: function () {
    this.button.style.visibility = "hidden"; // показать кнопку обновления
    this.button.parentNode.title = ""; // прячем подсказку
  }
}

window.onload = function (){
  refreshButton.button = document.getElementById("updCal");
  markSpecialDates();
  thisDay.showToday();
}

function chgeCursor(arg) {
  if (event.pageY > 60) {
    arg.style.cursor="url('img/up.png'),n-resize";
  } else {
    arg.style.cursor="url('img/down.png'),n-resize";
  }
}

// Изменение года на один
function scrollYear(diff) {
  let yr = +getYear() + diff;

  yr = yr + "";
  for (let i=0; i<4; i++) {
    document.getElementById("ydig"+i).src = 'img/'+yr[i]+'.jpg'; // рисуем новую цифру
  }
  toggleStencil(yr);
}

// Изменение одиночной цифры года при нажатии на ней кнопки мыши
function chgeYear(arg) {
  let st, nnum;
  st = arg.src.substr(-5);

  nnum = +st[0];
  if (event.clientY > 60) { // увеличиваем число на один
    if (arg.id === 'ydig0') {
       if (+st[0] === 1) nnum ++;
    } else {
       if (st[0] < 9) nnum ++;
       else nnum = 0;
    } 
  } else { // уменьшаем число на один
    if (arg.id === 'ydig0') {
       if (+st[0] === 2) nnum --;
    } else {
       if (st[0] > 0) nnum --;
       else nnum = 9;
    } 
  }
  arg.src = "img/" + nnum + ".jpg";
  toggleStencil(getYear());
}

// Переключение подсвечиваемого года в зависимости от "года прокрутки" (вверху)
function toggleStencil(yr) {
  if (yr===year) {
    thisYear = true;
    refreshButton.hide(); // спрятать кнопку обновления
    toggleOldYearBacklight(2);
  } else {
    if (thisYear) { // подсветку и кнопку обновления включаем только один раз
      refreshButton.show(); // показать кнопку обновления
      toggleOldYearBacklight(1);
    }
    thisYear = false;
  }
}

// Выкладываем цифры календаря на текущий год
function showYearDigits(){
    let yr= new Date(), st;
    yr = yr.getFullYear()+"";
    for (let i=0; i<4; i++)
    {
        st = "<img onClick='chgeYear(this);' align='absmiddle' id='ydig"+i+
        "' onMousemove='chgeCursor(this);' src='img/"+yr[i]+".jpg' alt='year digit'>";
        document.write(st);
    }
    return yr;
}

// Создание календаря (первоначально - при запуске)
function makeCalendar() {
  document.write('<link rel="stylesheet" href="ncld.css">');
  document.write('<table border="0" cellspacing="0">');
  for (let i = 0; i < 3; i++) // по строкам
  {
    document.write('<tr>');
    for (let j = 0; j < 5; j++) // по столбцам
    {
      document.write('<td><table class="calendar-row">');
      if (j === 0) { // дни недели
        document.write('<tr><td class="month-name-indent"></td></tr><tr><td><table class="week-day-table">');
        for (let k = 0; k < 7; k++) {
          document.write('<tr><td class="week-day">' + week[k] + '</td></tr>');
        }
        document.write('</table></td></tr>');
      } else { // месяц
        let mnum = (i * 4) + j; // номер месяца: 1-12
        document.write('<tr><td>', '<div class="month-name month-name-content">');
        document.write( months[mnum - 1], '</div></td></tr><tr>');
        document.write('<td id="mon' + mnum + '">', monDraw(mnum), '</td></tr>');
      }
      document.write('</table></td>');
    }
    document.write('</tr>');
  }
  document.write('</table>');
}

// получить требуемый год 
function getYear() {
  let year = "";
  for(let i=0; i<4; i++) {
    let el = document.getElementById("ydig"+i),
        dig = el.src.substr(-5)[0];
    year += dig;
  } 
  return year;
}

// Обновление календаря
function updateCalendar() {
  for (let i=1; i<13; i++) // по месяцам
  {
    let el = document.getElementById('mon'+i);
    el.innerHTML = '<td>'+ monDraw(i) +'</td>';
  }
  if (+year === thisDay.today.getFullYear()) thisDay.showToday();
  markSpecialDates();
}

/**
 * Установка памятных дат
 */
function markSpecialDates() {
  for (let dt of dates.once) {
    let oDate = new Date(dt.date);
    if (+year === oDate.getFullYear()) {
      insertDate(oDate, dt.desc, false);
    }
  }
  for (let dt of dates.yearly) {
    if (+year>=dt.begin && (!dt.end || +year<=dt.end)) {
      insertDate(new Date(year+"-"+dt.day), dt.desc, true);
    }
  }
  function insertDate(date, text, holiday) {
    const month = date.getMonth() + 1,
        day = date.getDate(),
        mt = document.getElementById("mon" + month).children[0]; // таблица текущего месяца
    let row = date.getDay();
    if (row === 0) row = 7;
    row--;
    let cell = mt.rows[row].cells[Math.floor((day + 5 - row) / 7)];
    cell.setAttribute("data-tooltip", text);
    cell.onmouseover = specDateOver;
    cell.onmouseout = specDateOut;
    cell.classList.add('spec-date');
    if (holiday) cell.classList.add('holiday');
  }
}

/**
 *  Формирование таблицы одного месяца
 *  mnum - номер месяца (1-12)
 */
function monDraw(mnum) {
  let cols, smon = `<table class="${season(mnum)} month">`;
  let fday; // день недели первого дня месяца 1..7
  let lday; // последний день месяца
  getFirstAndLastDaysOfTheMonth(mnum);
  if (mnum === 2) {
     cols = (fday===1 && lday === 28) ? 4 : 5;
  }  else  {
     if (fday===6 && lday===31 || fday===7) cols=6;
     else cols=5;
  }

  for (let i = 0; i < 7; i++) {
    smon += '<tr>';
    for (let j = 0; j < cols; j++) {
      let curDay = 7 * j + i + 2 - fday; // текущий день месяца
      let cls = '';
      smon += '<td';
      if (i > 4 && +year > 1967 || i > 5 && +year > 1917) cls = 'holiday';
      if (cls.length > 0) smon += ` class="${cls}"`;
      smon += '>';
      if (curDay < 1 || curDay > lday) smon += ' ';
      else smon += curDay;
      smon += '</td>';
    }
    smon += '</tr>';
  }
  smon += '</table>';
  return smon;

// Получение первого и последнего дня месяца
  function getFirstAndLastDaysOfTheMonth(month) {
    const yrs = new Date(year,month-1,1); // месяц: 0-11
    fday = yrs.getDay();
    if ( fday === 0 ) fday = 7;
    lday = new Date(year, month,0); // последний день месяца (дата - вычитаем один день из первого дня следующего месяца)
    lday = lday.getDate(); // последний день месяца (число: 28-31)
  }
}

///////////////////////////////////////
// Выбор сезона
///////////////////////////////////////
function season(mnum) {
  let rv;
  switch (mnum) {
    case 1:
    case 2:
    case 12:
      rv='winter';
      break;
    case 3:
    case 4:
    case 5:
      rv='spring';
      break;
    case 6:
    case 7:
    case 8:
      rv='summer';
      break;
    case 9:
    case 10:
    case 11:
      rv='autumn';
      break;
  }
  return rv;
}

// Показать текущий год календаря подсветкой
function toggleOldYearBacklight(onOff) {
  // определяем координаты цифр в месячной сетке
  const digMap=[[[0,2],[0,3],[1,1],[1,4],[2,1],[2,4],[3,1],[3,4],[4,1],[4,4],[5,1],[5,4],[6,2],[6,3]], // цифра 0
    [[0,3],[1,2],[1,3],[2,1],[2,3],[3,3],[4,3],[5,3],[6,3]], // цифра 1
    [[0,2],[0,3],[1,1],[1,4],[2,4],[3,3],[4,2],[5,1],[6,1],[6,2],[6,3],[6,4]], //2
    [[0,2],[0,3],[1,1],[1,4],[2,4],[3,3],[4,4],[5,1],[5,4],[6,2],[6,3]], //3
    [[0,4],[1,4],[1,3],[2,2],[2,4],[3,1],[3,4],[4,1],[4,2],[4,3],[4,4],[5,4],[6,4]],
    [[0,1],[0,2],[0,3],[0,4],[1,1],[2,1],[2,2],[2,3],[3,4],[4,4],[5,1],[5,4],[6,2],[6,3]],
    [[0,2],[0,3],[1,1],[1,4],[2,1],[3,1],[3,2],[3,3],[4,1],[4,4],[5,1],[5,4],[6,2],[6,3]],
    [[0,1],[0,2],[0,3],[0,4],[1,4],[2,3],[3,2],[4,1],[5,1],[6,1]],
    [[0,2],[0,3],[1,1],[1,4],[2,1],[2,4],[3,2],[3,3],[4,1],[4,4],[5,1],[5,4],[6,2],[6,3]],
    [[0,2],[0,3],[1,1],[1,4],[2,1],[2,4],[3,2],[3,3],[3,4],[4,4],[5,1],[5,4],[6,2],[6,3]]]; // 9

  for (let i=5; i<9; i++) // по месяцам
  {
    let el = document.getElementById('mon'+i);
    if (onOff === 1) showBgDigit(el, year[i-5]);
    else hideBgDigit(el, year[i-5]);
  }

// Формирование цифры года цветом фона
  function showBgDigit(el, digit) {
    const color = 'magenta';
    const tbl = el.querySelector('table');
    digit = +digit;
    for(let k=0; k<digMap[digit].length; k++) {
      let s = tbl.rows[digMap[digit][k][0]].cells[digMap[digit][k][1]];
      if (~s.className.indexOf('spec-date')) s.style.background = "lightcoral";
      else s.style.background = color;
      s.style.borderRadius = '5px';
    }
  }

// Очистка цифры года в фоне
  function hideBgDigit(el, digit) {
    const tbl = el.querySelector('table');
    digit = +digit;
    for(let k=0; k<digMap[digit].length; k++) {
      let s = tbl.rows[digMap[digit][k][0]].cells[digMap[digit][k][1]];
      s.style.background = null;
    }
  }
}

/*
 * Обработка наведения мыши
 */
function specDateOver(ev) {
  let target = ev.target;
  let ttt = target.dataset.tooltip;

  if (!ttt) return;
  tooltipElem = document.createElement('div');
  tooltipElem.className = 'tooltip';
  tooltipElem.innerHTML = ttt;

  // позиционируем сверху от аннотируемого элемента (top-center)
  let coords = target.getBoundingClientRect();

  let left = coords.left + 7 + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
  if (left < 0) left = 0; // не заезжать за левый край окна

  let top = coords.top - tooltipElem.offsetHeight - 15;
  if (top < 0) { // если подсказка не помещается сверху, то отображать её снизу
    top = coords.top + target.offsetHeight + 5;
  }

  tooltipElem.style.left = left + 'px';
  tooltipElem.style.top = top + 'px';
  document.body.appendChild(tooltipElem);
}

/*
 * Обработка отведения мыши
 */
function specDateOut () {
  if (tooltipElem) {
    tooltipElem.remove();
    tooltipElem = null;
  }
}

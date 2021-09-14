"use strict";
let months=['Январь','Февраль','Март','Апрель','Май','Июнь',
    'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
let week=['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
let year, yrs, day, mnum, lday;


// реакция на нажатие кнопки "обновить календарь"
function chgCld() {
  document.getElementById("updCal").style.visibility = "hidden"; // прячем кнопку
  year = getYear();
  updateCalendar();
}

function chgeCursor(arg) {
  if (event.clientY > 60) {
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
  document.getElementById("updCal").style.visibility = "visible"; // показать кнопку обновления
}

// Изменение одиночной цифры года при нажатии на ней кнопки мыши
function chgeYear(arg) {
  let st, ist, nnum;
  st = arg.src.substr(-5);
  ist="img/";

  nnum = +st[0];
  if (event.clientY > 60) { // увеличиваем число на один
    if (arg.id === 'ydig0') {
       if (st[0] == 1) nnum ++;
    } else {
       if (st[0] < 9) nnum ++;
       else nnum = 0;
    } 
  } else { // уменьшаем число на один
    if (arg.id === 'ydig0') {
       if (st[0] == 2) nnum --;
    } else {
       if (st[0] > 0) nnum --;
       else nnum = 9;
    } 
  }
  ist += nnum+".jpg";
  arg.src = ist;
  document.getElementById("updCal").style.visibility = "visible"; // показать кнопку обновления
}

// Выкладываем цифры календаря на текущий год
function iniScript(){
    let yr= new Date(), st;
    yr = yr.getFullYear()+"";
    for (let i=0; i<4; i++)
    {
        st = "<img onClick='chgeYear(this);' align='absmiddle' id='ydig"+i+
        "' onMousemove='chgeCursor(this);' src='img/"+yr[i]+".jpg'>";
        document.write(st);
    }
    return yr;
}

// Создание календаря
function makeCalendar(year) {
    document.write('<link rel="stylesheet" href="ncld.css">');
    if ( day == 0 ) day = 7;
    document.write('<table border="1" cellspacing="0">');
    for (let i=0; i<3; i++) // по строкам
    {
        document.write('<tr>');
        for (let j=0; j<4; j++) // по столбцам
        {
            mnum = (i*4)+(j+1); // месяц: 1-12
            document.write('<td id="mon'+mnum+'">','<p class="month-name">',months[mnum-1],'</p>');
            yrs = new Date(year,mnum-1,1); // месяц: 0-11
            day = yrs.getDay();
            if ( day == 0 ) day = 7;
            lday = new Date(year,mnum,0); // последний день месяца (дата - вычитаем один день из первого дня следующего месяца)
            lday = lday.getDate(); // последний день месяца (число: 28-31)
            document.write(monDraw(mnum));
            document.write('</td>');
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
    let el = document.getElementById('mon'+i), st;
    st = '<td> <p class="month-name">' + months[i-1] + '</p>';
    yrs = new Date(year,i-1,1); // месяц: 0-11
    day = yrs.getDay(); // день недели
    if ( day == 0 ) day = 7;
    lday = new Date(year, i, 0); // последний день месяца (дата - вычитаем один день из первого дня следующего месяца)
    lday = lday.getDate(); // последний день месяца (число: 28-31)
    st += monDraw(i);
    el.innerHTML = st;
  }
}

/**
Формирование таблицы одного месяца
*/
function monDraw(mnum) {
  let cols, dnum=1, smon;
  if (mnum == 2)
  {
     cols = (day==1 && lday == 28) ? 4 : 5;
  }
  else
  {
     if (day==6 && lday==31 || day==7) cols=6;
     else cols=5;
  }

  smon =  '<table align="center"';
  smon += `class="${season(mnum)}"`;
  smon += '>';

  for (let i=0; i<7; i++)
  {
      smon += '<tr>';
      if (mnum%4 == 1) {
          smon += '<td class="weekDay">'+week[i];
          smon += '</td>';
      }
      for (let j=0; j<cols; j++)
      {
          smon += '<td';
          if (i>4) smon += ' class="holiday"';
          smon += '>';
          if (j==0 && day>i+1)
              smon += ' ';
          else
          {
              let curDay=7*j+i+2-day;
              if (curDay>lday) curDay=' ';
              smon += curDay;
          }
          smon += '</td>';
      }
      smon += '</tr>';
  }
  smon += '</table>';
  return smon;
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
        rv='winter'
        break;
      case 3:
      case 4:
      case 5:
        rv='spring'
        break;
      case 6:
      case 7:
      case 8:
        rv='summer'
        break;
      case 9:
      case 10:
      case 11:
        rv='autemn'
        break;
    }
    return rv;
}
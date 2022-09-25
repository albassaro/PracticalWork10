// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);


/*** ОТОБРАЖЕНИЕ ***/

let mapColor = new Map(); // Создание map (неизменного) как эталона для записи цветов
for (let i = 0; i < fruitsList.children.length; i++) {
  // Запись значений ("название HTML-класса": "соответствующий ему цвет") для вывода рамки согласно указанного цвета
  mapColor.set(fruitsList.children[i].className, fruits[i].color);
}

// отрисовка карточек
const display = () => {
  // удаление всех дочерних элементов в <ul class = fruits__list ></ul>
  while (fruitsList.firstChild) {
    fruitsList.removeChild(fruitsList.firstChild);
  }

  for (let i = 0; i < fruits.length; i++) {
    let newElement = document.createElement('li');    // создание нового <li>
    for ([key, value] of mapColor) {                // Перебор ключа и значения из map для отображения рамки указанного цвета
      if (value == fruits[i].color) {       // условие совпадения цвета из map-эталона и цвета из fruits
        newElement.className = key;         // добавление элементу <li> нужного названия HTML-класса из map("название HTML-класса") для отображения правильного цвета рамки 
        break;
      }
    }
    // Добавление в <li> "<div>-элементов" и наполнение их данными
    newElement.innerHTML = `<div class = "fruit__info">  
     <div>index: ${i}</div>
     <div>kind: ${fruits[i].kind}</div>
     <div>color: ${fruits[i].color}</div>
     <div>weight(кг): ${fruits[i].weight}</div>
     </div>`;
    fruitsList.append(newElement);      // Вывод созданных HTML-элементов <li> с данными
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // Создание массива для проверки на совпадение с перемешанным массивом
  let checkMix = fruits.slice();

  while (fruits.length > 0) {
    let needNumber = getRandomInt(0, fruits.length - 1);  // Получение случайного элемента
    result.push(fruits[needNumber]);                      // Добавление выбранного элемента в result
    fruits.splice(needNumber, 1)                          // Удаление добавленного элемента из fruits
  }
  // Сравнение массивов на совпадение при перемешивании
  if (JSON.stringify(result) === JSON.stringify(checkMix)) {
    alert('Массив не перемешан. Перемешайте заново');
    fruits = checkMix;    // Вывод массива до перемешивания
  } else
    fruits = result;      // Вывод перемешанного массива
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  minWeight = document.querySelector('.minweight__input');            //  Находим поле с вводом минимального числа
  maxWeight = document.querySelector('.maxweight__input');            //  Находим поле с вводом максимального числа

  // Проверка на пустое значение строк с указанием веса
  if (minWeight.value === "" || maxWeight.value === "") {             // Проверка на пустое значение
    alert("Вы не ввели одно из значений веса. Проверьте поля и повторите попытку");
  } else {
    let weightFilter = fruits.filter((item) => {               // Поиск в fruits по всем элементам 

      // Проверка веса фруктов из fruits на вхождение в диапазон [мин , макс] значений, взятых из input-ов
      if (item.weight - minWeight.value >= 0 && item.weight - maxWeight.value <= 0) {
        return item.weight;     // Возврат этих элементов
      }
    });
    fruits = weightFilter;    // Запись выбранных элементов во fruits
  }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/
let sortKind = 'bubbleSort';          // инициализация состояния вида сортировки
let sortTime = '-';                   // инициализация состояния времени сортировки



const comparationColor = (a, b) => {
  if (a.color < b.color) return -1;  //  
  if (a.color > b.color) return 1;   //  Сравнение цветов из fruits (для вывода по их в алфавитном порядке)
  else return 0;                     // 

};

const sortAPI = {
  bubbleSort(fruits, comparation) {
    const n = fruits.length;
    // внешняя итерация по элементам
    for (let i = 0; i < n - 1; i++) {
      // внутренняя итерация для перестановки элемента в конец массива
      for (let j = 0; j < n - 1 - i; j++) {
        // сравниваем элементы
        if (comparation(fruits[j], fruits[j + 1]) === 1) { // Условие сравнения (с вызовом функции compareColor() для сравнения цветов) 
          // обмен элементов между собой
          let temp = fruits[j + 1];
          fruits[j + 1] = fruits[j];
          fruits[j] = temp;
        }
      }
    }
  },

  quickSort() {
    fruits = quickSort(fruits); // Вызов функции и  перезапись изначального массива отсортированным                  

    // функция обмена элементов
    function swap(fruits, firstIndex, secondIndex) {
      if ((fruits[firstIndex].color > fruits[secondIndex].color)) {   // Условие сравнения цветов (чтобы похожие цвета в уже отсортированном массиве каждый раз не менялись друг с другом местами)
        const temp = fruits[firstIndex];              // 
        fruits[firstIndex] = fruits[secondIndex];     // Замена местами двух элементов в fruits
        fruits[secondIndex] = temp;                   //
      }
    }

    // функция разделитель (сортировка элементов в массиве (слева от разделителя меньшие элементы, справа большие))
    function partition(fruits, left, right) {
      var pivot = fruits[Math.floor((right + left) / 2)].color,
        i = left,
        j = right;
      while (i <= j) {
        while (fruits[i].color < pivot) {
          i++;
        }
        while (fruits[j].color > pivot) {
          j--;
        }
        if (i <= j) {
          swap(fruits, i, j);            // Вызов функции для смены выбранных элементов местами
          i++;
          j--;
        }
      }
      return i;
    }

    // алгоритм быстрой сортировки
    function quickSort(fruits, left, right) {
      var index;
      if (fruits.length > 1) {
        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? fruits.length - 1 : right;
        index = partition(fruits, left, right);
        if (left < index - 1) {
          quickSort(fruits, left, index - 1);
        }
        if (index < right) {
          quickSort(fruits, index, right);
        }
      }
      return fruits;
    }
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, fruits, comparation) {
    const start = new Date().getTime();
    sort(fruits, comparation);            // Вызов нужной сортировки сортировки
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKindLabel.textContent === "bubbleSort") {     // Проверка текущего значения поля с названием сортировки
    sortKind = 'quickSort';                             // Переопределение названия сортировки
    sortKindLabel.textContent = sortKind;               // Замена значения на нужное
  } else {
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
  }
});

sortActionButton.addEventListener('click', () => {
  const sort = sortAPI[sortKind];                     
  sortAPI.startSort(sort, fruits, comparationColor);  
  sortTimeLabel.textContent = sortTime;
  display();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  // Проверка на ввод пустых значений
  if (kindInput.value === "" || weightInput.value === "") {
    alert("Не введено одно из значений при добавлении фрукта. Проверьте заполненность полей и повторите попытку")
  } else {
    if (isNaN(weightInput.value)) {    // Проверка веса на нечисловые значения
      alert("Значение веса должно быть указано в числовом виде");
    } else {
      fruits.push({                  // Добавление в fruits нового "фрукта" (необходимые значения берем из kindInput, colorInput, weightInput)
        "kind": kindInput.value,
        "color": colorInput.value,
        "weight": weightInput.value
      });
      display();                // Вывод на экран
      kindInput.value = "";     // Очистка полей
      weightInput.value = "";
    }
  }
});
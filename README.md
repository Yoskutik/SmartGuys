# Умники и умницы. Администрирование

Этот сайт предназначен для развертывания локально.  

Репозиторий включает в себя backend и frontend части сайта. Сервер написан с помощью __Node.js__
с использованием фреймворка _express.js_. На стороне сервера выполняется работа REST API. Для 
сборки сервера используется модуль _babel.js_ с помощью команды `npm run build`. Frontend написан 
с помощью _Embedded JavaScript templating_ с использованием _bootstrap_. Все стили написаны на 
языке _SCSS_.  

Каждая страница представляет из себя набор файлов:
  - _index.ejs_ - Файл разметки, написанный на языке __EJS__. Обработка формата _EJS_ в _HTML_ 
  происходит на стороне сервера.
  - _script.js_ - Основной скриптовый файл, написанный на _jQuery.js_. Отвечает за отрисовку и за
  функционирование страницы. С помощью скриптового файла происходит общение между пользователем и
  сервером посредством _REST API запросов_.
  - _style.css_ - Стилевой файл. Создан автоматически из файла _style.scss_. 
  
Сервер запускается с помощью приложения `Умники и умницы.exe` или с помощью команды `"bin/node" 
server.js`. 


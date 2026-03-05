README — Added episode artwork support

1) app.js now supports optional episode art:
   In APP.episodes, each episode may include:
     art: "img/<category>/<story>/ep01.png"

2) style.css adds blending styles.
   Best results: PNG with transparent irregular edges (torn paper / magazine cutout).

3) Put your images here (examples):
   img/horror/locked-signal/ep01.png ... ep08.png
   img/romance/late-night/ep01.png ... ep03.png

If an image is missing, it won't break the app (image hides on error).

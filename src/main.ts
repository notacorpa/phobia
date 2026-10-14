// src/main.ts
window.onload = function() {
    const a = document.createElement('audio');
    a.controls =true;
    a.src = './assets/trouble.mp3';
    document.body.appendChild(a);
}
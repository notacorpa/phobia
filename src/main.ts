import * as Phobia from 'phobia';

document.addEventListener('DOMContentLoaded', () => {
    const renderer = new Phobia.Renderer();

    renderer._context2D.drawRect(
        new Phobia.Vector2(50, 50),
        new Phobia.Vector2(200, 50),
        new Phobia.Vector2(200, 150),
        new Phobia.Vector2(50, 150)
    );
});
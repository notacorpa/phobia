import * as Phobia from 'phobia';

const element = document.createElement('canvas');
document.body.appendChild(element);

const gd = new Phobia.GraphicsDevice(element);
gd.drawRect(
    new Phobia.Vector2(50, 50),
    new Phobia.Vector2(200, 50),
    new Phobia.Vector2(200, 150),
    new Phobia.Vector2(50, 50)
)
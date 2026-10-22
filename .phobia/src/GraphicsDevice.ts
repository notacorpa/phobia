import * as Phobia from 'phobia';

export class GraphicsDevice {
    protected _canvas: HTMLCanvasElement;
    protected _gl: WebGLRenderingContext | null = null;
    protected _program: WebGLProgram | null = null;
    protected _buffer: WebGLBuffer | null = null;

    private _positionLocation: number = -1;
    private _resolutionLocation: WebGLUniformLocation | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._gl = canvas.getContext('webgl') as any;

        if (!this._gl) {
            console.error("WebGL not supported in this browser.");
            return;
        }

        this._initShaders();
        this._initBuffers();
    }

    private _initShaders(): void {
        const gl = this._gl!;

        // Vertex Shader: Converts pixel coordinates to WebGL clipspace (-1.0 to 1.0)
        const vsSource = `
            attribute vec2 a_position;
            uniform vec2 u_resolution;
            void main() {
                // Convert pixels to 0.0 -> 1.0
                vec2 zeroToOne = a_position / u_resolution;
                // Convert 0.0->1.0 to 0.0->2.0
                vec2 zeroToTwo = zeroToOne * 2.0;
                // Convert 0.0->2.0 to -1.0->1.0 (clipspace)
                vec2 clipSpace = zeroToTwo - 1.0;
                // Flip Y axis to match 2D Canvas layout (0,0 at top-left)
                gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
            }
        `;

        // Fragment Shader: Colors every pixel solid white
        const fsSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // RGBA White
            }
        `;

        // Compile helper
        const loadShader = (type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
            }
            return shader;
        };

        const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

        // Link shaders into a usable program
        this._program = gl.createProgram()!;
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);

        // Look up variable locations
        this._positionLocation = gl.getAttribLocation(this._program, 'a_position');
        this._resolutionLocation = gl.getUniformLocation(this._program, 'u_resolution');
    }

     private _initBuffers(): void {
        const gl = this._gl!;
        this._buffer = gl.createBuffer();
    }

    public drawRect(p1: Phobia.Vector2, p2: Phobia.Vector2, p3: Phobia.Vector2, p4: Phobia.Vector2): void {
        const gl = this._gl;
        if (!gl || !this._program) return;

        // Tell WebGL to use our shader program
        gl.useProgram(this._program);

        // Set the screen resolution uniform so the shader can map pixels properly
        gl.uniform2f(this._resolutionLocation, this._canvas.width, this._canvas.height);

        // Bind our GPU buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);

        // Flatten the 4 vector coordinates into a Float32Array
        // We break the 4-point rectangle into 2 triangles: (P1, P2, P4) and (P2, P3, P4)
        const vertices = new Float32Array([
            p1.x, p1.y, // Triangle 1
            p2.x, p2.y,
            p4.x, p4.y,
            p2.x, p2.y, // Triangle 2
            p3.x, p3.y,
            p4.x, p4.y
        ]);

        // Upload the flattened coordinates to the GPU buffer
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

        // Turn on the position attribute in the shader
        gl.enableVertexAttribArray(this._positionLocation);

        // Tell the shader how to read the data out of the buffer
        const size = 2;          // 2 components per iteration (x, y)
        const type = gl.FLOAT;   // data is 32-bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(this._positionLocation, size, type, normalize, stride, offset);

        // Execute the draw command (6 vertices = 2 triangles)
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}
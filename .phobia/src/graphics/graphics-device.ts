// graphics/graphics-device.ts

export class GraphicsDevice {
    protected canvas: HTMLCanvasElement;
    protected gl: WebGLRenderingContext;

    constructor() {
        const canvas = document.createElement('canvas');
        if (!canvas) throw new Error("Failed to create the game canvas.");
        canvas.classList.add("phobia-canvas");
        const gl = canvas.getContext('webgl');
        if (!gl) throw new Error("WebGL is not supported on this browser.");

        document.body.appendChild(canvas);
        
        // Set canvas and GL
        this.canvas = canvas;
        this.gl = gl;

        // 2. Define Shaders (GLSL)
        const vsSource = `
            attribute vec2 aPosition;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0); // Soft Blue color
            }
        `;

        // Helper function to compile shaders
        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) throw new Error("Failed to create shader");
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        // 3. Compile and Link Shaders into a Program
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader) throw new Error("No vertex shader");
        if (!fragmentShader) throw new Error("No fragment shader");
        
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
        }
        gl.useProgram(program);

        // 4. Define Geometry (Square coordinates in Clip Space: -1 to +1)
        // Using TRIANGLE_STRIP: Left-Bottom, Right-Bottom, Left-Top, Right-Top
        const vertices = new Float32Array([
            -0.5, -0.5,  // Bottom-Left
             0.5, -0.5,  // Bottom-Right
            -0.5,  0.5,  // Top-Left
             0.5,  0.5   // Top-Right
        ]);

        // 5. Create Buffer and Load Data
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // 6. Map Buffer Data to the Shader Attribute
        const aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // 7. Clear Screen and Draw
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw 4 vertices using TRIANGLE_STRIP
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
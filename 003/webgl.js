/**
 * @file 適当な粒子で満たす
 */

 const vertexShaderSource = `
 attribute vec2 a_position;
 uniform vec2 u_resolution;
 varying vec2 v_position;
 void main(void) {
	 vec2 zeroToOne = a_position / u_resolution;
	 vec2 zeroToTwo = zeroToOne * 2.0;
	 vec2 clipSpace = zeroToTwo - 1.0;
	 gl_Position =vec4(clipSpace * vec2(1, -1), 0, 1);
	 v_position = a_position;
 }
`
const fragmentShaderSource = `
 precision mediump float;
 uniform float u_time;
 varying vec2 v_position;

 float rand(vec2 co) {
	return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

 void main() {
	 gl_FragColor = vec4(
		vec3(
			rand(v_position + vec2(u_time, u_time)),
			rand(v_position + vec2(u_time, u_time) / 2.0),
			rand(v_position + vec2(u_time, u_time) / 3.0)
		),
	1);
 }
`

/**
* 
* @param {WebGLRenderingContext} gl 
* @param {number} type 
* @param {string} source 
*/
const getShader = (gl, type, source) => {
 const shader = gl.createShader(type)
 gl.shaderSource(shader, source)
 gl.compileShader(shader)
 if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	 return shader
 } else {
	 gl.deleteShader(shader)
	 console.error(`Fail to compile the shader: ${source}`)
 }

}

 /**
  * @type {HTMLCanvasElement}
  */
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')
if (!gl) {
	throw new Error('No webGL support😓')
}

 // シェーダの GLSL プログラムをコンパイルして webGL コンテキストに付加する
 const vertexShader = getShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
 const fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
 const program = gl.createProgram()
 gl.attachShader(program, vertexShader)
 gl.attachShader(program, fragmentShader)
 gl.linkProgram(program)


 const positionBuffer = gl.createBuffer()
 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

 gl.viewport(0, 0, canvas.width, canvas.height)
 gl.clearColor(0, 0, 0, 0)
 gl.clear(gl.COLOR_BUFFER_BIT)
 gl.useProgram(program)

const positoinAttributeLocation = gl.getAttribLocation(program, "a_position")
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
const timeUniformLocation = gl.getUniformLocation(program, "u_time")
gl.enableVertexAttribArray(positoinAttributeLocation)
gl.vertexAttribPointer(positoinAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

const positions = new Float32Array([
	0,            0,
	0, 	      canvas.height,
	canvas.width, canvas.height,	
	canvas.width, canvas.height,	
	canvas.width, 0,
	0,            0,
])
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)


setInterval(() => {
	const now = Date.now() / 1000
	gl.uniform1f(timeUniformLocation, now - Math.floor(now));
	gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2)		
}, 100);



/**
 * @file 再描画する
 */

 const vertexShaderSource = `
 attribute vec2 a_position;
 uniform vec2 u_resolution;
 varying vec4 v_color;
 void main(void) {
	 vec2 zeroToOne = a_position / u_resolution;
	 vec2 zeroToTwo = zeroToOne * 2.0;
	 vec2 clipSpace = zeroToTwo - 1.0;
	 gl_Position =vec4(clipSpace * vec2(1, -1), 0, 1);
	 v_color = vec4(a_position[0] / 256.0, a_position[1] / 256.0, 0, 1);
 }
`
const fragmentShaderSource = `
 precision mediump float;
 uniform vec4 u_color;
 varying vec4 v_color;
 void main() {
	 gl_FragColor = u_color + v_color;
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
const colorUniformLocation = gl.getUniformLocation(program, "u_color")
gl.enableVertexAttribArray(positoinAttributeLocation)
gl.vertexAttribPointer(positoinAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

/**
 * 
 * @param {[number, number, number]} rgb 
 * @param {{ x: number, y: number, w: number, h: number }} xy
 */
const render = (rgb, { x, y, w, h }) => {
	const rgba = [...rgb, 1]
	console.log(rgba)
	gl.uniform4f(colorUniformLocation, ...rgba);
	const positions = new Float32Array([
	x,     y,
	x,     y + h,
	x + w, y + h,
	x + w, y + h,
	x + w, y,
	x,     y,
	])
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}

render([0, 0, 0], { x: 0, y: 0, w: 100, h: 100 })

const colorPicker = document.getElementById('color')
const xPos = document.getElementById('x')
const yPos = document.getElementById('y')
const wPos = document.getElementById('w')
const hPos = document.getElementById('h')

const changeHandler = () => {
	const [, r, g, b] = colorPicker.value.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/).map(val => parseInt(val, 16) / 256)
	const x = parseInt(xPos.value, 10)
	const y = parseInt(yPos.value, 10)
	const w = parseInt(wPos.value, 10)
	const h = parseInt(hPos.value, 10)
	render([r, g, b], { x, y, w, h })
}

[colorPicker, xPos, yPos, wPos, hPos].map(element => element.addEventListener('input', changeHandler))

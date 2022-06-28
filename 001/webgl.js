/**
 * @file TRIANGLES 描画コンテキストで四角形を描く
 */

const vertexShaderSource = `
	attribute vec2 a_position;
	uniform vec2 u_resolution;
	void main() {
		vec2 zeroToOne = a_position / u_resolution;
		vec2 zeroToTwo = zeroToOne * 2.0;
		vec2 clipSpace = zeroToTwo - 1.0;
		gl_Position =vec4(clipSpace * vec2(1, -1), 0, 1);
	}
`
const fragmentShaderSource = `
	precision mediump float;
	uniform vec4 u_color;
	void main() {
		gl_FragColor = u_color;
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

const main = async () => {
	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById('canvas')
	const gl = canvas.getContext('webgl')
	if (!gl) {
		console.error('No webGL support😓')
		return
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

	for (const increment of [0,1,2,3,4,5,6,7,8,9]) {
		const rgba = [Math.random(), Math.random(), Math.random(), 1]
		gl.uniform4f(colorUniformLocation, ...rgba);
		const positions = new Float32Array([
			0,   0,
			0,   100,
			100, 100,
			100, 100,
			100, 0,
			0,   0,
		].map(num => num + increment * 10))
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
	}
}
main()

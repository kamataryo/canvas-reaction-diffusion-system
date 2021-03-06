/**
 * @file å¨æé¢æ°
 */

import { getShader } from '../libs/utils.js'

const main = async () => {

	 /**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.getElementById('canvas')
	const gl = canvas.getContext('webgl')
	if (!gl) {
		throw new Error('No webGL supportð')
	}

  const query = new URLSearchParams(window.location.search)

  const formula = document.getElementById('formula')
  if(query.get('formula')) {
    formula.value = query.get('formula')
  }

  const prepareGL = async () => {

    query.set('formula', formula.value)
    window.history.replaceState(null, null, '?' + query.toString())
    // window.location.search = query.toString()

      // ã·ã§ã¼ãã® GLSL ãã­ã°ã©ã ãã³ã³ãã¤ã«ãã¦ webGL ã³ã³ãã­ã¹ãã«ä»å ãã
    const vertexShader = await getShader(gl, gl.VERTEX_SHADER, './shader.vt.glsl')
    const fragmentShader = await getShader(gl, gl.FRAGMENT_SHADER, './shader.flg.glsl', { formula: formula.value })
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    // ãããã¡ã®è¨­å®
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // åæå
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // attrib ãã¼ãã¯ã¹ã·ã§ã¼ãã¼ã«æ¸¡ã
    const positoinAttributeLocation = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positoinAttributeLocation)
    gl.vertexAttribPointer(positoinAttributeLocation, 2, gl.FLOAT, false, 0, 0)

    // uniform ã ä¸é¨ã®ãã©ã°ã¡ã³ãã·ã§ã¼ãã¼ã«æ¸¡ã
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
    const timeUniformLocation = gl.getUniformLocation(program, "u_time")
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height)

    // ãã¼ãã¯ã¹æå ±ããããã¡ã«æ ¼ç´
    const positions = new Float32Array([
      0,            0,
      0, 	      canvas.height,
      canvas.width, canvas.height,
      canvas.width, canvas.height,
      canvas.width, 0,
      0,            0,
    ])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    let counter = 1

    const timerId = setInterval(() => {
      gl.uniform1f(timeUniformLocation, counter);
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
      counter += .01
    }, 10);
    return timerId
  }

  let timerId = await prepareGL()

  document.getElementById('apply').addEventListener('click', async () => {
    clearInterval(timerId)
    timerId = await prepareGL()
  })

  document.querySelectorAll('.sample').forEach(elem => {
    elem.addEventListener('click', async () => {
      formula.value = elem.dataset.formula
      clearInterval(timerId)
      timerId = await prepareGL()
    })
  })

}

main()

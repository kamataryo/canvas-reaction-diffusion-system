/**
*
* @param {WebGLRenderingContext} gl
* @param {number} type
* @param {string} sourceURL
*/
export const getShader = async (gl, type, sourceURL) => {
  const resp = await fetch(sourceURL)
  const source = await resp.text()
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader
  } else {
    gl.deleteShader(shader)
    throw new Error(`Fail to compile the shader: ${sourceURL}`)
  }
 }

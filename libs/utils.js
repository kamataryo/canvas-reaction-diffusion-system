/**
*
* @param {WebGLRenderingContext} gl
* @param {number} type
* @param {string} sourceURL
* @param {object} macro
*/
export const getShader = async (gl, type, sourceURL, macro = {}) => {
  const resp = await fetch(sourceURL)
  let source = await resp.text()

  for (const key in macro) {
    source = source.replace(`{{ ${key} }}`, macro[key])
  }

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

precision mediump float;
uniform float u_time;
varying vec2 v_position;
const float line_width = 0.03;

void main() {

  float x   = v_position[0] + u_time;
  float y   = v_position[1];

  vec3 color = vec3(0, 0, 0);
  float f_x  = {{ formula }};

  if (f_x > y && f_x < y + line_width) {
    color = vec3(1.0, .0, .0);
  }

  gl_FragColor = vec4(color , 1);
 }

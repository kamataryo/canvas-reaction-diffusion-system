precision mediump float;
uniform float u_time;
varying vec2 v_position;

float rand(vec2 co) {
	return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
}

const int max_trial = 100;
const float oscilation_threashold = 100.0;

void main() {

  // z = a + bi
  // z(n+1) = z(n)^2 + c
  // Z(0) = 0

  float z_a = .0;
  float z_b = .0;
  int depth = -1;

  for (int i = 0; i < max_trial; i++) {
    float abs_value = abs(dot(z_a, z_b));
    if (abs_value > oscilation_threashold) {
      if (depth == -1) {
        depth = i;
      }
    } else {
      z_a = pow(z_a, 2.0) - pow(z_b, 2.0) + v_position[0] / u_time;
      z_b = 2.0 * z_a * z_b + v_position[1] / u_time;
    }
  }

  float red = float(depth);
  // float green = depth;
  // float blue = depth;

  if (red != -1.0) {
    red = red / 10.0;
  }


	 gl_FragColor = vec4(
		vec3(
      red,
      red,red
			// rand(v_position + vec2(u_time, u_time)),
			// rand(v_position + vec2(u_time, u_time) / 2.0),
			// rand(v_position + vec2(u_time, u_time) / 3.0)
		),
	1);
 }

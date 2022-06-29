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

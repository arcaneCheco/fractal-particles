uniform float uTime;
uniform float uIter;
uniform float uDiscard;
varying vec2 vUv;
varying float vT;
varying float vDist;
varying float vIter;
varying float vDiscard;


void main() {
	float dist = length(gl_PointCoord-vec2(0.5));
	float s = smoothstep(0.2, 0.5,.01 / (dist*dist));
	gl_FragColor = vec4(vec3(vIter/uIter), s);
	gl_FragColor *= mix(1., vDiscard, uDiscard);
}
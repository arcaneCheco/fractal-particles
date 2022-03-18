uniform float uTime;
uniform float uProgress;
uniform float uScale;
uniform float uIter;
varying vec2 vUv;
varying float vT;
varying float vDist;
varying float vIter;
varying float vDiscard;

vec2 rot(vec2 pos, vec2 pivot, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    pos -= pivot;
    pos = vec2(pos.x*c - pos.y*s, pos.x*s + pos.y*c);
    return pos + pivot;
}

void main() {
    vec3 pos = position;

    float iter = 0.;
    float dist = 0.;
	float escapeRadius = 1.;
    vec2 nUv = uv;
    vec2 c = (nUv.xy - vec2(0.5));
    c *= uScale;
    vDiscard = 1.;
    c = rot(c, vec2(0.), uTime*0.01);
    vec2 z = vec2(0.);

    gl_PointSize=3.;

    for(iter=0.; iter<uIter; iter++) {
    	z.xy = vec2(z.x*z.x - z.y*z.y, 2.*z.x*z.y) + c;
        dist = length(z);
        if (dist > escapeRadius){ vDiscard = 0.; break;};
    }

    pos.x = z.x/3.;
    pos.y = mix(pos.y, z.y/uScale, uProgress);
    pos.z = mix(z.y/uScale, pos.z, uProgress);

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.);
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;

    gl_PointSize *= 1. / -viewPosition.z;

    vT = escapeRadius;
    vDist = dist;
    vIter = iter;
}
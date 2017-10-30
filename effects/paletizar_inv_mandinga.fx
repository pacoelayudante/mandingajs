/////////////////////////////////////////////////////////
// Invertidor Paletizador
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerPaletaInvertida;
uniform lowp sampler2D samplerBack;
uniform mediump vec2 destStart;
uniform mediump vec2 destEnd;

uniform highp float quepaleta;// el eje y

void main(void)
{
	// Retrieve front and back pixels
	highp float alfa = texture2D(samplerFront, vTex).a;
	highp vec4 back = texture2D(samplerBack, mix(destStart, destEnd, vTex));
	back /= 3.0;
	highp float indiceInv = back.r+back.g+back.b;
	highp vec4 color = texture2D(samplerPaletaInvertida, vec2( indiceInv , quepaleta ));
	color.rgb *= alfa;
	color.a *= alfa;

	gl_FragColor = color;
}
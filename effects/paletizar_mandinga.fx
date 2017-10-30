/////////////////////////////////////////////////////////
// Paletizador
varying mediump vec2 vTex;
uniform lowp sampler2D samplerFront;
uniform lowp sampler2D samplerPaleta;

uniform highp float quecolor;// el eje x
uniform highp float quepaleta;// el eje y

void main(void)
{
	// Retrieve front and back pixels
	highp float alfa = texture2D(samplerFront, vTex).a;// de aca sale la coordenada de color
	highp vec4 color = texture2D(samplerPaleta, vec2( quecolor , quepaleta ));
	color.rgb *= alfa;
	color.a = alfa;

	gl_FragColor = color;
}
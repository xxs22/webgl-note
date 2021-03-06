precision mediump float;
varying vec2 v_TexCoord;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;

void main() {
  vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
  vec4 color1 = texture2D(u_Sampler1, v_TexCoord);

  gl_FragColor = color0 * color1;
}

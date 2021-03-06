attribute vec4 a_Position;
uniform mat4 u_ViewMatrix;
attribute vec4 a_Color;
varying vec4 v_Color;

void main() {
  gl_Position = u_ViewMatrix * a_Position;
  v_Color = a_Color;
}

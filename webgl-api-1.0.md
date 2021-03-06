# WebGL 1.0 API 整理文档
本文主要根据《WebGL编程指南》中涉及到的 API 整理(基本上 webgl1.0 版本)
> 以下内容中 `gl` 代指 WebGLRenderingContext, 主要通过 canvas.getContext('webgl') 获取

## 整体
#### 1. `gl.clearColor(red, green, blue, alpha)`: 指定绘图区域背景色
  * 参数:
    - red: 红色值(0.0 -> 1.0)
    - green: 绿色值(0.0 -> 1.0)
    - blue: 蓝色值(0.0 -> 1.0)
    - alpha: 透明度(0.0 -> 1.0)
  * 返回值: 无
  * 错误: 无

#### 2. `gl.clear(buffer)`: 指定缓冲区设置为指定的值; 如果指定的是颜色缓冲区，那么将使用 `gl.clearColor` 指定的值
  * 参数:
    - buffer: 指定的颜色缓冲区；可使用位操作`|`指定多个缓冲区; 类型如下:
      - gl.COLOR_BUFFER_BIT: 颜色缓冲区
      - gl.DEPTH_BUFFER_BIT: 深度缓冲区
      - gl.STENCIL_BUFFER_BIT: 模板缓冲区
  * 返回值: 无
  * 错误:
    - INVALID_VALUE: 缓冲区类型错误

#### 3. `gl.drawArrays(mode, first, count)`: 执行顶点着色器，按照 mode 指定的参数绘制图形
  * 参数:
    - mode: 指定绘制方式(WebGL 支持的基本图形); 类型如下:
      - gl.POINTS: 绘制点。绘制在 v0,v1,v2,v3...处
      - gl.LINES: 绘制线段。绘制在(v0,v1),(v2,v3),(v3,v4)...处
      - gl.LINE_STRIP: 绘制连接的线段。绘制在(v0,v1),(v1,v2),(v2,v3)...处(`不会形成`闭合区域)
      - gl.LINE_LOOP: 绘制连接的线段。绘制在(v0,v1),(v1,v2),(v2,v3)...(vx,v0)处(`会`闭合区域)
      - gl.TRIANGLES: 绘制一系列单独的三角形。绘制在(v0,v1,v2),(v3,v4,v5)...处(最后剩余点不足以形成三角形时会被忽略)
      - gl.TRIANGLE_STRIP: 绘制一系列条带状的三角形。绘制在(v0,v1,v2),(v2,v1,v3),(v2,v3,v4)...处(**注意绘制顺序**)
      - gl.TRIANGLE_FAN: 绘制一系列三角形组成的类似于扇形的图形。绘制在(v0,v1,v2),(v0,v2,v3),(v0,v3,v4)...处(**注意绘制顺序**)
    - first: 指定从哪个顶点开始绘制(非负整数)
    - count: 指定绘制需要用到多少顶点(非负整数)
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: 传入的 mode 不是上述类型之一
    - INVALID_VALUE: 参数 first | count 是负数

## 着色器变量
### `attribute`变量
#### 1. `gl.getAttribLocation(program, name)`: 获取由 name 指定的 attribute 变量的内存地址
  * 参数:
    - program: 指定包含顶点着色器和片元着色器的着色器程序对象
    - name: 需要获取内存地址的 attribute 变量名称
  * 返回值:
    - [大于等于 0]: attribute 变量的内容地址
    - -1: 指定的 attribute 变量不存在，或者其命名具有 `gl_` | `webgl_` 前缀(内部变量)
  * 错误:
    - INVALID_OPERATION: 程序对象未能成功链接
    - INVALID_VALUE: name 参数长度大于 attribute 变量名的最大长度(默认 256 字节)

#### 2. `gl.vertexAttrib[1|2|3|4][f|fv](location, [v0, [v1, [v2, [v3]]]])`: 将数据(v0, v1, v2, v3)传给由 location 指定的 attribute 变量(·是指同族函数有四种，分别是: `vertexAttrib1f` -> `vertexAttrib4f`，对应传入的参数个数有`1->4`个; `[f|fv]`是指传入的数据类型格式: `f`为`float`浮点数, `fv`为`float`的向量格式(也就是浮点数组格式))
  * 参数:
    - location: 指定需要传入数据的 attribute 变量内存地址
    - v0, v1, v2, v3: 指定填充 attribute 变量的第1,2,3,4个分量的值
  * 返回值: 无
  * 错误:
    - INVALID_OPERATION: 没有当前的 program 对象
    - INVALID_VALUE: location 大于等于 attribute 变量的最大数目(默认为8)

### `uniform`变量
#### 1. `gl.getUniformLocation(program, name)`: 获取指定名称的 uniform 变量的存储位置
  * 参数:
    - program: 指定包含顶点着色器和片元着色器的程序对象
    - name: 指定想要获取器存储位置的 uniform 变量
  * 返回值:
    - non-null: 指定的 uniform 变量的位置
    - null: 指定的 uniform 变量不存在，或者其命名具有 `gl_` | `webgl_` 前缀
  * 错误:
    - INVALID_OPERATION: 程序对象未能成功链接
    - INCALID_VALUE:  name 参数的长度大于 unifrom 变量名的最大长度(默认 256 字节)

#### 2. `gl.uniform[1|2|3|4][f|fv](location, [v0, [v1, [v2, [v3]]]])`: 将数据传输给由 location 参数指定的 uniform 变量(同 attribute, `[1|2|3|4]`是指有同族函数, 分别是: `unifrom1f`->`unifrom4f`, 对应传入参数有`1->4`个; `[f|fv]`是指传入数据类型格式: `f`为`float`浮点数类型, `fv`为`float`向量格式数据(也就是浮点数))
  * 参数:
    - location: 指定将要修改的 uniform 变量的存储位置
    - v0, v1, v2, v3: 指定填充 uniform 变量的第1,2,3,4个分量的值
  * 返回值: 无
  * 错误:
    - INVALID_OPERATION: 没有当前的 program 对象，或者 location 是非法的存储位置

#### 3. `gl.uniformMatrix4fv(location, transpose, array)`: 将 array 表示的 4x4 矩阵分配给由 location 指定的 uniform 变量
  - 参数:
    - location: uniform 变量的存储位置
    - Transpose: WebGL 中必须置位 false(表示是否转置矩阵，WebGL 没有实现该方法，所以必须置位 false)。
    - array: 待传输的类型化数组。4x4 矩阵案列主序存储在其中
  - 返回值: 无
  - 错误:
    - INVALID_OPERATION: 不存在当前程序对象
    - INVALID_VALUE: transpose 不为 false, 或者数据长度小于16

### smapler2D 变量(2D 纹理)
#### 1. `gl.uniform1i(smapler, unitNumber)`: 将 unitNumner 号纹理单元绑定的纹理传递给 sampler 变量绑定的取样器
  * 参数:
    - sample: 同 uniform 变量获取到的绑定取样器变量
    - unitNumber: 纹理单元号(纹理单元见纹理部分)；
  * 返回值: 无
  * 错误: 无

## 着色器
### 创建着色器
#### 1. `gl.createShader(type)`: 创建由 type 指定的着色器对象
  * 参数:
    - type: 指定待创建的着色器类型;如下
      - gl.VERTEX_SHADER: 顶点着色器
      - gl.FRAGMENT_SHADER: 片元着色器
  * 返回值:
    - non-null: 创建的着色器
    - null: 创建失败
  * 错误:
    - INVALID_ENUM: type 类型错误(只能是上述两种类型)

#### 2. `gl.shaderSource(shader, source)`: 将 source 指定的字符串形式代码传入 shader 指定的着色器。如果之前已经向 shader 传入过代码了，旧的代码将被替换(替换的代码不会自动编译，需要重新手动编译)
  * 参数:
    - shader: 指定需要传入代码的着色器对象
    - source: 指定字符串形式的代码
  * 返回值: 无
  * 错误: 无

#### 3. `gl.compileShader(shader)`: 编译 sahder 指定的着色器中的源代码
  * 参数:
    - shader: 待编译代码的着色器
  * 返回值: 无
  * 错误: 无

#### 4. `gl.deleteSahder(shader)`: 删除 shader 指定的着色器
  * 参数:
    - shader: 待删除掉的着色器
  * 返回值: 无
  * 错误: 无

#### 5. `gl.getShaderParameter(shader, pname)`: 获取 shader 指定着色器中，panme 指定的参数信息
  * 参数:
    - shader: 指定获取参数的着色器
    - pname: 指定待获取的参数类型; 类型如下:
      - gl.SHADER_TYPE: 获取着色器类型(gl.VERTEX_SHADER | gl.GRAGMENT_SHADER)
      - gl.DELETE_STATUS: 获取着色器是否被成功删除
      - gl.COMPILE_STATUS: 获取着色器是否被成功编译
  * 返回值: 根据 pname 的不同，返回不同的值
    - gl.SHADER_TYPE: gl.VERTEX_SHADER | GL.FRAGMENT_SHADER
    - gl.DELETE_STATUS: true | false
    - gl.COMPILE_STATUS:  true | false
  * 错误:
    - INVALID_ENUM: pname 的值无效

#### 6. `gl.getShaderInfoLog(shader)`: 获取 shader 指定的着色器的信息日志
  * 参数:
    - shader: 指定获取信息日志的着色器
  * 返回值:
    - non-null: 包含日志信息的字符串
    - null: 没有编译错误
  * 错误: 无

### 创建程序对象
#### 1. `gl.createProgram()`: 创建程序对象
  * 参数: 无
  * 返回值:
    - non-null: 新创建的程序对象
    - null: 创建失败
  * 错误: 无

#### 2. `gl.attachShader(program, shader)`: 将 shader指定的着色器对象分配给 program 指定的程序对象
  * 参数:
    - program: 指定的程序对象
    - shader: 指定的着色器对象
  * 返回值: 无
  * 错误:
    - INVALID_OPERATION: shader 已经被分配给了 program

#### 3. `gl.linkProgram(program)`: 链接 program 指定的程序对象中的着色器
  * 参数:
    - program: 指定的程序对象
  * 返回值: 无
  * 错误: 无

#### 4. `gl.useProgram(program)`: 告知 WebGL 系统绘制是使用 program 指定的程序对象
  * 参数:
    - program: 指定待使用的程序对象
  * 返回值: 无
  * 错误: 无

#### 5. `gl.detachShader(program, shader)`: 取消 shader 指定的着色器对象对 program 指定的程序对象的分配
  * 参数:
    - program: 指定程序对象
    - shader: 指定的着色器对象
  * 返回值: 无
  * 错误:
    - INVALID_OPERATION: shader 没有被分配给 program

#### 6. `gl.deleteProgram(program)`: 删除 program 指定的程序对象。如果该程序正在被使用，则不会立即删除，而是等他不在被使用后在删除
  * 参数:
    - program: 指定待删除的 program 对象
  * 返回值: 无
  * 错误: 无

#### 7. `gl.getProgramParameter(program, pname)`: 获取 program 指定的程序对象中 pname指定的参数信息。返回值随着 pname 的不同而不同
  * 参数:
    - program: 指定程序对象
    - pname: 指定待获取的参数类型; 类型如下:
      - gl.DELETE_STATUS: 程序否被成功删除
      - gl.LINK_STATUS: 程序是否已经成功连接
      - gl.VALIDATE_STATUS: 程序是否已经通过验证
      - gl.ATTACHED_SHADER: 已经被分配给程序的着色器数量
      - gl.ACTIVE_ATTRIBUTES: 顶点着色器中 attribute 变量的数量
      - gl.ACTIVE_UNIFORMS: 程序中 uniform 变量的数量
  * 返回值:
    - gl.DELETE_STATUS: true | false
    - gl.LINK_STATUS: true | false
    - gl.VALIDATE_STATUS: true | false
    - gl.ATTACHED_SHADER: number
    - gl.ACTIVE_ATTRIBUTES: number
    - gl.ACTIVE_UNIFORMS: number
  * 错误:
    - INVALID_ENUM: pname 的值无效

#### 8. `gl.getProgramInfoLog(program)`: 获取 program 指定的程序对象的信息日志
  * 参数:
    - program: 指定待获取信息日志的程序对象
  * 返回值: 包含信息日志的字符串
  * 错误: 无

## 缓冲区
> 缓冲区使用流程:
> 1. 创建缓冲区对象(gl.createBuffer)
> 2. 绑定缓冲区对象(gl.bindBuffer)
> 3. 将数据写入缓冲区对象(gl.bufferData)
> 4. 将换冲区对象分配给一个 attribute 变量(gl.vertexAttribPointer)
> 5. 开启 attribute 变量(gl.enableVertexAttribArray)
> 6. 使用完后之后可以关闭 attribute 变量(gl.disableVertexArray)
> 7. 使用完毕之后可以删除此缓冲区(gl.deleteBuffer)

#### #### 1. `gl.createBuffer()`: 创建缓冲区对象
  * 参数: 无
  * 返回值:
    - non-null: 新创建的缓冲区对象
    - null: 创建缓冲区对象失败
  * 错误: 无

#### #### 2. `gl.bindBuffer(target, buffer)`: 允许使用 buffer 表示的缓冲区对象并将其绑定到 target 表示的目标上
  * 参数:
    - target: 需要绑定的目标; 有如下类型:
      - gl.ARRAY_BUFFER: 表示缓冲区中包含了顶点的数据
      - gl.ELEMENT_ARRAY_BUFFER: 表示缓冲区对象中包含了顶点的索引值
    - buffer: 指定有 `gl.createBuffer` 创建的缓冲区对象
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: target 不是上述值之一，这是将保持原有的绑定情况不变

#### #### 3. `gl.bufferData(target, data, usage)`: 开启存储空间，向绑定在 target 上的缓冲区对象中写入数据 data
  * 参数:
    - target: 写入数据的对象; 同`bindBuffer`有两种类型: `gl.ARRAY_BUFFER` | `gl.ELEMENT_ARRAY_BUFFER`
    - data: 写入缓冲区对象的数据(类型化数组)
    - usage: 表示程序将如何使用存储在缓冲区对象中的数据(该参数由于帮助 WebGL 优化操作，即使错误也不会终止程序(仅会降低效率)); 有如下类型:
      - gl.STATIC_DRAW: 只会向缓冲区对象中写入一次数据，但需要绘制很多次
      - gl.STREAM_DRAW: 只会向缓冲区对象中写入一次数据，然后绘制若干次
      - gl.DYNAMIC_DRAW: 会向缓冲区对象中多次写入数据，并绘制很多次
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: target 不是上述值之一，这是将保持原有的绑定情况不变

#### #### 4. `gl.vertexAttribPointer(location, size, type, normalized, stride, offset)`: 将绑定到`gl.ARRAY_BUFFER`的缓冲区对象分配给由 location 指定的变量
  * 参数:
    - location: 指定待分配 attribute 变量的存储位置
    - size: 指定缓冲区中每个顶点的分量个数(1到4)。若 size 比 attribute 变量需要的分量数小，缺失分量将按照与`gl.vertexAttrib[1234]f()`相同的规则补全。比如，如果 size 为 1，那么第 2、3 分量自动设定为 0，第 4 分量为 1
    - type: 用以下类型之一来指定数据格式:
      - gl.UNSIGNED_BYTE: 无符号字节, UInt8Array
      - gl.SHORT: 短整形, Int16Array
      - gl.UNSIGNED_SHORT: 无符号短整形, UInt16Array
      - gl.INT: 整形, Int32Array
      - gl.UNSIGNED_INT: 无符号整形, UInt32Array
      - gl.FLOAT: 浮点型, Float32Array
    - normalize: 传入 true/false, 标明是否将非浮点数的数据归一化到[0, 1]或[-1, 1]之间
    - astride: 指定相邻顶点间的字节数(默认为0)
    - offset: 指定缓冲区对象中的偏移量(以字节为单位), 即 attribute 变量从缓冲区中的何处开始存储。如果是从起始位置开始的，offset 设为 0
  * 返回值: 无
  * 错误:
    - INVALID_OPERATION: 不存在当前程序对象
    - INVALID_VALUE: location 大于等于 attribute 变量的最大数目(默认为`8`)，或者 stride 或 offset 是负数
   
#### #### 5. `gl.enableVertexArray(location)`: 开启 location 指定的 attribute 变量
  * 参数:
    - location: 指定 attribute 变量的存储位置
  * 返回值: 无
  * 错误:
    - INVALID_VALUE: location 大于等于 attribute 变量的最大数目

#### #### 6. `gl.disableVertexArray(location)`: 关闭 location 指定的 attribute 变量
  * 参数:
    - location: 指定 attribute 变量的存储位置
  * 返回值: 无
  * 错误:
    - INVALID_VALUE: location 大于等于 attribute 变量的最大数据(默认为8)

#### #### 7. `gl.deleteBuffer(buffer)`: 删除 buffer 指定的缓冲区对象
  * 参数:
    - buffer: 待删除的缓冲区对象
  * 返回值: 无
  * 错误: 无


s## WebGL 使用到的类型化数组

### 类型化数组类型
| 数组类型 | 每个元素所占字节数 | 描述(C 语言中的数据类型) |
| ------ | --------------- | --------------------- |
| Int8Array | 1 | 8位整型数(signed char) |
| UInt8Array | 1 | 8位无符号整型数(unsigned char) |
| Int16Array | 2 | 16位整型数(signed short) |
| UInt16Array | 2 | 16位无符号整型数(unsigned short) |
| Int32Array | 4 | 32位整型数(signed int) |
| UInt32Array | 4 | 32未无符号整型数(unsigned int) |
| Float32Array | 4 | 单精度32位浮点数(float) |
| Float64Array | 8 | 双精度64位浮点数(double) |

### 类型化数组方法、属性、常量
| 方法、属性、常量 | 描述 |
| ------------- | --- |
| get(index) | 获取第 index 个元素值 |
| set(index, value) | 设置第 index 个元素的值为 value |
| set(array, offset) | 从第 offset 个元素开始将数组 array 中的值填充进去 |
| length | 数据的长度 |
| BYTES_PER_ELEMENT | 数据中每个元素所占的字节数 |


## 纹理
> 纹理使用流程:
> 1. 创建纹理(gl.createTexture)
> 2. 图像 Y 轴翻转(gl.pixelStorei)
> 3. 激活纹理单元(gl.activeTexture) -- WebGL 通过纹理单元来实现同时使用多个纹理
> 4. 开启指定的纹理单元，绑定纹理到纹理单元(gl.bingTarget) --  告诉 WebGL 使用的是哪种纹理单元
> 5. 配置纹理对象的参数(gl.texParameteri)

#### 1. `gl.createTexture()`: 创建纹理对象以存储纹理
  * 参数: 无
  * 返回值:
    - non-null: 新创建的纹理对象
    - null: 创建纹理对象失败
  * 错误: 无

#### 2. `gl.pixelStorei(pname, param)`: 使用 panme 和 param 指定的方式处理纹理加载得到的图像
  * 参数:
    - pname: 需要处理的方式; 有如下两种:
      - gl.UNPACK_FLIP_Y_WEBGL: 对图像进行 Y 轴翻转。默认值为 false
      - gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL: 将图像 RGB 颜色值的每一个分量乘以 A。默认值为 false
    - param: 指定非0(true) 或 0(false)。必须为整数
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: pname 不是合法的值
  > 注: WebGL纹理坐标中的t轴的方向和 PNG、BMP、JPG 等格式图片的坐标系统的 Y 轴方向是相反的。所以需要先将图像进行 Y 轴翻转，才能正确的将图像映射到图形上


#### 3. `gl.activeTexture(textUnit)`: 激活 textUnit 指定的纹理单元
  * 参数:
    - textUnit: 指定准备激活的纹理单元; 如下:
      - gl.TEXTURE[0-7]: 指定的纹理单元号，WebGL 最少支持 8 个纹理单元; (Chrome 有 30 个纹理单元)
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: textUnit 的值不合法
  > 


#### 4. `gl.bindTexture(target, texture)`: 开启 texture 指定的纹理对象，并将其绑定到 target(目标)上。如果已经通过 `gl.activeTexture` 激活了某个纹理单元，则纹理对象也会绑定到这个纹理单元上
  * 参数:
    - target: 绑定的纹理类型; 如下:
      - gl.TEXTURE_2D: 二维纹理
      - gl.TEXTURE_CUBE_MAP: 立方体纹理
    - texture: 表示绑定的纹理单元
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: target 不是合法的值

#### 5. `gl.texParameteri(target, pname, param)`: 将 param 的值赋给绑定到目标的纹理对象的 pname 参数上
  * 参数:
    - target: 需要绑定的纹理对象；如下两种类型:
      - gl.TEXTURE_2D: 2D纹理对象
      - gl.TEXTURE_BUTE_MAP: 3D立方体纹理对象
    - pname: 纹理参数; 内容较多，见下表(5.1)；
    - param: 纹理参数的值；内容较多，见下表(5.2&5.3);
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: target 不是合法的值
    - INVALID_OPERATION: 当前目标上没有绑定纹理对象

##### 5.1 纹理参数及默认值
> | 纹理参数 | 描述 | 默认值 |
> | ------ | ---- | ----- |
> | gl.TEXTURE_MAG_FILTER | 纹理放大 |gl.LINEAR |
> | gl.TEXTURE_MIN_FILTER | 纹理缩小 |gl.NEAREST_MIPMAP_LINEAR |
> | gl.TEXTURE_WRAP_S | 纹理水平填充 |gl.REPEAT |
> | gl.TEXTURE_WRAP_T | 纹理垂直 K填充 |gl.REPEAT |

##### 5.2 可以赋值给 gl.TEXTURE_MAP_FILTER | gl.TEXTURE_MIN_FILTER 的非金字塔纹理类型常量
> | 值 | 描述 |
> | -- | --- |
> | gl.NEAREST | 使用源纹理上距离映射后像素(新像素)中心最近的那个像素的颜色值，作为新像素的值(使用曼哈顿距离) |
> | gl.LINEAR | 使用距离新像素中心最近的四个像素的颜色值的加权平均，作为新像素的值(与 gl.NEAREST相比效果更好，但计算开销会更大) |
> 
> 金字塔类型的纹理包括: gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR; 具体查看《OpenGL Programming Guide》

##### 5.3 可以赋值给 gl.TEXTURE_WRAP_S 和 gl.TEXTURE_WRAP_T 的常量
> | 值 | 描述 |
> | -- | --- |
> | gl.REPEAT | 平铺式重复纹理 |
> | gl.MIRRORED_REPEAT | 镜像对称式重复纹理 |
> | gl.CLAMP_TO_EDGE | 使用纹理图像边缘值 |

#### 6. `gl.texImage2D(target, level, internalformat, format, type, image)`: 将 image 指定的图像分配给绑定到目标上的纹理对象
  * 参数:
    - target: 绑定的纹理对象类型; 有如下两种
      - gl.TEXTURE_2D: 2D 纹理类型
      - gl.TEXTURE_CUBE_MAP: 3D 立方类型
    - level: 金字塔纹理类型需要此参数。非金字塔类型传入0即可
    - internalformat: 图像的内部格式(纹素格式); 见下表6.1
    - format: 纹理数据的格式，必须使用与 internalformat 相同的值
    - type: 纹理数据的类型; 见下表6.2
    - image: 包含纹理五项的 Image 对象
  * 返回值: 无
  * 错误:
    - INVALID_ENUM: target 不是合法的值
    - INVALID_OPERATION: 当前目标上没有绑定纹理对象

##### 6.1 纹素数据的格式
> | 格式 | 描述 |
> | --- | ---- |
> | gl.RGB | 红、绿、蓝 |
> | gl.RGBA | 红、绿、蓝、透明度 |
> | gl.ALPHA | (0.0, 0.0, 0.0, 透明度) |
> | gl.LUMINANCE | L、L、L、1L: 流明 |
> | gl.LUNINANCE_ALPHA | L、L、L、透明度 |

##### 6.2 纹理数据的格式
| 格式 | 描述 |
| --- | ---- |
| gl.UNSIGNED_BYTE | 无符号整形，每个颜色分量占据 1 字节 |
| gl.UNSIGNED_SHORT_5_6_5 | RGB: 每个分量分占 5、6、5 比特 |
| gl.UNSIGNED_SHORT_4_4_4_4 | RGBA: 每个分量分占 4、4、5、4 比特 |
| gl.UNSIGNED_SHORT_5_5_5_1 | RGBA: 每个分量分占 5、5、5、1 比特 |

#### 1. `gl.deleteTexture(texture)`: 删除纹理对象
  * 参数:
    - texture: 待删除的纹理对象
  * 返回值: 无
  * 错误: 无

我想开发一个web本地应用，用于提供给oh-my-opencode用户快速配置oh-my-opencode.json和opencode.json文件

# 主要功能：

## 1. opencode.json配置编辑模块

进行opencode.json的快速编辑和配置

### 1.1 加载opencode.json

上传opencode.json，然后显示opencode.json内容，可进行手动编辑

### 1.2 快捷编辑区

用户上传opencode.json后，出现一个快捷编辑区

#### 1.2.1 供应商和模型编辑

分为左右两栏，一栏供应商、一栏模型列表

- 供应商(provider)
  - 展示全部opencode支持的供应商（你要查询官方资料获取，并生成一个md文档列给我看）
  - 每个供应商都要有一个总开关，关闭后，在opencode.json删除对应的代码片段，开启则添加对应的代码片段
  - 点击任何一个供应商，右侧栏显示供应商支持的模型列表
- 模型列表：
  - 显示供应商支持的模型列表，一个cell显示一个模型
  - 每一个cell展示：
    - 模型名称（name）：左对齐
    - 开关：切换开关，开启后在opencode.json添加对应的配置代码片段
    - 次级信息：在模型名称下方，左对齐：显示limit_contex对应的数值、modalities_input（比如"text", "image", "pdf"）
  - 代码片段格式参考"$schema": "https://opencode.ai/config.json"

# 2. oh-my-opencode.json编辑模块

进行oh-my-opencode.json的快速编辑和配置

### 2.1 加载oh-my-opencode.json

上传oh-my-opencode.json，然后显示oh-my-opencode.json内容，可进行手动编辑

### 2.2 快捷编辑区

用户上传oh-my-opencode.json后，出现一个快捷编辑区，

#### 2.2.1 agents编辑

- 列出omo官方定义的所有agents（这方面你要查阅omo官方代码和文档，获取最新的agents分类），比如"sisyphus"、"atlas"、"prometheus"
- 每个agents，都对应4个编辑项：
  - model：下拉菜单，选项为opencode.json已经配置好的模型列表
  - temperature：数字输入框，默认0.1，最好选可拖动的滑块进行拖拉快速调节（也可以输入），拖一格就加减0.1
  - mode：下拉菜单，选项为primary、subagent
  - description：文本展示框，显示官方对每个agents的功能定义，比如Primary orchestrator (fallback: kimi-k2.5 → glm-4.7 → gpt-5.2-codex → gemini-3-pro)。可以点击编辑按钮，开启编辑模式，用户可输入文本
- 每次编辑每个选项，都实时按schema标准改变oh-my-opencode.json的内容。 参考"https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
- 总按钮：显示在预览区下方
  - 重置：将用户上传的oh-my-opencode.json还原成用户上传的版本，撤销一切修改的编辑项
  - 下载副本：弹出本地的目录选择弹出，把配置好的oh-my-opencode.json保存到用户指定的目录
  - 应用：把配置好的oh-my-opencode.json直接替换用户的opencode配置目录下的oh-my-opencode.json



#### 2.2.2 categories编辑

- 列出omo官方定义的所有categories（这方面你要查阅omo官方代码和文档，获取最新的categories分类），比如"visual-engineering"、"ultrabrain"、"quick"
- 每个agents，都对应2个编辑项：
  - model：下拉菜单，选项为opencode.json已经配置好的模型列表
  - variant：下拉菜单，默认为空，选项为模型的智能程度，比如xhigh、medium、max（必须与模型对应）




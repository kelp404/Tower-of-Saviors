#Tower-of-Saviors [![devDependency Status](https://david-dm.org/kelp404/Tower-of-Saviors/dev-status.png?branch=master)](https://david-dm.org/kelp404/Tower-of-Saviors#info=devDependencies)

[MIT License](http://www.opensource.org/licenses/mit-license.php)






##Unit Test
>
```bash
$ grunt test
```




##Development
```bash
# install node modules
$ npm install
```
```bash
# run the local server and the file watcher to compile CoffeeScript
$ grunt dev
```




###[Closure Compiler](https://code.google.com/p/closure-compiler/)
You could download compiler form [Google Code](https://code.google.com/p/closure-compiler/wiki/BinaryDownloads?tm=2).

**[External Tools](http://www.jetbrains.com/pycharm/webhelp/external-tools.html):**

Settings  |  value
:---------:|:---------:
Program | java
Parameters | -jar /Volumes/Data/tools/closure-compiler/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js $FileName$ --js_output_file $FileNameWithoutExtension$.min.$FileExt$
Working directory | $FileDir$

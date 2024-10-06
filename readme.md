
jdrone is a printable model for a quadcopter frame.
The model is designed programatically using
[jscad](https://github.com/jscad/OpenJSCAD.org) library.

The parts are designed to be easy to print.
No support is necessary, bridges and overhangs are kept short.
The build plate of 120x120 mm is necesary.
I recommend to print the parts with ABS.

We use M3x4x5 thread inserts and M3x8 button head screws
to connect the parts of the frame.
All parts are connected with minimum of two screws.
The motors are also connected with M3x8 screws.
The stack connects with four M3x20 button head screws.

The quadcopter is measured about 257mm diagonally,
and can handle propellers with 180mm diameter.
The motors are attached by 16*16mm M3 screws.
Flight controller is installed in 30.5x30.5 mm mounting, installing the stack is possible.
Receiver with dimensions 16x11mm can be added.

## Layout preview

![Layout preview](https://raw.githubusercontent.com/her01n/jdrone/refs/heads/main/preview.png)

[View 3d model.](https://github.com/her01n/jdrone/blob/main/stl/preview.stl)

## Compile

Install *node*, *make* and *@jscad/cli* package, example for arch:

```
sudo pacman -Syu --needed npm make
sudo npm install -g @jscad/cli
```

Now you can run *make* to generate *stl* files.

```
make
```

## Photo

![GOPR0438](https://github.com/user-attachments/assets/ddfe4e0a-a48e-4cba-bf41-8f1bcfa9a0f2)

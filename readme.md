
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
Flight controller is installed in 30.5x30.5mm or 20x20mm mounting, installing the stack is possible.
Receiver with dimensions 16x11mm can be added.

## Layout preview

![Layout preview](https://raw.githubusercontent.com/her01n/jdrone/refs/heads/main/preview.png)

[View 3d model.](https://github.com/her01n/jdrone/blob/main/stl/preview.stl)

## BOM

Printed parts

- 1x core
- 1x top
- 4x arm
- 4x long-leg-d

Connectors

- 20x M3x5x4 thread inserts. Thread M3, outer diameter 5mm, length 4mm.
- 24x M3x8 button head screws. Thread M3, length 8mm. Any head if not countersunk should work.
- 4x M3x25 button head screws.

Other parts necessary depends on the stack and optionally radio used:

### 20mm stack

- 1x flight controller and 1x ESC with 4 mounting holes of 3mm diameter,
  layed out in a square with a 20mm long side.
- 4x M2x4x3.2 thread set inserts. Inner diameter is 2mm, length 4mm and outer diameter 3.2mm.
- 8x M2/M3 silicone pads, 6-7mm long
- 4x M2x16 screws

### 30.5mm stack

- 1x flight controller and 1x ESC with 4 mounting holes of 4mm diameter,
  layed out in a corners of a square with 30.5mm long side.
- 8x M3/M4 silicone pads, 8mm long.
- 4x M3x5x4 thread inserts.
- 4x M3x20 button head screws.

### 16x11 mm radio

- 1x pcb radio with dimensions 16x11mm.
- 2x M3x5x4 thread inserts
- 2x M3x8 screws

## Gopro

It's possible to add a mount for a gopro or similar action camera.

Additional parts needed:

- 2x M3x5x4 thread inserts.
- 1x M5x7x8 thread insert.
- 2x M3x8 screws.

Print *gopro* model with ABS.
Optionally print *gopro-pad* with flexible material, like TPU.

## Usb

Model *usb* contains two parts that could be used to fix a usb-a socket.
It can be used to hold a wifi usb adapter for digital fpv.
The usb can be fixed to *core*, *top* or *horns* part.

Additional parts needed:

- 4x M3x5x4 thread inserts
  Two inserts in *usb* part and two in *core*, *top* or *horns*.
- 4x M3x8 screws

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

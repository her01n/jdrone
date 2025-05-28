default: stl/arm.stl stl/core.stl stl/gopro.stl stl/gopro-pad.stl stl/horns.stl \
    stl/long-leg-c.stl stl/long-leg-d.stl stl/pi-camera.stl stl/rx.stl stl/top.stl \
    stl/usb.stl stl/preview.stl preview.png

clean:
	rm -rf stl/*

stl/arm.stl: src/arm.js src/eyelet.js src/hulls.js src/print-cylinder.js src/symmetries.js
stl/core.stl: src/core.js src/arrow.js src/eyelet.js src/plate.js \
    src/print-cylinder.js src/symmetries.js src/thread-insert.js
stl/gopro.stl: src/gopro.js
stl/gopro-pad.stl: src/gopro-pad.js
stl/horns.stl: src/horns.js src/top.js src/arrow.js src/hulls.js src/plate.js
stl/long-leg-c.stl: src/long-leg-c.js src/long-leg.js
stl/long-leg-d.stl: src/long-leg-d.js src/long-leg.js
stl/preview.stl: src/preview.js src/arm.js src/arrow.js src/core.js src/eyelet.js \
    src/long-leg-d.js src/plate.js src/print-cylinder.js src/rx.js src/symmetries.js \
    src/top.js
stl/rx.stl: src/rx.js
stl/top.stl: src/top.js src/arrow.js src/hulls.js src/plate.js

stl/%.stl: src/%.js
	npx jscad $< -o $@

preview.png: stl/preview.stl
	f3d $< --output $@ --axis=false --grid=false --hdri-ambient \
	  --ambient-occlusion --anti-aliasing --tone-mapping --filename=false

watch:
	ls src/* | entr -c make

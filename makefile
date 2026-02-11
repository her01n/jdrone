default: stl/arm.stl stl/bind20.stl stl/bind40.stl stl/core.stl stl/gopro.stl \
    stl/gopro-pad.stl stl/horns.stl stl/long-leg-c.stl stl/long-leg-d.stl \
    stl/pi-camera.stl stl/top.stl stl/preview.stl stl/strap.stl preview.png

clean:
	rm -rf stl/*

stl/arm.stl: src/arm.js src/hulls.js src/print-cylinder.js src/symmetries.js
stl/bind20.stl: src/bind20.js src/bind.js src/symmetries.js
stl/bind40.stl: src/bind40.js src/bind.js src/symmetries.js
stl/core.stl: src/core.js src/arrow.js src/plate.js \
    src/print-cylinder.js src/symmetries.js src/thread-insert.js
stl/gopro.stl: src/gopro.js
stl/gopro-pad.stl: src/gopro-pad.js
stl/horns.stl: src/horns.js src/top.js src/arrow.js src/hulls.js src/plate.js
stl/long-leg-c.stl: src/long-leg-c.js src/long-leg.js
stl/long-leg-d.stl: src/long-leg-d.js src/long-leg.js
stl/preview.stl: src/preview.js src/arm.js src/arrow.js src/core.js \
    src/long-leg-d.js src/plate.js src/print-cylinder.js src/symmetries.js \
    src/top.js
stl/strap.stl: src/strap.js src/symmetries.js
stl/top.stl: src/top.js src/arrow.js src/hulls.js src/plate.js

stl/%.stl: src/%.js
	npx jscad $< -o $@

preview.png: stl/preview.stl
	f3d $< --output $@ --axis=false --grid=false --hdri-ambient \
	  --ambient-occlusion --anti-aliasing --tone-mapping --filename=false

watch:
	ls src/* | entr -c make

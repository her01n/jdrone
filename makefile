default: stl/arm.stl stl/center.stl stl/long-leg-c.stl stl/long-leg-s.stl \
    stl/long-leg-w.stl stl/rx.stl stl/top.stl

stl/arm.stl: src/arm.js src/eyelet.js src/hulls.js src/print-cylinder.js src/symmetries.js
stl/center.stl: src/center.js src/arrow.js src/eyelet.js src/plate.js \
    src/print-cylinder.js src/symmetries.js src/thread-insert.js
stl/long-leg-c.stl: src/long-leg-c.js src/long-leg.js
stl/long-leg-s.stl: src/long-leg-s.js src/long-leg.js
stl/long-leg-w.stl: src/long-leg-w.js src/long-leg.js
stl/rx.stl: src/rx.js
stl/top.stl: src/top.js src/arrow.js src/hulls.js src/plate.js

stl/%.stl: src/%.js
	npx jscad $< -o $@



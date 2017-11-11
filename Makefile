default: run.local.dev

run.local.dev:
	npm i && \
	node ./build.js & node ./server.js

run.local.release:
	npm i --production && \
	node ./build.js release && \
	node ./server.js release

docker:
	rm -rf ./node_modules && \
	npm i --production && \
	rm ./public/app.js && \
	rm ./public/externals.js && \
	node ./build.js release && \
	docker build -t catberry/catberry-example .

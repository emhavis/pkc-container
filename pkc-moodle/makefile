CURRENT_TIME = $(shell date +'%y.%m.%d %H:%M:%S')
CURRENT_TAG = "v0.1"
CURRENT_BUILD = "emhavis/pkc_moodle"

build: 
	docker build -t ${CURRENT_BUILD}:${CURRENT_TAG} .

buildAndPush:
	docker build -t ${CURRENT_BUILD}:${CURRENT_TAG} .
	docker push ${CURRENT_BUILD}:${CURRENT_TAG}

push:
	docker push ${CURRENT_BUILD}:${CURRENT_TAG}

build_no_cache: 
	docker build --no-cache -t ${CURRENT_BUILD}:${CURRENT_TAG} .

push_no_cache: 
	docker push ${CURRENT_BUILD}:${CURRENT_TAG}

commitToGitHub:
	git add .
	git commit -m 'Created Makefile for the first time, and committed at ${CURRENT_TIME}'
	git push

buildMulti:
	docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7,linux/arm/v6 -t ${CURRENT_BUILD}:${CURRENT_TAG} --push . 
	
buildMultiLocal:
	docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7,linux/arm/v6 -t localhost:5000/pkc_codeserver:${CURRENT_TAG} --push .


# docker build -t emhavis/pkc_semanticwiki:v1.37.1.build.2 --build-arg BUILD_SMW=true .
# 
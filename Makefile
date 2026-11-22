setup: install

install:
	npm ci

start:
	npm run dev

test:
	npm test

lint:
	npm run lint

build:
	rm -rf dist
	npm run build

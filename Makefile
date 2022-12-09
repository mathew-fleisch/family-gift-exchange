
SHELL := /bin/bash 

.PHONY: run
run:
# @open http://localhost:8000 -a "Google Chrome"
	@python3 -m http.server 8000

.PHONY: generate
generate:
	@while ! node gift-exchange.js; do sleep 1; echo "Try again..."; done
	@jq '.' output.json > output.json.pretty
	@mv output.json.pretty output.json

.PHONY: clean
clean:
	@rm -rf d3.v4.min.js jquery.min.js

.PHONY: docker-build
docker-build:
	docker build -t family-gift-exchange .

.PHONY: docker-run
docker-run: docker-build
	docker run -it --rm -v $(PWD):/workspace -p 8000:8000 family-gift-exchange
.PHONY: run
run:
	@open http://localhost:8000 -a "Google Chrome"
	@python -m SimpleHTTPServer 8000

.PHONY: generate
generate:
	@while ! node gift-exchange.js; do sleep 1; echo "Try again..."; done
	@jq '.' output.json > output.json.pretty
	@mv output.json.pretty output.json

.PHONY: clean
clean:
	@rm -rf d3.v4.min.js jquery.min.js
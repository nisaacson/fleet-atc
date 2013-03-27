MOCHA=node_modules/.bin/mocha
REPORTER=spec
test:
	node_modules/.bin/mocha $(shell find test -name "*check-test.js") --reporter spec
is-command-running: 
	$(MOCHA) test/is-command-running-test.js --reporter $(REPORTER)
spawn:
	$(MOCHA) test/spawn-test.js --reporter $(REPORTER)

.PHONY: test
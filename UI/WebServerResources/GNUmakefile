# GNUstep makefile

include ../common.make

WEBSERVER_RESOURCE_DIRS = css fonts img js
JS_FILES = js/Administration.* js/Common.* js/Contacts.* js/Mailer.* js/Main.* js/Preferences.* js/Scheduler.* css/styles.*
JS_LIB_FILES = js/vendor/angular-animate.* js/vendor/angular-aria.* js/vendor/angular-file-upload.min.js js/vendor/angular-material.* js/vendor/angular-sanitize.* js/vendor/angular-ui-router.* js/vendor/angular.* js/vendor/lodash.*
CSS_FILES = css/styles.css css/styles.css.map

.DEFAULT_GOAL := all

dev:
	npm install --production
	@if [ ! -e angular-material/src ]; then \
	  git submodule init; \
	fi
	git submodule update
	@if [ -d bower_components ]; then \
	  bower update --allow-root; \
	else \
	  bower install --allow-root; \
	fi
	grunt --stack build

prod:
	git stash
	grunt --stack build
	git update-index --no-assume-unchanged $(CSS_FILES) $(JS_FILES) $(JS_LIB_FILES)
	git add -f $(CSS_FILES) $(JS_FILES) $(JS_LIB_FILES)
	git commit -m "(js/css) Update generated files"
	git update-index --assume-unchanged $(CSS_FILES) $(JS_FILES) $(JS_LIB_FILES)
	git stash pop

all:
	@echo "The 'all' target does nothing. Use 'make dev' to generate static files and 'make install' to install them."

install:
	@if [ -L "$(SOGO_WEBSERVERRESOURCESDIR)" ]; then \
	  echo "$(SOGO_WEBSERVERRESOURCESDIR) is a symbolic link (for development?). Installation skipped."; \
	else \
	  mkdir -p $(SOGO_WEBSERVERRESOURCESDIR); \
	  cp -r $(WEBSERVER_RESOURCE_DIRS) $(SOGO_WEBSERVERRESOURCESDIR)/; \
	fi

check:

clean:

distclean: clean

uninstall:
	@if [ -L "$(SOGO_WEBSERVERRESOURCESDIR)" ]; then \
	  echo "$(SOGO_WEBSERVERRESOURCESDIR) is a symbolic link (for development?). Uninstallation skipped."; \
	else \
	  rm -rf $(SOGO_WEBSERVERRESOURCESDIR); \
	fi

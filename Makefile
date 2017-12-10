.PHONY: create-workspace
create-workspace: Workspace clear-workspace
	cp -R -L Chrome "Workspace/Polite Phabricator.chromeextension"
	cp -R -L Safari "Workspace/Polite Phabricator.safariextension"
	
.PHONY: clear-workspace
clear-workspace:
	rm -rf Workspace/*

Workspace:
	mkdir Workspace

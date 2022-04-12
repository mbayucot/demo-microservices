.PHONY: start-managed
demo-managed: publish take-five docker-up docker-down

.PHONY: publish
publish:
	.scripts/publish.sh

.PHONY: unpublish
unpublish:
	.scripts/unpublish.sh

.PHONY: docker-up
docker-up:
	docker-compose -f docker-compose.yml up
	@sleep 2
	@docker logs apollo-gateway

.PHONY: docker-build
docker-build:
	docker-compose build

.PHONY: docker-down
docker-down:
	docker-compose down --remove-orphans

.PHONY: take-five
take-five:
	@echo waiting for robots to finish work ...
	@sleep 5

.PHONY: graph-api-env
graph-api-env:
	@.scripts/graph-api-env.sh


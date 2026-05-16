FROM --platform=$BUILDPLATFORM golang:1.26.2-alpine3.23 AS builder

WORKDIR /code

ENV CGO_ENABLED=0
ENV GOPATH=/go
ENV GOCACHE=/go-build

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod/cache \
    go mod download

COPY . .

RUN --mount=type=cache,target=/go/pkg/mod/cache \
    --mount=type=cache,target=/go-build \
    go build -o bin/jobs-server cmd/api-server/main.go

FROM scratch

COPY --from=builder /code/bin/jobs-server /usr/local/bin/jobs-server
CMD ["/usr/local/bin/jobs-server"]

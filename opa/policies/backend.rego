package backend.authz

default allow = false

allow {
    input.user.realm_access.roles[_] == "admin"
}

allow {
    input.user.realm_access.roles[_] == "user"
    input.method == "GET"
}

allow {
    input.user.preferred_username == "backend-service"
    input.method == "POST"
    input.path == "/microservice/endpoint"
}

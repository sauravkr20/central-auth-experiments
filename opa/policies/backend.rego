package backend.authz

default allow = false

# Allow admins full access
allow {
  input.user.role == "admin"
}

# Allow users to read only
allow {
  input.user.role == "user"
  input.action == "read"
}

# Service-to-service: allow backend to call microservice
allow {
  input.service == "backend"
  input.target == "microservice"
  input.action == "invoke"
}

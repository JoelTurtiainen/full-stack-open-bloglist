# curl -s -i -X POST \
#   'http://localhost:3001/api/blogs' \
#   -H 'Content-Type: application/json' \
#   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhc2kiLCJpZCI6IjY3ODdhNjdlZjQ3NmY1MDMwNWI4ZjI5MCIsImlhdCI6MTczNzEwNzYwNn0.RBgChVUidAfG7X8-92Zh1yC184N1vtqASrIwn0cBWoE' \
#   -d '{"url":"wikipedia.org", "title": "Saunomista", "author": "Kari Kiuas", "likes": 5}' \

# curl -s -i -X POST \
#   'http://localhost:3001/api/users' \
#   -H 'Content-Type: application/json' \
#   -d '{"username": "pasi", "name": "Pasi Porsas", "password":"qwertyuiop"}' \

curl -s -i -X POST \
  'http://localhost:3001/api/users' \
  -H 'Content-Type: application/json' \
  -d '{"username": "kari", "name": "Kari Kiuas", "password":"12345"}' \

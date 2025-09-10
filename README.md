# full-stack-open-bloglist
Assignment for [fullstackopen.com](https://fullstackopen.com/en/part11/expanding_further#exercises-11-19-11-21) part 11, task 20

Use following to create a new user: 
```sh
curl -s -i -X POST \
  'http://https://full-stack-open-bloglist-rkbn.onrender.com/api/users' \
  -H 'Content-Type: application/json' \
  -d '{"username": "<username>", "name": "<name>", "password":"<password>"}' \ 
```

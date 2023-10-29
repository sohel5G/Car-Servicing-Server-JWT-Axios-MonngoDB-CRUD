### JWT token generate server side steps : 
- Install jsonwebtoken
- jwt.sign (payload, secret, {expiresIn})
- send to client side (res.send(token))


### JWT token store client side steps : 
- memory (ok type but not very good way)
- local storage (ok type but not good way)
- cookies (http only is good way)

### Server side : 
- Set cookie with http only for development secure: false
- cors
```JavaScript
app.use(cors({
    origin: ['http://localhost:5173/'],
    credentials: true
}));
```




#### Client side code :
- axios setting
- axios set withCredentials: true (it's for all method to send client browser cookie to server API like post, get, put fetch etc etc.... )
```JavaScript
const jwtUser = { email: user?.email }
      axios.post('http://localhost:5000/jwt', jwtUser, { withCredentials: true })
        .then(res => console.log(res.data))
```




#### Server side code for JWT
```JavaScript
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(cookieParser());


app.post('/jwt', (req, res) => {
    const user = req.body;

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

    res
        .cookie('token', token, {
            httpOnly: true,
            secure: false
        })
        .send({ success: true })
})

```







### make hexadecimal number node js terminal : 
```JavaScript
node
```
```JavaScript
require('crypto').randomBytes(64)
```
```JavaScript
require('crypto').randomBytes(64).toString('hex')
```


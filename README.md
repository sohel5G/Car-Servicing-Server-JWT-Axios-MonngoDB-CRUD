### JWT token generate server side steps : 
- Install jsonwebtoken
- Install Cookie Parser
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
    origin: ['http://localhost:5173', 'http://localhost:5174'],
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


#### For all API lke this below : 
- Client Side 
```JavaScript
axios.get(`http://localhost:5000/bookings?email=${user.email}`, { withCredentials: true })
    .then((res) => setBookings(res.data));
```

- Server Side
```JavaScript
app.get('/bookings', async (req, res) => {

            console.log('Token get from frontend', req.cookies.token);

            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }

            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })
```




####  Custom middleware & verify token to provide correct user data
```JavaScript
/* Custom made middlewares */
const logger = async (req, res, next) => {
    console.log('called', req.host, req.originalUrl)
    next()
}

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    console.log('value of token in middleware', token);

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ message: 'Unauthorized' })
        }
        // console.log('value in the token decoded', decoded);
        req.user = decoded
        next()
    })
}
/* Custom made middlewares End */


 app.get('/bookings', logger, verifyToken, async (req, res) => {

    // console.log('Token get from frontend', req.cookies.token);
    // console.log('user in the valid token', req.user);

    /*token verify */
    if( req.query.email !==  req.user.email){
        return res.status(403).send({message: 'Forbidden access'})
    }/*token verify end */

    let query = {};
    if (req.query?.email) {
        query = { email: req.query.email }
    }

    const result = await bookingCollection.find(query).toArray();
    res.send(result)
})

```








#### make hexadecimal number node js terminal command : 
```JavaScript
node
```
```JavaScript
require('crypto').randomBytes(64)
```
```JavaScript
require('crypto').randomBytes(64).toString('hex')
```





#### Server side deploy
- Vercel config file 
- If you use cookies in cross side: use cros for your production url
- vercel --prod
- after deploy set environment variable

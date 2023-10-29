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

### Client side :
- Axios setting

```JavaScript
app.post('/jwt', (req, res) => {
            const user = req.body;

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none'
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


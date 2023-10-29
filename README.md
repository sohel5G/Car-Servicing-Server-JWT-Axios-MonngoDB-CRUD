## JWT token generate steps : 
- Install jsonwebtoken
- jwt.sign (payload, secret, {expiresIn})
- send to client side (res.send(token))





make hexadecimal number node js terminal : 

```JavaScript
node
```
```JavaScript
require('crypto').randomBytes(64)
```
```JavaScript
require('crypto').randomBytes(64).toString('hex')
```


let express = require('express')
let request = require('request')
let querystring = require('querystring')

let app = express()

/////////////////////////////////////////////COMPLETE BELOW KEYS ON LOCAL///////////////////////////////////////////////////////////
// let FRONTEND_URI = ""
// let redirect_uri = ""
// let SPOTIFY_CLIENT_ID = ""
// let SPOTIFY_CLIENT_SECRET = ""
/////////////////////////////////////////////COMPLETE ABOVE KEYS ON LOCAL///////////////////////////////////////////////////////////

/////////////////////////////////////////////COMMENT OUT BELOW OUT ON LOCAL///////////////////////////////////////////////////////////
let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'
/////////////////////////////////////////////COMMENT OUT ABOVE OUT ON LOCAL///////////////////////////////////////////////////////////



app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
//////////////////////////////////////////FLIP COMMENT/UNCOMMENT BELOW ON LOCAL///////////////////////////////////////////////////////////
      // client_id: SPOTIFY_CLIENT_ID,
      client_id: process.env.SPOTIFY_CLIENT_ID,
//////////////////////////////////////////FLIP COMMENT/UNCOMMENT ABOVE ON LOCAL///////////////////////////////////////////////////////////
      scope: 'playlist-read-private playlist-modify-private playlist-read-collaborative playlist-modify-public user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
//////////////////////////////////////////FLIP COMMENT/UNCOMMENT BELOW ON LOCAL///////////////////////////////////////////////////////////
        // SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
//////////////////////////////////////////FLIP COMMENT/UNCOMMENT ABOVE ON LOCAL///////////////////////////////////////////////////////////
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
//////////////////////////////////////////FLIP COMMENT/UNCOMMENT BELOW ON LOCAL///////////////////////////////////////////////////////////
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    // let uri = FRONTEND_URI || 'http://localhost:3000'
//////////////////////////////////////////FLIP COMMENT/UNCOMMENT ABOVE ON LOCAL///////////////////////////////////////////////////////////
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
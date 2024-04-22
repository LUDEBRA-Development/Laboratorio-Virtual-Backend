const app = require('./app');

app.listen(app.get('port'), ()=>{
    console.log('Listenig port', app.get("port")); 
})
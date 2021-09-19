import express from 'express';
import handlebars from 'express-handlebars'

const app = express();
const PORT = 8080;
const objProductos = [];
const router = express.Router();

const server = app.listen(PORT, () => {
    console.log(`Estas escuchando en el puerto: ${server.address().port}`);
});

server.on('ERROR', error => console.log(`Error en servidor: ${error}` ));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(express.static('public'));

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', 'pug'); // registra el motor de plantillas

router.get('/', (req,res)=>{

    res.send(
        `<h1 style="color:blue"> Bienvenidos al Servidor Express </h1>`
        );
});

router.get('/productos/listar', (req,res) => {
    let objError = {error : 'no hay productos cargados'};
    res.json(objProductos.length > 0 ? objProductos : objError);
});


router.post('/productos/guardar', (req,res) => {
    try{
        let body = req.body;
        body.id =  objProductos.length == 0 ? objProductos.length + 1 : Math.max(...objProductos.map(user => user.id)) + 1 ;
        objProductos.push(body);
        //res.json(objProductos);
        res.redirect('/')
    } catch {
        console.log('Error al obtener los productos del body');
        res.status(400).send('<h1 style="color:red"> Parece que hubo un error </h1> ');
    }
});

router.get('/productos/listar/:id', (req,res) => {
    let objError = {error : 'producto no encontrado'};
    try{
        let objFind = objProductos.find((e) => e.id == req.params.id);
        objFind ? res.json(objFind) : res.status(400).json(objError);
    } catch {
        console.log('Error. Id inexistente');
        res.status(400).json('<h1 style="color:red"> Parece que hubo un error </h1> ');
    }
});

router.put('/productos/actualizar/:id', (req,res) => {
    let objError = {error : 'producto no encontrado'};
    try {
        let index = objProductos.map(function(e) { return e.id; }).indexOf(req.params.id);
        let objFind = objProductos.find((e) => e.id == req.params.id);
        let body = req.body;
        body.tittle ? objFind.tittle = body.tittle : objFind.tittle;
        body.price ? objFind.price = body.price : objFind.price;
        body.thumbnail ? objFind.thumbnail = body.thumbnail : objFind.thumbnail;
        objProductos[index] = objFind;
        objFind ? res.status(200).json(objProductos) : res.status(400).json(objError);
    } catch (error) {
        console.log('Error. Id inexistente');
        res.status(400).json('<h1 style="color:red"> Parece que hubo un error </h1> ');
    }
});

router.delete('/productos/eliminar/:id', (req,res) => {
    let objError = {error : 'producto no encontrado'};
    try{
        console.log(req.params.id);
        let objFind = objProductos.filter((e) => e.id != req.params.id);
        objProductos.splice(0, objProductos.length, ...objFind);
        res.json(objProductos);
    } catch {
        console.log('Error. Id inexistente');
        res.status(400).json('<h1 style="color:red"> Parece que hubo un error </h1> ');
    }
});

router.get('/productos/vista', (req,res) => {
    let listExist = objProductos.length > 0 ? true : false;
    res.render('index.pug', { objProductos, listExists: listExist });
});
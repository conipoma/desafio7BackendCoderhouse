import express from 'express';
import fs from 'fs';


class Archivo {
    constructor(file) {
        this.file = (file);
        this.encoding = 'utf-8';
        this.visita = 0;
        this.visitaRandom = 0
    }

    async read() {
        try {
            const products = await fs.promises.readFile(
                this.file,
                this.encoding
            );
        const productsArray = JSON.parse(products);
        console.log(productsArray)
            
        const productObj = {
            items: [...productsArray],
            cantidad: productsArray.length 
        };

        return productObj;

    } catch(error) {
        console.log(error)
    }
 }
};

/* Instanciamos la clase Archivo a partir del productos.txt */
const archivoProduct = new Archivo('productos.txt');

const app = express();

/*Rutas*/
app.get('/items', (req, res) => {
    archivoProduct
        .read()
        .then((data) => {
            archivoProduct.visita++;
            res.send(data);
        })
        .catch((e) => console.log(e));
});

app.get('/item-random', (req, res) => {
    archivoProduct
        .read()
        .then((data) => {
            const numRandom = Math.floor(Math.random() * data.cantidad);
            const productRandom = { item: data.items[numRandom] };
            archivoProduct.visitaRandom++;
            res.send(productRandom);
        })
        .catch((e) => console.log(e));
});

app.get('/visitas', (req, res) => {
    res.send({
        visitas: {
            items: archivoProduct.visita,
            item: archivoProduct.visitaRandom,
        },
    });
});
                       
/*Servidor*/                                     
const PORT = 8080;
app.listen(PORT, () => console.log(`Servidor http escuchando por el puerto ${PORT}`));
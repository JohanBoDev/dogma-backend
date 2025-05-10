import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productosRoutes.js';
import colaboradoresRoutes from './routes/colaboradoresRoutes.js';
import plantasRoutes from './routes/plantasRoutes.js';
import estacionesRoutes from './routes/estacionesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import separacionRoutes from './routes/separacionRoutes.js';
import despachosRoutes from './routes/despachoRoutes.js';
import devolucionesRoutes from './routes/devolucionesRoutes.js';
import productoDanadoRoutes from './routes/productoDanadoRoutes.js';
import conteoFisicoRoutes from './routes/conteoFisicoRoutes.js';
import inventarioRoutes from './routes/inventarioRoutes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/plantas', plantasRoutes);
app.use('/api/estaciones', estacionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/separacion', separacionRoutes);
app.use('/api/despachos', despachosRoutes);
app.use('/api/devoluciones', devolucionesRoutes);
app.use('/api/productos-danados', productoDanadoRoutes);
app.use('/api/conteo-fisico', conteoFisicoRoutes);
app.use('/api/inventario', inventarioRoutes);




export default app;
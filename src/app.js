import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productosRoutes.js';
import colaboradoresRoutes from './routes/colaboradoresRoutes.js';
import plantasRoutes from './routes/plantasRoutes.js';
import estacionesRoutes from './routes/estacionesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import separacionRoutes from './routes/separacionRoutes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/plantas', plantasRoutes);
app.use('/api/estaciones', estacionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/separacion', separacionRoutes);





export default app;
import Mistri from '../models/Mistri.js';
import buildCrud from './crudFactory.js';

/**
 * Technicians (mistris)
 * @route /api/mistris  - public read, admin write
 */
export default buildCrud(Mistri);

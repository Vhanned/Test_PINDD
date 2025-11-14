import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  usuario:{type:String, unique:true},
  contrasena:{type:String, required:true},
});

// Metodo para comparar contraseñas
userSchema.methods.comparePassword = async function(contrasenaLogin) {
  return contrasenaLogin === this.contrasena;
};

const User = mongoose.model('Usuarios', userSchema);

export default User;
export function soloAdministrador(req,res,next){
    if(req.usuario.rol !== 'ADMINISTRADOR'){
        return res.status(403).json({error:'Solo el administrador puede hacer esto.'})
    }
    next()
}
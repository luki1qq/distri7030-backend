import jwt from 'jsonwebtoken'

export const getIdByToken = (token)=>{
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload)
    return payload.id;
  }catch(error){
    console.log(error)
    throw new Error('Token invalido')
  }
} 
import jwt from 'jsonwebtoken'

export const getEmailByToken = (token)=>{
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload)
    return payload.email;
  }catch(error){
    console.log(error)
    throw new Error('Token invalido')
  }
} 
export const validateUser = (email,password)=>{
  if (password === null || password === undefined) {
    return {
      ok: false,
      message: 'La contraseña no puede ser nula.'
    }
  }
  if (  password.length < 6){
    console.log(password.length)
    return {
      ok : false,
      message : 'La contraseña debe tener al menos 6 carácteres.'
    }
  }
  const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  if (!emailRegex.test(email)) {
      return {
      ok: false,
      message: 'El email es invalido.'
    } 
  }

  return {
    ok:true
  }
}

export const validateUserUpdate = ( password) => {
  if (password.length < 6) {
    console.log(password.length)
    return {
      ok: false,
      message: 'La contraseña debe tener al menos 6 carácteres.'
    }
  }
 

  return {
    ok: true
  }
}
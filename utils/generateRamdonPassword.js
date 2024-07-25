export const generatePassword = ()=>{
    let randomNumberString = '';
    for (let i = 0; i < 6; i++) {
      const randomDigit = Math.floor(Math.random() * 10); // Genera un dígito aleatorio entre 0 y 9
      randomNumberString += randomDigit;
    }
    return randomNumberString;
}
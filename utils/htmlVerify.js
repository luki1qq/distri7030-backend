export const htmlVerify = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación Exitosa</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        text-align: center;
        margin: 0;
        padding: 50px;
      }
      .container {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: inline-block;
      }
      a {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
      a:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Verificación Exitosa</h1>
      <p>Ya puedes iniciar sesión en la página.</p>
      <a href="/login">Iniciar Sesión</a>
    </div>
  </body>
  </html>`


export const messageVerifySuscriber = (url)=>{
  return `<p>Confirma tu mail haciendo click en el siguiente enlace. </p> 
            <a href="${url}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">CONFIRMAR EMAIL</a>`
} 
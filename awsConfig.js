// awsConfig.js
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Debes almacenar estas claves en variables de entorno
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'sa-east-1', // Cambia esto por la región donde creaste el bucket
});

const s3 = new AWS.S3();

export default s3;

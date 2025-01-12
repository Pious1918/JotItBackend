import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



const s3client = new S3Client({
    region: process.env.BUCKET_REGION,

    credentials: {
        accessKeyId: process.env.Access_key!,
        secretAccessKey: process.env.Secret_access_key!
    }
})


export const generatepresigned = async ( fileName: string, fileType: string): Promise<string> => {

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName
    }
    try {
        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(s3client, command, { expiresIn: 300 });
        return url;

    } catch (error) {
        console.error(error);
        throw new Error('Error generating presigned URL');
    }
}
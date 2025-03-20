import {
  S3Client,
  NoSuchKey,
  S3ServiceException,
  GetObjectCommand,
  DeleteObjectCommand,
  waitUntilObjectNotExists,
  DeleteObjectsCommand,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectsCommandOutput,
  ListObjectsCommandOutput,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { config } from '../../config';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

interface PutS3ObjectParams {
  bucketName: string;
  key: string;
  Body: string | Buffer;
  ContentType: string;
}

interface DeleteS3ObjectsParams {
  bucketName: string;
  objectKeys: Array<{ Key: string }>;
}

interface ListS3ObjectsParams {
  bucketName: string;
  Prefix: string;
}

const putS3Object = async ({
  bucketName,
  key,
  Body,
  ContentType,
}: PutS3ObjectParams): Promise<void> => {
  const client = new S3Client({});
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body,
    ContentType,
  } as PutObjectCommandInput);

  try {
    await client.send(command);
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'EntityTooLarge'
    ) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

const getS3Object = async (
  bucketName: string,
  objectKey: string,
): Promise<Uint8Array | undefined> => {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      }),
    );
    const str = await response.Body?.transformToByteArray();
    return str;
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      console.error(
        `Error from S3 while getting object "${objectKey}" from "${bucketName}". No such key exists.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

const deleteS3Object = async (
  bucketName: string,
  objectKey: string,
): Promise<void> => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      }),
    );
    await waitUntilObjectNotExists(
      {
        client: s3Client,
        maxWaitTime: 0,
      },
      { Bucket: bucketName, Key: objectKey },
    );
    // A successful delete, or a delete for a non-existent object, both return
    // a 204 response code.
    console.info(
      `The object "${objectKey}" from bucket "${bucketName}" was deleted, or it didn't exist.`,
    );
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'NoSuchBucket'
    ) {
      console.error(
        `Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

const deleteS3Objects = async ({
  bucketName,
  objectKeys,
}: DeleteS3ObjectsParams): Promise<void> => {
  try {
    const { Deleted } = (await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: objectKeys,
        },
      }),
    )) as DeleteObjectsCommandOutput;

    await Promise.all(
      objectKeys.map((objectKey) =>
        waitUntilObjectNotExists(
          {
            client: s3Client,
            maxWaitTime: 0,
          },
          { Bucket: bucketName, Key: objectKey.Key },
        ),
      ),
    );

    if (Deleted) {
      console.info(
        `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`,
      );
      console.info(Deleted.map((d) => ` • ${d.Key}`).join('\n'));
    }
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'NoSuchBucket'
    ) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}. The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting objects from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

const listS3ObjectsV2 = async ({
  bucketName,
  Prefix,
}: ListS3ObjectsParams): Promise<ListObjectsCommandOutput | undefined> => {
  try {
    const command = new ListObjectsCommand({
      Bucket: bucketName,
      Prefix,
    });

    const response = await s3Client.send(command);
    return response;
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'NoSuchBucket'
    ) {
      console.error(
        `Error from S3 while listing objects from ${bucketName}. The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting listS3Objects from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

async function uploadJsonToS3(
  responseJson: unknown,
  bucketName: string,
  fileName: string,
): Promise<void> {
  try {
    // Prepare the file content
    const jsonData = JSON.stringify(responseJson);

    // Upload to S3
    await putS3Object({
      bucketName,
      key: fileName,
      Body: jsonData,
      ContentType: 'application/json',
    });
    console.log('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export {
  s3Client,
  putS3Object,
  uploadJsonToS3,
  getS3Object,
  deleteS3Object,
  deleteS3Objects,
  listS3ObjectsV2,
  type PutS3ObjectParams,
  type DeleteS3ObjectsParams,
  type ListS3ObjectsParams,
};

interface IB2Config {
  applicationKeyId: string;
  applicationKey: string;
  bucketId: string;
}
export const b2Config: IB2Config = {
  applicationKeyId: process.env.B2_KEY_ID!,
  applicationKey: process.env.B2_KEY!,
  bucketId: process.env.B2_BUCKET_ID!,
};

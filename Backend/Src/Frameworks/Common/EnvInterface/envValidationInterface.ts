export interface envValidation {
    env: string;
    port: number;
    serverUrl: string;
    mongoose: {
      url: string;
      databaseName: string;
      options: {
        useCreateIndex: boolean;
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
      };
    };
    jwt: {
      secret: string;
      accessExpirationMinutes: number;
      refreshExpirationDays: number;
      resetPasswordExpirationMinutes: number;
      verifyEmailExpirationMinutes: number;
    };
    defaultPassword: string;
    facebook: {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
    };
    email: {
      smtp: {
        host: string;
        port: number;
        auth: {
          user: string;
          pass: string;
        };
        tls: {
          rejectUnauthorized: boolean;
        };
      };
      from: string;
    };
    easyShipApiKey: string;
    clientUrl: string;
    paypalClientId: string;
    paypalSecret: string;
    spotify: {
      spotifyClientId: string;
      spotifyClientSecret: string;
      spotifyRedirect: string;
    };
    shouldCompressGlb: string;
    shouldCompressImage: string;
    uploadDirectory: string;
    queueName: string;
    invitationExpirationMinutes: number;
    zohoDeskClientId: string;
    zohoDeskClientSecret: string;
    zohoDeskDepartmentId: string;
    zohoDeskGrantCode: string;
  }
  
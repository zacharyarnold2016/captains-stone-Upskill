export interface Config {
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  redis: {
    host: string;
    port: number;
  };
  auth: {
    secret: string;
  };
}

const configs: {
  development: Config;
  test: Config;
  production: Config;
} = {
  development: {
    db: {
      host: "localhost",
      port: 3306,
      username: "dev",
      password: "dev",
      database: "capstone_project",
    },
    redis: {
      host: "localhost",
      port: 6379,
    },
    auth: {
      secret: "some-dev-secret",
    },
  },
  test: {
    db: {
      host: "localhost",
      port: 3306,
      username: "dev",
      password: "dev",
      database: "test",
    },
    redis: {
      host: "localhost",
      port: 6379,
    },
    auth: {
      secret: "some-dev-secret",
    },
  },
  production: {
    db: {
      host: "localhost",
      port: 3306,
      username: "dev",
      password: "dev",
      database: "capstone_project",
    },
    redis: {
      host: "localhost",
      port: 6379,
    },
    auth: {
      secret: "some-dev-secret",
    },
  },
};

const getConfig = (): Config => {
  if (!process.env.NODE_ENV) {
    throw new Error(
      'Env parameter NODE_ENV must be specified! Possible values are "development", "test", "production"'
    );
  }

  const env = process.env.NODE_ENV as "development";

  if (!configs[env]) {
    throw new Error(
      'Unsupported NODE_ENV value was provided! Possible values are "development", "test", "production"'
    );
  }

  return configs[env];
};

export const config = getConfig();

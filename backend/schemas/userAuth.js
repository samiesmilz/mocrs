const userAuth = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/userAuth.json",
  type: "object",
  properties: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
  additionalProperties: false,
  required: ["username", "password"],
};

export default userAuth;

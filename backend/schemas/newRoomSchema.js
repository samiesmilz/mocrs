const newRoomSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/roomSchema.json",
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 150,
    },
    description: {
      type: "string",
      maxLength: 250,
    },
    room_type: {
      type: "string",
      enum: ["meeting", "study", "focus", "chat"],
    },
    is_private: {
      type: "boolean",
    },
    creator_id: {
      type: "integer",
    },
  },
  additionalProperties: false,
  required: ["name", "room_type", "creator_id"],
};

export default newRoomSchema;

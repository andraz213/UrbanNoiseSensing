// This class is used for deserializing JSON objects
// into their respective models for further use.

export interface Deserializable {
  deserialize(input: any): this;
}

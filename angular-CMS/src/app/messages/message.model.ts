export class Message {
  /** MongoDB primary key (optional; usually omitted in API responses). */
  _id?: string;

  constructor(
    public id: string,
    public subject: string,
    public sender: string,
    public msgText: string
  ) {}
}

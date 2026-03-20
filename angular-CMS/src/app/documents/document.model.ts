export class Document {
  /** MongoDB primary key (optional; not sent to browser in normal API responses). */
  _id?: string;

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public url: string,
    public children?: Document[] | null
  ) {}
}


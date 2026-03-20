export class Contact {
  /** MongoDB primary key (optional; usually omitted in API responses). */
  _id?: string;

  constructor(
    public id: string,
    public name: string,
    public email: string | null,
    public phone: string | null,
    public imageUrl: string | null,
    public group: Contact[] | null
  ) {}
}

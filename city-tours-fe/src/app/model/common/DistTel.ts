export class DistTel {
  constructor(
    public area?: string,
    public exchange?: string,
    public subscriber?: string,
  ) {
  }

  public static concatenate(phone: DistTel) {
    return phone != null ? phone.area + " " + phone.exchange + " " + phone.subscriber : '';
  }
}

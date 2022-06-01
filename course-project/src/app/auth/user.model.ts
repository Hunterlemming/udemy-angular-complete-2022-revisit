export interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string
}

function isUserData(object: any): object is UserData {
  return ('email' in object && 'id' in object && '_token' in object && '_tokenExpirationDate' in object);
}

export class User {
    
  constructor(
    public email: string, 
    public id: string, 
    private _token: string, 
    private _tokenExpirationDate: Date
  ) {}

  //#region Accessors

  get token(): string {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  //#endregion

  //#region Static Functions

  static toUser(obj: UserData): User {
    if (!obj && !isUserData(obj)) {
      return null;
    }
    return new User(obj.id, obj.email, obj._token, new Date(obj._tokenExpirationDate));
  }

  //#endregion

}